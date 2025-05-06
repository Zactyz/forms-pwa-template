import Footer from "@/components/footer";
import Header from "@/components/header";
import MobileLayout from "@/layout/mobile";
import { ReactNode } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function HomeLayout({ children }: { children: ReactNode }) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    if (isMobile) {
        return <MobileLayout>{children}</MobileLayout>;
    }

    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
}
