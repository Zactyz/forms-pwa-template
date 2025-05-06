import { IFormField, ITextFormField } from "@/db/types/formField";

interface TextInputProps {
    field: IFormField;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    readOnly?: boolean;
}

const TextInput = ({ field, value = '', onChange, error, readOnly = false }: TextInputProps) => {
    const typedField = field as ITextFormField;
    const inputType = field.type === 'email'
        ? 'email'
        : field.type === 'phone'
            ? 'tel'
            : 'text';

    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text">
                    {field.label}
                    {field.required && <span className="text-error ml-1">*</span>}
                </span>
            </label>

            <input
                type={inputType}
                className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
                placeholder={typedField.placeholder || ''}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={readOnly}
                minLength={typedField.minLength}
                maxLength={typedField.maxLength}
                required={field.required}
            />

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
};

export default TextInput; 