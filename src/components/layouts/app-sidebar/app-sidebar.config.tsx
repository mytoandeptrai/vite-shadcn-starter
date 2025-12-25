import { EUserType, ROUTES } from '@/constant';
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
    shortcut: ['h', 'h'],
    items: [],
  },
  {
    title: t('labels.balance'),
    url: ROUTES.BALANCE,
    icon: CircleDollarSignIcon,
    isActive: false,
    shortcut: ['b', 'b'],
    items: [],
  },
  {
    title: t('labels.transactions'),
    url: ROUTES.TRANSACTIONS,
    icon: ArrowLeftRightIcon,
    isActive: false,
    shortcut: ['t', 't'],
    items: [],
  },
  {
    title: t('labels.wallet-address'),
    url: ROUTES.WALLET_ADDRESS,
    icon: Wallet2Icon,
    shortcut: ['w', 'a'],
    isActive: false,
    items: [],
  },
  {
    title: t('labels.merchants'),
    url: ROUTES.MERCHANTS,
    icon: MenuIcon,
    shortcut: ['m', 'm'],
    isActive: false,
    items: [],
    access: {
      type: EUserType.MARKETPLACE,
    },
  },
  {
    title: t('labels.developer'),
    url: ROUTES.DEVELOPER,
    icon: Users2Icon,
    shortcut: ['d', 'd'],
    isActive: false,
    items: [],
  },
  {
    title: t('labels.settings'),
    url: ROUTES.SETTINGS,
    icon: SettingsIcon,
    shortcut: ['s', 's'],
    isActive: false,
    items: [
      {
        title: t('labels.profile'),
        url: ROUTES.PROFILE,
        icon: User2Icon,
        shortcut: ['p', 'p'],
      },
      {
        title: t('labels.system'),
        url: ROUTES.SYSTEM,
        icon: WrenchIcon,
        shortcut: ['s', 't'],
      },
    ],
  },
];
