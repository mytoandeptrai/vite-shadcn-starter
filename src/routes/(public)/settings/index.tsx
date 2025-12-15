import { SettingContainer } from '@/modules/settings/setting'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/settings/')({
  component: SettingContainer,
})

