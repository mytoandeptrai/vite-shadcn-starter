import { FormInput } from "@/components/form-fields/form-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Show } from "@/components/utilities";
import { useTranslation } from "@/integrations/i18n";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMerchantFormContext } from "../../contexts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ActionType } from "../../hooks";

type MerchantFormUiProps = {
  actionType: ActionType;
  isLoading: boolean;
  onClose: () => void;
  onAdd: () => void;
  onEdit: (index: number) => void;
};

type MerchantAddressListProps = {
  onAdd: () => void;
  onEdit: (index: number) => void;
  isLoading: boolean;
  actionType: ActionType;
};

const MerchantAddressList = ({
  onAdd,
  onEdit,
  isLoading,
  actionType,
}: MerchantAddressListProps) => {
  const { t } = useTranslation("merchants-page");
  const {
    form: {
      formState: { errors },
    },
    fields,
    remove,
  } = useMerchantFormContext();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">{t("title")}</h3>

        <Show when={actionType !== "view"}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdd}
            disabled={isLoading}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("actions.add")}
          </Button>
        </Show>
      </div>

      <Show when={fields.length === 0}>
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground text-sm">
            {t("messages.no-wallet-addresses")}
          </p>
        </div>
      </Show>

      <Show when={fields.length > 0}>
        <div className="h-52 overflow-y-auto md:h-80">
          <div className="space-y-3">
            {fields.map((field, index) => {
              return (
                <div key={field.id} className="rounded-lg border p-4">
                  <div className="flex flex-col items-center justify-between gap-2 md:flex-row md:items-start md:gap-0">
                    <div className="w-full space-y-2 md:flex-1">
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="w-32 truncate font-medium text-sm md:w-56">
                              {field.label}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm">{field.label}</p>
                          </TooltipContent>
                        </Tooltip>
                        <div className="shrink-0">
                          <Badge variant="secondary" className="mr-2 text-xs">
                            {field.chain?.toUpperCase()}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {field.crypto?.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <p className="break-all font-mono text-muted-foreground text-xs">
                        {field.address}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(index)}
                        disabled={isLoading || actionType === 'view'}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={isLoading || actionType === 'view'}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Show>

      <Show when={!!errors.walletAddresses}>
        <p className="mt-1.5 font-medium text-destructive text-sm">
          {errors?.walletAddresses?.message}
        </p>
      </Show>
    </div>
  );
};

const MerchantFormUi = ({
  actionType,
  isLoading,
  onClose,
  onAdd,
  onEdit,
}: MerchantFormUiProps) => {
  const { t } = useTranslation("merchants-page");
  const { form } = useMerchantFormContext();

  return (
    <div className="space-y-4">
      <Show when={["create", "update", "view"].includes(actionType ?? "")}>
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <FormInput
            control={form.control}
            disabled={isLoading}
            readOnly={actionType === "view"}
            name="firstName"
            label={t("fields.first-name.label")}
            placeholder={t("fields.first-name.placeholder")}
            required
          />
          <FormInput
            control={form.control}
            disabled={isLoading}
            readOnly={actionType === "view"}
            name="lastName"
            label={t("fields.last-name.label")}
            placeholder={t("fields.last-name.placeholder")}
            required
          />
        </div>
        <FormInput
          control={form.control}
          disabled={isLoading}
          readOnly={actionType === "view"}
          name="email"
          label={t("fields.email.label")}
          placeholder={t("fields.email.placeholder")}
          type="email"
          required
        />

        <MerchantAddressList
          onAdd={onAdd}
          onEdit={onEdit}
          isLoading={isLoading}
          actionType={actionType}
        />
      </Show>

      <Show when={actionType !== "view"}>
        <div className="flex items-center justify-between gap-2">
          <Button
            className="w-1/2"
            size="lg"
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
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
      </Show>
    </div>
  );
};

export default MerchantFormUi;
