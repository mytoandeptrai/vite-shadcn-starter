import { PageContainer } from "@/components/containers";
import { useTranslation } from "@/integrations/i18n";
import DeveloperApiKeysContainer from "../developer-api-keys-container";
import DeveloperApiUrlsContainer from "../developer-api-urls-container";
import DeveloperSDKContainer from "../developer-sdk-container";

const DeveloperContainer = () => {
  const { t } = useTranslation('developer-page');
  return (
    <PageContainer pageTitle={t('title')} pageDescription={t('description')}>
      <div className="space-y-6">
        <DeveloperApiKeysContainer />
        <DeveloperApiUrlsContainer />
        <DeveloperSDKContainer />
      </div>
    </PageContainer>
  );
};

export default DeveloperContainer;
