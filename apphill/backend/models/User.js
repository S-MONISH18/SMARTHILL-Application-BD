const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    password: { type: String, required: true },
    location: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    role: {
      type: String,
      required: true,
      enum: ['farmer', 'tractor_owner', 'customer'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
