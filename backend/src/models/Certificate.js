import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
    certificateUrl: { type: String, default: '' },
  },
  { timestamps: true },
);

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
