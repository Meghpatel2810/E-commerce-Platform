const Order = require('../models/Order');
const BulkOrder = require('../models/BulkOrder');
const Product = require('../models/Product');

exports.create = async (req, res) => {
  try {
    const { customerEmail = '', items, address } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items are required' });
    }
    // Verify stock and decrement atomically
    for (const it of items) {
      const qty = Number(it.qty || 0);
      if (!it.productId || qty <= 0) return res.status(400).json({ message: 'Invalid item' });
      const updated = await Product.updateOne({ _id: it.productId, stock: { $gte: qty } }, { $inc: { stock: -qty } });
      if (updated.matchedCount === 0 || updated.modifiedCount === 0) {
        return res.status(400).json({ message: `Insufficient stock for ${it.name || 'item'}` });
      }
    }
    const amount = items.reduce((s, it) => s + Number(it.price) * Number(it.qty), 0);
    const order = await Order.create({ customerEmail, items, address, amount, status: 'pending', type: 'retail' });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.mine = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'email query required' });
    const retailOrders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
    const bulkOrders = await BulkOrder.find({ buyerEmail: email }).sort({ createdAt: -1 });
    // Combine and format for frontend
    const all = [
      ...retailOrders.map(o => ({ ...o.toObject(), orderType: 'retail' })),
      ...bulkOrders.map(o => ({ ...o.toObject(), orderType: 'wholesale' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.all = async (req, res) => {
  try {
    const { status, from, to, min, max } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (from || to) {
      filter.createdAt = {};
      if (from) {
        // Start of the day for 'from' date
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);
        filter.createdAt.$gte = fromDate;
      }
      if (to) {
        // End of the day for 'to' date
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = toDate;
      }
    }
    // Handle amount filter - only apply if min/max are valid numbers
    if (min !== undefined && min !== '' && min !== null) {
      const minNum = Number(min);
      if (!isNaN(minNum)) {
        if (!filter.amount) filter.amount = {};
        filter.amount.$gte = minNum;
      }
    }
    if (max !== undefined && max !== '' && max !== null) {
      const maxNum = Number(max);
      if (!isNaN(maxNum)) {
        if (!filter.amount) filter.amount = {};
        filter.amount.$lte = maxNum;
      }
    }
    const retailOrders = await Order.find(filter).sort({ createdAt: -1 });
    
    // Build bulk filter
    const bulkFilter = {};
    if (status) bulkFilter.status = status;
    if (from || to) {
      bulkFilter.createdAt = {};
      if (from) {
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);
        bulkFilter.createdAt.$gte = fromDate;
      }
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        bulkFilter.createdAt.$lte = toDate;
      }
    }
    // Handle amount filter for bulk orders (using totalAmount)
    if (min !== undefined && min !== '' && min !== null) {
      const minNum = Number(min);
      if (!isNaN(minNum)) {
        if (!bulkFilter.totalAmount) bulkFilter.totalAmount = {};
        bulkFilter.totalAmount.$gte = minNum;
      }
    }
    if (max !== undefined && max !== '' && max !== null) {
      const maxNum = Number(max);
      if (!isNaN(maxNum)) {
        if (!bulkFilter.totalAmount) bulkFilter.totalAmount = {};
        bulkFilter.totalAmount.$lte = maxNum;
      }
    }
    const bulkOrders = await BulkOrder.find(bulkFilter).sort({ createdAt: -1 });
    
    // Combine and format
    const all = [
      ...retailOrders.map(o => ({ ...o.toObject(), orderType: 'retail' })),
      ...bulkOrders.map(o => ({ ...o.toObject(), orderType: 'wholesale', amount: o.totalAmount, customerEmail: o.buyerEmail }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const restoreStock = async (items) => {
  for (const it of items) {
    if (it.productId && it.qty) {
      await Product.updateOne({ _id: it.productId }, { $inc: { stock: Number(it.qty) } });
    }
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    let order = await Order.findById(id);
    let isBulk = false;
    if (!order) {
      order = await BulkOrder.findById(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      isBulk = true;
    }
    // Prevent changing status from 'cancelled' to any other status
    if (order.status === 'cancelled' && status !== 'cancelled') {
      return res.status(400).json({ message: 'Cannot change status of a cancelled order' });
    }
    const wasCancelled = order.status === 'cancelled';
    const willBeCancelled = status === 'cancelled';
    // Restore stock if changing to cancelled (and wasn't already cancelled)
    if (willBeCancelled && !wasCancelled) {
      await restoreStock(order.items);
    }
    order.status = status;
    await order.save();
    // Return formatted order with orderType for frontend consistency
    const result = order.toObject();
    if (isBulk) {
      result.orderType = 'wholesale';
      result.amount = result.totalAmount;
      result.customerEmail = result.buyerEmail;
    } else {
      result.orderType = 'retail';
    }
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'email query required' });
    let order = await Order.findOne({ _id: id, customerEmail: email });
    let isBulk = false;
    if (!order) {
      order = await BulkOrder.findOne({ _id: id, buyerEmail: email });
      if (!order) return res.status(404).json({ message: 'Order not found or unauthorized' });
      isBulk = true;
    }
    if (order.status === 'cancelled') return res.status(400).json({ message: 'Order already cancelled' });
    if (order.status === 'delivered') return res.status(400).json({ message: 'Cannot cancel delivered order' });
    // Restore stock
    await restoreStock(order.items);
    order.status = 'cancelled';
    await order.save();
    // Return formatted order with orderType for frontend consistency
    const result = order.toObject();
    if (isBulk) {
      result.orderType = 'wholesale';
      result.amount = result.totalAmount;
      result.customerEmail = result.buyerEmail;
    } else {
      result.orderType = 'retail';
    }
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

