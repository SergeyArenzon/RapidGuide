import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/auth/signup/')({
  beforeLoad: ({ context }) => {
    const auth = context.auth
    
    // If not authenticated, redirect to sign in
    if (!auth.isAuthenticated) {
      throw redirect({
        to: '/auth/signin',
      })
    }
    
    // If already has guide profile, redirect to dashboard
    if (auth.guide) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='container'>
        <Button variant="link">Create Traveller</Button>
        <Button variant="link"><Link to="/auth/signup/guide">Create Guide</Link></Button>
    </div>
  ) 
}
