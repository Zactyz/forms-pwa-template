import { JSXElementConstructor, ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../_app";
import { getLayout } from "@/lib/homeLayout";
import { getFormTemplateById } from "@/lib/formTemplates";
import { getFormResponseById, getDraftResponsesByTemplateId } from "@/lib/formResponses";
import { IFormTemplate } from "@/db/types/formTemplate";
import { IFormResponse } from "@/db/types/formResponse";
import FormViewer from "@/components/forms/FormViewer";
import { useRouter } from "next/router";
import Link from "next/link";

const FormPage: NextPageWithLayout = () => {
    const [template, setTemplate] = useState<IFormTemplate | null>(null);
    const [response, setResponse] = useState<IFormResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const router = useRouter();
    const { id, responseId } = router.query;

    useEffect(() => {
        const loadFormData = async () => {
            if (!router.isReady) return;

            setLoading(true);
            try {
                if (!id) {
                    setError("No form specified");
                    return;
                }

                // Load the form template
                const loadedTemplate = await getFormTemplateById(Number(id));
                if (!loadedTemplate) {
                    setError("Form not found");
                    return;
                }

                setTemplate(loadedTemplate);

                // Load an existing response if specified
                if (responseId) {
                    const loadedResponse = await getFormResponseById(Number(responseId));
                    if (loadedResponse) {
                        setResponse(loadedResponse);
                        if (loadedResponse.status === 'submitted') {
                            setSubmitted(true);
                        }
                    }
                } else {
                    // Check for existing draft responses
                    const draftResponses = await getDraftResponsesByTemplateId(Number(id));
                    if (draftResponses.length > 0) {
                        // Use the most recent draft
                        const mostRecentDraft = draftResponses.sort((a, b) =>
                            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                        )[0];
                        setResponse(mostRecentDraft);
                    }
                }
            } catch (error) {
                console.error("Error loading form:", error);
                setError("Failed to load form data");
            } finally {
                setLoading(false);
            }
        };

        loadFormData();
    }, [id, responseId, router.isReady]);

    const handleSubmit = (submittedResponseId: number | string) => {
        setSubmitted(true);
        // Navigate to the confirmation page
        router.push(`/forms/confirmation?id=${submittedResponseId}`);
    };

    const handleSaveDraft = (savedResponseId: number | string) => {
        // Update the URL to include the responseId for future reference
        router.replace(
            { pathname: router.pathname, query: { ...router.query, responseId: savedResponseId } },
            undefined,
            { shallow: true }
        );
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
                    <Link href="/forms" className="btn btn-primary">
                        View All Forms
                    </Link>
                </div>
            </div>
        );
    }

    if (!template) {
        return (
            <div className="container mx-auto p-4">
                <div className="alert alert-warning">
                    <div>
                        <span>Form not found</span>
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

    if (submitted) {
        return (
            <div className="container mx-auto p-4">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Form Submitted</h2>
                        <p>Thank you for your submission!</p>
                        <div className="card-actions justify-end mt-4">
                            <Link href="/forms" className="btn btn-primary">
                                View All Forms
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <FormViewer
                        template={template}
                        existingResponse={response || undefined}
                        onSubmit={handleSubmit}
                        onSaveDraft={handleSaveDraft}
                    />
                </div>
            </div>
        </div>
    );
};

FormPage.getLayout = (page: ReactElement<any, string | JSXElementConstructor<any>>) =>
    getLayout(page, "Form");

export default FormPage;
