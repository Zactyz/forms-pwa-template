import { JSXElementConstructor, ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../_app";
import { getLayout } from "@/lib/homeLayout";
import { getFormResponseById } from "@/lib/formResponses";
import { getFormTemplateById } from "@/lib/formTemplates";
import { IFormResponse } from "@/db/types/formResponse";
import { IFormTemplate } from "@/db/types/formTemplate";
import { useRouter } from "next/router";
import Link from "next/link";

const ConfirmationPage: NextPageWithLayout = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [response, setResponse] = useState<IFormResponse | null>(null);
    const [template, setTemplate] = useState<IFormTemplate | null>(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const loadData = async () => {
            if (!router.isReady || !id) return;

            setLoading(true);
            try {
                const loadedResponse = await getFormResponseById(Number(id));
                if (loadedResponse) {
                    setResponse(loadedResponse);

                    // Load form template
                    const loadedTemplate = await getFormTemplateById(loadedResponse.formTemplateId);
                    if (loadedTemplate) {
                        setTemplate(loadedTemplate);
                    }
                }
            } catch (error) {
                console.error("Error loading confirmation data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, router.isReady]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!response) {
        return (
            <div className="container mx-auto p-4">
                <div className="alert alert-warning">
                    <div>
                        <span>Response not found</span>
                    </div>
                </div>
                <div className="mt-4">
                    <Link href="/forms" className="btn btn-primary">
                        View All Forms
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-success text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold">Form Submitted Successfully!</h2>
                        <p className="text-base-content/70 mt-2">
                            Thank you for your submission. Your form has been processed.
                        </p>
                    </div>

                    <div className="bg-base-200 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold mb-2">Submission Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-base-content/70">Form Name:</p>
                                <p className="font-medium">{template?.name || 'Unknown Form'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-base-content/70">Submission ID:</p>
                                <p className="font-medium">{response.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-base-content/70">Submission Date:</p>
                                <p className="font-medium">{response.submittedAt ? new Date(response.submittedAt).toLocaleString() : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-base-content/70">Status:</p>
                                <p className="font-medium">
                                    <span className="badge badge-success">{response.status}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <Link href="/forms" className="btn btn-outline">
                            Back to Forms
                        </Link>
                        <Link href={`/forms/${template?.id}`} className="btn btn-primary">
                            Submit Another Response
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

ConfirmationPage.getLayout = (page: ReactElement<any, string | JSXElementConstructor<any>>) =>
    getLayout(page, "Form Submitted");

export default ConfirmationPage; 