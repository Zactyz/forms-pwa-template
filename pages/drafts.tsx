import { ReactElement, useState, useEffect } from "react";
import MobileLayout from "@/layout/mobile";
import Head from "next/head";
import { useRouter } from "next/router";
import type { NextPageWithLayout } from "./_app";
import HomeLayout from "@/layout/home";

const DraftsPage: NextPageWithLayout = () => {
    const router = useRouter();
    const [drafts, setDrafts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // Determine if we're on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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

    const content = (
        <>
            <div className={isMobile ? "mb-4" : "mb-6 flex justify-between items-center"}>
                <h1 className={isMobile ? "text-xl font-bold mb-1" : "text-2xl font-bold"}>Saved Drafts</h1>
                {!isMobile && drafts.length > 0 && (
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => router.push('/forms')}
                    >
                        Browse Forms
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center my-6">
                    <span className={isMobile ? "loading loading-spinner loading-md" : "loading loading-spinner loading-lg"}></span>
                </div>
            ) : drafts.length > 0 ? (
                <div className={isMobile ? "space-y-3" : "space-y-4"}>
                    {drafts.map((draft) => (
                        <div
                            key={draft.id}
                            className={isMobile
                                ? "card bg-white border border-base-200 hover:bg-base-100 transition-colors cursor-pointer"
                                : "card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer"}
                            onClick={() => handleContinueDraft(draft.id)}
                        >
                            <div className={isMobile ? "card-body" : "card-body p-4"}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h2 className={isMobile ? "card-title text-lg" : "card-title"}>{draft.title}</h2>
                                        <div className={isMobile ? "text-sm opacity-70" : "text-base-content/70"}>
                                            Last edited: {formatDate(draft.lastSaved)}
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            className={isMobile ? "btn btn-sm btn-primary" : "btn btn-primary"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleContinueDraft(draft.id);
                                            }}
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-3 w-full">
                                    <div className="w-full bg-base-200 rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full"
                                            style={{ width: `${draft.progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs mt-1 text-right">{draft.progress}% complete</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={isMobile
                    ? "text-center py-6 bg-white"
                    : "text-center p-10 bg-base-200 rounded-lg"}>
                    <div className={isMobile ? "text-4xl mb-2" : "text-5xl mb-3"}>📝</div>
                    <h3 className={isMobile ? "text-lg font-semibold mb-2" : "text-xl font-semibold mb-2"}>No Drafts Found</h3>
                    <p className={isMobile ? "text-base-content/70 text-sm" : "text-base-content/70 mb-4"}>
                        Start filling out a form and it will automatically save as you go.
                    </p>
                    <button
                        className={isMobile ? "btn btn-primary mt-3" : "btn btn-primary mt-4"}
                        onClick={() => router.push('/forms')}
                    >
                        Browse Forms
                    </button>
                </div>
            )}
        </>
    );

    return (
        <>
            <Head>
                <title>Saved Drafts - ISW Forms</title>
                <meta name="description" content="Continue your saved form drafts" />
            </Head>

            {isMobile
                ? <div className="px-4 py-2 mt-14">{content}</div>
                : (
                    <div className="flex flex-col items-center justify-center pt-20">
                        <div className="prose w-full max-w-full sm:w-[80%] sm:max-w-4xl">
                            {content}
                        </div>
                    </div>
                )
            }
        </>
    );
};

DraftsPage.getLayout = function getLayout(page: ReactElement) {
    return <HomeLayout>{page}</HomeLayout>;
};

export default DraftsPage; 