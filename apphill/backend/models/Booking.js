const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    tractorModel: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerPhone: { type: String, required: true, index: true },
    farmerPhone: { type: String, required: true, index: true },
    farmerName: { type: String, default: 'Unknown Farmer' },
    fromDate: { type: String },
    toDate: { type: String },
    hours: { type: String, default: '1' },
    total: { type: String, default: '0' },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Confirmed', 'Rejected', 'Completed', 'Cancelled'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
