import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Sidebar } from '@/components/Sidebar'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="grid grid-cols-[1fr_200px] grid-rows-[50px_1fr] h-full w-full">
        <nav>DASHBOARD</nav>
        <aside>
            <Sidebar />
        </aside>
        <main>
            <Outlet />
        </main>
    </div>)
}
