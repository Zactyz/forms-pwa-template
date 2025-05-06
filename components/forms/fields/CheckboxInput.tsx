import { IFormField, ISelectFormField } from "@/db/types/formField";
import { useState } from "react";

interface CheckboxInputProps {
    field: IFormField;
    value: string | string[];
    onChange: (value: string | string[]) => void;
    error?: string;
    readOnly?: boolean;
}

const CheckboxInput = ({ field, value = [], onChange, error, readOnly = false }: CheckboxInputProps) => {
    const typedField = field as ISelectFormField;
    const [otherValue, setOtherValue] = useState<string>('');

    // Ensure value is always an array
    const values = Array.isArray(value) ? value : value ? [value] : [];

    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
        if (field.type === 'checkbox') {
            // For checkboxes (multiple selection)
            const newValues = [...values];

            if (checked) {
                // Add value if not already present
                if (!newValues.includes(optionValue)) {
                    newValues.push(optionValue);
                }
            } else {
                // Remove value
                const index = newValues.indexOf(optionValue);
                if (index !== -1) {
                    newValues.splice(index, 1);
                }
            }

            onChange(newValues);
        } else {
            // For single checkbox (boolean)
            onChange(checked ? optionValue : '');
        }
    };

    const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtherValue(e.target.value);

        // Update the values array to include the new "other" value
        const newValues = [...values.filter(v => v !== '__other__')];
        if (e.target.value) {
            newValues.push('__other__');
        }
        onChange(newValues);
    };

    if (field.type === 'checkbox' || field.type === 'multiselect') {
        return (
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">
                        {field.label}
                        {field.required && <span className="text-error ml-1">*</span>}
                    </span>
                </label>

                <div className={`space-y-2 ${error ? 'border border-error rounded-lg p-2' : ''}`}>
                    {typedField.options.map((option, index) => (
                        <div key={index} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`${field.name}_${index}`}
                                name={field.name}
                                className="checkbox checkbox-primary"
                                value={option.value}
                                checked={values.includes(option.value)}
                                onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                                disabled={readOnly}
                                required={field.required && index === 0 && values.length === 0}
                            />
                            <label htmlFor={`${field.name}_${index}`} className="ml-2 cursor-pointer">
                                {option.label}
                            </label>
                        </div>
                    ))}

                    {typedField.allowOther && (
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`${field.name}_other`}
                                name={field.name}
                                className="checkbox checkbox-primary"
                                value="__other__"
                                checked={values.includes('__other__')}
                                onChange={(e) => {
                                    handleCheckboxChange('__other__', e.target.checked);
                                    if (!e.target.checked) {
                                        setOtherValue('');
                                    }
                                }}
                                disabled={readOnly}
                            />
                            <label htmlFor={`${field.name}_other`} className="ml-2 cursor-pointer">
                                Other
                            </label>

                            {values.includes('__other__') && (
                                <input
                                    type="text"
                                    className="input input-bordered ml-2 flex-grow"
                                    placeholder="Specify other..."
                                    value={otherValue}
                                    onChange={handleOtherChange}
                                    disabled={readOnly}
                                />
                            )}
                        </div>
                    )}
                </div>

                {field.helpText && !error && (
                    <label className="label">
                        <span className="label-text-alt">{field.helpText}</span>
                    </label>
                )}

                {error && (
                    <label className="label">
                        <span className="label-text-alt text-error">{error}</span>
                    </label>
                )}
            </div>
        );
    }

    return null;
};

export default CheckboxInput; 