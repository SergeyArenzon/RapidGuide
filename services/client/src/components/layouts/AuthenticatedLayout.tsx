import { Outlet, useMatches } from '@tanstack/react-router'
import { Breadcrumb } from '../Breadcrumb';
import { Sidebar } from '@/components/Sidebar';

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
      <main className="flex flex-col h-full overflow-hidden">
          <nav className="flex flex-col  items-left gap-2 flex-shrink-0 p-4 pb-2">
            <Breadcrumb />
            {currentLabel && <h1 className="text-2xl font-semibold mt-2">{currentLabel}</h1>}
          </nav>

        <div className="flex-1 overflow-auto p-4 pt-2">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

