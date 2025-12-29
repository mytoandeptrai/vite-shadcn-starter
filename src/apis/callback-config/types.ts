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
  callback_url: string;
  eventTypes: string[];
  redirectUrl: string;
  webhookSecret: string;
}

export interface GetCallbackConfigResponse extends BaseResponseType<CallbackConfig> {}

export interface UpdateCallbackConfigResponse extends BaseResponseType<CallbackConfig> {}

