import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { useTranslation } from '@/integrations/i18n';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { ROUTES } from '@/constant';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

const NotFoundPage = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const handleGoHome = () => {
    navigate({
      to: isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN,
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Empty className="max-w-2xl">
        <EmptyHeader>
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[120px] font-bold leading-none text-muted-foreground/20 select-none">
                404
              </div>
            </div>
            <EmptyMedia variant="icon" className="relative bg-transparent size-24">
              <FileQuestion className="size-12 text-muted-foreground" />
            </EmptyMedia>
          </div>
          <EmptyTitle className="text-3xl font-bold">
            {t('not-found.title', { defaultValue: 'Page Not Found' })}
          </EmptyTitle>
          <EmptyDescription className="text-base max-w-md">
            {t('not-found.description', {
              defaultValue: "The page you're looking for doesn't exist or has been moved. Please check the URL and try again.",
            })}
          </EmptyDescription>
        </EmptyHeader>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={handleGoHome}
            className="min-w-[160px]"
          >
            <Home className="size-4" />
            {t('not-found.goHome', { defaultValue: 'Go to Dashboard' })}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              window.history.back();
            }}
            className="min-w-[160px]"
          >
            <ArrowLeft className="size-4" />
            {t('not-found.goBack', { defaultValue: 'Go Back' })}
          </Button>
        </div>
      </Empty>
    </div>
  );
};

export default NotFoundPage;
