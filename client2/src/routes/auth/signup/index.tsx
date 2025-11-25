import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/auth/signup/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='container'>
        <Button variant="link">Create Traveller</Button>
        <Button variant="link"><Link to="/signup/guide">Create Guide</Link></Button>
    </div>
  ) 
}
