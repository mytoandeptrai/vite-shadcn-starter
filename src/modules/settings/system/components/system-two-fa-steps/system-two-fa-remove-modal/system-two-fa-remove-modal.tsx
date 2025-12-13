import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { Show } from "@/components/utilities";
import { useTranslation } from "@/integrations/i18n";
import { useSystemTwoFaRemoveModal } from "../../../hooks";
import { FormWrapper } from "@/components/ui/form";
import { FormInput } from "@/components/form-fields/form-input";

export type SystemTwoFaRemoveModalProps = {
  open: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onSubmit: (password: string) => void;
};

const SystemTwoFaRemoveModal = ({
  open,
  onClose,
  onSubmit,
  isLoading,
}: SystemTwoFaRemoveModalProps) => {
  const { t, form, submit } = useSystemTwoFaRemoveModal(onSubmit);
  return (
    <Modal
      title={t("system.labels.two-fa.remove-modal.title")}
      description={t("system.labels.two-fa.remove-modal.description")}
      isOpen={open}
      onClose={onClose}
    >
      <FormWrapper className="space-y-4" form={form} onSubmit={submit}>
        <FormInput
          control={form.control}
          disabled={isLoading}
          name="password"
          type="password"
          label={t("system.labels.two-fa.remove-modal.fields.password.label")}
          placeholder={t("system.labels.two-fa.remove-modal.fields.password.placeholder")}
          required
        />
        <div className="flex items-center justify-between gap-2">
          <Button
            className="w-1/2"
            size="lg"
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onClose}
          >
            {t("buttons.cancel", { ns: "common" })}
          </Button>
          <Button
            className="w-1/2"
            size="lg"
            type="submit"
            disabled={isLoading}
          >
            <Show when={isLoading}>
              <Spinner />
            </Show>
            {t("buttons.ok", { ns: "common" })}
          </Button>
        </div>
      </FormWrapper>
    </Modal>
  );
};

export default SystemTwoFaRemoveModal;
