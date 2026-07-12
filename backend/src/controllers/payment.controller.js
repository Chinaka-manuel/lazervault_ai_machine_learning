import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { verifyPayment } from '../services/payment.service.js';
import { confirmPurchase } from './order.controller.js';
import logger from '../utils/logger.js';

export const verifyOrder = asyncHandler(async (req, res) => {
  const { reference } = req.query;
  const order = await Order.findOne({ reference });
  if (!order) throw new ApiError(404, 'Order not found');

  if (order.status === 'paid') {
    return res.json({ success: true, status: 'paid', order });
  }

  const result = await verifyPayment(order.paymentProvider, reference);
  if (!result.verified) {
    order.status = 'failed';
    await order.save();
    throw new ApiError(402, 'Payment not verified');
  }

  await Payment.create({
    order: order._id,
    user: order.user,
    provider: order.paymentProvider,
    reference,
    gatewayReference: result.reference,
    amount: order.total,
    currency: order.currency,
    status: 'success',
    gatewayResponse: result.gatewayResponse,
  });

  await confirmPurchase(order);
  await Order.findByIdAndUpdate(order._id, { paymentReference: reference });
  res.json({ success: true, status: 'paid', order });
});

export const paymentWebhook = asyncHandler(async (req, res) => {
  const provider = req.query.provider || 'stripe';
  try {
    const event = req.body;
    if (event?.event === 'charge.success' || event?.data?.status === 'success') {
      const reference = event.data?.reference || event.data?.metadata?.reference;
      const order = await Order.findOne({ reference });
      if (order && order.status !== 'paid') {
        await Payment.create({
          order: order._id,
          user: order.user,
          provider,
          reference,
          amount: order.total,
          status: 'success',
        });
        await confirmPurchase(order);
      }
    }
    res.json({ received: true });
  } catch (err) {
    logger.error('Webhook error', { error: err.message });
    res.status(400).json({ received: false });
  }
});

export const refundOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.status !== 'paid') throw new ApiError(400, 'Only paid orders can be refunded');
  order.status = 'refunded';
  await order.save();
  await Payment.updateOne({ order: order._id }, { status: 'refunded' });
  res.json({ success: true, order });
});

export default { verifyOrder, paymentWebhook, refundOrder };
