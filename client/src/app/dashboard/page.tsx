'use client'
import { Button } from "@/components/ui/button";
import useUserStore from "@/store/useUser";

export default function Dashboard() {
  const { accessToken } = useUserStore();
  console.log({accessToken});
  
  return (
    <div className="flex items-center justify-center col-start-1 col-span-1 row-start-2 row-span-1">
        <Button>Button</Button>
    </div>
  );
}
