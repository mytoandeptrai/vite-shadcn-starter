import type { BaseResponseType } from '@/types';

export interface ApiKey {
  MerchantID: number;
  Name: string;
  Key: string;
  KeyHash: string;
  KeyType: string;
  KeyPrefix: string;
  PairedKeyID: number;
  Active: boolean;
  SecretHash: string;
  Environment: string;
  Permissions: string[];
  RateLimitBucket: number;
  ExpiresAt: string;
  LastUsedAt: string | null;
  AllowedIPs: string[];
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
}

export interface ApiKeyMetrics {
  avgResponseTimeMs: number;
  last30Days: boolean;
  successRate: number;
  totalRequests: number;
}

export interface CreateApiKeyParams {
  name: string;
  environment: string;
  expiresIn: number;
  permissions: string[];
  twoFACode: string;
}

export interface ApiKeyDetailParams {
  id: string;
}

export type GetApiKeysResponse = BaseResponseType<{ keys: ApiKey[] }>;

export type GetApiKeyResponse = BaseResponseType<ApiKey>;

export type GetApiKeyMetricsResponse = BaseResponseType<ApiKeyMetrics>;