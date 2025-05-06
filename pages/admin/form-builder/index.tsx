import { JSXElementConstructor, ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import { getLayout } from "@/lib/homeLayout";
import { getAllFormTemplates } from "@/lib/formTemplates";
import { IFormTemplate } from "@/db/types/formTemplate";
import Link from "next/link";
import { useRouter } from "next/router";

const FormBuilderPage: NextPageWithLayout = () => {
    const [templates, setTemplates] = useState<IFormTemplate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const router = useRouter();

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

        loadTemplates();
    }, []);

    const filteredTemplates = templates.filter(
        (template) =>
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateNew = () => {
        router.push("/admin/form-builder/new");
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Form Templates</h1>
                <button className="btn btn-primary" onClick={handleCreateNew}>
                    Create New Form
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search templates..."
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
                    <h2 className="text-xl mb-4">No templates found</h2>
                    <p className="mb-4">Create your first form template to get started.</p>
                    <button className="btn btn-primary" onClick={handleCreateNew}>
                        Create New Form
                    </button>
                </div>
            ) : filteredTemplates.length === 0 ? (
                <div className="text-center p-10 bg-base-200 rounded-lg">
                    <h2 className="text-xl">No matching templates</h2>
                    <p>Try a different search term or create a new template.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                        <div
                            key={template.id}
                            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                        >
                            <div className="card-body">
                                <h2 className="card-title">{template.name}</h2>
                                <p className="text-sm text-base-content/70 mb-4">
                                    {template.description || "No description provided"}
                                </p>
                                <div className="text-xs text-base-content/50">
                                    <p>
                                        Created: {template.createdAt.toLocaleDateString()}
                                    </p>
                                    <p>
                                        Last Modified: {template.updatedAt.toLocaleDateString()}
                                    </p>
                                    <p>
                                        Fields: {template.fields.length}
                                    </p>
                                </div>
                                <div className="card-actions justify-end mt-4">
                                    <Link
                                        href={`/forms/${template.id}`}
                                        className="btn btn-sm btn-ghost"
                                    >
                                        Preview
                                    </Link>
                                    <Link
                                        href={`/admin/form-builder/${template.id}`}
                                        className="btn btn-sm btn-primary"
                                    >
                                        Edit
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

FormBuilderPage.getLayout = (page: ReactElement<any, string | JSXElementConstructor<any>>) =>
    getLayout(page, "Form Builder");

export default FormBuilderPage; 