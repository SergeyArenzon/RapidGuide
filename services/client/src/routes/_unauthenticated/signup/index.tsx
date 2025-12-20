import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useGuideStore } from '@/store/useGuide'
import { useTravellerStore } from '@/store/useTraveller'

export const Route = createFileRoute('/_unauthenticated/signup/')({
  component: RouteComponent,
  staticData: {
    label: 'Sign Up',
  },
})

function RouteComponent() {
  const { guide } = useGuideStore(state => state)
  const { traveller } = useTravellerStore(state => state)
  
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

