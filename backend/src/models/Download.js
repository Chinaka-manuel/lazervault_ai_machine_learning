import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    downloadedAt: { type: Date, default: Date.now },
    ip: { type: String, default: '' },
  },
  { timestamps: true },
);

const Download = mongoose.model('Download', downloadSchema);
export default Download;
