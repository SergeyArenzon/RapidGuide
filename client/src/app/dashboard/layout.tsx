'use client';
import {Sidebar} from "@/components/Sidebar";
import { ProtectedPageGuard } from "@/components/AuthGuard";


function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedPageGuard>
      <div className="grid grid-cols-[1fr_300px] grid-rows-[70px_1fr] h-screen"> 
        <Sidebar />
        <main>{children}</main>
      </div>
    </ProtectedPageGuard>
    )  
}

export default DashboardLayout;