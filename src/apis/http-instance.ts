import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from 'axios';
import qs from 'qs';
import { env } from '@/constant';

import type { TOptional } from '@/types';

type TFailedRequests = {
  resolve: (value: AxiosResponse) => void;
  reject: (value: AxiosError) => void;
  config: AxiosRequestConfig;
  error: AxiosError;
};

type NonNullableObject<T> = {
  [K in keyof T]: T[K] extends object ? NonNullableObject<T[K]> : NonNullable<T[K]>;
};

const MAXIMUM_RETRY_UN_AUTHENTICATION = 5;

type TRefreshToKenResponse = {
  token?: string;
  refreshToken?: string;
  tokenExpires?: number;
};

export enum ECookie {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

class HttpInstance {
  private readonly instance: AxiosInstance;

  private failedRequests: TFailedRequests[] = [];

  private isTokenRefreshing = false;

  private baseURL = '';

  private readonly refreshTokenCount = new Map<TOptional<string>, number>();

  constructor(config?: CreateAxiosDefaults) {
    this.baseURL = env.API_URL;

    this.instance = axios.create({
      ...config,
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
      paramsSerializer: (params) => {
        const _params = this.cleanParams(params);
        return qs.stringify(_params, { arrayFormat: 'repeat' });
      },
    });
    this.setupInterceptorsTo(this.instance);
  }

  private isEmpty<T>(value: T): boolean {
    return (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && value !== null && Object.keys(value).length === 0)
    );
  }

  private cleanParams<T extends Record<string, unknown>>(obj: T): NonNullableObject<T> {
    const result: Partial<NonNullableObject<T>> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (this.isEmpty(value)) {
        continue;
      }

      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        const nested = this.cleanParams(value as Record<string, unknown>);
        if (Object.keys(nested).length > 0) {
          result[key as keyof T] = nested as NonNullableObject<T>[keyof T];
        }
      } else {
        result[key as keyof T] = value as NonNullableObject<T>[keyof T];
      }
    }

    return result as NonNullableObject<T>;
  }

  private readonly onRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = localStorage.getItem(ECookie.ACCESS_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  };

  private readonly onRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[request error] [${JSON.stringify(error)}]`);

    return Promise.reject(error);
  };

  private readonly onResponse = (response: AxiosResponse) => {
    const { url } = response.config;
    const result = response.data;

    const isExistedRefreshTokenCount = this.refreshTokenCount.has(url);

    if (isExistedRefreshTokenCount) {
      this.refreshTokenCount.set(url, 0);
    }

    return result;
  };

  private readonly onResponseError = async (error: AxiosError) => {
    const originalRequest = error.config!;
    const { url } = originalRequest;
    const data = error.response?.data as any;

    if (data.statusCode !== 401) {
      return Promise.reject(data);
    }

    if (this.isTokenRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedRequests.push({
          resolve,
          reject,
          config: originalRequest,
          error,
        });
      });
    }

    const existedRefreshTokenCount = this.refreshTokenCount.get(url) ?? 0;

    if (existedRefreshTokenCount >= MAXIMUM_RETRY_UN_AUTHENTICATION) {
      window.location.href = '/';

      return Promise.reject(new Error('Maximum retry attempts exceeded. Redirecting to login.'));
    }

    this.refreshTokenCount.set(url, existedRefreshTokenCount + 1);
    this.isTokenRefreshing = true;

    try {
      const refreshToken = localStorage.getItem(ECookie.REFRESH_TOKEN) ?? '';
      const urlEndpoint = `${this.baseURL}/auth/refresh`;

      const response = await axios.post(
        urlEndpoint,
        {
          refreshToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const result: TRefreshToKenResponse = response.data;

      localStorage.setItem(ECookie.ACCESS_TOKEN, result.token!);
      localStorage.setItem(ECookie.REFRESH_TOKEN, result.refreshToken!);

      this.failedRequests.forEach(({ resolve, reject, config }) => {
        this.instance(config)
          .then((resHttp) => resolve(resHttp))
          .catch((errorHttp) => reject(errorHttp));
      });
    } catch (error: unknown) {
      this.failedRequests.forEach(({ reject, error: errorFailedRequest }) => reject(errorFailedRequest));
      this.removeTokenCookie();
      window.location.href = '/sign-in';

      return Promise.reject(error);
    } finally {
      this.failedRequests = [];
      this.isTokenRefreshing = false;
    }

    if (originalRequest) {
      return this.instance(originalRequest);
    }

    return Promise.reject(new Error('Original request is undefined.'));
  };

  private setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.request.use(this.onRequest, this.onRequestError);
    axiosInstance.interceptors.response.use(this.onResponse, this.onResponseError);

    return axiosInstance;
  }

  private removeTokenCookie() {
    localStorage.removeItem(ECookie.ACCESS_TOKEN);
    localStorage.removeItem(ECookie.REFRESH_TOKEN);
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  public async post<T, D = unknown>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  public async patch<T, D = unknown>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }
}

const httpInstance = new HttpInstance();

export default httpInstance;
