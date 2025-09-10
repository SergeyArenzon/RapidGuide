import Link from "next/link"
import { Button } from '@/components/ui/button'
import ROUTES from "@/app/routes"


const Signup = () => {
  return (
    <div className='container'>
      <Button variant="link"><Link href={ROUTES.CREATE_TRAVELLER}>Create Traveller</Link></Button>
      <Button variant="link"><Link href={ROUTES.CREATE_GUIDE}>Create Guide</Link></Button>
    </div>
  )
}

export default Signup