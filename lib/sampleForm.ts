import { IFormTemplate } from "@/db/types/formTemplate";
import { IFormField } from "@/db/types/formField";
import { formTemplateTable } from "@/db/database.config";

/**
 * Initialize a sample form template in the database for testing purposes
 */
export async function initializeSampleForm(): Promise<number> {
    // Check if sample form already exists
    const existingForms = await formTemplateTable
        .where("name")
        .equals("Equipment Inspection Form")
        .toArray();

    if (existingForms.length > 0) {
        console.log("Sample form already exists");
        return existingForms[0].id as number;
    }

    // Create sample form fields
    const formFields: IFormField[] = [
        {
            type: "text",
            label: "Inspector Name",
            name: "inspectorName",
            required: true,
            order: 1,
            helpText: "Enter the full name of the inspector",
        },
        {
            type: "text",
            label: "Location",
            name: "location",
            required: true,
            order: 2,
        },
        {
            type: "date",
            label: "Inspection Date",
            name: "inspectionDate",
            required: true,
            order: 3,
        },
        {
            type: "section",
            label: "Equipment Details",
            name: "equipmentDetails",
            required: false,
            order: 4,
        },
        {
            type: "text",
            label: "Equipment ID",
            name: "equipmentId",
            required: true,
            order: 5,
        },
        {
            type: "text",
            label: "Equipment Name",
            name: "equipmentName",
            required: true,
            order: 6,
        },
        {
            type: "text",
            label: "Manufacturer",
            name: "manufacturer",
            required: false,
            order: 7,
        },
        {
            type: "text",
            label: "Model Number",
            name: "modelNumber",
            required: false,
            order: 8,
        },
        {
            type: "text",
            label: "Serial Number",
            name: "serialNumber",
            required: false,
            order: 9,
        },
        {
            type: "section",
            label: "Inspection Items",
            name: "inspectionItems",
            required: false,
            order: 10,
            helpText: "Check all items that apply",
        },
        {
            type: "radio",
            label: "Overall Condition",
            name: "overallCondition",
            required: true,
            order: 11,
            helpText: "Rate the overall condition of the equipment",
            conditionalDisplay: undefined,
            isHidden: false,
            defaultValue: "good",
            validations: [
                {
                    type: "required",
                    message: "Please rate the overall condition",
                },
            ],
        },
        {
            type: "checkbox",
            label: "Inspection Points",
            name: "inspectionPoints",
            required: true,
            order: 12,
            helpText: "Check all items that have been inspected",
            conditionalDisplay: undefined,
            isHidden: false,
            defaultValue: [],
        },
        {
            type: "textarea",
            label: "Issues Found",
            name: "issuesFound",
            required: false,
            order: 13,
            helpText: "Describe any issues found during the inspection",
            conditionalDisplay: undefined,
            isHidden: false,
        },
        {
            type: "textarea",
            label: "Corrective Actions",
            name: "correctiveActions",
            required: false,
            order: 14,
            conditionalDisplay: {
                dependsOn: "issuesFound",
                operator: "notEquals",
                value: "",
            },
            isHidden: false,
        },
        {
            type: "select",
            label: "Next Inspection Due",
            name: "nextInspectionDue",
            required: true,
            order: 15,
            helpText: "When is the next inspection due?",
            conditionalDisplay: undefined,
            isHidden: false,
        },
        {
            type: "image",
            label: "Equipment Photos",
            name: "equipmentPhotos",
            required: false,
            order: 16,
            helpText: "Add photos of the equipment (optional)",
            conditionalDisplay: undefined,
            isHidden: false,
        },
        {
            type: "signature",
            label: "Inspector Signature",
            name: "inspectorSignature",
            required: true,
            order: 17,
            helpText: "Sign to verify this inspection",
            conditionalDisplay: undefined,
            isHidden: false,
        },
    ];

    // Add options to radio and select fields
    const radioField = formFields.find(f => f.name === "overallCondition") as any;
    if (radioField) {
        radioField.options = [
            { label: "Excellent", value: "excellent" },
            { label: "Good", value: "good" },
            { label: "Fair", value: "fair" },
            { label: "Poor", value: "poor" },
            { label: "Unserviceable", value: "unserviceable" },
        ];
    }

    const checkboxField = formFields.find(f => f.name === "inspectionPoints") as any;
    if (checkboxField) {
        checkboxField.options = [
            { label: "Physical damage", value: "physicalDamage" },
            { label: "Electrical components", value: "electricalComponents" },
            { label: "Safety mechanisms", value: "safetyMechanisms" },
            { label: "Fluid levels", value: "fluidLevels" },
            { label: "Calibration", value: "calibration" },
            { label: "Lubrication", value: "lubrication" },
            { label: "Moving parts", value: "movingParts" },
            { label: "Warning labels", value: "warningLabels" },
            { label: "Documentation", value: "documentation" },
        ];
        checkboxField.allowOther = true;
    }

    const selectField = formFields.find(f => f.name === "nextInspectionDue") as any;
    if (selectField) {
        selectField.options = [
            { label: "1 month", value: "1month" },
            { label: "3 months", value: "3months" },
            { label: "6 months", value: "6months" },
            { label: "1 year", value: "1year" },
        ];
    }

    // Create the sample form template
    const sampleForm: IFormTemplate = {
        name: "Equipment Inspection Form",
        description: "Use this form to document equipment inspections and maintenance checks",
        createdAt: new Date(),
        updatedAt: new Date(),
        fields: formFields,
        settings: {
            allowOfflineSubmission: true,
            requireSignature: true,
            allowIncomplete: false,
            showProgressBar: true,
            autoSave: true,
            allowImageUpload: true,
            allowGeolocation: true,
            theme: "default",
        },
    };

    // Save the form template to the database
    const id = await formTemplateTable.add(sampleForm);
    console.log("Sample form created with ID:", id);

    return id as number;
} 