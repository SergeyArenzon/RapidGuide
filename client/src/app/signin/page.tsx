
'use client'
import ROUTES from "@/app/routes";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import bg from '@/../public/images/guilherme-stecanella-_dH-oQF9w-Y-unsplash.jpg'
import { Button } from "@/components/ui/button";
import { PublicPageGuard } from "@/components/AuthGuard";


export default function SigninPage() {
  return (
    <PublicPageGuard>
      <div className="bg-white w-3/5 h-3/4 flex shadow-md container text-primary">
        <div className="relative w-1/2 container flex justify-center rounded items-center bg-primary overflow-hidden">
          <Image src={bg} className="opacity-60 absolute z-0 " layout="fill" objectFit="cover" alt="traveller image"/>
        </div>

        <div className="w-1/2 container flex flex-col gap-4  items-center ">
          <h2 className="font-extrabold">Discover More, Travel Better</h2>
          <div className="italic text-black">
            Your simplest way to connect with expert local guides for unforgettable experiences.
            Sign in and start your journey today
          </div>
          <Button onClick={() => signIn("google")}>Sign in with Google</Button>
        </div>
      </div>
    </PublicPageGuard>
    )
  }
