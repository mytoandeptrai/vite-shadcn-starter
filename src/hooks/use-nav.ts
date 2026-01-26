/**
 * Fully client-side hook for filtering navigation items based on RBAC
 *
 * This hook uses AuthContext to check permissions, roles, and organization
 * without any server calls. This is perfect for navigation visibility (UX only).
 *
 * Performance:
 * - All checks are synchronous (no server calls)
 * - Instant filtering
 * - No loading states
 * - No UI flashing
 *
 * Note: For actual security (API routes, server actions), always use client-side checks.
 * This is only for UI visibility.
 */

import { useMemo } from 'react';
import type { NavItem } from '@/types';
import { useAuthContext } from '@/integrations/auth/auth-provider';

/**
 * Hook to filter navigation items based on RBAC (fully client-side)
 *
 * @param items - Array of navigation items to filter
 * @returns Filtered items
 */
export function useFilteredNavItems(items: NavItem[]) {
  const { user } = useAuthContext();

  // Memoize context and permissions
  const accessContext = useMemo(() => {
    const permissions = user?.permissions || [];
    const role = user?.role;
    const type = user?.type;

    return {
      user: user ?? undefined,
      permissions: permissions as string[],
      role: role ?? undefined,
      type: type ?? undefined,
    };
  }, [user]);

  // Filter items synchronously (all client-side)
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // No access restrictions
        if (!item.access) {
          return true;
        }

        // Check permission
        if (item.access.permission) {
          if (!accessContext.permissions.includes(item.access.permission)) {
            return false;
          }
        }

        // Check type
        if (item.access.type) {
          if (accessContext.type !== item.access.type) {
            return false;
          }
        }

        // Check role
        if (item.access.role) {
          if (accessContext.role !== item.access.role) {
            return false;
          }
        }

        return true;
      })
      .map((item) => {
        // Recursively filter child items
        if (item.items && item.items.length > 0) {
          const filteredChildren = item.items.filter((childItem) => {
            // No access restrictions
            if (!childItem.access) {
              return true;
            }

            // Check permission
            if (childItem.access.permission) {
              if (!accessContext.permissions.includes(childItem.access.permission)) {
                return false;
              }
            }

            // Check type
            if (childItem.access.type) {
              if (accessContext.type !== childItem.access.type) {
                return false;
              }
            }

            // Check role
            if (childItem.access.role) {
              if (accessContext.role !== childItem.access.role) {
                return false;
              }
            }

            return true;
          });

          return {
            ...item,
            items: filteredChildren,
          };
        }

        return item;
      });
  }, [items, accessContext]);

  return filteredItems;
}
