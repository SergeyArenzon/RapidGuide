import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Sidebar } from '@/components/Sidebar'

export const Route = createFileRoute('/_authenticated/traveller')({
  component: TravellerLayout,
})

function TravellerLayout() {
  return (
    <div className="grid grid-cols-[1fr_200px] grid-rows-[50px_1fr] h-full w-full">
      <aside>
        <Sidebar />
      </aside>
      <main className="overflow-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}

