import { userSchema } from "@rapid-guide-io/shared";
import useUserStore from "@/store/useUser";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const useAuth = () => {
    const {  data, status } = useSession();
    const { setUser, clearUser, isLogged } = useUserStore();
    const [error, setError] = useState<boolean>(false)
    
    useEffect(() => {
      if (status === "authenticated") {  
        try {
          console.log({user: data?.user});
          
          const user = userSchema.parse(data?.user);
          setUser(user);
        } catch (error) {
          console.log({error});
          
          setError(true)
        }
        
      } else if (status === "unauthenticated") {
        clearUser();
      }
    }, [status]);

    return { isLogged , status, error};
};

export default useAuth;