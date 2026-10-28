const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    productName: { type: String, required: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String, index: true },
    buyerPhone: { type: String, required: true, index: true },
    buyerName: { type: String, default: null },
    quantity: { type: String, default: 'N/A' },
    price: { type: String, default: '0' },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Rejected'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
