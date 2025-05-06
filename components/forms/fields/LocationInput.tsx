import { useState, useEffect } from 'react';
import { IFormField, ILocationFormField } from "@/db/types/formField";
import { ILocationData } from '@/db/types/formResponse';

interface LocationInputProps {
    field: IFormField;
    value: ILocationData | null;
    onChange: (value: ILocationData | null) => void;
    error?: string;
    readOnly?: boolean;
}

const LocationInput = ({ field, value, onChange, error, readOnly = false }: LocationInputProps) => {
    const typedField = field as ILocationFormField;
    const [loading, setLoading] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    const getCurrentLocation = () => {
        if (readOnly) return;

        setLoading(true);
        setLocationError(null);

        // Check if geolocation is available
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        const options = {
            enableHighAccuracy: typedField.requireHighAccuracy || false,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const locationData: ILocationData = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                };

                onChange(locationData);
                setLoading(false);
            },
            (err) => {
                console.error('Error getting location:', err);
                setLocationError(`Error getting location: ${err.message}`);
                setLoading(false);
            },
            options
        );
    };

    const clearLocation = () => {
        if (readOnly) return;
        onChange(null);
    };

    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text">
                    {field.label}
                    {field.required && <span className="text-error ml-1">*</span>}
                </span>
            </label>

            <div className={`border rounded-lg p-4 ${error ? 'border-error' : 'border-base-300'}`}>
                {value ? (
                    <div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                                <label className="text-xs">Latitude</label>
                                <p className="font-mono">{value.latitude.toFixed(6)}</p>
                            </div>
                            <div>
                                <label className="text-xs">Longitude</label>
                                <p className="font-mono">{value.longitude.toFixed(6)}</p>
                            </div>
                        </div>

                        {value.accuracy && (
                            <div className="mb-2">
                                <label className="text-xs">Accuracy</label>
                                <p className="text-sm">{value.accuracy.toFixed(1)} meters</p>
                            </div>
                        )}

                        <div className="mb-2">
                            <label className="text-xs">Captured at</label>
                            <p className="text-sm">{new Date(value.timestamp).toLocaleString()}</p>
                        </div>

                        {!readOnly && (
                            <div className="flex justify-end mt-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline"
                                    onClick={clearLocation}
                                >
                                    Clear Location
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        {locationError && (
                            <div className="alert alert-error mb-4 text-sm">
                                {locationError}
                            </div>
                        )}

                        {!readOnly && (
                            <button
                                type="button"
                                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                onClick={getCurrentLocation}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm mr-2"></span>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                                Get Current Location
                            </button>
                        )}

                        {readOnly && (
                            <p className="text-base-content/70">No location data captured</p>
                        )}
                    </div>
                )}
            </div>

            {field.helpText && !error && !locationError && (
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

export default LocationInput; 