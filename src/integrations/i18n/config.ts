import { env } from '@/constant';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'vi'],
    debug: env.ENVIRONMENT === 'development',

    /** Interpolation settings */
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    /** Backend settings for loading translation files */
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    /** Default namespace */
    defaultNS: 'common',
    ns: [
      'common',
      'validation',
      'navigation',
      'register-page',
      'login-page',
      'verify-email-page',
      'verified-email-page',
      'dashboard-page',
      'balance-page',
    ],

    /** Detection settings */
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
