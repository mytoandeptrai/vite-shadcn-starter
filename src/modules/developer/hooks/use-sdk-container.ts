import { useMemo, useState } from 'react';
import type { ISDK } from '../types/sdk.types';
import { getSDKListFromEnv } from '../constants/sdk.constants';

export const useSDKContainer = () => {
  const [selectedSDK, setSelectedSDK] = useState<ISDK | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const data = useMemo(() => {
    const sdkList = getSDKListFromEnv();
    return {
      data: sdkList,
    };
  }, []);

  const handleSDKClick = (sdk: ISDK) => {
    setSelectedSDK(sdk);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSDK(null);
  };

  return {
    data,
    selectedSDK,
    isModalOpen,
    handleSDKClick,
    handleCloseModal,
  };
};
