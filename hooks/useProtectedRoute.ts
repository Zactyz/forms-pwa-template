import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Hook to protect routes that require authentication
 * @param redirectUrl URL to redirect to if user is not authenticated
 * @returns Loading state
 */
export function useProtectedRoute(redirectUrl: string = "/auth/signin") {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const router = useRouter();

    useEffect(() => {
        // If session is loaded and there's no user, redirect to the login page
        if (!loading && !session) {
            router.push({
                pathname: redirectUrl,
                query: { callbackUrl: router.asPath },
            });
        }
    }, [loading, session, router, redirectUrl]);

    return { loading, session };
} 