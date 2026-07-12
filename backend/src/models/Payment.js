import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: String, enum: ['paystack', 'stripe', 'mock'], required: true },
    reference: { type: String, required: true, unique: true },
    gatewayReference: { type: String, default: '' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
    gatewayResponse: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
