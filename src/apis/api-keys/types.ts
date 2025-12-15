import type { BaseResponseType } from "@/types";

export interface ApiKey {
  active: boolean;
  createdAt: string;
  environment: string;
  expiresAt: string;
  id: number;
  key: string;
  keyType: string;
  lastUsedAt: string;
  name: string;
  permissions: string[];
  rateLimitBucket: number;
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
}

export interface ApiKeyDetailParams {
  id: string;
}

export type GetApiKeysResponse = BaseResponseType<ApiKey[]>;

export type GetApiKeyResponse = BaseResponseType<ApiKey>;

export type GetApiKeyMetricsResponse = BaseResponseType<ApiKeyMetrics>;