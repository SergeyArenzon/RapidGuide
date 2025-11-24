
import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { useAuth } from '@/hooks/use-auth'
import Loading from './Loading'

export const AppLayout = () => {
  const { isLoading } = useAuth()
  if (isLoading) {
    return <Loading />
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
    </div>
  )
}
