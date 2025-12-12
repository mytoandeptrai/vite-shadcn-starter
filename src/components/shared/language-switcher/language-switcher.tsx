'use client';

import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  const isCollapsed = className?.includes('justify-center') || false;

  const languages = useMemo(
    () => [
      { code: 'en', name: t('common:labels.english') },
      { code: 'vi', name: t('common:labels.vietnamese') },
    ],
    [t]
  );

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setCurrentLanguage(code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'flex w-32 items-center gap-2 px-2 text-sm',
            'text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white',
            className
          )}
        >
          <Globe className='h-4 w-4' />
          {!isCollapsed && <span>{languages.find((l) => l.code === currentLanguage)?.name || 'English'}</span>}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={isCollapsed ? 'start' : 'end'} className='min-w-32'>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={cn(
              'cursor-pointer',
              currentLanguage === language.code
                ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-700 dark:text-white'
                : 'text-neutral-700 dark:text-neutral-200'
            )}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
