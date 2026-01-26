import { useTranslation } from '@/integrations/i18n';
import type { FCC } from '@/types';
import type React from 'react';
import { Paragraph, SectionHeading, SectionSubtitle } from '../ui/typography';
import { Show } from '../utilities';
import { Button } from '../ui/button';
import { AlertTriangle } from 'lucide-react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { ROUTES } from '@/constant';

type PageContainerProps = {
  scrollable?: boolean;
  isLoading?: boolean;
  access?: boolean;
  accessFallback?: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  pageHeaderAction?: React.ReactNode;
  errorMessage?: string;
  backRoute?: string;
};

function PageSkeleton() {
  return (
    <div className='flex flex-1 animate-pulse flex-col gap-4 p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='mb-2 h-8 w-48 rounded bg-muted' />
          <div className='h-4 w-96 rounded bg-muted' />
        </div>
      </div>
      <div className='mt-6 h-40 w-full rounded-lg bg-muted' />
      <div className='h-40 w-full rounded-lg bg-muted' />
    </div>
  );
}

export const PageContainer: FCC<PageContainerProps> = ({
  children,
  scrollable = true,
  isLoading = false,
  access = true,
  accessFallback,
  pageTitle,
  pageDescription,
  pageHeaderAction,
  errorMessage = '',
  backRoute = ROUTES.DASHBOARD,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const navigate = useNavigate();

  const onReload = () => {
    router.invalidate();
  };

  const onGoBack = () => {
    navigate({
      to: backRoute,
    });
  };

  if (!access) {
    return (
      <div className='mt-16 flex flex-1 items-center justify-center p-4 pt-0'>
        {accessFallback ?? (
          <div className='text-center text-lg text-muted-foreground'>
            {t('errors.messages.you-do-not-have-access-to-this-page')}
          </div>
        )}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className='flex h-full items-center justify-center py-12'>
        <div className='flex flex-col items-center text-center'>
          <div className='mb-4 rounded-full bg-muted p-4'>
            <AlertTriangle className='size-6' />
          </div>
          <h2 className='font-semibold text-lg'>{t('errors.messages.error-title-loading-component')}</h2>
          <p className='mt-2 text-base text-muted-foreground'>{t('errors.messages.error-loading-component')}</p>
          <div className='mt-6 flex gap-3'>
            <Button variant='outline' type='button' onClick={onGoBack}>
              {t('buttons.back')}
            </Button>
            <Button onClick={onReload} type='button'>
              {t('buttons.reload')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const content = isLoading ? <PageSkeleton /> : children;

  return scrollable ? (
    <div className='mt-16 h-[calc(100dvh-64px)]'>
      <div className='flex flex-1 flex-col p-4 pt-0'>
        <div className='mb-4 flex items-start justify-between'>
          <div>
            <Show when={!!pageTitle}>
              <SectionHeading>{pageTitle ?? ''}</SectionHeading>
            </Show>
            <Show when={!!pageDescription}>
              <Paragraph size='sm' className='mt-2 text-muted-foreground'>
                {pageDescription ?? ''}
              </Paragraph>
            </Show>
          </div>
          {pageHeaderAction ? <div>{pageHeaderAction}</div> : null}
        </div>
        {content}
      </div>
    </div>
  ) : (
    <div className='mt-16 flex flex-1 flex-col p-4 pt-0'>
      <div className='mb-4 flex items-start justify-between'>
        <div>
          <Show when={!!pageTitle}>
            <SectionHeading>{pageTitle ?? ''}</SectionHeading>
          </Show>
          <Show when={!!pageDescription}>
            <SectionSubtitle>{pageDescription ?? ''}</SectionSubtitle>
          </Show>
        </div>
        {pageHeaderAction ? <div>{pageHeaderAction}</div> : null}
      </div>
      {content}
    </div>
  );
};
