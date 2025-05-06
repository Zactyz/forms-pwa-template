import { IFormField, IDateFormField } from "@/db/types/formField";

interface DateTimeInputProps {
    field: IFormField;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    readOnly?: boolean;
}

const DateTimeInput = ({ field, value = '', onChange, error, readOnly = false }: DateTimeInputProps) => {
    const typedField = field as IDateFormField;
    const inputType = field.type === 'date' ? 'date' : 'time';

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
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={readOnly}
                required={field.required}
                min={typedField.minDate ? formatDate(typedField.minDate, inputType) : undefined}
                max={typedField.maxDate ? formatDate(typedField.maxDate, inputType) : undefined}
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

// Helper function to format Date objects to the required format for date/time inputs
const formatDate = (date: Date, type: 'date' | 'time'): string => {
    if (type === 'date') {
        return date.toISOString().split('T')[0];
    } else {
        // Format time as HH:MM
        return date.toTimeString().slice(0, 5);
    }
};

export default DateTimeInput; 