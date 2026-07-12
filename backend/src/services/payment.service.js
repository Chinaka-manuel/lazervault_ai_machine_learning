import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

const STRIPE_AVAILABLE = Boolean(env.STRIPE_SECRET_KEY);
const PAYSTACK_AVAILABLE = Boolean(env.PAYSTACK_SECRET_KEY);
const PAYSTACK_BASE = 'https://api.paystack.co';

let stripe = null;
if (STRIPE_AVAILABLE) {
  const Stripe = (await import('stripe')).default;
  stripe = new Stripe(env.STRIPE_SECRET_KEY);
}

const paystackRequest = async (path, options = {}) => {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!data.status) throw new ApiError(402, data.message || 'Paystack request failed');
  return data;
};

export const paymentProviders = ['paystack', 'stripe'];

export const initializePayment = async (provider, { email, amount, reference, callbackUrl, metadata }) => {
  const amountMinor = Math.round(Number(amount) * 100);

  if (provider === 'mock') return mockInitialize(reference);

  if (provider === 'paystack') {
    if (!PAYSTACK_AVAILABLE) return mockInitialize(reference);
    const response = await paystackRequest('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({ email, amount: amountMinor, reference, callback_url: callbackUrl, metadata }),
    });
    return {
      provider: 'paystack',
      authorizationUrl: response.data.authorization_url,
      reference: response.data.reference,
      accessCode: response.data.access_code,
    };
  }

  if (provider === 'stripe') {
    if (!STRIPE_AVAILABLE) return mockInitialize(reference);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: metadata?.title || 'LazerVault Order' },
            unit_amount: amountMinor,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${callbackUrl}&status=success`,
      cancel_url: `${env.FRONTEND_URL}/cart?status=cancel`,
      metadata: { reference, ...metadata },
    });
    return { provider: 'stripe', authorizationUrl: session.url, reference, sessionId: session.id };
  }

  throw new ApiError(400, 'Unsupported payment provider');
};

const mockInitialize = (reference) => ({
  provider: 'mock',
  authorizationUrl: `${env.FRONTEND_URL}/checkout/mock?reference=${reference}`,
  reference,
  mock: true,
});

export const verifyPayment = async (provider, reference) => {
  if (provider === 'paystack') {
    if (!PAYSTACK_AVAILABLE) return mockVerify(reference);
    const response = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
    const data = response.data;
    return {
      verified: data.status === 'success',
      amount: data.amount / 100,
      currency: data.currency,
      reference: data.reference,
      gatewayResponse: data.gateway_response,
    };
  }

  if (provider === 'stripe') {
    if (!STRIPE_AVAILABLE) return mockVerify(reference);
    // For Stripe we look up the checkout session by reference stored in metadata.
    const sessions = await stripe.checkout.sessions.list({ limit: 1 });
    const session = sessions.data.find((s) => s.metadata?.reference === reference) || sessions.data[0];
    return {
      verified: session?.payment_status === 'paid',
      amount: (session?.amount_total || 0) / 100,
      currency: session?.currency,
      reference,
      gatewayResponse: session?.payment_status,
    };
  }

  return mockVerify(reference);
};

const mockVerify = (reference) => ({
  verified: true,
  amount: 0,
  currency: 'USD',
  reference,
  gatewayResponse: 'mock-success',
});

export const constructWebhookEvent = (payload, signature) => {
  if (STRIPE_AVAILABLE && signature) {
    return stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
  }
  return null;
};

export default { initializePayment, verifyPayment, constructWebhookEvent, paymentProviders };
