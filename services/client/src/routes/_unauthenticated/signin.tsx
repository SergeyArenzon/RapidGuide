import { createFileRoute, redirect } from '@tanstack/react-router'
import bgImage from '/images/guilherme-stecanella-_dH-oQF9w-Y-unsplash.jpg'
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/_unauthenticated/signin')({
  validateSearch: searchSchema,
  staticData: {
    label: 'Sign In',
    showBreadcrumb: false,
  },
  beforeLoad: ({ context }) => {
    const { session, guide } = context

    if (session && !guide) {
        throw redirect({
            to: '/signup',
        })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const handleSignInWithGoogle = async () => {
    console.log("sign in with google");
    await authClient.signIn.social({
      provider: 'google',
      newUserCallbackURL: "http://localhost:3000/signup",
      callbackURL: "http://localhost:3000/"
    })
  }

  return <div className="bg-white w-3/5 h-3/4 flex  shadow-md  text-primary">

          <div className="relative w-1/2  flex justify-center rounded items-center bg-primary overflow-hidden">
                  <img src={bgImage} className="opacity-60 absolute z-0 w-full h-full object-cover" alt="traveller image"/>
              </div>

              <div className="w-1/2 flex flex-col gap-4  items-center ">
                  <h2 className="font-extrabold">Discover More, Travel Better</h2>
                  <div className="italic text-black">
                  Your simplest way to connect with expert local guides for unforgettable experiences.
                  Sign in and start your journey today
                  </div>
                  <Button onClick={handleSignInWithGoogle}>Sign in with Google</Button>
              </div>
    </div>
}
