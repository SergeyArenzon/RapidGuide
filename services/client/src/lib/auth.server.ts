// src/services/auth-server.ts
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

const getSessionQueryFn = async (cookieHeader?: string | null) => {
  // Call your NestJS endpoint directly from the TanStack server
  const response = await fetch("http://localhost:80/api/v1/auth/auth/get-session", {
    headers: {
      // Forward the cookie header from the browser
      cookie: cookieHeader || "",
    },
  });

  if (!response.ok) return null;
  
  // Get JWT token from response headers (similar to Better Auth's set-auth-jwt header)
  const jwt = response.headers.get("set-auth-jwt");
  const data = await response.json();
  
  return {
    data,
    jwt,
  };
};

export const getSessionFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const headers = getRequestHeaders();
    return await getSessionQueryFn(headers.get("cookie"));
  });

export const getSessionQueryKey = ['session'] as const;

export const getSessionQuery = {
  queryKey: getSessionQueryKey,
  queryFn: async () => {
    return await getSessionFn();
  },
};