import { useGetSDKList } from '@/apis/developer';
import SDKDetailModalUi from '../../components/sdk-detail-modal-ui';
import SDKGridListUi from '../../components/sdk-grid-list-ui';
import { useSDKContainer } from '../../hooks/use-sdk-container';

const DeveloperSDKContainer = () => {
  const { selectedSDK, isModalOpen, handleSDKClick, handleCloseModal } = useSDKContainer();
  const { data } = useGetSDKList();

  return (
    <>
      <SDKGridListUi sdks={data?.data || []} onSDKClick={handleSDKClick} />
      <SDKDetailModalUi sdk={selectedSDK} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default DeveloperSDKContainer;
