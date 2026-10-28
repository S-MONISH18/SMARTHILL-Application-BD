const mongoose = require('mongoose');

const tractorSchema = new mongoose.Schema(
  {
    tractorId: { type: String, required: true, unique: true, index: true },
    ownerPhone: { type: String, required: true, index: true },
    ownerName: { type: String, required: true },
    model: { type: String, required: true },
    number: { type: String, required: true },
    location: { type: String, default: '' },
    hourlyRate: { type: String, default: '0' },
    dailyRate: { type: String, default: '0' },
    status: { type: String, default: 'Available', index: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Tractor', tractorSchema);
