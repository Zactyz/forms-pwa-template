import { signIn, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { getLayout } from "@/lib/homeLayout";
import type { NextPageWithLayout } from "../_app";
import type { GetServerSidePropsContext } from "next";

interface SignInProps {
    csrfToken: string;
}

const SignIn: NextPageWithLayout<SignInProps> = ({ csrfToken }) => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { callbackUrl } = router.query;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const result = await signIn("cognito", {
                callbackUrl: (callbackUrl as string) || "/",
                redirect: true,
            });

            if (result?.error) {
                setError("Authentication failed. Please try again.");
            }
        } catch (error) {
            setError("An unexpected error occurred. Please try again.");
            console.error("Authentication error:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Sign In</h1>
                    <p className="mt-2 text-gray-600">Sign in to your account</p>
                </div>

                {error && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Sign in with Cognito
                    </button>
                </form>
            </div>
        </div>
    );
};

SignIn.getLayout = (page) => getLayout(page, "Sign In");

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const csrfToken = await getCsrfToken(context);
    return {
        props: { csrfToken: csrfToken || "" },
    };
}

export default SignIn; 