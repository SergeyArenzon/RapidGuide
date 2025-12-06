import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/')({
  beforeLoad: ({ context }) => {
    const auth = context.auth
    
    // If authenticated and has guide profile, redirect to dashboard
    if (auth.isAuthenticated && auth.guide) {
      throw redirect({
        to: '/dashboard',
      })
    }
    
    // Default: redirect to signin
    throw redirect({
      to: '/auth/signin',
    })
  },
})