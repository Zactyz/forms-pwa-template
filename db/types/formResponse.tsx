export type FormResponseStatus = 'draft' | 'submitted' | 'error' | 'syncing';

export interface IFormResponse {
    id?: number;
    formTemplateId: number;
    submittedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    data: Record<string, any>;
    status: FormResponseStatus;
    offlineCreated: boolean;
    syncedAt?: Date;
    deviceInfo?: IDeviceInfo;
    locationData?: ILocationData;
    meta?: Record<string, any>;
}

export interface IDeviceInfo {
    deviceId?: string;
    deviceModel?: string;
    osVersion?: string;
    appVersion?: string;
    browserType?: string;
}

export interface ILocationData {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: number;
} 