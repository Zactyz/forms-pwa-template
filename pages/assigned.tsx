import { ReactElement, useState, useEffect } from "react";
import MobileLayout from "@/layout/mobile";
import Head from "next/head";
import { useRouter } from "next/router";
import type { NextPageWithLayout } from "./_app";
import HomeLayout from "@/layout/home";

const AssignedPage: NextPageWithLayout = () => {
    const router = useRouter();
    const [assigned, setAssigned] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // Determine if we're on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    useEffect(() => {
        // Simulate fetching assigned forms
        const fetchAssigned = async () => {
            try {
                // In a real implementation, this would fetch from API
                // Simulate an API delay
                await new Promise(resolve => setTimeout(resolve, 800));

                // Sample assigned forms
                const sampleAssigned = [
                    {
                        id: 'assign-1',
                        title: 'Weekly Safety Inspection',
                        dueDate: new Date(Date.now() + 172800000).toISOString(),
                        priority: 'high',
                        location: 'Building A',
                        assignedBy: 'John Manager'
                    },
                    {
                        id: 'assign-2',
                        title: 'Equipment Audit',
                        dueDate: new Date(Date.now() + 432000000).toISOString(),
                        priority: 'medium',
                        location: 'Warehouse 3',
                        assignedBy: 'Sarah Supervisor'
                    },
                    {
                        id: 'assign-3',
                        title: 'Monthly Maintenance Report',
                        dueDate: new Date(Date.now() + 86400000).toISOString(),
                        priority: 'medium',
                        location: 'Factory Floor',
                        assignedBy: 'Mike Director'
                    },
                    {
                        id: 'assign-4',
                        title: 'Environmental Compliance Check',
                        dueDate: new Date(Date.now() + 259200000).toISOString(),
                        priority: 'low',
                        location: 'All Facilities',
                        assignedBy: 'Compliance Team'
                    },
                ];

                setAssigned(sampleAssigned);
            } catch (error) {
                console.error("Error fetching assigned forms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssigned();
    }, []);

    const formatDueDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getDaysRemaining = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return <span className={isMobile ? "badge badge-xs badge-error" : "badge badge-error"}>High</span>;
            case 'medium':
                return <span className={isMobile ? "badge badge-xs badge-warning" : "badge badge-warning"}>Medium</span>;
            case 'low':
                return <span className={isMobile ? "badge badge-xs badge-info" : "badge badge-info"}>Low</span>;
            default:
                return <span className={isMobile ? "badge badge-xs badge-info" : "badge badge-info"}>Normal</span>;
        }
    };

    const handleStartForm = (formId: string) => {
        // Navigate to form
        router.push(`/forms/${formId}`);
    };

    const content = (
        <>
            <div className={isMobile ? "mb-4" : "mb-6 flex justify-between items-center"}>
                <h1 className={isMobile ? "text-xl font-bold mb-1" : "text-2xl font-bold"}>Assigned Forms</h1>
                {!isMobile && assigned.length > 0 && (
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
            ) : assigned.length > 0 ? (
                <div className={isMobile ? "space-y-3" : "space-y-4"}>
                    {assigned.map((form) => {
                        const daysRemaining = getDaysRemaining(form.dueDate);

                        return (
                            <div
                                key={form.id}
                                className={isMobile
                                    ? "card bg-white border border-base-200 hover:bg-base-100 transition-colors"
                                    : "card bg-base-100 shadow-xl hover:shadow-2xl transition-all"}
                            >
                                <div className={isMobile ? "card-body" : "card-body p-4"}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h2 className={isMobile ? "card-title text-lg" : "card-title"}>{form.title}</h2>
                                                {getPriorityBadge(form.priority)}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 my-2">
                                                <div>
                                                    <div className="opacity-70 text-sm">Location</div>
                                                    <div>{form.location}</div>
                                                </div>
                                                <div>
                                                    <div className="opacity-70 text-sm">Assigned by</div>
                                                    <div>{form.assignedBy}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ml-4">
                                            <button
                                                className={`btn btn-primary ${isMobile ? "btn-sm" : ""}`}
                                                onClick={() => handleStartForm(form.id)}
                                            >
                                                Start Form
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`mt-2 ${daysRemaining <= 1 ? 'text-error' : ''}`}>
                                        <div className="flex justify-end text-sm">
                                            Due: {formatDueDate(form.dueDate)}
                                            {daysRemaining <= 1 &&
                                                <span className="ml-2 font-bold">
                                                    ({daysRemaining === 0 ? 'Today' : 'Tomorrow'})
                                                </span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className={isMobile
                    ? "text-center py-6 bg-white"
                    : "text-center p-10 bg-base-200 rounded-lg"}>
                    <div className={isMobile ? "text-4xl mb-2" : "text-5xl mb-3"}>✓</div>
                    <h3 className={isMobile ? "text-lg font-semibold mb-2" : "text-xl font-semibold mb-2"}>No Assigned Forms</h3>
                    <p className={isMobile ? "text-base-content/70 text-sm" : "text-base-content/70 mb-4"}>
                        You don&apos;t have any forms assigned to you at this time.
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
                <title>Assigned Forms - ISW Forms</title>
                <meta name="description" content="Forms that have been assigned to you" />
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

AssignedPage.getLayout = function getLayout(page: ReactElement) {
    return <HomeLayout>{page}</HomeLayout>;
};

export default AssignedPage; 