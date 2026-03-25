import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  stock?: number;
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
  stock?: number;
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
      const stockLimit = action.payload.stock;

      if (existing) {
        const nextQuantity = existing.quantity + qty;
        const availableStock = stockLimit ?? existing.stock;

        if (availableStock !== undefined && nextQuantity > availableStock) {
          return;
        }

        existing.quantity = nextQuantity;
        if (stockLimit !== undefined) {
          existing.stock = stockLimit;
        }
      } else {
        state.items.push({
          id: action.payload.id,
          name: action.payload.name,
          price: action.payload.price,
          size: action.payload.size,
          color: action.payload.color,
          image: action.payload.image,
          quantity: qty,
          stock: stockLimit,
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

      const nextQuantity = Math.max(1, action.payload.quantity);
      if (target.stock !== undefined && nextQuantity > target.stock) {
        return;
      }

      target.quantity = nextQuantity;
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
