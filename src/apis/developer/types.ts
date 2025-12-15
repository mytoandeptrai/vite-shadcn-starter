import type { ISDK, SDKCategory } from '@/modules/developer/types/sdk.types';

export interface GetSDKListParams {
  category?: SDKCategory;
}

export interface GetSDKListResponse {
  data: ISDK[];
}

export interface GetSDKDetailParams {
  id: string;
}

export interface GetSDKDetailResponse {
  data: ISDK;
}
