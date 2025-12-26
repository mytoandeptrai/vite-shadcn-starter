import httpInstance from '../http-instance';
import { KEYS } from './keys';
import type {
  DashboardApiUsageResponse,
  DashboardBalanceParams,
  DashboardBalanceResponse,
  DashboardBaseGraphParams,
  DashboardOrderSummaryResponse,
  DashboardOverviewResponse,
  DashboardStartGuideResponse,
} from './types';

export const getDashboardOverview = async (params: DashboardBaseGraphParams, signal?: AbortSignal) => {
  return httpInstance.get<DashboardOverviewResponse>(KEYS.OVERVIEW, { params, signal }).then((res) => res);
};

export const getDashboardStartGuide = async (signal?: AbortSignal) => {
  return httpInstance.get<DashboardStartGuideResponse>(KEYS.START_GUIDE, { signal }).then((res) => res);
};

export const getDashboardOrderSummary = async (params: DashboardBaseGraphParams, signal?: AbortSignal) => {
  return httpInstance.get<DashboardOrderSummaryResponse>(KEYS.ORDER_SUMMARY, { params, signal }).then((res) => res);
};

export const getDashboardBalance = async (params: DashboardBalanceParams, signal?: AbortSignal) => {
  return httpInstance.get<DashboardBalanceResponse>(KEYS.BALANCE, { params, signal }).then((res) => res);
};

export const getDashboardApiUsage = async (params: DashboardBaseGraphParams, signal?: AbortSignal) => {
  return httpInstance.get<DashboardApiUsageResponse>(KEYS.API_USAGE, { params, signal }).then((res) => res);
};