import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSessionStore } from "@/store/useSession";
import { useGuideStore } from "@/store/useGuide";

export const useInitRouter = () => {
    const { guide } = useGuideStore((state) => state);
    const { session, isLoading } = useSessionStore((state) => state);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !session) {
            navigate({ to: "/auth/signin" });
        }
        else if (!isLoading && !guide) {
            navigate({ to: "/auth/signup" });
        } 
        else if (!isLoading && guide) {
            navigate({ to: "/dashboard" });
        }
    }, [isLoading, session, guide]);
}
