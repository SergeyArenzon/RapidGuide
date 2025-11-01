import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  console.log("index");
  
  return (
    <div>wdsf</div>
  )
}
