import type { BaseResponseType } from '@/types';

export interface CallbackConfig {
  callbackUrl: string;
  createdAt: string;
  eventTypes: string[];
  id: number;
  isActive: boolean;
  merchantId: number;
  redirectUrl: string;
  updatedAt: string;
}

export interface UpdateCallbackConfigParams {
  callbackUrl: string;
  eventTypes: string[];
  redirectUrl: string;
  webhookSecret: string;
  isActive: boolean;
}

export interface GetCallbackConfigResponse extends BaseResponseType<CallbackConfig> {}

export interface UpdateCallbackConfigResponse extends BaseResponseType<CallbackConfig> {}

