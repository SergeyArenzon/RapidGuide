import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: () => {
    console.log("index");
  },
})
function RouteComponent() {
  return <div>Hello "/"!</div>
}

