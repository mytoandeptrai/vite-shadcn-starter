import { Button } from '@/components/ui/button';
import { CustomLink } from '@/components/ui/custom-link';
import { ROUTES } from '@/constant';

const LandingContainer = () => {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      {/* Hero Section */}
      <section className='flex flex-1 flex-col items-center justify-center px-4 py-24 text-center'>
        <h1 className='mb-4 font-bold text-4xl tracking-tight md:text-6xl'>
          Payments made <span className='text-primary'>simple</span>
        </h1>
        <p className='mb-8 max-w-2xl text-muted-foreground text-xl'>
          PWC Pay gives you everything you need to accept payments, manage payouts, and grow your business — all in one
          dashboard.
        </p>
        <Button size='lg' asChild>
          <CustomLink to={ROUTES.GETTING_STARTED}>Get Started</CustomLink>
        </Button>
      </section>

      {/* Features Section */}
      <section className='border-t bg-muted/30 px-4 py-16'>
        <div className='mx-auto max-w-5xl'>
          <h2 className='mb-12 text-center font-semibold text-2xl md:text-3xl'>Everything you need to scale</h2>
          <div className='grid gap-8 md:grid-cols-3'>
            <div className='flex flex-col items-center text-center'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                <span className='font-bold text-primary text-xl'>₿</span>
              </div>
              <h3 className='mb-2 font-semibold text-lg'>Multi-currency</h3>
              <p className='text-muted-foreground text-sm'>
                Accept crypto and fiat payments across multiple chains and networks.
              </p>
            </div>
            <div className='flex flex-col items-center text-center'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                <span className='font-bold text-primary text-xl'>⚡</span>
              </div>
              <h3 className='mb-2 font-semibold text-lg'>Instant payouts</h3>
              <p className='text-muted-foreground text-sm'>
                Move funds to your wallet addresses with low fees and fast confirmation times.
              </p>
            </div>
            <div className='flex flex-col items-center text-center'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                <span className='font-bold text-primary text-xl'>🔒</span>
              </div>
              <h3 className='mb-2 font-semibold text-lg'>Secure by design</h3>
              <p className='text-muted-foreground text-sm'>
                Role-based access, audit logs, and enterprise-grade security out of the box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className='border-t px-4 py-12 text-center'>
        <p className='mb-4 text-muted-foreground'>Ready to get started?</p>
        <Button variant='outline' asChild>
          <CustomLink to={ROUTES.GETTING_STARTED}>Create your account</CustomLink>
        </Button>
      </section>
    </div>
  );
};

export default LandingContainer;
