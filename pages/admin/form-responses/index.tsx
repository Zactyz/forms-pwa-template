import { JSXElementConstructor, ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import { getLayout } from "@/lib/homeLayout";
import { getAllFormResponses, getFormResponsesPage, getUnsyncedResponses } from "@/lib/formResponses";
import { getAllFormTemplates } from "@/lib/formTemplates";
import { IFormResponse } from "@/db/types/formResponse";
import { IFormTemplate } from "@/db/types/formTemplate";
import { syncService } from "@/lib/syncService";
import Link from "next/link";

const FormResponsesPage: NextPageWithLayout = () => {
    const [responses, setResponses] = useState<IFormResponse[]>([]);
    const [templates, setTemplates] = useState<Map<number, IFormTemplate>>(new Map());
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [filterTemplateId, setFilterTemplateId] = useState<number | undefined>(undefined);
    const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [unsyncedCount, setUnsyncedCount] = useState(0);
    const [syncing, setSyncing] = useState(false);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Load all templates for reference
                const allTemplates = await getAllFormTemplates();
                const templateMap = new Map<number, IFormTemplate>();
                allTemplates.forEach(template => {
                    if (template.id) {
                        templateMap.set(Number(template.id), template);
                    }
                });
                setTemplates(templateMap);

                // Load responses with pagination
                const result = await getFormResponsesPage(
                    currentPage,
                    pageSize,
                    filterTemplateId,
                    filterStatus as any
                );

                setResponses(result.responses);
                setTotalPages(result.totalPages);

                // Get unsynced count
                const unsynced = await getUnsyncedResponses();
                setUnsyncedCount(unsynced.length);
            } catch (error) {
                console.error("Failed to load responses:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();

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
                loadData(); // Reload data after sync
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
    }, [currentPage, pageSize, filterTemplateId, filterStatus]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleTemplateFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setFilterTemplateId(value ? Number(value) : undefined);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handleStatusFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setFilterStatus(value || undefined);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handleSync = () => {
        if (syncService) {
            syncService.sync();
        }
    };

    const formatDate = (date: Date | undefined | string) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleString();
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Form Responses</h1>

                {!isOffline && unsyncedCount > 0 && (
                    <button
                        className={`btn btn-primary ${syncing ? 'loading' : ''}`}
                        onClick={handleSync}
                        disabled={syncing}
                    >
                        {syncing ? 'Syncing...' : `Sync ${unsyncedCount} Responses`}
                    </button>
                )}
            </div>

            {isOffline && (
                <div className="alert alert-warning mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>You are currently offline. Some functionality may be limited.</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Filter by Template</span>
                        </div>
                        <select
                            className="select select-bordered w-full"
                            value={filterTemplateId || ""}
                            onChange={handleTemplateFilter}
                        >
                            <option value="">All Templates</option>
                            {Array.from(templates.values()).map((template) => (
                                <option key={template.id} value={template.id}>
                                    {template.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Filter by Status</span>
                        </div>
                        <select
                            className="select select-bordered w-full"
                            value={filterStatus || ""}
                            onChange={handleStatusFilter}
                        >
                            <option value="">All Statuses</option>
                            <option value="draft">Draft</option>
                            <option value="submitted">Submitted</option>
                            <option value="error">Error</option>
                            <option value="syncing">Syncing</option>
                        </select>
                    </label>
                </div>

                <div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Items Per Page</span>
                        </div>
                        <select
                            className="select select-bordered w-full"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1); // Reset to first page
                            }}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </label>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center my-8">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : responses.length === 0 ? (
                <div className="alert alert-info">
                    <div>
                        <span>No responses found matching the current filters.</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Form</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Submitted</th>
                                    <th>Sync Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {responses.map((response) => (
                                    <tr key={response.id}>
                                        <td>{response.id}</td>
                                        <td>
                                            {templates.get(response.formTemplateId)?.name ||
                                                `Form #${response.formTemplateId}`}
                                        </td>
                                        <td>
                                            <span className={`badge ${response.status === 'submitted' ? 'badge-success' :
                                                response.status === 'draft' ? 'badge-warning' :
                                                    response.status === 'error' ? 'badge-error' :
                                                        'badge-info'
                                                }`}>
                                                {response.status}
                                            </span>
                                        </td>
                                        <td>{formatDate(response.createdAt)}</td>
                                        <td>{formatDate(response.submittedAt)}</td>
                                        <td>
                                            {response.offlineCreated ? (
                                                <span className="badge badge-warning">Needs Sync</span>
                                            ) : response.syncedAt ? (
                                                <span className="badge badge-success">Synced</span>
                                            ) : (
                                                <span className="badge">N/A</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={`/admin/form-responses/${response.id}`}
                                                    className="btn btn-xs btn-outline"
                                                >
                                                    View
                                                </Link>
                                                {response.status === 'draft' && (
                                                    <Link
                                                        href={`/forms/${response.formTemplateId}?responseId=${response.id}`}
                                                        className="btn btn-xs btn-primary"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center my-6">
                            <div className="join">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        className={`join-item btn ${currentPage === page ? "btn-active" : ""
                                            }`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

FormResponsesPage.getLayout = (page: ReactElement<any, string | JSXElementConstructor<any>>) =>
    getLayout(page, "Form Responses");

export default FormResponsesPage; 