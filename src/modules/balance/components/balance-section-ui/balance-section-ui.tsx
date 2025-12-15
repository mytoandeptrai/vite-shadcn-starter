import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Show } from "@/components/utilities";
import { CURRENCY_CODE_MAPPING } from "@/constant";
import { useTranslation } from "@/integrations/i18n";
import { useCurrencyStore } from "@/stores/use-base-store";
import { formatCurrency } from "@/utils";
import { Clock4Icon, Wallet } from "lucide-react";

type BalanceSectionUiProps = {
  title: string;
  description: string;
  onClick?: () => void;
  type: "available" | "incoming" | "processing";
  amount: number;
};

const BalanceSectionUi = ({
  title,
  description,
  amount,
  onClick,
  type,
}: BalanceSectionUiProps) => {
  const { t } = useTranslation("balance-page");
  const { currency } = useCurrencyStore();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {type === "available" && <Wallet className="h-8 w-8 text-primary" />}
        {type === "incoming" && (
          <Clock4Icon className="h-8 w-8 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-balance font-bold text-4xl">
          {formatCurrency(amount, currency)}
          <span className="ml-2 text-lg text-muted-foreground">
            {CURRENCY_CODE_MAPPING[currency.code] ?? "-"}
          </span>
        </div>
        <Show when={type === "available"}>
          <div className="mt-4 flex items-center gap-2">
            <Button type="button" onClick={onClick}>
              {t("actions.with-draw")}
            </Button>
          </div>
        </Show>
      </CardContent>
    </Card>
  );
};

export default BalanceSectionUi;
