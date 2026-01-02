import type * as React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';

type PermittedButtonProps = {
  permitted?: boolean;
  tooltipProps?: React.ComponentPropsWithoutRef<typeof TooltipContent>;
} & ButtonProps;

const PermittedButton = ({ permitted = true, tooltipProps, className, ...props }: PermittedButtonProps) => {
  const { t } = useTranslation('common');

  const button = <Button {...props} disabled={!permitted || props.disabled} className={className} />;

  if (permitted) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn('inline-flex w-fit', className)}>{button}</span>
      </TooltipTrigger>
      <TooltipContent side="top" {...tooltipProps}>
        <p className="whitespace-pre-line text-xs">{t('messages.unpermitted')}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default PermittedButton;
