import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

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

function RouteComponent() {
  return (
    <div className='flex min-h-screen bg-linear-to-b from-slate-50 to-white'>
      <div className='flex flex-1 flex-col items-center justify-center px-4 md:px-0'>
        <Outlet />
      </div>
    </div>
  );
}
