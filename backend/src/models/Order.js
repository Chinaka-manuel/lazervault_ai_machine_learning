import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: { type: String, required: true },
    type: { type: String, enum: ['course', 'video', 'snapshot'] },
    price: { type: Number, required: true },
    thumbnail: { type: String, default: '' },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    reference: { type: String, required: true, unique: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
      default: 'pending',
    },
    paymentProvider: { type: String, enum: ['paystack', 'stripe', 'mock'], default: 'mock' },
    paymentReference: { type: String, default: '' },
    couponCode: { type: String, default: '' },
    invoiceUrl: { type: String, default: '' },
    paidAt: { type: Date },
  },
  { timestamps: true },
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
