import { useTranslation } from "@/integrations/i18n";
import { cn } from "@/lib/utils";
import { Paragraph } from "./typography";

interface Props {
  className?: string;
  title?: string;
}

const NoRecord = ({ className, title }: Props) => {
  const { t } = useTranslation('common');
  return (
    <div className={cn('z-50 flex size-full flex-col items-center justify-center gap-2 bg-base-white', className)}>
      <img src="/svg/no-record.svg" width={148} height={148} alt="no record" />
      <Paragraph className="text-primary-500 text-sm">{title ?? t('noRecordDataHere')}</Paragraph>
    </div>
  );
};

export default NoRecord;
