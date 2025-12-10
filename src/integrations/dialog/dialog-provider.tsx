import { Show } from '@/components/utilities';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import TwoFaDialog from './components/two-fa-dialog';

export enum GeneralModals {
  SignUp = 0,
  SignIn = 1,
  TwoFA = 2,
}

type GeneralModalState = {
  type: GeneralModals;
  metadata?: {
    cb?: (code?: string) => void;
    onAbort?: () => void;
    isLoading?: boolean;
    skipInitVerification?: boolean;
    closeOnSubmit?: boolean;
  };
};

type HandleOpenTwoFAModalProps = {
  cb?: (code?: string) => void;
  onAbort?: () => void;
  forceOpen?: boolean;
  isLoading?: boolean;
  skipInitVerification?: boolean;
  closeOnSubmit?: boolean;
  disabledWarningText?: string;
};

export type DialogContextState = {
  onOpenTwoFAModal: (props: HandleOpenTwoFAModalProps) => void;
  onCloseModal: () => void;
};

const DialogContext = createContext<DialogContextState | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [generalModalState, setGeneralModalState] = useState<GeneralModalState | null>(null);

  const onCloseModal = useCallback(() => {
    setGeneralModalState(null);
  }, []);

  const onOpenTwoFAModal = useCallback(
    ({ cb, onAbort, isLoading, skipInitVerification, closeOnSubmit }: HandleOpenTwoFAModalProps) => {
      setGeneralModalState((prev) => ({
        ...prev,
        type: GeneralModals.TwoFA,
        metadata: { cb, onAbort, isLoading, skipInitVerification, closeOnSubmit },
      }));
    },
    []
  );

  const contextValue: DialogContextState = { onOpenTwoFAModal, onCloseModal };

  return (
    <DialogContext.Provider value={contextValue}>
      <>
        <Show when={generalModalState?.type === GeneralModals.TwoFA}>
          <TwoFaDialog
            open={generalModalState?.type === GeneralModals.TwoFA}
            onClose={() => {
              generalModalState?.metadata?.onAbort?.();
              onCloseModal();
            }}
            onSubmit={(code) => {
              generalModalState?.metadata?.cb?.(code);
            }}
            isLoading={!!generalModalState?.metadata?.isLoading}
            skipInitVerification={generalModalState?.metadata?.skipInitVerification}
            closeOnSubmit={generalModalState?.metadata?.closeOnSubmit}
          />
        </Show>
        {children}
      </>
    </DialogContext.Provider>
  );
}

export function useDialogContext() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialogContext must be used within a DialogProvider');
  }
  return context;
}