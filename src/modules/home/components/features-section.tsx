import { Code, Zap, Globe, Shield, Palette, GitBranch } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built with Vite for instant hot module replacement and optimized builds.',
  },
  {
    icon: Code,
    title: 'Type Safe',
    description: 'Full TypeScript support with strict type checking and excellent DX.',
  },
  {
    icon: Globe,
    title: 'i18n Ready',
    description: 'Multi-language support out of the box with react-i18next integration.',
  },
  {
    icon: Shield,
    title: 'Production Ready',
    description: 'Includes error handling, loading states, and best practices.',
  },
  {
    icon: Palette,
    title: 'Beautiful UI',
    description: 'shadcn/ui components with Tailwind CSS for stunning interfaces.',
  },
  {
    icon: GitBranch,
    title: 'Modern Stack',
    description: 'TanStack Router, React Query, and the latest React features.',
  },
];

export function FeaturesSection() {
  return (
    <section className='bg-white py-24 dark:bg-gray-900'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 font-bold text-4xl text-gray-900 md:text-5xl dark:text-white'>Everything You Need</h2>
          <p className='mx-auto max-w-2xl text-gray-600 text-xl dark:text-gray-300'>
            All the tools and components to build modern, scalable applications
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className='border-2 transition-all duration-300 hover:border-purple-500 hover:shadow-lg dark:hover:border-purple-400'
              >
                <CardHeader>
                  <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500'>
                    <Icon className='h-6 w-6 text-white' />
                  </div>
                  <CardTitle className='text-xl'>{feature.title}</CardTitle>
                  <CardDescription className='text-base'>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
