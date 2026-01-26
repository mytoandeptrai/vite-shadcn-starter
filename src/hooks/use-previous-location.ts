import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { ROUTES } from '@/constant';

// Auth related paths where redirecting back would cause loops
const AUTH_PATHS = new Set([
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.LINK_EXPIRED,
  ROUTES.RESET_PASSWORD,
  ROUTES.VERIFY_EMAIL,
  ROUTES.VERIFIED_EMAIL,
  ROUTES.ACTIVE,
] as string[]); // extend if needed

export function isAuthPath(path?: string) {
  if (!path) return false;
  try {
    const url = new URL(path, globalThis?.location?.origin || 'http://localhost');
    return AUTH_PATHS.has(url.pathname);
  } catch {
    return AUTH_PATHS.has(path);
  }
}

export function sanitizeRedirect(target?: string, fallback = ROUTES.HOME) {
  if (!target) return fallback;
  // Prevent open redirects by only allowing same-origin relative paths
  let newTarget = target;
  try {
    // If absolute URL, ensure same origin
    if (/^https?:\/\//i.test(target)) {
      const loc = globalThis?.location;
      if (!loc) return fallback;
      const url = new URL(target);
      if (url.origin !== loc.origin) return fallback;
      newTarget = url.pathname + url.search + url.hash;
    }
  } catch {
    return fallback;
  }
  // Avoid redirect loops to auth pages
  if (isAuthPath(newTarget)) return fallback;
  return newTarget || fallback;
}

export function usePreviousLocation() {
  const router = useRouter();
  const [previousLocation, setPreviousLocation] = useState<string>(ROUTES.HOME);
  useEffect(() => {
    return router.subscribe('onResolved', ({ fromLocation }) => {
      if (fromLocation?.href) {
        const sanitized = sanitizeRedirect(fromLocation.href);
        setPreviousLocation(sanitized);
      }
    });
  }, [router]);
  return previousLocation;
}
