import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Currency domain model
 */
export type Currency = {
  code: string; // ISO code: USD, VND, EUR
  symbol: string; // $, ₫, €
  locale: string; // en-US, vi-VN
  decimalPlaces: number; // 2, 0
};

/**
 * Store state
 */
export type CurrencyStoreState = {
  currency: Currency;
};

/**
 * Store actions
 */
export type CurrencyStoreActions = {
  setCurrency: (currency: Currency) => void;
  reset: () => void;
};

export type CurrencyStore = CurrencyStoreState & CurrencyStoreActions;

/**
 * Default currency (USD)
 */
export const DEFAULT_CURRENCY: Currency = {
  code: 'USD',
  symbol: '$',
  locale: 'en-US',
  decimalPlaces: 2,
};

export const DEFAULT_CURRENCY_STORE_STATE: CurrencyStoreState = {
  currency: DEFAULT_CURRENCY,
};

/**
 * Currency store (persisted)
 */
export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      ...DEFAULT_CURRENCY_STORE_STATE,

      setCurrency: (currency: Currency) => set({ currency }),

      reset: () => set(DEFAULT_CURRENCY_STORE_STATE),
    }),
    {
      name: '__currency_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
