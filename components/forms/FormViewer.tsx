import { useState, useEffect } from 'react';
import { IFormTemplate } from '@/db/types/formTemplate';
import { IFormField, FieldType, IFieldValidation } from '@/db/types/formField';
import { IFormResponse, IDeviceInfo, ILocationData } from '@/db/types/formResponse';
import { createFormResponse, updateFormResponse, submitFormResponse } from '@/lib/formResponses';

// Import all available field components
import TextInput from './fields/TextInput';
import TextAreaInput from './fields/TextAreaInput';
import NumberInput from './fields/NumberInput';
import DateTimeInput from './fields/DateTimeInput';
import SelectInput from './fields/SelectInput';
import CheckboxInput from './fields/CheckboxInput';
import FileInput from './fields/FileInput';
import SignatureInput from './fields/SignatureInput';
import LocationInput from './fields/LocationInput';

interface FormViewerProps {
    template: IFormTemplate;
    existingResponse?: IFormResponse;
    onSubmit?: (responseId: number | string) => void;
    onSaveDraft?: (responseId: number | string) => void;
    readOnly?: boolean;
}

// Custom type for form input fields (to be created as needed)
type FormFieldComponent = (props: {
    field: IFormField;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    readOnly?: boolean;
}) => JSX.Element | null;

