import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <section className='bg-gradient-to-r from-purple-600 to-pink-600 py-24 dark:from-purple-800 dark:to-pink-800'>
      <div className='mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
        <h2 className='mb-6 font-bold text-4xl text-white md:text-5xl'>Ready to Build Something Amazing?</h2>
        <p className='mx-auto mb-8 max-w-2xl text-purple-100 text-xl'>
          Start building your next project with our modern, production-ready starter template. Everything you need is
          already set up.
        </p>
        <Link to='/demo/form'>
          <Button
            size='lg'
            variant='secondary'
            className='group bg-white px-8 py-6 text-lg text-purple-600 hover:bg-purple-50'
          >
            Explore Demo Form
            <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
          </Button>
        </Link>
      </div>
    </section>
  );
}
