import { useState } from 'react';
import type { ISDK } from '../types/sdk.types';
import { useGetSDKList } from '@/apis/developer';

export const useSDKContainer = () => {
  const [selectedSDK, setSelectedSDK] = useState<ISDK | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data } = useGetSDKList();

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
