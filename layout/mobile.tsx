import MobileNavBar from "@/components/MobileNavBar";
import MobileHeader from "@/components/MobileHeader";
import { ReactNode } from "react";

export default function MobileLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-base-200">
            {/* Status bar area with color that matches the theme */}
            <div className="mobile-status-area bg-primary bg-opacity-90"></div>

            {/* Header */}
            <MobileHeader />

            {/* Main content with proper spacing */}
            <main className="flex-1 pt-14 pb-16 px-3 overflow-auto">
                <div className="max-w-md mx-auto">
                    {children}
                </div>
            </main>

            {/* Navigation bar */}
            <MobileNavBar />
        </div>
    );
} 