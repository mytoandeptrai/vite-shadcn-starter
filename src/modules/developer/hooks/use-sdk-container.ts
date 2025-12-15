import { useState } from 'react';
import type { ISDK } from '../types/sdk.types';

export const useSDKContainer = () => {
  const [selectedSDK, setSelectedSDK] = useState<ISDK | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSDKClick = (sdk: ISDK) => {
    setSelectedSDK(sdk);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSDK(null);
  };

  return {
    selectedSDK,
    isModalOpen,
    handleSDKClick,
    handleCloseModal,
  };
};
