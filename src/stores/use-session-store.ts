import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SessionStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
};

export type SessionStoreActions = {
  reset: () => void;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
};

export type SessionStore = SessionStoreState & SessionStoreActions;

export const DEFAULT_SESSION_STORE_STATE: SessionStoreState = {
  accessToken: null,
  refreshToken: null,
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SESSION_STORE_STATE,
      reset: () => set(DEFAULT_SESSION_STORE_STATE),
      setAccessToken: (accessToken: string | null) => set({ accessToken }),
      setRefreshToken: (refreshToken: string | null) => set({ refreshToken }),
    }),
    {
      name: '__session_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
