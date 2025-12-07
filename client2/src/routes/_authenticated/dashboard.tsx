import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import Api from '@/lib/api'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const handleMe = async () => {
    const api = new Api();
    const meData = await api.profile.getMe();
    console.log(meData);
  }
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

