"use client";
import useAuth from "@/hooks/useAuth";
import Loading from "./Loading";
import { Error } from "@/components/Error";


export default function ClientApp({ children }: { children: React.ReactNode }) {
  const { status, error } = useAuth();
  if (error) return <Error title="Error loading user" description="Please try again later" />
  if (status === "loading") return <Loading/>

  return children;
}