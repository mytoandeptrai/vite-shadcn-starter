import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';
import { EMedia, FILE_FORMAT, NUMBER_FORMAT_LOOK_UP } from '@/constant';
import type { IMedia } from '@/types';

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
