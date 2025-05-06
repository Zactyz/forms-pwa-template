import { JSXElementConstructor, ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../_app";
import { getLayout } from "@/lib/homeLayout";
import { getAllFormTemplates } from "@/lib/formTemplates";
import { getUnsyncedResponses } from "@/lib/formResponses";
import { IFormTemplate } from "@/db/types/formTemplate";
import { syncService } from "@/lib/syncService";
import Link from "next/link";

const FormsPage: NextPageWithLayout = () => {
    const [templates, setTemplates] = useState<IFormTemplate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [unsyncedCount, setUnsyncedCount] = useState(0);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        const loadTemplates = async () => {
            try {
                const allTemplates = await getAllFormTemplates();
                setTemplates(allTemplates);
            } catch (error) {
                console.error("Failed to load templates:", error);
            } finally {
                setLoading(false);
            }
        };

        const loadUnsyncedCount = async () => {
            try {
                const unsynced = await getUnsyncedResponses();
                setUnsyncedCount(unsynced.length);
            } catch (error) {
                console.error("Failed to load unsynced count:", error);
            }
        };

        loadTemplates();
        loadUnsyncedCount();

        // Set up online/offline detection
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Set up sync listeners
        const handleSyncEvent = (event: string, data: any) => {
            if (event === 'start') {
                setSyncing(true);
            } else if (event === 'complete' || event === 'error') {
                setSyncing(false);
                loadUnsyncedCount();
            }
        };

        if (syncService) {
            syncService.addSyncListener(handleSyncEvent);
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);

            if (syncService) {
                syncService.removeSyncListener(handleSyncEvent);
            }
        };
    }, []);

    const handleSync = () => {
        if (syncService) {
            syncService.sync();
        }
    };

    const filteredTemplates = templates.filter(
        (template) =>
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Available Forms</h1>
                <p className="text-base-content/70">
                    Select a form to fill out from the list below.
                </p>
            </div>

            {isOffline && (
                <div className="alert alert-warning mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>You are currently offline. Forms can still be filled and will sync when you're back online.</span>
                </div>
            )}

            {!isOffline && unsyncedCount > 0 && (
                <div className="alert alert-info mb-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>You have {unsyncedCount} unsynced form {unsyncedCount === 1 ? 'submission' : 'submissions'}.</span>
                    </div>
                    <button
                        className={`btn btn-sm btn-primary ${syncing ? 'loading' : ''}`}
                        onClick={handleSync}
                        disabled={syncing}
                    >
                        {syncing ? 'Syncing...' : 'Sync Now'}
                    </button>
                </div>
            )}

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search forms..."
                    className="input input-bordered w-full max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : templates.length === 0 ? (
                <div className="text-center p-10 bg-base-200 rounded-lg">
                    <h2 className="text-xl mb-4">No forms available</h2>
                    <p className="mb-4">There are no forms available at the moment.</p>
                </div>
            ) : filteredTemplates.length === 0 ? (
                <div className="text-center p-10 bg-base-200 rounded-lg">
                    <h2 className="text-xl">No matching forms</h2>
                    <p>Try a different search term.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                        <div
                            key={template.id}
                            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
                        >
                            <div className="card-body">
                                <h2 className="card-title">{template.name}</h2>
                                <p className="text-sm text-base-content/70 mb-4">
                                    {template.description || "No description provided"}
                                </p>
                                <div className="flex flex-wrap items-center text-xs text-base-content/50 mb-4 gap-2">
                                    <span className="badge badge-outline">
                                        {template.fields.length} Fields
                                    </span>
                                    {template.settings.allowOfflineSubmission && (
                                        <span className="badge badge-outline badge-success">
                                            Offline Enabled
                                        </span>
                                    )}
                                    {template.settings.requireSignature && (
                                        <span className="badge badge-outline">
                                            Signature Required
                                        </span>
                                    )}
                                </div>
                                <div className="card-actions justify-end">
                                    <Link href={`/forms/${template.id}`} className="btn btn-primary">
                                        Fill Out Form
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

FormsPage.getLayout = (page: ReactElement<any, string | JSXElementConstructor<any>>) =>
    getLayout(page, "Forms");

export default FormsPage; 