const FormViewer = ({
    template,
    existingResponse,
    onSubmit,
    onSaveDraft,
    readOnly = false
}: FormViewerProps) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [responseId, setResponseId] = useState<number | string | undefined>(existingResponse?.id);
    const [submitting, setSubmitting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    // Initialize form data from existing response if available
    useEffect(() => {
        if (existingResponse) {
            setFormData(existingResponse.data || {});
            setResponseId(existingResponse.id);
        }
    }, [existingResponse]);

    // Auto-save functionality
    useEffect(() => {
        if (template.settings.autoSave && Object.keys(formData).length > 0 && !readOnly) {
            const autoSaveTimer = setTimeout(() => {
                handleSaveDraft();
            }, 5000); // Auto-save after 5 seconds of inactivity

            return () => clearTimeout(autoSaveTimer);
        }
    }, [formData, template.settings.autoSave, readOnly]);

    // Monitor online/offline status
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleFieldChange = (name: string, value: any) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        // Clear error for this field if it exists
        if (formErrors[name]) {
            setFormErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        template.fields.forEach((field) => {
            // Skip validation for hidden fields
            if (field.isHidden) return;

            // Required field validation
            if (field.required) {
                const value = formData[field.name];

                if (value === undefined || value === null || value === '') {
                    newErrors[field.name] = `${field.label} is required`;
                }
            }

            // Additional validations based on field types
            if (field.validations?.length) {
                field.validations.forEach((validation: IFieldValidation) => {
                    const value = formData[field.name];

                    // Skip if the field is empty and not required
                    if ((value === undefined || value === null || value === '') && !field.required) {
                        return;
                    }

                    switch (validation.type) {
                        case 'minLength':
                            if (typeof value === 'string' && value.length < validation.value) {
                                newErrors[field.name] = validation.message;
                            }
                            break;
                        case 'maxLength':
                            if (typeof value === 'string' && value.length > validation.value) {
                                newErrors[field.name] = validation.message;
                            }
                            break;
                        case 'min':
                            if (typeof value === 'number' && value < validation.value) {
                                newErrors[field.name] = validation.message;
                            }
                            break;
                        case 'max':
                            if (typeof value === 'number' && value > validation.value) {
                                newErrors[field.name] = validation.message;
                            }
                            break;
                        case 'pattern':
                            if (typeof value === 'string' && !new RegExp(validation.value).test(value)) {
                                newErrors[field.name] = validation.message;
                            }
                            break;
                        case 'email':
                            if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                                newErrors[field.name] = validation.message;
                            }
                            break;
                    }
                });
            }
        });

        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Get device information
    const getDeviceInfo = (): IDeviceInfo => {
        return {
            deviceId: navigator.userAgent,
            deviceModel: navigator.platform,
            osVersion: navigator.userAgent,
            appVersion: '1.0.0',
            browserType: navigator.userAgent.includes('Chrome') ? 'Chrome' :
                navigator.userAgent.includes('Firefox') ? 'Firefox' :
                    navigator.userAgent.includes('Safari') ? 'Safari' : 'Unknown'
        };
    };

    // Get current location data if geolocation is enabled
    const getCurrentLocation = async (): Promise<ILocationData | undefined> => {
        if (!template.settings.allowGeolocation) {
            return undefined;
        }

        // Return a promise that resolves with location data
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.log('Geolocation is not supported by this browser.');
                resolve(undefined);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const locationData: ILocationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    };
                    resolve(locationData);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    resolve(undefined);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });
    };

    const handleSaveDraft = async () => {
        if (readOnly) return;

        setSaving(true);
        try {
            const now = new Date();
            const deviceInfo = getDeviceInfo();

            if (responseId) {
                // Update existing draft
                await updateFormResponse(Number(responseId), {
                    data: formData,
                    updatedAt: now,
                    deviceInfo
                });
            } else {
                // Create new draft
                const newResponseId = await createFormResponse({
                    formTemplateId: template.id as number,
                    data: formData,
                    status: 'draft',
                    offlineCreated: isOffline,
                    deviceInfo,
                    createdAt: now,
                    updatedAt: now
                } as IFormResponse);

                setResponseId(newResponseId);

                if (onSaveDraft) {
                    onSaveDraft(newResponseId);
                }
            }
        } catch (error) {
            console.error('Error saving draft:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (readOnly) return;

        const isValid = validateForm();
        if (!isValid && !template.settings.allowIncomplete) {
            // Scroll to first error
            const firstErrorField = document.querySelector('[data-error="true"]');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setSubmitting(true);
        try {
            let submittedResponseId = responseId;
            const now = new Date();
            const deviceInfo = getDeviceInfo();

            // Get location data if enabled
            const locationData = await getCurrentLocation();

            if (submittedResponseId) {
                // Update and submit existing response
                await updateFormResponse(Number(submittedResponseId), {
                    data: formData,
                    status: 'submitted',
                    submittedAt: now,
                    deviceInfo,
                    offlineCreated: isOffline,
                    locationData
                });
            } else {
                // Create and submit new response
                submittedResponseId = await createFormResponse({
                    formTemplateId: template.id as number,
                    data: formData,
                    status: 'submitted',
                    submittedAt: now,
                    offlineCreated: isOffline,
                    deviceInfo,
                    locationData,
                    createdAt: now,
                    updatedAt: now
                } as IFormResponse);

                setResponseId(submittedResponseId);
            }

            if (onSubmit) {
                onSubmit(submittedResponseId);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const renderField = (field: IFormField) => {
        // Skip rendering hidden fields
        if (field.isHidden) return null;

        // Handle conditional display logic
        if (field.conditionalDisplay) {
            const { dependsOn, operator, value } = field.conditionalDisplay;
            const dependentValue = formData[dependsOn];

            let showField = false;

            switch (operator) {
                case 'equals':
                    showField = dependentValue === value;
                    break;
                case 'notEquals':
                    showField = dependentValue !== value;
                    break;
                case 'contains':
                    showField = Array.isArray(dependentValue) ?
                        dependentValue.includes(value) :
                        String(dependentValue).includes(String(value));
                    break;
                case 'startsWith':
                    showField = typeof dependentValue === 'string' && dependentValue.startsWith(String(value));
                    break;
                case 'endsWith':
                    showField = typeof dependentValue === 'string' && dependentValue.endsWith(String(value));
                    break;
                case 'greaterThan':
                    showField = typeof dependentValue === 'number' && dependentValue > Number(value);
                    break;
                case 'lessThan':
                    showField = typeof dependentValue === 'number' && dependentValue < Number(value);
                    break;
                default:
                    showField = true;
            }

            if (!showField) return null;
        }

        const commonProps = {
            field,
            value: formData[field.name],
            onChange: (value: any) => handleFieldChange(field.name, value),
            error: formErrors[field.name],
            readOnly
        };

        switch (field.type) {
            case 'text':
            case 'email':
            case 'phone':
                return <TextInput {...commonProps} />;
            case 'textarea':
                return <TextAreaInput {...commonProps} />;
            case 'number':
                return <NumberInput {...commonProps} />;
            case 'date':
            case 'time':
                return <DateTimeInput {...commonProps} />;
            case 'select':
            case 'radio':
                return <SelectInput {...commonProps} />;
            case 'checkbox':
            case 'multiselect':
                return <CheckboxInput {...commonProps} />;
            case 'file':
            case 'image':
                return <FileInput {...commonProps} />;
            case 'signature':
                return <SignatureInput {...commonProps} />;
            case 'location':
                return <LocationInput {...commonProps} />;
            case 'section':
            case 'heading':
                return (
                    <div className="my-4">
                        <h3 className="text-lg font-semibold">{field.label}</h3>
                        {field.helpText && <p className="text-sm text-base-content/70">{field.helpText}</p>}
                    </div>
                );
            default:
                return (
                    <div className="p-4 bg-base-200 rounded-lg">
                        <p className="font-semibold">{field.label}</p>
                        <p className="text-sm text-base-content/70 mt-2">
                            This field type ({field.type}) will be implemented soon.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className={`form-container ${readOnly ? 'form-readonly' : ''}`}>
            {isOffline && (
                <div className="alert alert-warning mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>You are currently offline. Your form will be saved locally and synced when you're back online.</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <h1 className="text-2xl font-bold mb-4">{template.name}</h1>

                {template.description && (
                    <p className="text-base-content/70 mb-6">{template.description}</p>
                )}

                {template.settings.showProgressBar && !readOnly && (
                    <div className="w-full bg-base-200 rounded-full h-2.5 mb-6">
                        <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{
                                width: `${Math.floor(
                                    (Object.keys(formData).length / template.fields.filter(f => !f.isHidden && f.type !== 'section' && f.type !== 'heading').length) * 100
                                )}%`
                            }}
                        ></div>
                    </div>
                )}

                <div className="space-y-6">
                    {template.fields.map((field, index) => (
                        <div key={field.id || index} data-error={!!formErrors[field.name]}>
                            {renderField(field)}
                        </div>
                    ))}
                </div>

                {!readOnly && (
                    <div className="mt-8 flex justify-between">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={handleSaveDraft}
                            disabled={saving}
                        >
                            {saving ? <span className="loading loading-spinner loading-sm"></span> : 'Save Draft'}
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? <span className="loading loading-spinner loading-sm"></span> : 'Submit Form'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default FormViewer; 