import { JSXElementConstructor, ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import { getLayout } from "@/lib/homeLayout";
import { getFormResponseById } from "@/lib/formResponses";
import { getFormTemplateById } from "@/lib/formTemplates";
import { IFormResponse } from "@/db/types/formResponse";
import { IFormTemplate } from "@/db/types/formTemplate";
import { useRouter } from "next/router";
import Link from "next/link";
import FormViewer from "@/components/forms/FormViewer";

const FormResponseDetailPage: NextPageWithLayout = () => {
    const [response, setResponse] = useState<IFormResponse | null>(null);
    const [template, setTemplate] = useState<IFormTemplate | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const loadData = async () => {
            if (!router.isReady) return;

            setLoading(true);
            try {
                if (!id) {
                    setError("No response specified");
                    return;
                }

                // Load the form response
                const loadedResponse = await getFormResponseById(Number(id));
                if (!loadedResponse) {
                    setError("Response not found");
                    return;
                }

                setResponse(loadedResponse);

                // Load the associated form template
                const loadedTemplate = await getFormTemplateById(loadedResponse.formTemplateId);
                if (!loadedTemplate) {
                    setError("Form template not found");
                    return;
                }

                setTemplate(loadedTemplate);
            } catch (error) {
                console.error("Error loading response data:", error);
                setError("Failed to load response data");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, router.isReady]);

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="alert alert-error">
                    <div>
                        <span>{error}</span>
                    </div>
                </div>
                <div className="mt-4">
                    <Link href="/admin/form-responses" className="btn btn-primary">
                        Back to Responses
                    </Link>
                </div>
            </div>
        );
    }

    if (!response || !template) {
        return (
            <div className="container mx-auto p-4">
                <div className="alert alert-warning">
                    <div>
                        <span>Response or form template not found</span>
                    </div>
                </div>
                <div className="mt-4">
                    <Link href="/admin/form-responses" className="btn btn-primary">
                        Back to Responses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Response #{response.id} - {template.name}
                </h1>
                <Link href="/admin/form-responses" className="btn btn-outline">
                    Back to Responses
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title">Response Details</h2>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <tbody>
                                    <tr>
                                        <td className="font-semibold">ID</td>
                                        <td>{response.id}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Form Template</td>
                                        <td>
                                            <Link
                                                href={`/admin/form-builder/${template.id}`}
                                                className="link link-primary"
                                            >
                                                {template.name}
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Status</td>
                                        <td>
                                            <span className={`badge ${response.status === 'submitted' ? 'badge-success' :
                                                    response.status === 'draft' ? 'badge-warning' :
                                                        response.status === 'error' ? 'badge-error' :
                                                            'badge-info'
                                                }`}>
                                                {response.status}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Created</td>
                                        <td>{formatDate(response.createdAt)}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Updated</td>
                                        <td>{formatDate(response.updatedAt)}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Submitted</td>
                                        <td>{formatDate(response.submittedAt)}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Created Offline</td>
                                        <td>{response.offlineCreated ? "Yes" : "No"}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Synced</td>
                                        <td>{formatDate(response.syncedAt)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Device Info */}
                {response.deviceInfo && (
                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <h2 className="card-title">Device Information</h2>
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <tbody>
                                        <tr>
                                            <td className="font-semibold">Device ID</td>
                                            <td>{response.deviceInfo.deviceId || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">Device Model</td>
                                            <td>{response.deviceInfo.deviceModel || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">OS Version</td>
                                            <td>{response.deviceInfo.osVersion || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">App Version</td>
                                            <td>{response.deviceInfo.appVersion || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">Browser</td>
                                            <td>{response.deviceInfo.browserType || "N/A"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Location Data */}
                {response.locationData && (
                    <div className="card bg-base-100 shadow-md col-span-1 md:col-span-2">
                        <div className="card-body">
                            <h2 className="card-title">Location Data</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <span className="font-semibold">Latitude:</span> {response.locationData.latitude}
                                </div>
                                <div>
                                    <span className="font-semibold">Longitude:</span> {response.locationData.longitude}
                                </div>
                                <div>
                                    <span className="font-semibold">Accuracy:</span> {response.locationData.accuracy ? `${response.locationData.accuracy} meters` : "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Form Data */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title mb-4">Form Data</h2>

                    {/* Display the read-only form with the submitted data */}
                    <FormViewer
                        template={template}
                        existingResponse={response}
                        readOnly={true}
                    />
                </div>
            </div>
        </div>
    );
};

FormResponseDetailPage.getLayout = (page: ReactElement<any, string | JSXElementConstructor<any>>) =>
    getLayout(page, "Response Details");

export default FormResponseDetailPage; 