import { createAuthClient } from "better-auth/react" 
import { jwtClient } from "better-auth/client/plugins"


export const authClient = await  createAuthClient({
    fetchOptions: {
        credentials: 'include',
    },
    plugins: [
        jwtClient() 
    ],
    baseURL: "http://localhost:80/api/v1/auth/auth",  // The base URL of your auth server
})
