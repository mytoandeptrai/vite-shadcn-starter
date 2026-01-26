export const env = {
  APP_URL: import.meta.env.VITE_APP_URL || '',
  API_URL: import.meta.env.VITE_API_URL || '',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || '',
  APP_SUPPORT_EMAIL: import.meta.env.VITE_APP_SUPPORT_EMAIL || '',
  ENVIRONMENT: import.meta.env.VITE_ENV || '',
  RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '',
  SDK_LIST: import.meta.env.VITE_SDK_LIST || '',
};

export const NUMBER_FORMAT_LOOK_UP = [
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'B' },
  { value: 1e12, symbol: 'T' },
  { value: 1e15, symbol: 'P' },
  { value: 1e18, symbol: 'E' },
];

export const IMAGE_TYPE = ['png', 'jpg', 'jpeg', 'webp', 'svg'];
export const VIDEO_TYPE = ['mp4', 'mov', 'webm', 'ogg', 'wmv'];

export const FILE_FORMAT = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/jpg',
  'image/svg',
  'image/gif',
  'image/svg+xml',
];

export const keyLocalStorage = {
  EXPIRED_SIGN_UP_TIME: 'expired-signup-time',
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};

export const PAGE_SIZE_OPTIONS = [10, 50, 100, 200, 500];

export const messageError = {
  ACTIVE_CODE_EXPIRED: 'ACTIVE_CODE_EXPIRED',
  EMAIL_EXISTED: 'EMAIL_EXISTED',
  ADDRESS_EXISTED: 'ADDRESS_EXISTED',
  USER_ACTIVATED: 'USER_ACTIVATED',
  REQUESTED: 'REQUESTED',
  NOT_FOUND: 'NOT_FOUND',
  OLD_PASSWORD_NOT_MATCH: 'OLD_PASSWORD_NOT_MATCH',
  NEED_TWO_FA: 'NEED_TWO_FA',
  MATCH_CURRENT_PASSWORD: 'MATCH_CURRENT_PASSWORD',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CHAIN: 'INVALID_CHAIN',
  FORGOT_PASSWORD_CODE_EXPIRED: 'FORGOT_PASSWORD_CODE_EXPIRED',
  FORGOT_PASSWORD_LINK_ALREADY_USED: 'FORGOT_PASSWORD_LINK_ALREADY_USED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  BLACKLISTED_ADDRESS: 'BLACKLISTED_ADDRESS',
};

export const CURRENCY_CODE_MAPPING: Record<string, string> = {
  USD: 'USD',
  THB: 'THB',
  VND: 'VND',
};

export const CURRENCY_SYMBOL_MAPPING: Record<string, string> = {
  USD: '$',
  THB: '฿',
  VND: '₫',
};

export const PROTOCOL_CHAIN_MAPPING: Record<string, string> = {
  BEP20: 'BSC',
  ERC20: 'ETH',
};

export const BASE_REFRESH_INTERVAL = 1000 * 10; // 10 seconds

export const MAX_WALLETS_PER_CHAIN = 2; // Maximum number of wallets allowed per chain

export const STABLE_TOKEN: Record<string, string> = {
  USDC: "USDC",
  USDT: "USDT",
  TEST: "TEST"
}