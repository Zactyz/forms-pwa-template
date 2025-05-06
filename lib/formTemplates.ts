import { formTemplateTable, db } from '@/db/database.config';
import { IFormTemplate } from '@/db/types/formTemplate';

/**
 * Get all form templates
 */
export async function getAllFormTemplates(): Promise<IFormTemplate[]> {
    return await formTemplateTable.toArray();
}

/**
 * Get form templates with pagination
 */
export async function getFormTemplatesPage(
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc'
): Promise<{
    templates: IFormTemplate[];
    total: number;
    totalPages: number;
    currentPage: number;
}> {
    const offset = (page - 1) * pageSize;

    // Get total count for pagination
    const total = await formTemplateTable.count();
    const totalPages = Math.ceil(total / pageSize);

    // Get templates with sorting
    let collection = formTemplateTable.orderBy(sortBy);
    if (sortDirection === 'desc') {
        collection = collection.reverse();
    }

    const templates = await collection.offset(offset).limit(pageSize).toArray();

    return {
        templates,
        total,
        totalPages,
        currentPage: page
    };
}

/**
 * Get a form template by ID
 */
export async function getFormTemplateById(id: number): Promise<IFormTemplate | undefined> {
    return await formTemplateTable.get(id);
}

/**
 * Search form templates by name or description
 */
export async function searchFormTemplates(query: string): Promise<IFormTemplate[]> {
    const searchTerm = query.toLowerCase();

    return await formTemplateTable
        .filter(template =>
            template.name.toLowerCase().includes(searchTerm) ||
            template.description.toLowerCase().includes(searchTerm)
        )
        .toArray();
}

/**
 * Create a new form template
 */
export async function createFormTemplate(template: Omit<IFormTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date();
    const newTemplate: IFormTemplate = {
        ...template,
        createdAt: now,
        updatedAt: now
    };

    const id = await formTemplateTable.add(newTemplate);
    return typeof id === 'number' ? id : Number(id);
}

/**
 * Update an existing form template
 */
export async function updateFormTemplate(id: number, template: Partial<IFormTemplate>): Promise<number> {
    const updateData = {
        ...template,
        updatedAt: new Date()
    };

    return await formTemplateTable.update(id, updateData);
}

/**
 * Delete a form template
 */
export async function deleteFormTemplate(id: number): Promise<void> {
    await formTemplateTable.delete(id);
}

/**
 * Duplicate a form template
 */
export async function duplicateFormTemplate(id: number): Promise<number> {
    const template = await getFormTemplateById(id);

    if (!template) {
        throw new Error(`Template with ID ${id} not found`);
    }

    const now = new Date();
    const duplicatedTemplate: IFormTemplate = {
        ...template,
        id: undefined, // Remove the ID to create a new one
        name: `${template.name} (Copy)`,
        createdAt: now,
        updatedAt: now
    };

    const newId = await formTemplateTable.add(duplicatedTemplate);
    return typeof newId === 'number' ? newId : Number(newId);
}

/**
 * Export a form template to JSON
 */
export function exportFormTemplateToJSON(template: IFormTemplate): string {
    return JSON.stringify(template, null, 2);
}

/**
 * Import a form template from JSON
 */
export async function importFormTemplateFromJSON(jsonString: string): Promise<number> {
    try {
        const template = JSON.parse(jsonString) as IFormTemplate;
        const now = new Date();

        // Ensure valid structure and add timestamps
        const newTemplate: IFormTemplate = {
            ...template,
            id: undefined, // Remove any existing ID
            createdAt: now,
            updatedAt: now
        };

        const id = await formTemplateTable.add(newTemplate);
        return typeof id === 'number' ? id : Number(id);
    } catch (error) {
        console.error('Failed to import template:', error);
        throw new Error('Invalid template format');
    }
} 