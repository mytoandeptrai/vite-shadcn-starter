import { createFileRoute } from '@tanstack/react-router'
import { StorybookDemoContainer } from '@/modules/demo-storybook'

export const Route = createFileRoute('/demo/storybook')({
	component: StorybookDemoContainer,
})
