const Product = require('../models/Product');
const BulkOrder = require('../models/BulkOrder');

function computeTieredUnit(price, qty) {
  // Flat 25% discount for wholesale orders
  const discount = 25;
  const unit = Number((price * (1 - discount / 100)).toFixed(2));
  return { discountPercent: discount, unitPrice: unit };
}

exports.quote = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, qty }]
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'items required' });
    const result = [];
    for (const it of items) {
      const p = await Product.findById(it.productId);
      if (!p) return res.status(404).json({ message: 'Product not found' });
      const qty = Number(it.qty);
      if (qty < 10) return res.status(400).json({ message: 'Minimum quantity for wholesale is 10' });
      if ((p.stock ?? 0) < 10) return res.status(400).json({ message: `${p.name} has stock less than 10, cannot be purchased in wholesale` });
      const { discountPercent, unitPrice } = computeTieredUnit(p.price, qty);
      const lineTotal = Number((unitPrice * qty).toFixed(2));
      const insufficient = qty > (p.stock ?? 0);
      result.push({ productId: p._id, name: p.name, qty, basePrice: p.price, availableStock: p.stock ?? 0, insufficient, discountPercent, unitPrice, lineTotal, imageUrl: p.imageUrl || '' });
    }
    const totalAmount = result.reduce((s, r) => s + r.lineTotal, 0);
    const hasInsufficient = result.some(r => r.insufficient);
    res.json({ items: result, totalAmount, hasInsufficient });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.place = async (req, res) => {
  try {
    const { buyerEmail = '', items, address } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'items required' });
    // Recalculate to prevent client tampering
    const recompute = [];
    for (const it of items) {
      const p = await Product.findById(it.productId);
      if (!p) return res.status(404).json({ message: 'Product not found' });
      const qty = Number(it.qty);
      if (qty < 10) return res.status(400).json({ message: 'Minimum quantity for wholesale is 10' });
      if ((p.stock ?? 0) < 10) return res.status(400).json({ message: `${p.name} has stock less than 10, cannot be purchased in wholesale` });
      const { discountPercent, unitPrice } = computeTieredUnit(p.price, qty);
      // Ensure stock
      const updated = await Product.updateOne({ _id: p._id, stock: { $gte: qty } }, { $inc: { stock: -qty } });
      if (!updated.modifiedCount) return res.status(400).json({ message: `Insufficient stock for ${p.name}` });
      const lineTotal = Number((unitPrice * qty).toFixed(2));
      recompute.push({ productId: p._id, name: p.name, qty, basePrice: p.price, discountPercent, unitPrice, lineTotal, imageUrl: p.imageUrl || '' });
    }
    const totalAmount = recompute.reduce((s, r) => s + r.lineTotal, 0);
    const order = await BulkOrder.create({ buyerEmail, items: recompute, totalAmount, address, status: 'pending' });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const orders = await BulkOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


