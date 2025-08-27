import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { userSchema } from "@rapid-guide-io/dto";
import useUserStore from "@/store/useUser";


const useAuth = () => {
    const {  data, status } = useSession();
    const { setUser, clearUser, isLogged } = useUserStore();
    const [error, setError] = useState<boolean>(false)
    
    useEffect( () => {
      if (status === "authenticated") {  
        try {          
          const user = userSchema.parse(data?.user);
          setUser(user);
        } catch (error) {
          setError(true)
        }
      } else if (status === "unauthenticated") {
        clearUser();
      }
    }, [status]);

    return { isLogged , status, error};
};

export default useAuth;