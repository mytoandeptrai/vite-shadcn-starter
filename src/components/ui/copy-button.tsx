import { useCopy } from '@/hooks/use-copy';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { CheckCircle2, CopyIcon } from 'lucide-react';
import type React from 'react';
import { toast } from 'sonner';
import { Button } from './button';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  isShowToast?: boolean;
  toastMessage?: string;
  iconClassName?: string;
}

const CopyButton = ({ value, className, isShowToast = true, toastMessage, iconClassName, ...props }: Props) => {
  const { t } = useTranslation();
  const [copied, copy] = useCopy();

  const handleCopy = () => {
    if (copied) return;
    copy(value);

    if (isShowToast) {
      toast.success(toastMessage || t('errors.messages.copied-to-clipboard'));
    }
  };

  return (
    <Button
      variant='outline'
      size='icon'
      type='button'
      onClick={handleCopy}
      {...props}
      className={cn(
        'group',
        {
          'cursor-pointer': !copied,
        },
        className
      )}
    >
      {copied ? (
        <CheckCircle2 className={cn('h-4 w-4', iconClassName)} />
      ) : (
        <CopyIcon
          className={cn(
            'h-4 w-4 transition-opacity duration-100 ease-linear group-hover:opacity-100 md:h-3 md:w-3',
            iconClassName
          )}
        />
      )}
    </Button>
  );
};

export default CopyButton;