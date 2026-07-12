import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['sale', 'refund', 'payout', 'withdrawal'], default: 'sale' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    reference: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true },
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
