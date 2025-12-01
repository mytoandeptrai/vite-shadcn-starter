import { AnimatePresence, motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Tiếng Việt' }
];

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const isCollapsed = className?.includes('justify-center') || false;

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setCurrentLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-colors p-2 rounded-md"
        title={languages.find(l => l.code === currentLanguage)?.name || 'Language'}
      >
        <Globe className="h-4 w-4" />
        {!isCollapsed && (
          <span>{languages.find(l => l.code === currentLanguage)?.name || 'English'}</span>
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute mt-1 bg-white dark:bg-neutral-800 rounded-md shadow-md overflow-hidden z-50 min-w-32",
              isCollapsed ? "left-0" : "top-full right-0"
            )}
          >
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => changeLanguage(language.code)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm",
                    currentLanguage === language.code
                      ? "bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      : "text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  )}
                >
                  {language.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 