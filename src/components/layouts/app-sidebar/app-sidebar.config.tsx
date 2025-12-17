import { ROUTES } from '@/constant';
import type { NavItem } from '@/types';
import type { TFunction } from 'i18next';
import {
  ArrowLeftRightIcon,
  CircleDollarSignIcon,
  LayoutDashboardIcon,
  MenuIcon,
  SettingsIcon,
  User2Icon,
  Users2Icon,
  Wallet2Icon,
  WrenchIcon,
} from 'lucide-react';

export const navItems = (t: TFunction): NavItem[] => [
  {
    title: t('labels.home'),
    url: ROUTES.DASHBOARD,
    icon: LayoutDashboardIcon,
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
  },
  {
    title: t('labels.balance'),
    url: ROUTES.BALANCE,
    icon: CircleDollarSignIcon,
    isActive: false,
    items: [],
  },
  {
    title: t('labels.transactions'),
    url: ROUTES.TRANSACTIONS,
    icon: ArrowLeftRightIcon,
    isActive: false,
    items: [],
  },
  {
    title: t('labels.wallet-address'),
    url: ROUTES.WALLET_ADDRESS,
    icon: Wallet2Icon,
    shortcut: ['p', 'p'],
    isActive: false,
    items: [],
  },
  {
    title: t('labels.merchants'),
    url: ROUTES.MERCHANTS,
    icon: MenuIcon,
    shortcut: ['k', 'k'],
    isActive: false,
    items: [],
  },
  {
    title: t('labels.developer'),
    url: ROUTES.DEVELOPER,
    icon: Users2Icon,
    shortcut: ['k', 'k'],
    isActive: false,
    items: [],
  },
  {
    title: t('labels.settings'),
    url: ROUTES.SETTINGS,
    icon: SettingsIcon,
    shortcut: ['k', 'k'],
    isActive: false,
    items: [
      {
        title: t('labels.profile'),
        url: ROUTES.PROFILE,
        icon: User2Icon,
        shortcut: ['m', 'm'],
      },
      {
        title: t('labels.system'),
        url: ROUTES.SYSTEM,
        icon: WrenchIcon,
        shortcut: ['m', 'm'],
      },
    ],
  },
];
