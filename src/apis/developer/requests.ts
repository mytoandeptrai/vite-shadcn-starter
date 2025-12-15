import type {
  GetSDKListParams,
  GetSDKListResponse,
  GetSDKDetailParams,
  GetSDKDetailResponse,
} from "./types";
import { SDK_LIST } from "@/modules/developer/constants/sdk.constants";
import type { ISDK } from "@/modules/developer/types/sdk.types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getSDKList = async (
  params: GetSDKListParams,
  signal?: AbortSignal
): Promise<GetSDKListResponse> => {
  await sleep(500);

  let filteredSDKs: ISDK[] = SDK_LIST;

  if (params.category) {
    filteredSDKs = SDK_LIST.filter((sdk) => sdk.category === params.category);
  }

  return {
    data: filteredSDKs,
  };
};

export const getSDKDetail = async (
  params: GetSDKDetailParams,
  signal?: AbortSignal
): Promise<GetSDKDetailResponse> => {
  await sleep(300);

  const sdk = SDK_LIST.find((s) => s.id === params.id);

  if (!sdk) {
    throw new Error("SDK not found");
  }

  return {
    data: sdk,
  };
};
