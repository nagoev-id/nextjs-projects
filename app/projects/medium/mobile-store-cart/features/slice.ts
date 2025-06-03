/**
 * @fileoverview Модуль Redux slice для управления состоянием корзины покупок
 * @module features/slice
 */

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Mobiles } from '@/app/projects/medium/mobile-store-cart/features/api';

/**
 * @typedef {Object} InitialState - Тип начального состояния хранилища
 * @property {Mobiles} items - Список всех доступных товаров
 * @property {Mobiles} cartItems - Список товаров в корзине
 * @property {number} amount - Общее количество товаров в корзине
 * @property {number} total - Общая стоимость товаров в корзине
 */
type InitialState = {
  items: Mobiles;
  cartItems: Mobiles;
  amount: number;
  total: number;
}

/**
 * Начальное состояние хранилища
 * @type {InitialState}
 */
const initialState: InitialState = {
  items: [],
  cartItems: [],
  amount: 0,
  total: 0,
};

/**
 * Вычисляет общую стоимость товаров в корзине
 *
 * @param {Mobiles} cartItems - Список товаров в корзине
 * @returns {number} Общая стоимость товаров
 */
const calculateTotal = (cartItems: Mobiles): number => {
  return cartItems.reduce((total, item) => total + (Number(item.price) * item.amount), 0);
};

/**
 * Slice для управления состоянием магазина и корзины
 *
 * @description Содержит редьюсеры для управления товарами и корзиной покупок:
 * - Установка списка доступных товаров
 * - Очистка корзины
 * - Удаление товара из корзины
 * - Изменение количества товара в корзине
 */
const mobileStoreSlice = createSlice({
  name: 'mobileStore',
  initialState,
  reducers: {
    /**
     * Устанавливает список доступных товаров
     *
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<Mobiles>} action - Действие с данными товаров
     */
    setItems: (state, action: PayloadAction<Mobiles>) => {
      state.items = action.payload;
    },

    /**
     * Очищает корзину полностью
     *
     * @param {InitialState} state - Текущее состояние
     */
    clearCartItems: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },

    /**
     * Удаляет товар из корзины по его ID
     *
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<string>} action - Действие с ID товара для удаления
     */
    removeCartItem: (state, action: PayloadAction<string>) => {
      const idStr = String(action.payload);
      const removedItem = state.cartItems.find(item => item.id === idStr);
      state.cartItems = state.cartItems.filter(item => item.id !== idStr);
      if (removedItem) {
        state.amount -= removedItem.amount;
      }
      state.total = calculateTotal(state.cartItems);
    },

    /**
     * Обновляет количество товара в корзине
     *
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<{id: string, change: number}>} action - Действие с ID товара и изменением количества
     * @description
     * - Если товар уже в корзине, изменяет его количество
     * - Если количество становится 0, удаляет товар из корзины
     * - Если товара нет в корзине и change > 0, добавляет его в корзину
     * - После изменений пересчитывает общее количество и стоимость
     */
    updateCartItemAmount: (state, action: PayloadAction<{ id: string, change: number }>) => {
      const { id, change } = action.payload;
      const cartItem = state.cartItems.find(item => item.id === id);

      if (cartItem) {
        cartItem.amount = Math.max(0, cartItem.amount + change);
        if (cartItem.amount === 0) {
          state.cartItems = state.cartItems.filter(item => item.id !== id);
        }
      } else if (change > 0) {
        const newItem = state.items.find(item => item.id === id);
        if (newItem) {
          state.cartItems.push({ ...newItem, amount: change });
        }
      }

      state.amount = state.cartItems.reduce((total, item) => total + item.amount, 0);
      state.total = calculateTotal(state.cartItems);
    },
  },
});

/**
 * Селектор для получения всего состояния магазина
 *
 * @param {Object} state - Состояние Redux
 * @param {InitialState} state.mobileStore - Состояние магазина
 * @returns {InitialState} Состояние магазина
 */
export const selectMobileStoreState = (state: { mobileStore: InitialState }): InitialState => {
  return state.mobileStore;
};

/**
 * Мемоизированный селектор для получения данных магазина
 *
 * @description Использует createSelector для мемоизации и оптимизации производительности
 * @returns {Object} Объект с данными магазина (items, cartItems, amount, total)
 * @example
 * // Использование в компоненте
 * const { items, cartItems, amount, total } = useSelector(selectMobileStoreData);
 */
export const selectMobileStoreData = createSelector(
  selectMobileStoreState,
  (state) => ({
    items: state.items,
    cartItems: state.cartItems,
    amount: state.amount,
    total: state.total,
  }),
);

// Экспорт действий для использования в компонентах
export const { setItems, removeCartItem, updateCartItemAmount, clearCartItems } = mobileStoreSlice.actions;

// Экспорт редьюсера для подключения к хранилищу
export const mobileStoreReducer = mobileStoreSlice.reducer;