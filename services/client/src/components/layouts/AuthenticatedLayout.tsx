import { Outlet, useMatches } from '@tanstack/react-router'
import { Breadcrumb } from '../Breadcrumb';
import { Sidebar } from '@/components/Sidebar';
// Import router types to ensure declaration merging is applied
import '@/types/router'
import { extractNameFromLoaderData } from '@/lib/route-utils'

export function AuthenticatedLayout() {
  const matches = useMatches()
  
  // Get the label from the last match (the specific page)
  const lastMatch = matches[matches.length - 1]
  // TypeScript now knows the type of staticData from declaration merging
  console.log({lastMatch});
  // Try to extract name from loader data (works for tour, booking, or any entity with a name)
  const dynamicName = extractNameFromLoaderData(lastMatch.loaderData)
  const currentLabel = dynamicName || lastMatch.staticData.label
  const currentDescription = lastMatch.staticData.description


  return (
    <div className="grid grid-cols-[auto_1fr] h-full w-full p-4">
      <aside>
        <Sidebar />
      </aside>
      <main className="flex flex-col h-full overflow-hidden gap-3">
        <nav className="flex flex-col  items-left gap-2 shrink-0 ">
          <Breadcrumb />
          {currentLabel && <h1 className="text-2xl font-semibold mt-2">{currentLabel}</h1>}
          {currentDescription && <p className="text-muted-foreground">{currentDescription}</p>}
        </nav>
        <section className="flex-1 overflow-auto">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

