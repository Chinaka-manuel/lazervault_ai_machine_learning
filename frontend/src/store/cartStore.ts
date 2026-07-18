import { create } from 'zustand';
import { commerceApi } from '@/services/commerce.api';

interface CartItem {
  product: { _id: string; title: string; thumbnail?: string; price: number; type: string };
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  count: number;
  loading: boolean;
  fetch: () => Promise<void>;
  add: (productId: string, quantity?: number) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  reset: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  discount: 0,
  tax: 0,
  total: 0,
  count: 0,
  loading: false,
  fetch: async () => {
    set({ loading: true });
    try {
      const { data } = await commerceApi.getCart();
      set({
        items: data.cart.items || [],
        subtotal: data.subtotal || 0,
        discount: data.discount || 0,
        tax: data.tax || 0,
        total: data.total || 0,
        count: (data.cart.items || []).length,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
  add: async (productId, quantity = 1) => {
    const { data } = await commerceApi.addToCart(productId, quantity);
    if (data.alreadyOwned) {
      throw new Error('You already own this product');
    }
    set({
      items: data.cart.items || [],
      subtotal: data.subtotal,
      discount: data.discount,
      tax: data.tax,
      total: data.total,
      count: (data.cart.items || []).length,
    });
  },
  remove: async (id) => {
    const { data } = await commerceApi.removeFromCart(id);
    set({
      items: data.cart.items || [],
      subtotal: data.subtotal,
      discount: data.discount,
      tax: data.tax,
      total: data.total,
      count: (data.cart.items || []).length,
    });
  },
  clear: async () => {
    await commerceApi.clearCart();
    set({ items: [], subtotal: 0, discount: 0, tax: 0, total: 0, count: 0 });
  },
  applyCoupon: async (code) => {
    const { data } = await commerceApi.applyCoupon(code);
    set({ subtotal: data.subtotal, discount: data.discount, tax: data.tax, total: data.total });
  },
  reset: () => set({ items: [], subtotal: 0, discount: 0, tax: 0, total: 0, count: 0 }),
}));
