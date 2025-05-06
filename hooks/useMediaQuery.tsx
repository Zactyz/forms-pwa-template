import { useState, useEffect } from "react";

/**
 * Custom hook to check if a media query matches
 * @param query The media query to check (e.g. '(max-width: 768px)')
 * @returns True if the media query matches, false otherwise
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(false);

    useEffect(() => {
        // Check if we're on the client side
        if (typeof window !== "undefined") {
            const media = window.matchMedia(query);

            // Set the initial value
            setMatches(media.matches);

            // Define a callback function to handle changes
            const listener = () => setMatches(media.matches);

            // Add the listener
            if (media.addEventListener) {
                media.addEventListener("change", listener);
            } else {
                // Fallback for older browsers
                media.addListener(listener);
            }

            // Clean up
            return () => {
                if (media.removeEventListener) {
                    media.removeEventListener("change", listener);
                } else {
                    // Fallback for older browsers
                    media.removeListener(listener);
                }
            };
        }

        return undefined;
    }, [query]);

    return matches;
}

export default useMediaQuery; 