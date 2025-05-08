import MobileNavBar from "@/components/MobileNavBar";
import MobileHeader from "@/components/MobileHeader";
import { ReactNode } from "react";
import { useEffect, useState } from "react";

// The exact color from ISW.ico to use consistently throughout the app
const ISW_BLUE = "#1E90FF";

export default function MobileLayout({ children }: { children: ReactNode }) {
    // Track the current theme
    const [theme, setTheme] = useState("light");

    // Detect theme changes
    useEffect(() => {
        const detectTheme = () => {
            const dataTheme = document.documentElement.getAttribute("data-theme") || "light";
            setTheme(dataTheme);
        };

        // Initial detection
        detectTheme();

        // Set up observer for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    detectTheme();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);

    // Determine if we're in dark mode
    const isDarkMode = theme.includes("Dark") || theme.includes("dark");

    // Detect and mark if we're in standalone mode (especially for iOS)
    useEffect(() => {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            // Check for iOS standalone mode
            const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone === true;

            if (isInStandaloneMode) {
                document.documentElement.classList.add('standalone');
            } else {
                document.documentElement.classList.remove('standalone');
            }

            // Update theme color meta tag based on current theme
            const themeColorMeta = document.getElementById('theme-color-meta');
            if (themeColorMeta) {
                themeColorMeta.setAttribute('content', isDarkMode ? '#0F172A' : '#FFFFFF');
            }

            // Apply theme-based background color
            const bgColor = isDarkMode ? 'var(--b1)' : 'var(--b1)';
            document.body.style.backgroundColor = bgColor;
            document.documentElement.style.backgroundColor = bgColor;

            // Handle the app's content wrapper
            const appElement = document.getElementById('__next');
            if (appElement) {
                appElement.style.backgroundColor = bgColor;
            }

            // Set theme variables
            document.documentElement.style.setProperty('--b1', isDarkMode ? '#0F172A' : '#FFFFFF');
            document.documentElement.style.setProperty('--b2', isDarkMode ? '#1E293B' : '#F1F5F9');
            document.documentElement.style.setProperty('--b3', isDarkMode ? '#334155' : '#E2E8F0');
        }
    }, [isDarkMode, theme]);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Status bar area with theme color */}
            <div className="mobile-status-area" style={{ backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF' }}></div>

            {/* Header with white background */}
            <MobileHeader isDarkMode={isDarkMode} logoColor={ISW_BLUE} />

            {/* Main content area with white background and full width */}
            <main className="flex-1 pt-14 pb-20 w-full overflow-auto">
                <div className="px-4 py-2 w-full">
                    {children}
                </div>
            </main>

            {/* Navigation bar */}
            <MobileNavBar logoColor={ISW_BLUE} />
        </div>
    );
} 