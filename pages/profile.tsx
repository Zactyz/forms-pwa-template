import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getLayout } from "@/lib/homeLayout";
import type { NextPageWithLayout } from "./_app";
import Loading from "@/components/Loading";
import { signOut } from "next-auth/react";
import { useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import { createError, ErrorType } from "@/lib/errorHandler";

const Profile: NextPageWithLayout = () => {
    const { loading, session } = useProtectedRoute();
    const [error, setError] = useState<null | string | any>(null);

    if (loading) {
        return <Loading fullScreen text="Loading your profile..." />;
    }

    if (!session) {
        return null; // This will redirect to login
    }

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: "/" });
        } catch (err) {
            setError(createError(ErrorType.AUTH, "Failed to sign out", undefined, err));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-6">My Profile</h1>

                {error && <ErrorMessage error={error} />}

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                    <div className="bg-gray-100 p-4 rounded">
                        <p className="mb-2"><span className="font-medium">Name:</span> {session.user?.name || "Not provided"}</p>
                        <p className="mb-2"><span className="font-medium">Email:</span> {session.user?.email || "Not provided"}</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

Profile.getLayout = (page) => getLayout(page, "Profile");

export default Profile; 