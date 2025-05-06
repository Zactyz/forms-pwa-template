import { IFormField, ITextFormField } from "@/db/types/formField";

interface TextAreaInputProps {
    field: IFormField;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    readOnly?: boolean;
}

const TextAreaInput = ({ field, value = '', onChange, error, readOnly = false }: TextAreaInputProps) => {
    const typedField = field as ITextFormField;

    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text">
                    {field.label}
                    {field.required && <span className="text-error ml-1">*</span>}
                </span>
            </label>

            <textarea
                className={`textarea textarea-bordered w-full ${error ? 'textarea-error' : ''}`}
                placeholder={typedField.placeholder || ''}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={readOnly}
                rows={5}
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

export default TextAreaInput; 