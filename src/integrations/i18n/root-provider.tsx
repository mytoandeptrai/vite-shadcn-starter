import { useEffect } from 'react';
import './config';

interface I18nProviderProps {
  children: React.ReactNode;
}

/** I18n Provider component that initializes i18n configuration */
export function Provider({ children }: I18nProviderProps) {
  useEffect(() => {
    // i18n is initialized in config.ts
    // This effect ensures proper hydration on client side
  }, []);

  return <>{children}</>;
}

/** Get context for i18n (if needed for router context) */
export function getContext() {
  return {};
}
