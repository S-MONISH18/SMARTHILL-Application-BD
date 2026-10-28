const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    category: { type: String, required: true, index: true },
    quantity: { type: String, required: true },
    price: { type: String, required: true },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
