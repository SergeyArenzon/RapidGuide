import { Outlet, useMatches } from '@tanstack/react-router'
import { Breadcrumb } from '../Breadcrumb';
import { Sidebar } from '@/components/Sidebar'

export function AuthenticatedLayout() {
  const matches = useMatches()
  // Get the label from the last match (the specific page)
  const lastMatch = matches[matches.length - 1]
  const currentLabel = (lastMatch.staticData as { label?: string } | undefined)?.label
  
  return (
    <div className="grid grid-cols-[auto_1fr] h-full w-full">
      <aside>
        <Sidebar />
      </aside>
      <main className="overflow-auto p-4 gap-2 flex flex-col">
        <Breadcrumb />
        {currentLabel && <h1 className="text-2xl font-semibold">{currentLabel}</h1>}
        <Outlet />
      </main>
    </div>
  )
}

