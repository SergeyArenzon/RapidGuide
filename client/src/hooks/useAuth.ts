import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { userSchema } from "@rapid-guide-io/dto";
import useUserStore from "@/store/useUser";
import ROUTES from "@/app/routes";


const useAuth = () => {
    const { setUser, setAccessToken, clearUser, isLogged, accessToken } = useUserStore();
    const [error, setError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const router = useRouter();
    const pathname = usePathname();
    
    useEffect( () => {
      const checkRefreshToken = async () => {
        const refreshToken = await fetch("http://huddlehub.io/api/v1/auth/refresh", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (refreshToken.ok) {
          const data = await refreshToken.json();
          const { user, accessToken } = data;
          setUser(user, accessToken);
          setIsLoading(false);
          
        } else {
          clearUser();
          setIsLoading(false);
          if (pathname !== ROUTES.SIGNIN) {
            router.push(ROUTES.SIGNIN);
          }
        }
      }

      checkRefreshToken();
    }, []);


    return { isLogged, error, accessToken, isLoading };
};

export default useAuth;