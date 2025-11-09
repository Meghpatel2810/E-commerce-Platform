const mongoose = require('mongoose');

const bulkItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    basePrice: { type: Number, required: true },
    discountPercent: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
    imageUrl: { type: String, default: '' }
  },
  { _id: false }
);

const bulkOrderSchema = new mongoose.Schema(
  {
    buyerEmail: { type: String, trim: true, lowercase: true, default: '' },
    items: { type: [bulkItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    status: { type: String, enum: ['pending', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'], default: 'pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);

