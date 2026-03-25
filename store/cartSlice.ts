import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

interface AddCartItemPayload {
  id: number;
  name: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity?: number;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isDrawerOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddCartItemPayload>) => {
      const { id, size, color } = action.payload;
      const existing = state.items.find(
        (item) => item.id === id && item.size === size && item.color === color,
      );

      const qty = action.payload.quantity ?? 1;

      if (existing) {
        existing.quantity += qty;
      } else {
        state.items.push({
          id: action.payload.id,
          name: action.payload.name,
          price: action.payload.price,
          size: action.payload.size,
          color: action.payload.color,
          image: action.payload.image,
          quantity: qty,
        });
      }

      state.isDrawerOpen = true;
    },

    removeFromCart: (
      state,
      action: PayloadAction<{ id: number; size: string; color: string }>,
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
          ),
      );
    },

    updateCartQuantity: (
      state,
      action: PayloadAction<{
        id: number;
        size: string;
        color: string;
        quantity: number;
      }>,
    ) => {
      const target = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color,
      );

      if (!target) return;
      target.quantity = Math.max(1, action.payload.quantity);
    },

    clearCart: (state) => {
      state.items = [];
    },

    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },

    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  openCartDrawer,
  closeCartDrawer,
} = cartSlice.actions;

export default cartSlice.reducer;
