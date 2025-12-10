import { ROUTES } from '@/constant';
import type { NavItem } from '@/types';
import {
  ArrowLeftRightIcon,
  CircleDollarSignIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  Users2Icon,
  Wallet2Icon,
} from 'lucide-react';

export const navItems: NavItem[] = [
  {
    title: 'Home',
    url: ROUTES.DASHBOARD,
    icon: LayoutDashboardIcon,
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
  },
  {
    title: 'Balance',
    url: ROUTES.BALANCE,
    icon: CircleDollarSignIcon,
    isActive: false,
    items: [],
  },
  {
    title: 'Transactions',
    url: ROUTES.TRANSACTIONS,
    icon: ArrowLeftRightIcon,
    isActive: false,
    items: [],
  },
  {
    title: 'Wallet Address',
    url: ROUTES.WALLET_ADDRESS,
    icon: Wallet2Icon,
    shortcut: ['p', 'p'],
    isActive: false,
    items: [],
  },
  {
    title: 'Developer',
    url: ROUTES.DEVELOPER,
    icon: Users2Icon,
    shortcut: ['k', 'k'],
    isActive: false,
    items: [],
  },
  {
    title: 'Settings',
    url: ROUTES.SETTINGS,
    icon: SettingsIcon,
    shortcut: ['k', 'k'],
    isActive: false,
    items: [],
  },
];