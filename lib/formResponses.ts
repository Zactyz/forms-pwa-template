import { formResponseTable, db } from '@/db/database.config';
import { IFormResponse, FormResponseStatus } from '@/db/types/formResponse';
import { Collection } from 'dexie';

/**
 * Get all form responses
 */
export async function getAllFormResponses(): Promise<IFormResponse[]> {
    return await formResponseTable.toArray();
}

/**
 * Get form responses for a specific template
 */
export async function getResponsesByTemplateId(formTemplateId: number): Promise<IFormResponse[]> {
    return await formResponseTable
        .where('formTemplateId')
        .equals(formTemplateId)
        .toArray();
}

/**
 * Get form responses with pagination
 */
export async function getFormResponsesPage(
    page: number = 1,
    pageSize: number = 10,
    formTemplateId?: number,
    status?: FormResponseStatus,
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc'
): Promise<{
    responses: IFormResponse[];
    total: number;
    totalPages: number;
    currentPage: number;
}> {
    const offset = (page - 1) * pageSize;

    // Create a collection that we can filter
    let collection: Collection = formResponseTable.toCollection();

    // Apply filters if provided
    if (formTemplateId !== undefined) {
        collection = formResponseTable.where('formTemplateId').equals(formTemplateId);
    }

    // We need to get all matching responses first to apply further filtering and sorting
    let responses: IFormResponse[] = await collection.toArray();

    // Apply status filter if provided
    if (status !== undefined) {
        responses = responses.filter(response => response.status === status);
    }

    // Get total count for pagination
    const total = responses.length;
    const totalPages = Math.ceil(total / pageSize);

    // Sort by the specified field
    responses.sort((a, b) => {
        const aValue = a[sortBy as keyof IFormResponse];
        const bValue = b[sortBy as keyof IFormResponse];

        if (aValue === undefined || bValue === undefined) return 0;

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // Apply pagination
    responses = responses.slice(offset, offset + pageSize);

    return {
        responses,
        total,
        totalPages,
        currentPage: page
    };
}

/**
 * Get a form response by ID
 */
export async function getFormResponseById(id: number): Promise<IFormResponse | undefined> {
    return await formResponseTable.get(id);
}

/**
 * Get draft responses by template ID
 */
export async function getDraftResponsesByTemplateId(formTemplateId: number): Promise<IFormResponse[]> {
    return await formResponseTable
        .where('formTemplateId')
        .equals(formTemplateId)
        .and(response => response.status === 'draft')
        .toArray();
}

/**
 * Create a new form response
 */
export async function createFormResponse(response: Omit<IFormResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date();
    const newResponse: IFormResponse = {
        ...response,
        createdAt: now,
        updatedAt: now
    };

    const id = await formResponseTable.add(newResponse);
    return typeof id === 'number' ? id : Number(id);
}

/**
 * Update an existing form response
 */
export async function updateFormResponse(id: number, response: Partial<IFormResponse>): Promise<number> {
    const updateData = {
        ...response,
        updatedAt: new Date()
    };

    return await formResponseTable.update(id, updateData);
}

/**
 * Submit a form response (change status from draft to submitted)
 */
export async function submitFormResponse(id: number): Promise<number> {
    const now = new Date();
    return await formResponseTable.update(id, {
        status: 'submitted',
        submittedAt: now,
        updatedAt: now
    });
}

/**
 * Delete a form response
 */
export async function deleteFormResponse(id: number): Promise<void> {
    await formResponseTable.delete(id);
}

/**
 * Get all unsynchronized responses (for offline support)
 */
export async function getUnsyncedResponses(): Promise<IFormResponse[]> {
    return await formResponseTable
        .filter(response =>
            response.offlineCreated === true &&
            (response.status === 'submitted' || response.status === 'error')
        )
        .toArray();
}

/**
 * Mark a response as synced
 */
export async function markResponseAsSynced(id: number): Promise<number> {
    const now = new Date();
    return await formResponseTable.update(id, {
        offlineCreated: false,
        syncedAt: now,
        updatedAt: now
    });
}

/**
 * Export responses to JSON
 */
export function exportResponsesToJSON(responses: IFormResponse[]): string {
    return JSON.stringify(responses, null, 2);
} 