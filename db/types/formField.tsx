export type FieldType =
    | 'text'
    | 'number'
    | 'email'
    | 'phone'
    | 'date'
    | 'time'
    | 'select'
    | 'multiselect'
    | 'checkbox'
    | 'radio'
    | 'textarea'
    | 'signature'
    | 'file'
    | 'image'
    | 'location'
    | 'section'
    | 'heading';

export interface IFormField {
    id?: string;
    type: FieldType;
    label: string;
    name: string;
    required: boolean;
    order: number;
    helpText?: string;
    defaultValue?: any;
    validations?: IFieldValidation[];
    isHidden?: boolean;
    conditionalDisplay?: IConditionalDisplay;
}

export interface IFieldValidation {
    type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email' | 'url' | 'custom';
    value?: any;
    message: string;
}

export interface IConditionalDisplay {
    dependsOn: string; // Field name this depends on
    operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
    value: any;
}

export interface ITextFormField extends IFormField {
    type: 'text' | 'email' | 'phone';
    minLength?: number;
    maxLength?: number;
    placeholder?: string;
    pattern?: string;
}

export interface INumberFormField extends IFormField {
    type: 'number';
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
}

export interface ITextAreaFormField extends IFormField {
    type: 'textarea';
    minLength?: number;
    maxLength?: number;
    placeholder?: string;
    rows?: number;
}

export interface IDateFormField extends IFormField {
    type: 'date' | 'time';
    minDate?: Date;
    maxDate?: Date;
}

export interface ISelectOption {
    label: string;
    value: string;
}

export interface ISelectFormField extends IFormField {
    type: 'select' | 'multiselect' | 'radio' | 'checkbox';
    options: ISelectOption[];
    allowOther?: boolean;
}

export interface IFileFormField extends IFormField {
    type: 'file' | 'image';
    maxSize?: number; // in bytes
    multiple?: boolean;
    allowedTypes?: string[]; // e.g., ['image/jpeg', 'image/png']
}

export interface ISignatureFormField extends IFormField {
    type: 'signature';
    penColor?: string;
    backgroundColor?: string;
}

export interface ILocationFormField extends IFormField {
    type: 'location';
    requireHighAccuracy?: boolean;
}

export interface ISectionFormField extends IFormField {
    type: 'section' | 'heading';
    collapsible?: boolean;
    collapsed?: boolean;
} 