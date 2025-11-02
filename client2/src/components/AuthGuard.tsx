import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Loading from '@/components/Loading';
import ROUTES from '@/app/routes';

interface AuthGuardConfig {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean; // true = require login, false = require logout
}

export default function AuthGuard({ 
  children, 
  redirectTo = ROUTES.DASHBOARD, 
  requireAuth = false 
}: AuthGuardConfig) {
  const { isLoading, isLogged } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // If we require auth but user is not logged in
      if (requireAuth && !isLogged) {
        router.push(ROUTES.SIGNIN);
        return;
      }
      
      // If we require no auth (auth pages) but user is logged in
      if (!requireAuth && isLogged) {
        router.push(redirectTo);
        return;
      }
    }
  }, [isLoading, isLogged, requireAuth, router, redirectTo]);

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // If requiring auth but not logged in, don't render (redirect is happening)
  if (requireAuth && !isLogged) {
    return <Loading />;
  }

  // If requiring no auth but logged in, don't render (redirect is happening)
  if (!requireAuth && isLogged) {
    return <Loading />;
  }

  // All checks passed, render children
  return <>{children}</>;
}

// Convenience wrapper for public pages (signin, signup)
export function PublicPageGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={false} redirectTo={ROUTES.DASHBOARD}>
      {children}
    </AuthGuard>
  );
}

// Convenience wrapper for protected pages (dashboard, etc)
export function ProtectedPageGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={true} redirectTo={ROUTES.SIGNIN}>
      {children}
    </AuthGuard>
  );
}
