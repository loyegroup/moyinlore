import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  company: {
    name: String,
    email: String,
    phone: String,
    address: String,
  },
  invoice: {
    footerNote: String,
    currency: { type: String, default: 'NGN' },
  },
  notifications: { type: Boolean, default: true },
  theme: { type: String, default: 'system' },
}, {
  timestamps: true,
});

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
