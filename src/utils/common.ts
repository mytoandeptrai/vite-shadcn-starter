import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import { isAddress } from 'ethers';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';
import { CURRENCY_CODE_MAPPING, EMedia, FILE_FORMAT, NUMBER_FORMAT_LOOK_UP } from '@/constant';
import type { IMedia, Option } from '@/types';
import type { TFunction } from 'i18next';
import type { Currency } from '@/stores/use-base-store';

dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(advancedFormat);

export const range = (start: number, end: number) => {
  const length = end - start + 1;
  /*
        Create an array of certain length and set the elements within it from
      start value to end value.
    */
  return Array.from({ length }, (_, idx) => idx + start);
};

export const currentNo = (no: number, page: number, limit: number) => {
  return no + 1 + (Number(page) - 1) * Number(limit);
};

export const validateFileFormat = (file: File, formatFile: string[] = FILE_FORMAT): boolean => {
  if (!file || typeof file === 'string') return true;
  return formatFile.includes(file.type);
};

export const checkFileSize = (file: File, size: number): boolean => {
  if (!file || typeof file === 'string') return true;
  return file.size <= size * 1024 * 1024;
};

export const validateFileSize = (file: File, size = 10): boolean => {
  if (!file || typeof file === 'string') return true;
  if (!file.size) return true;
  return file?.size <= size * 1024 * 1024;
};

export function shortenString(str?: string, length = 10) {
  if (!str) return '';
  if (str?.length <= length) return str;
  return `${str.substring(0, length)}...${str.substring(str.length - length)}`;
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const handleToastError = (error: any, defaultError = 'Something went wrong') => {
  toast.error(error?.shortMessage ?? error?.message ?? error?.cause?.message ?? defaultError);
};

export function formatDate(date: string, format = 'DD/MM/YYYY HH:mm:ss') {
  return dayjs(date).format(format);
}

export function numberFormatter(num: number, digits = 1) {
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  let item: { value: number; symbol: string } | undefined;
  for (let i = NUMBER_FORMAT_LOOK_UP.length - 1; i >= 0; i--) {
    if (num >= NUMBER_FORMAT_LOOK_UP[i].value) {
      item = NUMBER_FORMAT_LOOK_UP[i];
      break;
    }
  }
  return item ? (num / item.value).toFixed(digits).replace(regexp, '').concat(item.symbol) : '0';
}

export const sleep = async (time: number) => {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, time)
  );
};

export const getCountdownToTime = (endTime: string | undefined, format: 'HH:mm' | 'HH:mm:ss' = 'HH:mm'): string => {
  if (!endTime || !dayjs(endTime).isValid()) return format === 'HH:mm:ss' ? '00:00:00' : '00:00';

  const now = dayjs();
  const end = dayjs(endTime);

  const diff = end.diff(now);

  if (diff <= 0) {
    return format === 'HH:mm:ss' ? '00:00:00' : '00:00';
  }

  const duration = dayjs.duration(diff);
  const hours = Math.floor(duration.asHours()).toString().padStart(2, '0');
  const minutes = duration.minutes().toString().padStart(2, '0');
  const seconds = duration.seconds().toString().padStart(2, '0');

  if (format === 'HH:mm:ss') {
    return `${hours}:${minutes}:${seconds}`;
  }

  return `${hours}:${minutes}`;
};

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(decimals)} ${
    sizeType === 'accurate' ? (accurateSizes[i] ?? 'Bytest') : (sizes[i] ?? 'Bytes')
  }`;
}

export function formatCurrencyUSD(amount: number | string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(+amount);
}

export const removeDuplicatesByKey = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array?.filter((item) => {
    const itemKey = item[key];
    if (!seen.has(itemKey)) {
      seen.add(itemKey);
      return true;
    }
    return false;
  });
};

export const initMediaFromUrl = (url: string): IMedia => {
  return {
    id: uuid(),
    url,
    type: url?.includes(EMedia.Video) ? EMedia.Video : EMedia.Image,
  };
};

export const groupByKey = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce(
    (acc, item) => {
      const itemKey = item[key];
      if (!acc[itemKey as string]) {
        acc[itemKey as string] = [];
      }
      acc[itemKey as string].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
};

export function formatNaturalNumber(
  value: number | null | undefined,
  options?: Intl.NumberFormatOptions,
  locale = 'en-US'
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '-';
  }

  return new Intl.NumberFormat(locale, options).format(value);
}

export const formatCurrency = (amount: number | string, currency: Currency): string => {
  const value = typeof amount === 'string' ? Number(amount) : amount;

  if (Number.isNaN(value)) return '0';

  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: CURRENCY_CODE_MAPPING[currency.code] ?? 'USD',
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces,
  }).format(value);
};

export const formatCurrencyWithDecimals = (payload: { num?: number; minDecimals?: number; maxDecimals?: number }) => {
  const { num, maxDecimals = 2, minDecimals = 2 } = payload;
  // Ensure maxDecimals is between 0 and 8
  const clampedDecimals = Math.max(0, Math.min(8, maxDecimals));

  return (num || 0).toLocaleString('en-US', {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: clampedDecimals,
  });
};

export const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 5)}...${address.slice(-7)}`;
};

