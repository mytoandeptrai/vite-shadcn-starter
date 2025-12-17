import { SettingContainer } from '@/modules/settings/setting';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(private)/settings/')({
  component: SettingContainer,
});
