import { userSchema } from "@rapid-guide-io/contracts";
import type { GuideDto, UserDto} from "@rapid-guide-io/contracts";
import Api from "@/lib/api";

export const fetchMeHandler = async (
    jwt: string, 
    setGudeCB: (guide: GuideDto) => void, 
    clearguideCB: () => void) => {
    try {
      const api = new Api(jwt);
      const meData = await api.getMe();
      
      if (meData.guide) {
        setGudeCB(meData.guide);
      } else {
        clearguideCB();
      }
    } catch (error) {
      console.error('Failed to fetch profile/me:', error);
      clearguideCB();
    }
  }
  
  
  
 export const sessionUserHandler = (
    sessionUser: UserDto, 
    setUserCB: (user: UserDto) => void, 
    clearUserCB: () => void) => {
  
      const parsed = userSchema.safeParse(sessionUser)
  
      if (parsed.success) {
        setUserCB(parsed.data)
      } else {
        console.error('Failed to parse session user', parsed.error)
        clearUserCB()
      }
  }
  
  