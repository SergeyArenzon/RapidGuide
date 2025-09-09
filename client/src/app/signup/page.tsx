import Link from "next/link"
import { Button } from '@/components/ui/button'
import ROUTES from "@/app/routes"
import { ProtectedPageGuard } from "@/components/AuthGuard"


const Signup = () => {
  return (
    <ProtectedPageGuard>
      <div className='container'>
        <Button variant="link"><Link href={ROUTES.CREATE_TRAVELLER}>Create Traveller</Link></Button>
        <Button variant="link"><Link href={ROUTES.CREATE_GUIDE}>Create Guide</Link></Button>
      </div>
    </ProtectedPageGuard>
  )
}

export default Signup