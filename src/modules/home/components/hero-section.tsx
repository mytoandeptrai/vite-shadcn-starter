import { Link } from '@tanstack/react-router';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDialogContext } from '@/integrations/dialog/dialog-provider';

export function HeroSection() {
  const { onOpenTwoFAModal } = useDialogContext();
  const onClick = () => {
    onOpenTwoFAModal({
      forceOpen: true,
      skipInitVerification: true,
      isLoading: false,
      closeOnSubmit: false,
      cb: (code?: string) => {
        console.log('🚀 ~ onClick ~ code:', code);
      },
    });
  };

  return (
    <section className='relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      {/* Background decoration */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='-top-40 -right-40 absolute h-80 w-80 animate-blob rounded-full bg-purple-300 opacity-70 mix-blend-multiply blur-xl filter' />
        <div className='-bottom-40 -left-40 animation-delay-2000 absolute h-80 w-80 animate-blob rounded-full bg-blue-300 opacity-70 mix-blend-multiply blur-xl filter' />
        <div className='-translate-x-1/2 -translate-y-1/2 animation-delay-4000 absolute top-1/2 left-1/2 h-80 w-80 transform animate-blob rounded-full bg-pink-300 opacity-70 mix-blend-multiply blur-xl filter' />
      </div>

      <div className='relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
        <div className='mb-6 flex items-center justify-center gap-2'>
          <Sparkles className='h-6 w-6 text-purple-600 dark:text-purple-400' />
          <span className='font-medium text-purple-600 text-sm uppercase tracking-wide dark:text-purple-400'>
            Modern React Starter
          </span>
        </div>

        <h1 className='mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text font-bold text-5xl text-transparent md:text-6xl lg:text-7xl'>
          Build Amazing Apps
          <br />
          <span className='text-gray-900 dark:text-white'>Faster Than Ever</span>
        </h1>

        <p className='mx-auto mb-8 max-w-3xl text-gray-600 text-xl md:text-2xl dark:text-gray-300'>
          A modern, production-ready starter template with TanStack Router, React Query, i18n, and all the tools you
          need to build exceptional applications.
        </p>

        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <Button size='lg' className='group px-8 py-6 text-lg' onClick={onClick}>
            Get Started With 2FA
            <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
          </Button>
          <Link to='/demo/table'>
            <Button size='lg' variant='outline' className='px-8 py-6 text-lg'>
              View Demos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
