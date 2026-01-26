import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/getting-started')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/getting-started"!</div>
}
