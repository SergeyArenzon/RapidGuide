import { Outlet } from '@tanstack/react-router'
import { Sidebar } from '@/components/Sidebar'
import { useActiveTab } from '@/hooks/useActiveTab'
import { Breadcrumb } from '../Breadcrumb';

export function AuthenticatedLayout() {
  const activeTab = useActiveTab()
  console.log({activeTab});
  
  return (
    <div className="grid grid-cols-[auto_1fr] h-full w-full">
      <aside>
        <Sidebar />
      </aside>
      <main className="overflow-auto p-4 gap-2 flex flex-col">
        <Breadcrumb />
        <h1 className="text-2xl font-semibold">{activeTab?.label}</h1>
        <Outlet />
      </main>
    </div>
  )
}

