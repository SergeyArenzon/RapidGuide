import { createAuthClient } from "better-auth/react" 

export const authClient = createAuthClient({
    baseURL: "http://localhost:80/api/v1/auth/auth"  // The base URL of your auth server
})