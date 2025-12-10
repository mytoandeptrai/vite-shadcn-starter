import { useTranslation } from "@/integrations/i18n";
import { useCallback, useState } from "react";

export const useDeveloperApiKeysContainer = () => {
  const { t } = useTranslation('developer-page');
  const [isOpenDialog, setIsOpenDialog] = useState(false);


  const onCloseDialog = useCallback(() => {
    setIsOpenDialog(false);
  }, []);

  const onOpenDialog = useCallback(() => {
    setIsOpenDialog(true);
  }, []);   

  /** TODO: Request API here */
  const isLoading = false;
  const publicKey = 'pk_live_z09e9alqg2i'
  const secretKey = 'sk_live_6kmxy1hhd66'

  return {
    t,
    isLoading,
    publicKey,
    secretKey,
    isOpenDialog,
    onCloseDialog,
    onOpenDialog,
  };
};