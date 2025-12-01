import { useTranslation as useI18nTranslation } from 'react-i18next'

/** Custom hook that wraps react-i18next's useTranslation with better typing */
export function useTranslation(namespace?: string) {
  return useI18nTranslation(namespace)
}

