import AppHeader from '@/components/layouts/app-header';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/(public)')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className='flex min-h-screen flex-col'>
      <AppHeader />
      <main className='flex-1'>
        <Outlet />
      </main>
    </section>
  );
}
