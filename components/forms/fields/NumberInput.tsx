import { IFormField, INumberFormField } from "@/db/types/formField";

interface NumberInputProps {
    field: IFormField;
    value: number | string;
    onChange: (value: number | string) => void;
    error?: string;
    readOnly?: boolean;
}

const NumberInput = ({ field, value, onChange, error, readOnly = false }: NumberInputProps) => {
    const typedField = field as INumberFormField;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue === '') {
            onChange('');
        } else {
            const numValue = parseFloat(newValue);
            if (!isNaN(numValue)) {
                onChange(numValue);
            }
        }
    };

    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text">
                    {field.label}
                    {field.required && <span className="text-error ml-1">*</span>}
                </span>
            </label>

            <input
                type="number"
                className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
                placeholder={typedField.placeholder || ''}
                value={value === undefined || value === null ? '' : value}
                onChange={handleChange}
                disabled={readOnly}
                min={typedField.min}
                max={typedField.max}
                step={typedField.step || 1}
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

export default NumberInput; 