export const kebabToTitleCase = (text: string): string => {
  return text
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatToTitleCase = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export function removeEmptyStringObject(obj: Record<string, string | number | boolean | null | undefined>) {
  const cloneObj = { ...obj };
  Object.keys(cloneObj).forEach((key) => {
    if (cloneObj[key] === '') delete cloneObj[key];
  });
  return cloneObj;
}

export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const downloadCSVFile = (csvString: string, fileName = 'CSV Report', type?: string) => {
  const blob = new Blob([csvString], { type: type ?? 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName} - created ${new Date().toDateString()}`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const isInvalidNumber = (value: unknown): boolean => {
  return value === null || value === undefined || typeof value !== 'number' || Number.isNaN(value);
};

export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const formatNumber = (num: number): string => {
  return num < 10 ? `0${num}` : `${num}`;
};

const getUnit = (t: TFunction, value: number, singular: string, plural: string): string => {
  return value === 1 ? t(`time-units.${singular}`) : t(`time-units.${plural}`);
};

export const formatTimeFromSeconds = (seconds: number, t: TFunction): string => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = seconds % 60;

  if (days > 0) {
    return `${formatNumber(days)} ${getUnit(t, days, 'day', 'days')} ${formatNumber(hours)} ${getUnit(
      t,
      hours,
      'hour',
      'hours'
    )} ${formatNumber(minutes)} ${getUnit(t, minutes, 'minute', 'minutes')} ${formatNumber(remainingSeconds)} ${getUnit(
      t,
      remainingSeconds,
      'second',
      'seconds'
    )}`;
  }

  if (hours > 0) {
    return `${formatNumber(hours)} ${getUnit(t, hours, 'hour', 'hours')} ${formatNumber(minutes)} ${getUnit(
      t,
      minutes,
      'minute',
      'minutes'
    )} ${formatNumber(remainingSeconds)} ${getUnit(t, remainingSeconds, 'second', 'seconds')}`;
  }

  if (minutes > 0) {
    return `${formatNumber(minutes)} ${getUnit(
      t,
      minutes,
      'minute',
      'minutes'
    )} ${formatNumber(remainingSeconds)} ${getUnit(t, remainingSeconds, 'second', 'seconds')}`;
  }

  return `${formatNumber(remainingSeconds)} ${getUnit(t, remainingSeconds, 'second', 'seconds')}`;
};

export const CHAIN_OPTIONS = (t: TFunction): Option<string>[] => [
  { label: t('chains.ETH', { ns: 'common' }), value: 'ETH', disabled: false },
  { label: t('chains.BNB', { ns: 'common' }), value: 'BSC', disabled: true },
];

export const CRYPTO_OPTIONS = (t: TFunction): Option<string>[] => [
  { label: t('tokens.USDT', { ns: 'common' }), value: 'USDT', disabled: false },
  { label: t('tokens.TEST', { ns: 'common' }), value: 'TEST', disabled: false },
  { label: t('tokens.USDC', { ns: 'common' }), value: 'USDC', disabled: true },
];

export const NETWORK_OPTIONS = (t: TFunction): Option<string>[] => [
  { label: t('networks.testnet', { ns: 'common' }), value: 'testnet' },
  { label: t('networks.mainnet', { ns: 'common' }), value: 'mainnet' },
];

export const filterBooleanArray = <T>(arr?: T[]): T[] => {
  if (!arr || !Array.isArray(arr) || arr?.length === 0) return [];
  return arr.filter((el) => Boolean(el));
};

export function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const days = Math.floor(totalSeconds / 86400);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  if (parts.length === 0) return '0s';

  return parts.join(' ');
}

/** Validate Ethereum address format using ethers library */
export const isValidEthereumAddress = (address: string): boolean => {
  return isAddress(address);
};