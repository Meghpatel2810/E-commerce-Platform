const path = require('path');
const Product = require('../models/Product');
const Order = require('../models/Order');
const BulkOrder = require('../models/BulkOrder');

exports.list = async (req, res) => {
  try {
    const { category, q, sort } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.name = { $regex: q, $options: 'i' };
    let sortSpec = { createdAt: -1 };
    switch (sort) {
      case 'price_asc': sortSpec = { price: 1 }; break;
      case 'price_desc': sortSpec = { price: -1 }; break;
      case 'date_asc': sortSpec = { createdAt: 1 }; break;
      case 'date_desc': sortSpec = { createdAt: -1 }; break;
      default: break;
    }
    const items = await Product.find(filter).sort(sortSpec);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Product not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const body = req.body;
    const imageUrl = req.file ? `/images/${req.file.filename}` : body.imageUrl || '';
    const item = await Product.create({
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock,
      category: body.category,
      imageUrl
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const body = req.body;
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Product not found' });
    if (Object.prototype.hasOwnProperty.call(body, 'name')) item.name = body.name || item.name;
    if (Object.prototype.hasOwnProperty.call(body, 'description')) item.description = body.description ?? item.description;
    if (Object.prototype.hasOwnProperty.call(body, 'price')) item.price = body.price === '' ? item.price : Number(body.price);
    if (Object.prototype.hasOwnProperty.call(body, 'stock')) item.stock = body.stock === '' ? item.stock : Number(body.stock);
    if (Object.prototype.hasOwnProperty.call(body, 'category')) item.category = body.category || item.category;
    if (req.file) item.imageUrl = `/images/${req.file.filename}`;
    if (body.imageUrl) item.imageUrl = body.imageUrl;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Product not found' });
    
    // Check if product exists in any retail orders
    const inRetailOrder = await Order.findOne({ 'items.productId': req.params.id });
    if (inRetailOrder) {
      return res.status(400).json({ 
        message: 'Cannot delete product. It is present in one or more orders. Please cancel or complete those orders first.' 
      });
    }
    
    // Check if product exists in any wholesale orders
    const inBulkOrder = await BulkOrder.findOne({ 'items.productId': req.params.id });
    if (inBulkOrder) {
      return res.status(400).json({ 
        message: 'Cannot delete product. It is present in one or more wholesale orders. Please cancel or complete those orders first.' 
      });
    }
    
    await item.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.categories = async (req, res) => {
  try {
    const cats = await Product.distinct('category', { category: { $nin: [null, ''] } });
    res.json(cats.sort());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

