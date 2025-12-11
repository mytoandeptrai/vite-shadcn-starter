import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/settings/system')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/settings/system"!</div>
}
