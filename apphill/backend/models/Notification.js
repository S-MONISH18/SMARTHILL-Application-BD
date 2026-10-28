const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    notificationId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
