import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type {
  DashboardApiUsageResponse,
  DashboardBalanceParams,
  DashboardBalanceResponse,
  DashboardBaseGraphParams,
  DashboardOrderSummaryResponse,
  DashboardOverviewResponse,
  DashboardStartGuideResponse,
} from './types';
import {
  getDashboardApiUsage,
  getDashboardBalance,
  getDashboardOrderSummary,
  getDashboardOverview,
  getDashboardStartGuide,
} from './requests';
import { KEYS } from './keys';

export const useGetDashboardOverview = (
  params: DashboardBaseGraphParams,
  options?: Omit<UseQueryOptions<DashboardOverviewResponse, Error>, 'queryKey'>
) => {
  return useQuery<DashboardOverviewResponse, Error>({
    queryKey: [KEYS.OVERVIEW, params],
    queryFn: ({ signal }) => getDashboardOverview(params, signal),
    ...options,
  });
};

export const useGetDashboardStartGuide = (
  options?: Omit<UseQueryOptions<DashboardStartGuideResponse, Error>, 'queryKey'>
) => {
  return useQuery<DashboardStartGuideResponse, Error>({
    queryKey: [KEYS.START_GUIDE],
    queryFn: ({ signal }) => getDashboardStartGuide(signal),
    ...options,
  });
};

export const useGetDashboardOrderSummary = (
  params: DashboardBaseGraphParams,
  options?: Omit<UseQueryOptions<DashboardOrderSummaryResponse, Error>, 'queryKey'>
) => {
  return useQuery<DashboardOrderSummaryResponse, Error>({
    queryKey: [KEYS.ORDER_SUMMARY, params],
    queryFn: ({ signal }) => getDashboardOrderSummary(params, signal),
    ...options,
  });
};

export const useGetDashboardBalance = (
  params: DashboardBalanceParams,
  options?: Omit<UseQueryOptions<DashboardBalanceResponse, Error>, 'queryKey'>
) => {
  return useQuery<DashboardBalanceResponse, Error>({
    queryKey: [KEYS.BALANCE, params],
    queryFn: ({ signal }) => getDashboardBalance(params, signal),
    ...options,
  });
};

export const useGetDashboardApiUsage = (
  params: DashboardBaseGraphParams,
  options?: Omit<UseQueryOptions<DashboardApiUsageResponse, Error>, 'queryKey'>
) => {
  return useQuery<DashboardApiUsageResponse, Error>({
    queryKey: [KEYS.API_USAGE, params],
    queryFn: ({ signal }) => getDashboardApiUsage(params, signal),
    ...options,
  });
};