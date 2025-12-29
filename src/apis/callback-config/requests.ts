import httpInstance from '../http-instance';
import { KEYS } from './keys';
import type { GetCallbackConfigResponse, UpdateCallbackConfigParams, UpdateCallbackConfigResponse } from './types';

export const getCallbackConfig = (signal?: AbortSignal) => {
  return httpInstance.get<GetCallbackConfigResponse>(KEYS.CALLBACK_CONFIG, { signal }).then((res) => res);
};

export const updateCallbackConfig = (params: UpdateCallbackConfigParams, signal?: AbortSignal) => {
  return httpInstance.put<UpdateCallbackConfigResponse>(KEYS.CALLBACK_CONFIG, params, { signal }).then((res) => res);
};
