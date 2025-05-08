import Footer from "@/components/footer";
import Header from "@/components/header";
import MobileLayout from "@/layout/mobile";
import { ReactNode, useEffect, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function HomeLayout({ children }: { children: ReactNode }) {
    // Initialize with null to prevent hydration mismatch
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        // Only run on client side
        if (typeof window !== 'undefined') {
            const checkMobile = () => {
                setIsMobile(window.innerWidth <= 768);
            };

            // Initial check
            checkMobile();

            // Add event listener for resize
            window.addEventListener('resize', checkMobile);

            // Cleanup
            return () => window.removeEventListener('resize', checkMobile);
        }
    }, []);

    // Show nothing during SSR to prevent hydration mismatch
    if (isMobile === null) {
        return <div style={{ display: 'none' }} />;
    }

    if (isMobile) {
        return <MobileLayout>{children}</MobileLayout>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
