import { IFormField, ISelectFormField, ISelectOption } from "@/db/types/formField";
import { useState } from "react";

interface SelectInputProps {
    field: IFormField;
    value: string | string[];
    onChange: (value: string | string[]) => void;
    error?: string;
    readOnly?: boolean;
}

const SelectInput = ({ field, value, onChange, error, readOnly = false }: SelectInputProps) => {
    const typedField = field as ISelectFormField;
    const [otherValue, setOtherValue] = useState<string>('');

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (field.type === 'select') {
            onChange(e.target.value);
        } else if (field.type === 'radio') {
            // For radio buttons
            onChange(e.target.value);
        }
    };

    const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtherValue(e.target.value);
        onChange(e.target.value);
    };

    if (field.type === 'select') {
        return (
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">
                        {field.label}
                        {field.required && <span className="text-error ml-1">*</span>}
                    </span>
                </label>

                <select
                    className={`select select-bordered w-full ${error ? 'select-error' : ''}`}
                    value={value as string || ''}
                    onChange={handleOptionChange}
                    disabled={readOnly}
                    required={field.required}
                >
                    <option value="" disabled>Select an option</option>
                    {typedField.options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                    {typedField.allowOther && (
                        <option value="__other__">Other</option>
                    )}
                </select>

                {typedField.allowOther && value === '__other__' && (
                    <input
                        type="text"
                        className="input input-bordered w-full mt-2"
                        placeholder="Specify other..."
                        value={otherValue}
                        onChange={handleOtherChange}
                        disabled={readOnly}
                    />
                )}

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

    if (field.type === 'radio') {
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
                                type="radio"
                                id={`${field.name}_${index}`}
                                name={field.name}
                                className="radio radio-primary"
                                value={option.value}
                                checked={value === option.value}
                                onChange={handleOptionChange}
                                disabled={readOnly}
                                required={field.required && index === 0}
                            />
                            <label htmlFor={`${field.name}_${index}`} className="ml-2 cursor-pointer">
                                {option.label}
                            </label>
                        </div>
                    ))}

                    {typedField.allowOther && (
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id={`${field.name}_other`}
                                name={field.name}
                                className="radio radio-primary"
                                value="__other__"
                                checked={value === '__other__'}
                                onChange={handleOptionChange}
                                disabled={readOnly}
                            />
                            <label htmlFor={`${field.name}_other`} className="ml-2 cursor-pointer">
                                Other
                            </label>

                            {value === '__other__' && (
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

export default SelectInput; 