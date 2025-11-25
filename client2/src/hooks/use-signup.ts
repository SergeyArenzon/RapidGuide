import { useNavigate } from "@tanstack/react-router";
import { useSessionStore } from "@/store/useSession";
import { useGuideStore } from "@/store/useGuide";

export const useSignup = () => {
    const { session } = useSessionStore((state) => state);
    const { guide } = useGuideStore((state) => state);
    const navigate = useNavigate();

    if (session && !guide ) {
        navigate({ to: "/signup" });
    }
}
