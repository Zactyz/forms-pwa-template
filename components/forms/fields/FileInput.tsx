import { IFormField, IFileFormField } from "@/db/types/formField";
import { useState, useRef } from "react";

interface FileInputProps {
    field: IFormField;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    readOnly?: boolean;
}

const FileInput = ({ field, value, onChange, error, readOnly = false }: FileInputProps) => {
    const typedField = field as IFileFormField;
    const [fileNames, setFileNames] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isImage = field.type === 'image';
    const acceptTypes = isImage
        ? "image/*"
        : typedField.allowedTypes?.join(",") || "";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            setFileNames([]);
            onChange(null);
            return;
        }

        // Check file sizes if maxSize is specified
        if (typedField.maxSize) {
            for (let i = 0; i < files.length; i++) {
                if (files[i].size > typedField.maxSize) {
                    alert(`File ${files[i].name} exceeds the maximum size limit of ${formatBytes(typedField.maxSize)}`);
                    // Reset the file input
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                    return;
                }
            }
        }

        // Convert FileList to array for easier handling
        const filesArray = Array.from(files);
        setFileNames(filesArray.map(file => file.name));

        // If it's a single file input, just return the first file
        if (!typedField.multiple) {
            onChange(filesArray[0]);
        } else {
            onChange(filesArray);
        }
    };

    const handleRemoveFile = () => {
        setFileNames([]);
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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

            <div className={`${error ? 'border border-error rounded-lg p-2' : ''}`}>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="file-input file-input-bordered w-full"
                    accept={acceptTypes}
                    onChange={handleFileChange}
                    disabled={readOnly}
                    required={field.required}
                    multiple={typedField.multiple}
                />

                {/* Preview for selected files */}
                {fileNames.length > 0 && (
                    <div className="mt-2">
                        <div className="flex justify-between items-center">
                            <p className="text-sm">
                                {typedField.multiple
                                    ? `${fileNames.length} file(s) selected`
                                    : fileNames[0]}
                            </p>
                            <button
                                type="button"
                                className="btn btn-sm btn-ghost"
                                onClick={handleRemoveFile}
                                disabled={readOnly}
                            >
                                Clear
                            </button>
                        </div>

                        {/* Image preview for image type */}
                        {isImage && value && (
                            <div className="mt-2">
                                {typedField.multiple ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {Array.isArray(value) && value.map((file: File, index: number) => (
                                            <div key={index} className="relative aspect-square">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Preview ${index}`}
                                                    className="object-cover w-full h-full rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="relative max-w-xs">
                                        <img
                                            src={URL.createObjectURL(value)}
                                            alt="Preview"
                                            className="object-contain max-h-48 rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

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

// Helper function to format file size in bytes to human-readable format
const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default FileInput; 