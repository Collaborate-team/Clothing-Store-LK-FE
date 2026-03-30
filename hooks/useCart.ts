/**
 * Custom Hook for Cart Operations with Error Handling
 */

'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart as addToCartAction, removeFromCart as removeFromCartAction, updateCartQuantity } from '@/store/cartSlice';
import { useNotification } from '@/context/NotificationContext';
import { validateQuantity } from '@/utils/validation';
import { ERROR_MESSAGES, logError } from '@/utils/error-handler';

export function useCart() {
  const dispatch = useAppDispatch();
  const { showNotification } = useNotification();
  const items = useAppSelector((state) => state.cart.items);
  const isDrawerOpen = useAppSelector((state) => state.cart.isDrawerOpen);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = useCallback(
    (payload: {
      id: number;
      name: string;
      price: number;
      size: string | null;
      color: string | null;
      image: string;
      quantity?: number;
      stock?: number;
    }) => {
      const qty = payload.quantity ?? 1;

      if (payload.stock !== undefined) {
        const existingItem = items.find(
          (item) =>
            item.id === payload.id &&
            item.size === payload.size &&
            item.color === payload.color,
        );
        const requestedTotalQuantity = (existingItem?.quantity ?? 0) + qty;
        const error = validateQuantity(requestedTotalQuantity, payload.stock);
        if (error) {
          showNotification(error.userMessage, 'error');
          logError(error, {
            operation: 'addToCart',
            productId: payload.id,
            requestedTotalQuantity,
            availableStock: payload.stock,
          });
          return false;
        }
      }

      dispatch(addToCartAction(payload));
      showNotification(`${payload.name} added to cart successfully!`, 'success');
      return true;
    },
    [dispatch, items, showNotification]
  );

  const removeFromCart = useCallback(
    (itemId: number, size: string | null, color: string | null) => {
      dispatch(removeFromCartAction({ id: itemId, size, color }));
      showNotification('Item removed from cart successfully.', 'info');
      return true;
    },
    [dispatch, showNotification]
  );

  const updateQuantity = useCallback(
    (itemId: number, size: string | null, color: string | null, newQuantity: number) => {
      if (newQuantity < 1) {
        showNotification(ERROR_MESSAGES.INVALID_QUANTITY, 'error');
        return false;
      }

      const item = items.find(
        (cartItem) => cartItem.id === itemId && cartItem.size === size && cartItem.color === color,
      );
      if (item?.stock !== undefined && newQuantity > item.stock) {
        showNotification(`Only ${item.stock} items are available in stock.`, 'error');
        return false;
      }

      dispatch(updateCartQuantity({ id: itemId, size, color, quantity: newQuantity }));
      return true;
    },
    [dispatch, items, showNotification]
  );

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  return {
    items,
    isDrawerOpen,
    totalItems,
    totalPrice: getTotalPrice(),
    addToCart,
    removeFromCart,
    updateQuantity,
  };
}
