import { Link } from '@tanstack/react-router';
import { BookOpen, Home, Menu, Network, Table, X } from 'lucide-react';
import { useState } from 'react';
import LanguageSwitcher from '@/components/shared/language-switcher';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';

export default function AppHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation('navigation');

  return (
    <>
      <header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-16 items-center justify-between px-4'>
          <div className='flex items-center gap-4'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => setIsOpen(true)}
              className='md:hidden'
              aria-label='Open menu'
            >
              <Menu className='h-5 w-5' />
            </Button>
            <Link to='/' className='flex items-center gap-2 font-semibold text-xl transition-colors hover:text-primary'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 font-bold text-white'>
                V
              </div>
              <span className='hidden sm:inline-block'>Vite Starter</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden items-center gap-1 md:flex'>
            <Link
              to='/'
              className='flex items-center gap-2 rounded-md px-4 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground'
              activeProps={{
                className:
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground',
              }}
            >
              <Home className='h-4 w-4' />
              {t('home')}
            </Link>
            <Link
              to='/demo/table'
              className='flex items-center gap-2 rounded-md px-4 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground'
              activeProps={{
                className:
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground',
              }}
            >
              <Table className='h-4 w-4' />
              Table
            </Link>
            <Link
              to='/demo/storybook'
              className='flex items-center gap-2 rounded-md px-4 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground'
              activeProps={{
                className:
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground',
              }}
            >
              <BookOpen className='h-4 w-4' />
              Storybook
            </Link>
            <Link
              to='/demo/form'
              className='flex items-center gap-2 rounded-md px-4 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground'
              activeProps={{
                className:
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground',
              }}
            >
              Form
            </Link>
          </nav>

          <div className='flex items-center gap-2'>
            <LanguageSwitcher className='hidden sm:flex' />
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className='fixed inset-0 z-50 bg-black/50 md:hidden'
            onClick={() => setIsOpen(false)}
            aria-hidden='true'
          />

          {/* Sidebar */}
          <aside
            className={`fixed top-0 left-0 z-50 flex h-full w-80 transform flex-col border-r bg-background shadow-xl transition-transform duration-300 ease-in-out ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className='flex items-center justify-between border-b p-4'>
              <h2 className='font-bold text-xl'>Navigation</h2>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => setIsOpen(false)}
                aria-label='Close menu'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>

            <nav className='flex-1 space-y-1 overflow-y-auto p-4'>
              <Link
                to='/'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-accent hover:text-accent-foreground'
                activeProps={{
                  className: 'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground',
                }}
              >
                <Home className='h-5 w-5' />
                <span className='font-medium'>{t('home')}</span>
              </Link>

              <Link
                to='/demo/table'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-accent hover:text-accent-foreground'
                activeProps={{
                  className: 'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground',
                }}
              >
                <Table className='h-5 w-5' />
                <span className='font-medium'>TanStack Table</span>
              </Link>

              <Link
                to='/demo/storybook'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-accent hover:text-accent-foreground'
                activeProps={{
                  className: 'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground',
                }}
              >
                <BookOpen className='h-5 w-5' />
                <span className='font-medium'>Storybook</span>
              </Link>

              <Link
                to='/demo/tanstack-query'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-accent hover:text-accent-foreground'
                activeProps={{
                  className: 'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground',
                }}
              >
                <Network className='h-5 w-5' />
                <span className='font-medium'>TanStack Query</span>
              </Link>

              <Link
                to='/demo/form'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-accent hover:text-accent-foreground'
                activeProps={{
                  className: 'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground',
                }}
              >
                <span className='font-medium'>Form Demo</span>
              </Link>
            </nav>

            {/* Language Switcher in Sidebar */}
            <div className='border-t p-4'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='font-medium text-muted-foreground text-sm'>{t('settings')}</span>
              </div>
              <LanguageSwitcher />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
