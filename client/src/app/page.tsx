'use client';

import Loading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ROUTES from "@/app/routes";

const  Home = () => {
  const { isLoading, isLogged } = useAuth();
  const router = useRouter();
  
  // Handle navigation in useEffect to avoid updating router during render
  useEffect(() => {
    if (!isLoading && isLogged) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isLoading, isLogged, router]);
  
  // Always call hooks at the top level - never conditionally
  // Show loading while checking authentication
  if (isLoading || isLogged) {
    return <Loading/>;
  }
  
  // If not logged in and not loading, redirect to signin
  return null;
}

export default Home