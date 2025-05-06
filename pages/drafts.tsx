import { ReactElement, useState, useEffect } from "react";
import MobileLayout from "@/layout/mobile";
import Head from "next/head";
import { useRouter } from "next/router";
import type { NextPageWithLayout } from "./_app";

const DraftsPage: NextPageWithLayout = () => {
    const router = useRouter();
    const [drafts, setDrafts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching saved form drafts
        const fetchDrafts = async () => {
            try {
                // In a real implementation, this would fetch from local storage or API
                const savedDrafts = localStorage.getItem("formDrafts");
                const parsedDrafts = savedDrafts ? JSON.parse(savedDrafts) : [];

                // Add some sample drafts for demonstration
                if (parsedDrafts.length === 0) {
                    const sampleDrafts = [
                        { id: 'draft-1', title: 'Safety Inspection Report', lastSaved: new Date().toISOString(), progress: 70 },
                        { id: 'draft-2', title: 'Equipment Maintenance Form', lastSaved: new Date(Date.now() - 86400000).toISOString(), progress: 30 },
                        { id: 'draft-3', title: 'Site Survey Form', lastSaved: new Date(Date.now() - 172800000).toISOString(), progress: 50 },
                    ];
                    setDrafts(sampleDrafts);
                } else {
                    setDrafts(parsedDrafts);
                }
            } catch (error) {
                console.error("Error fetching drafts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDrafts();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleContinueDraft = (draftId: string) => {
        // Navigate to form with draft data
        router.push(`/forms/${draftId}`);
    };

    return (
        <>
            <Head>
                <title>Saved Drafts - ISW Forms</title>
                <meta name="description" content="Continue your saved form drafts" />
            </Head>

            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Saved Drafts</h1>

                {loading ? (
                    <div className="flex justify-center my-8">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : drafts.length > 0 ? (
                    <div className="space-y-4">
                        {drafts.map((draft) => (
                            <div
                                key={draft.id}
                                className="card bg-base-100 hover:bg-base-200 transition-colors cursor-pointer"
                                onClick={() => handleContinueDraft(draft.id)}
                            >
                                <div className="card-body p-4">
                                    <h2 className="card-title text-lg">{draft.title}</h2>
                                    <div className="text-sm opacity-70">Last edited: {formatDate(draft.lastSaved)}</div>

                                    <div className="mt-2">
                                        <div className="w-full bg-base-300 rounded-full h-2.5">
                                            <div
                                                className="bg-primary h-2.5 rounded-full"
                                                style={{ width: `${draft.progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs mt-1 text-right">{draft.progress}% complete</div>
                                    </div>

                                    <div className="card-actions justify-end mt-2">
                                        <button className="btn btn-sm btn-primary">Continue</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-5xl mb-3">📝</div>
                        <h3 className="text-xl font-semibold mb-2">No Drafts Found</h3>
                        <p className="text-base-content/70">
                            Start filling out a form and it will automatically save as you go.
                        </p>
                        <button
                            className="btn btn-primary mt-4"
                            onClick={() => router.push('/forms')}
                        >
                            Browse Forms
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

DraftsPage.getLayout = function getLayout(page: ReactElement) {
    return <MobileLayout>{page}</MobileLayout>;
};

export default DraftsPage; 