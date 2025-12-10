import { createFileRoute, Outlet, redirect, useLocation } from '@tanstack/react-router';
import { useTranslation } from '@/integrations/i18n';
import { ROUTES } from '@/constant';

export const Route = createFileRoute('/(auth)')({
  beforeLoad: ({ context, location }) => {
    const auth = context.auth;
    if (auth.isAuthenticated) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: RouteComponent,
});

const sidebarMapping = {
  [`${ROUTES.REGISTER}`]: {
    heading: 'layouts.auth.title',
    description: 'layouts.auth.description',
    bullets: [
      {
        title: 'layouts.auth.register.quickAndFreeSignUp',
        subtitle: 'layouts.auth.register.createAccountInSeconds',
      },
      {
        title: 'layouts.auth.register.simpleIntegration',
        subtitle: 'layouts.auth.register.useAPIOrPrebuiltSDK',
      },
      {
        title: 'layouts.auth.register.startAcceptingPayments',
        subtitle: 'layouts.auth.register.goLiveInstantly',
      },
    ],
  },
  [`${ROUTES.LOGIN}`]: {
    heading: 'layouts.auth.title',
    description: 'layouts.auth.description',
    bullets: [
      {
        title: 'layouts.auth.login.secureLogin',
        subtitle: 'layouts.auth.login.protectYourAccountWithStrongEncryption',
      },
      {
        title: 'layouts.auth.login.fastAccess',
        subtitle: 'layouts.auth.login.quickAccessToYourDashboard',
      },
      {
        title: 'layouts.auth.login.stayInControl',
        subtitle: 'layouts.auth.login.manageYourBusinessConfidently',
      },
      {
        title: 'layouts.auth.login.builtForMerchants',
        subtitle: 'layouts.auth.login.optimizedForDailyOperations',
      },
      {
        title: 'layouts.auth.login.reliableAuthentication',
        subtitle: 'layouts.auth.login.zeroDowntimeGuaranteed',
      },
    ],
  },
};

function RouteComponent() {
  const { t } = useTranslation('common');
  const location = useLocation();
  const pathname = location.pathname;
  const sidebar = sidebarMapping[pathname] ?? sidebarMapping[ROUTES.LOGIN];
  return (
    <div className='flex min-h-screen bg-linear-to-b from-slate-50 to-white'>
      <div className='hidden flex-col items-end justify-center bg-linear-to-br p-12 lg:flex lg:w-2/5'>
        <div className='max-w-md'>
          <div className='mb-12'>
            <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground'>
              PWC
            </div>
            <h1 className='mb-2 font-bold text-3xl'>{t(sidebar.heading)}</h1>
            <p className='text-slate-600 text-sm'>{t(sidebar.description)}</p>
          </div>
          <div className='space-y-6'>
            {sidebar?.bullets.map((bullet, index) => (
              <div key={index} className='flex items-start gap-3'>
                <div className='mt-2 h-2 w-2 shrink-0 rounded-full bg-primary' />
                <div>
                  <h3 className='font-semibold text-sm'>{t(bullet.title)}</h3>
                  <p className='mt-1 text-slate-600 text-xs'>{t(bullet.subtitle)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='flex flex-1 flex-col items-center justify-center px-4 md:px-0'>
        <Outlet />
      </div>
    </div>
  );
}
