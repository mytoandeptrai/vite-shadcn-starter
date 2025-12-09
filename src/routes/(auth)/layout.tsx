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
}

function RouteComponent() {
  const { t } = useTranslation('common');
  const location = useLocation()
  const pathname = location.pathname
  const sidebar = sidebarMapping[pathname] ?? sidebarMapping[ROUTES.LOGIN];
  return (
    <div className='flex min-h-screen bg-linear-to-b from-slate-50 to-white'>
      <div className='hidden flex-col items-center justify-center px-8 pt-16 md:flex md:w-2/5'>
        <h1 className='mb-8 font-bold text-2xl'>{t(sidebar.heading)}</h1>
        <div className='space-y-6'>
          {sidebar?.bullets.map((bullet, index) => (
            <div key={index} className='flex items-start gap-3'>
              <div className='mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600' />
              <div>
                <h3 className='font-semibold text-sm'>{t(bullet.title)}</h3>
                <p className='mt-1 text-slate-600 text-xs'>{t(bullet.subtitle)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-1 flex-col items-center justify-center px-4 md:px-0'>
        <Outlet />
      </div>
    </div>
  );
}
