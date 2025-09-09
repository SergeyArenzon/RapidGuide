'use client';
import { PublicPageGuard } from "@/components/AuthGuard";

function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PublicPageGuard>
      <div className="min-h-screen flex justify-center py-10">
        {children}
      </div>
    </PublicPageGuard>
  )
}

export default AuthLayout;