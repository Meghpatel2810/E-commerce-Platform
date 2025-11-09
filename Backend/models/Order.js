const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, default: '' }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerEmail: { type: String, required: false, trim: true, lowercase: true, default: '' },
    items: { type: [orderItemSchema], required: true },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'], default: 'pending' },
    type: { type: String, enum: ['retail', 'wholesale'], default: 'retail' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

