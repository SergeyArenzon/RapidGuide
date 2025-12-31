import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'


export const Route = createFileRoute('/_unauthenticated/signup/')({
  component: RouteComponent,
  staticData: {
    label: 'Sign Up',
  },
})

function RouteComponent() {
  const { guide, traveller } = Route.useRouteContext();
  
  return (
    <div className='container'>
        {!traveller && <Button variant="link">
          <Link to="/signup/traveller">Create Traveller</Link>
        </Button>}
        {!guide && <Button variant="link">
          <Link to="/signup/guide">Create Guide</Link>
        </Button>}
    </div>
  ) 
}

