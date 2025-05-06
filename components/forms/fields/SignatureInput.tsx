import { IFormField, ISignatureFormField } from "@/db/types/formField";
import { useRef, useState, useEffect } from "react";

interface SignatureInputProps {
    field: IFormField;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    readOnly?: boolean;
}

const SignatureInput = ({ field, value, onChange, error, readOnly = false }: SignatureInputProps) => {
    const typedField = field as ISignatureFormField;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastX, setLastX] = useState(0);
    const [lastY, setLastY] = useState(0);
    const [hasSignature, setHasSignature] = useState(!!value);

    // Set up the canvas when component mounts
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set the background color
        ctx.fillStyle = typedField.backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw lines with a nice width and color
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = typedField.penColor || '#000000';

        // Restore saved signature if available
        if (value) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
            img.src = value;
        }
    }, [typedField, value]);

    // Handle drawing on the canvas
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (readOnly) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        let clientX, clientY;

        if ('touches' in e) {
            // Touch event
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            // Mouse event
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const rect = canvas.getBoundingClientRect();
        setLastX(clientX - rect.left);
        setLastY(clientY - rect.top);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || readOnly) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let clientX, clientY;

        if ('touches' in e) {
            // Touch event
            e.preventDefault(); // Prevent scrolling on touch devices
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            // Mouse event
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        setLastX(x);
        setLastY(y);
        setHasSignature(true);
    };

    const endDrawing = () => {
        if (!isDrawing || readOnly) return;

        setIsDrawing(false);

        // Save the signature as data URL
        if (hasSignature) {
            const canvas = canvasRef.current;
            if (canvas) {
                const dataUrl = canvas.toDataURL('image/png');
                onChange(dataUrl);
            }
        }
    };

    const clearSignature = () => {
        if (readOnly) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = typedField.backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        setHasSignature(false);
        onChange('');
    };

    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text">
                    {field.label}
                    {field.required && <span className="text-error ml-1">*</span>}
                </span>
            </label>

            <div className={`border rounded-lg p-2 ${error ? 'border-error' : 'border-base-300'}`}>
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className={`w-full border border-base-300 rounded-lg cursor-${readOnly ? 'not-allowed' : 'crosshair'}`}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseOut={endDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={endDrawing}
                />

                {!readOnly && (
                    <div className="flex justify-end mt-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={clearSignature}
                            disabled={!hasSignature}
                        >
                            Clear
                        </button>
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

export default SignatureInput; 