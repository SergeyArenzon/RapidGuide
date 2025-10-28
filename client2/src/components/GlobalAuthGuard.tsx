'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Loading from '@/components/Loading';
import ROUTES from '@/app/routes';

interface GlobalAuthGuardProps {
  children: React.ReactNode;
}


// Define which routes require authentication
const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.SIGNUP,
  ROUTES.CREATE_TRAVELLER,
  ROUTES.CREATE_GUIDE,
];

// Define which routes should redirect authenticated users away (auth-only routes)
const AUTH_ONLY_ROUTES = [
  ROUTES.SIGNIN,
];

export default function GlobalAuthGuard({ children }: GlobalAuthGuardProps) {
  const { isLoading, isLogged } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      const isProtectedRoute = PROTECTED_ROUTES.includes(pathname);
      const isAuthOnlyRoute = AUTH_ONLY_ROUTES.includes(pathname);

      // If user is not logged in and trying to access a protected route
      if (!isLogged && isProtectedRoute) {
        router.push(ROUTES.SIGNIN);
        return;
      }

      // If user is logged in and trying to access auth-only routes
      if (isLogged && isAuthOnlyRoute) {
        router.push(ROUTES.DASHBOARD);
        return;
      }

      // Special handling for root route
      if (pathname === ROUTES.ROOT) {
        if (isLogged) {
          router.push(ROUTES.DASHBOARD);
        } else {
          router.push(ROUTES.SIGNIN);
        }
        return;
      }
    }
  }, [isLoading, isLogged, pathname, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // Show loading while redirecting
  const isProtectedRoute = PROTECTED_ROUTES.includes(pathname);
  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.includes(pathname);

  if (!isLogged && isProtectedRoute) {
    return <Loading />;
  }

  if (isLogged && isAuthOnlyRoute) {
    return <Loading />;
  }

  if (pathname === ROUTES.ROOT) {
    return <Loading />;
  }

  // All checks passed, render the app
  return <>{children}</>;
}
