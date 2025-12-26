import type { BaseResponseType } from '@/types';

export interface ApiUsage {
  chartData: ChartDaum[];
  period: string;
  successRate: number;
  totalCalls: number;
  totalFailure: number;
  totalSuccess: number;
}

export interface ChartDaum {
  date: string;
  failure: number;
  success: number;
}

export interface Balance {
  chartData: ChartDaum2[];
  crypto: string;
  currency: string;
  period: string;
  totalBalance: number;
}

export interface ChartDaum2 {
  amount: number;
  date: string;
}

export interface Orders {
  averageOrdersPerDay: number;
  chartData: ChartDaum3[];
  period: string;
  totalOrders: number;
}

export interface ChartDaum3 {
  date: string;
  orders: number;
}

export interface StartGuide {
  apiKeys: ApiKeys;
  sdk: Sdk;
  wallet: Wallet;
}

export interface ApiKeys {
  apiKeyCount: number;
  completed: boolean;
  hasApiKeys: boolean;
}

export interface Sdk {
  completed: boolean;
  downloaded: boolean;
}

export interface Wallet {
  completed: boolean;
  hasWalletAddress: boolean;
  walletCount: number;
}

export interface DashboardOverview {
  apiUsage: ApiUsage;
  balance: Balance;
  orders: Orders;
  startGuide: StartGuide;
}

export interface DashboardStartGuide {
  apiKeys: ApiKeys;
  sdk: Sdk;
  wallet: Wallet;
}

export interface DashboardOrderSummary {
  averageOrdersPerDay: number;
  chartData: ChartDaum3[];
  period: string;
  totalOrders: number;
}

export interface DashboardBalance {
  chartData: ChartDaum2[];
  crypto: string;
  currency: string;
  period: string;
  totalBalance: number;
}

export interface DashboardApiUsage {
  chartData: ChartDaum[];
  period: string;
  successRate: number;
  totalCalls: number;
  totalFailure: number;
  totalSuccess: number;
}

export interface DashboardBaseGraphParams {
  period: string;
}

export interface DashboardBalanceParams extends DashboardBaseGraphParams {
  crypto: string;
}

export interface DashboardOverviewResponse extends BaseResponseType<DashboardOverview> {}
export interface DashboardStartGuideResponse extends BaseResponseType<DashboardStartGuide> {}
export interface DashboardOrderSummaryResponse extends BaseResponseType<DashboardOrderSummary> {}
export interface DashboardBalanceResponse extends BaseResponseType<DashboardBalance> {}
export interface DashboardApiUsageResponse extends BaseResponseType<DashboardApiUsage> {}