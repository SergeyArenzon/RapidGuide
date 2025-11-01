import { createFileRoute } from '@tanstack/react-router'
import bgImage from '/images/guilherme-stecanella-_dH-oQF9w-Y-unsplash.jpg'
import { Button } from '@/components/ui/button';


export const Route = createFileRoute('/auth/signin/')({
  component: RouteComponent,
})

function RouteComponent() {   
  return <div className="bg-white w-3/5 h-3/4 flex shadow-md container text-primary">
    <div className="relative w-1/2 container flex justify-center rounded items-center bg-primary overflow-hidden">
            <img src={bgImage} className="opacity-60 absolute z-0 w-full h-full object-cover" alt="traveller image"/>
        </div>

        <div className="w-1/2 container flex flex-col gap-4  items-center ">
            <h2 className="font-extrabold">Discover More, Travel Better</h2>
            <div className="italic text-black">
            Your simplest way to connect with expert local guides for unforgettable experiences.
            Sign in and start your journey today
            </div>
            <Button onClick={() => console.log("sign in with google")}>Sign in with Google</Button>
        </div>
    </div>
}

