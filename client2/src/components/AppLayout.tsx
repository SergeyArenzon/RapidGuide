
import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'

export const AppLayout = () => {
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
