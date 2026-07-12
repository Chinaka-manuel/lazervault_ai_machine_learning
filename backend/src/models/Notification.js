import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['purchase', 'upload', 'payment', 'discount', 'announcement', 'system'],
      default: 'system',
    },
    title: { type: String, required: true },
    message: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: '' },
  },
  { timestamps: true },
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
