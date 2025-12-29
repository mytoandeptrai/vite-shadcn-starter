import SDKDetailModalUi from '../../components/sdk-detail-modal-ui';
import SDKGridListUi from '../../components/sdk-grid-list-ui';
import { useSDKContainer } from '../../hooks/use-sdk-container';

const DeveloperSDKContainer = () => {
  const { data, selectedSDK, isModalOpen, handleSDKClick, handleCloseModal } = useSDKContainer();

  return (
    <>
      <SDKGridListUi sdks={data?.data || []} onSDKClick={handleSDKClick} />
      <SDKDetailModalUi sdk={selectedSDK} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default DeveloperSDKContainer;
