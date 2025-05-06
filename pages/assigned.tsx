import { ReactElement, useState, useEffect } from "react";
import MobileLayout from "@/layout/mobile";
import Head from "next/head";
import { useRouter } from "next/router";
import type { NextPageWithLayout } from "./_app";

const AssignedPage: NextPageWithLayout = () => {
    const router = useRouter();
    const [assigned, setAssigned] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
                return <span className="badge badge-error">High</span>;
            case 'medium':
                return <span className="badge badge-warning">Medium</span>;
            case 'low':
                return <span className="badge badge-info">Low</span>;
            default:
                return <span className="badge badge-info">Normal</span>;
        }
    };

    const handleStartForm = (formId: string) => {
        // Navigate to form
        router.push(`/forms/${formId}`);
    };

    return (
        <>
            <Head>
                <title>Assigned Forms - ISW Forms</title>
                <meta name="description" content="Forms that have been assigned to you" />
            </Head>

            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Assigned Forms</h1>

                {loading ? (
                    <div className="flex justify-center my-8">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : assigned.length > 0 ? (
                    <div className="space-y-4">
                        {assigned.map((form) => {
                            const daysRemaining = getDaysRemaining(form.dueDate);

                            return (
                                <div
                                    key={form.id}
                                    className="card bg-base-100 hover:bg-base-200 transition-colors"
                                >
                                    <div className="card-body p-4">
                                        <div className="flex justify-between items-start">
                                            <h2 className="card-title text-lg">{form.title}</h2>
                                            {getPriorityBadge(form.priority)}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 my-2 text-sm">
                                            <div>
                                                <div className="opacity-70">Location</div>
                                                <div>{form.location}</div>
                                            </div>
                                            <div>
                                                <div className="opacity-70">Assigned by</div>
                                                <div>{form.assignedBy}</div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-2">
                                            <div className={`text-sm ${daysRemaining <= 1 ? 'text-error' : ''}`}>
                                                Due: {formatDueDate(form.dueDate)}
                                                {daysRemaining <= 1 &&
                                                    <span className="ml-2 font-bold">
                                                        ({daysRemaining === 0 ? 'Today' : 'Tomorrow'})
                                                    </span>
                                                }
                                            </div>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleStartForm(form.id)}
                                            >
                                                Start Form
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-5xl mb-3">✓</div>
                        <h3 className="text-xl font-semibold mb-2">No Assigned Forms</h3>
                        <p className="text-base-content/70">
                            You don't have any forms assigned to you at this time.
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

AssignedPage.getLayout = function getLayout(page: ReactElement) {
    return <MobileLayout>{page}</MobileLayout>;
};

export default AssignedPage; 