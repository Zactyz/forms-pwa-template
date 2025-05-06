import { useRouter } from 'next/router';
import Link from 'next/link';
import { getLayout } from "@/lib/homeLayout";
import type { NextPageWithLayout } from "../_app";

const errorTypes: Record<string, string> = {
    Configuration: "There is a problem with the server configuration. Contact support for more information.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link is no longer valid. It may have been used already or it may have expired.",
    Default: "An unexpected error occurred. Please try again.",
};

const AuthError: NextPageWithLayout = () => {
    const router = useRouter();
    const { error } = router.query;

    const errorMessage = error && typeof error === 'string' && errorTypes[error]
        ? errorTypes[error]
        : errorTypes.Default;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-600">Authentication Error</h1>
                    <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                        {errorMessage}
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <Link href="/" className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

AuthError.getLayout = (page) => getLayout(page, "Authentication Error");

export default AuthError; 