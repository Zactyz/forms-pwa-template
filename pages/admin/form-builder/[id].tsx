import { JSXElementConstructor, ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import { getLayout } from "@/lib/homeLayout";
import { getFormTemplateById, updateFormTemplate, createFormTemplate } from "@/lib/formTemplates";
import { IFormTemplate, IFormSettings } from "@/db/types/formTemplate";
import { IFormField, FieldType } from "@/db/types/formField";
import { useRouter } from "next/router";
import Link from "next/link";

const defaultFormSettings: IFormSettings = {
    allowOfflineSubmission: true,
    requireSignature: false,
    allowIncomplete: false,
    showProgressBar: true,
    autoSave: true,
    allowImageUpload: true,
    allowGeolocation: false,
    theme: "default"
};

const FormBuilderEditorPage: NextPageWithLayout = () => {
    const [template, setTemplate] = useState<IFormTemplate>({
        name: "",
        description: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        fields: [],
        settings: defaultFormSettings
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'fields' | 'settings'>('fields');
    const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(null);

    const router = useRouter();
    const { id } = router.query;
    const isNew = id === 'new';

    const availableFieldTypes: { type: FieldType; label: string; description: string }[] = [
        { type: 'text', label: 'Text', description: 'Single line text input' },
        { type: 'textarea', label: 'Text Area', description: 'Multi-line text input' },
        { type: 'number', label: 'Number', description: 'Numeric input field' },
        { type: 'email', label: 'Email', description: 'Email address input' },
        { type: 'phone', label: 'Phone', description: 'Phone number input' },
        { type: 'date', label: 'Date', description: 'Date picker' },
        { type: 'time', label: 'Time', description: 'Time picker' },
        { type: 'select', label: 'Dropdown', description: 'Select from options' },
        { type: 'radio', label: 'Radio Buttons', description: 'Single choice selection' },
        { type: 'checkbox', label: 'Checkboxes', description: 'Multiple choice selection' },
        { type: 'file', label: 'File Upload', description: 'File upload field' },
        { type: 'image', label: 'Image Upload', description: 'Image upload field' },
        { type: 'signature', label: 'Signature', description: 'Signature capture field' },
        { type: 'section', label: 'Section', description: 'Group fields into sections' },
        { type: 'heading', label: 'Heading', description: 'Add a heading or instructions' },
    ];

    useEffect(() => {
        const loadTemplate = async () => {
            setLoading(true);
            try {
                if (id && id !== 'new') {
                    const loadedTemplate = await getFormTemplateById(Number(id));
                    if (loadedTemplate) {
                        setTemplate(loadedTemplate);
                    } else {
                        setError("Template not found");
                        router.push("/admin/form-builder");
                    }
                }
            } catch (error) {
                console.error("Failed to load template:", error);
                setError("Failed to load template");
            } finally {
                setLoading(false);
            }
        };

        if (router.isReady) {
            loadTemplate();
        }
    }, [id, router.isReady, router]);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isNew) {
                await createFormTemplate(template);
            } else if (id) {
                await updateFormTemplate(Number(id), template);
            }
            router.push("/admin/form-builder");
        } catch (error) {
            console.error("Failed to save template:", error);
            setError("Failed to save template");
        } finally {
            setSaving(false);
        }
    };

    const handleFieldAdd = (type: FieldType) => {
        // Create a new field with default values
        const newField: IFormField = {
            type,
            label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
            name: `field_${Date.now()}`,
            required: false,
            order: template.fields.length,
            helpText: ""
        };

        // Add the new field to the template
        setTemplate({
            ...template,
            fields: [...template.fields, newField],
            updatedAt: new Date()
        });

        // Select the new field for editing
        setSelectedFieldIndex(template.fields.length);
    };

    const handleFieldUpdate = (index: number, updatedField: IFormField) => {
        const updatedFields = [...template.fields];
        updatedFields[index] = updatedField;

        setTemplate({
            ...template,
            fields: updatedFields,
            updatedAt: new Date()
        });
    };

    const handleFieldDelete = (index: number) => {
        const updatedFields = template.fields.filter((_, i) => i !== index);

        // Reorder remaining fields
        const reorderedFields = updatedFields.map((field, i) => ({
            ...field,
            order: i
        }));

        setTemplate({
            ...template,
            fields: reorderedFields,
            updatedAt: new Date()
        });

        // Deselect the field if it was selected
        if (selectedFieldIndex === index) {
            setSelectedFieldIndex(null);
        } else if (selectedFieldIndex && selectedFieldIndex > index) {
            // Adjust selected index if a field before it was deleted
            setSelectedFieldIndex(selectedFieldIndex - 1);
        }
    };

    const handleFieldMove = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === template.fields.length - 1)
        ) {
            return; // Can't move further
        }

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const updatedFields = [...template.fields];

        // Swap the fields
        [updatedFields[index], updatedFields[newIndex]] = [updatedFields[newIndex], updatedFields[index]];

        // Update the order property
        const reorderedFields = updatedFields.map((field, i) => ({
            ...field,
            order: i
        }));

        setTemplate({
            ...template,
            fields: reorderedFields,
            updatedAt: new Date()
        });

        // Update selected field index if needed
        if (selectedFieldIndex === index) {
            setSelectedFieldIndex(newIndex);
        } else if (selectedFieldIndex === newIndex) {
            setSelectedFieldIndex(index);
        }
    };

    const handleSettingsChange = (updatedSettings: IFormSettings) => {
        setTemplate({
            ...template,
            settings: updatedSettings,
            updatedAt: new Date()
        });
    };

    const renderFieldList = () => {
        return (
            <div className="bg-base-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Form Fields</h3>
                {template.fields.length === 0 ? (
                    <div className="text-center p-6 bg-base-100 rounded-lg">
                        <p>No fields added yet. Add your first field from the palette.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {template.fields.map((field, index) => (
                            <div
                                key={index}
                                className={`
                  p-3 rounded-lg flex justify-between items-center cursor-pointer
                  ${selectedFieldIndex === index ? 'bg-primary bg-opacity-20' : 'bg-base-100'}
                  hover:bg-primary hover:bg-opacity-10
                `}
                                onClick={() => setSelectedFieldIndex(index)}
                            >
                                <div>
                                    <div className="font-medium">{field.label}</div>
                                    <div className="text-xs text-base-content/70">
                                        {field.type} {field.required ? '(Required)' : ''}
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    <button
                                        className="btn btn-xs btn-ghost"
                                        onClick={(e) => { e.stopPropagation(); handleFieldMove(index, 'up'); }}
                                        disabled={index === 0}
                                    >
                                        ↑
                                    </button>
                                    <button
                                        className="btn btn-xs btn-ghost"
                                        onClick={(e) => { e.stopPropagation(); handleFieldMove(index, 'down'); }}
                                        disabled={index === template.fields.length - 1}
                                    >
                                        ↓
                                    </button>
                                    <button
                                        className="btn btn-xs btn-ghost text-error"
                                        onClick={(e) => { e.stopPropagation(); handleFieldDelete(index); }}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderFieldPalette = () => {
        return (
            <div className="bg-base-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Field Types</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableFieldTypes.map((fieldType, index) => (
                        <div
                            key={index}
                            className="bg-base-100 p-3 rounded-lg cursor-pointer hover:bg-primary hover:bg-opacity-10"
                            onClick={() => handleFieldAdd(fieldType.type)}
                        >
                            <div className="font-medium">{fieldType.label}</div>
                            <div className="text-xs text-base-content/70">{fieldType.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderFieldEditor = () => {
        if (selectedFieldIndex === null) {
            return (
                <div className="bg-base-200 rounded-lg p-6 text-center">
                    <p>Select a field to edit its properties or add a new field from the palette.</p>
                </div>
            );
        }

        const field = template.fields[selectedFieldIndex];

        return (
            <div className="bg-base-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Field Properties: {field.label}</h3>
                <div className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Label</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={field.label}
                            onChange={(e) => handleFieldUpdate(selectedFieldIndex, { ...field, label: e.target.value })}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name (for data)</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={field.name}
                            onChange={(e) => handleFieldUpdate(selectedFieldIndex, { ...field, name: e.target.value })}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Help Text</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={field.helpText || ''}
                            onChange={(e) => handleFieldUpdate(selectedFieldIndex, { ...field, helpText: e.target.value })}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Required</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={field.required}
                                onChange={(e) => handleFieldUpdate(selectedFieldIndex, { ...field, required: e.target.checked })}
                            />
                        </label>
                    </div>

                    {/* Additional field-specific properties could be added here based on field.type */}
                </div>
            </div>
        );
    };

    const renderSettingsPanel = () => {
        return (
            <div className="bg-base-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Form Settings</h3>
                <div className="space-y-4">
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Allow Offline Submission</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={template.settings.allowOfflineSubmission}
                                onChange={(e) => handleSettingsChange({ ...template.settings, allowOfflineSubmission: e.target.checked })}
                            />
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Require Signature</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={template.settings.requireSignature}
                                onChange={(e) => handleSettingsChange({ ...template.settings, requireSignature: e.target.checked })}
                            />
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Allow Incomplete Submissions</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={template.settings.allowIncomplete}
                                onChange={(e) => handleSettingsChange({ ...template.settings, allowIncomplete: e.target.checked })}
                            />
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Show Progress Bar</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={template.settings.showProgressBar}
                                onChange={(e) => handleSettingsChange({ ...template.settings, showProgressBar: e.target.checked })}
                            />
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Auto-Save Draft</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={template.settings.autoSave}
                                onChange={(e) => handleSettingsChange({ ...template.settings, autoSave: e.target.checked })}
                            />
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Allow Image Upload</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={template.settings.allowImageUpload}
                                onChange={(e) => handleSettingsChange({ ...template.settings, allowImageUpload: e.target.checked })}
                            />
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Enable Geolocation</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={template.settings.allowGeolocation}
                                onChange={(e) => handleSettingsChange({ ...template.settings, allowGeolocation: e.target.checked })}
                            />
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Theme</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={template.settings.theme || 'default'}
                            onChange={(e) => handleSettingsChange({ ...template.settings, theme: e.target.value })}
                        >
                            <option value="default">Default</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="colorful">Colorful</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        {isNew ? "Create New Form" : `Edit Form: ${template.name}`}
                    </h1>
                    {!isNew && (
                        <p className="text-sm text-base-content/70">
                            Last modified: {template.updatedAt.toLocaleDateString()}
                        </p>
                    )}
                </div>
                <div className="flex space-x-2">
                    <Link href="/admin/form-builder" className="btn btn-ghost">
                        Cancel
                    </Link>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? <span className="loading loading-spinner loading-sm"></span> : "Save Form"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-error mb-4" role="alert">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Form Name</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter form name"
                        className="input input-bordered w-full"
                        value={template.name}
                        onChange={(e) => setTemplate({ ...template, name: e.target.value, updatedAt: new Date() })}
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Description</span>
                    </label>
                    <textarea
                        placeholder="Enter form description"
                        className="textarea textarea-bordered w-full"
                        value={template.description}
                        onChange={(e) => setTemplate({ ...template, description: e.target.value, updatedAt: new Date() })}
                    />
                </div>
            </div>

            <div className="tabs mb-4">
                <a
                    className={`tab tab-bordered ${activeTab === 'fields' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('fields')}
                >
                    Form Builder
                </a>
                <a
                    className={`tab tab-bordered ${activeTab === 'settings' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Form Settings
                </a>
            </div>

            {activeTab === 'fields' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-1">
                        {renderFieldList()}
                        <div className="mt-4">
                            {renderFieldPalette()}
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        {renderFieldEditor()}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="lg:col-span-1">
                        {renderSettingsPanel()}
                    </div>
                    <div className="lg:col-span-1 bg-base-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4">Preview Settings</h3>
                        <p>This will show a preview of how your form settings will affect the form appearance and behavior.</p>
                        {/* Add form preview component here */}
                    </div>
                </div>
            )}
        </div>
    );
};

FormBuilderEditorPage.getLayout = (page: ReactElement<any, string | JSXElementConstructor<any>>) =>
    getLayout(page, "Form Builder Editor");

export default FormBuilderEditorPage; 