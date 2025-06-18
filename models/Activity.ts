import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    action: { type: String, required: true },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Activity ||
  mongoose.model('Activity', activitySchema);
