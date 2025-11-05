import { createAuthClient } from "better-auth/react" 

export const authClient = createAuthClient({
    baseURL: "http://huddlehub.io/api/v1/auth/auth"  // The base URL of your auth server
})