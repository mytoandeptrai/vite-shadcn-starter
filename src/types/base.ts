import type { FC, PropsWithChildren } from 'react';
import type { EMedia } from '@/constant';
import type { LucideIcon } from 'lucide-react';

export type FCC<P = {}> = FC<PropsWithChildren<P>>;

export type TOptional<T> = T | undefined;

export interface IMedia {
  id?: string;
  url: string;
  type?: EMedia;
  file?: File | null;
}

export interface BaseResponseType<T = unknown> {
  data?: T;
  code: number;
  message?: string;
}

export interface IMeta {
  code: number;
  message: string | string[];
  exception: string;
  path: string;
}

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: LucideIcon;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
  access?: string[];
}

export interface Option<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

export type CommonRequestType = {
  page?: number;
  pageSize?: number;
  sort_by?: string;
  order_by?: "desc" | "asc";
  fields?: string;
  search?: string;
};

export type IPaginatedResponseType<T> = {
  data: T;
  hasNextPage: boolean;
  page: number;
  totalPage: number;
  totalCount: number;
};