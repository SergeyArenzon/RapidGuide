import { Outlet } from '@tanstack/react-router'
import { Sidebar } from '@/components/Sidebar'

export function AuthenticatedLayout() {
  return (
    <div className="grid grid-cols-[200px_1fr] h-full w-full">
      <aside>
        <Sidebar />
      </aside>
      <main className="overflow-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}

