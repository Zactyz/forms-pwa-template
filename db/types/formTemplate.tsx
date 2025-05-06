import { IFormField } from "@/db/types/formField";

export interface IFormTemplate {
    id?: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    fields: IFormField[];
    settings: IFormSettings;
}

export interface IFormSettings {
    allowOfflineSubmission: boolean;
    requireSignature: boolean;
    allowIncomplete: boolean;
    showProgressBar: boolean;
    autoSave: boolean;
    allowImageUpload: boolean;
    allowGeolocation: boolean;
    theme?: string;
    customCSS?: string;
    destinations?: IFormDestination[];
}

export interface IFormDestination {
    id: number;
    name: string;
    type: 'email' | 'api' | 'database' | 'file';
    enabled: boolean;
    config: any; // Configuration specific to the destination type
} 