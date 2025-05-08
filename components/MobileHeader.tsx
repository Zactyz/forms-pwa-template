import { MoonIcon, SunIcon } from "@/lib/icons";
import usePersistentStorageValue from "@/hooks/usePersistentStorageValue";
import useThemeDetect from "@/hooks/useThemeDetect";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";

interface MobileHeaderProps {
    isDarkMode?: boolean;
    logoColor?: string;
}

const MobileHeader = ({ isDarkMode = false, logoColor = "#1E90FF" }: MobileHeaderProps) => {
    const router = useRouter();
    const isDarkThemeByDefault = useThemeDetect();
    const [localTheme, setLocalTheme] = usePersistentStorageValue(
        "theme",
        isDarkThemeByDefault ? "iswDark" : "iswLight",
    );

    // Update theme when it changes
    useEffect(() => {
        if (document) {
            document.documentElement.setAttribute("data-theme", localTheme);
        }
    }, [localTheme]);

    // Get the current page title based on the route
    const getPageTitle = () => {
        const path = router.pathname;

        if (path === "/") return "Home";
        if (path.startsWith("/forms")) return "Forms";
        if (path.startsWith("/admin/form-builder")) return "Form Builder";
        if (path.startsWith("/admin/form-responses")) return "Form Responses";
        if (path.startsWith("/admin/settings")) return "Settings";
        if (path.startsWith("/admin")) return "Admin";
        if (path.startsWith("/profile")) return "Profile";
        if (path.startsWith("/drafts")) return "Saved Drafts";
        if (path.startsWith("/assigned")) return "Assigned Forms";

        // Default case: capitalize the last part of the path
        const lastSegment = path.split("/").pop() || "";
        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    };

    // Check if we should show back button (not on main pages)
    const shouldShowBackButton = () => {
        const path = router.pathname;
        const mainPages = ['/', '/forms', '/drafts', '/assigned', '/profile'];
        return !mainPages.includes(path);
    };

    // Handle back button click
    const handleBackClick = () => {
        router.back();
    };

    const themeSwap = (
        <label className="swap swap-rotate">
            <input
                name="theme-input-controller"
                aria-label="theme-input-controller"
                type="checkbox"
                className="swap-input"
                checked={localTheme === "iswDark"}
                onChange={() => setLocalTheme(localTheme === "iswDark" ? "iswLight" : "iswDark")}
            />
            <div className="swap-on">
                <MoonIcon classname="fill-current w-5 h-5" />
            </div>
            <div className="swap-off">
                <SunIcon classname="fill-current w-5 h-5" />
            </div>
        </label>
    );

    return (
        <div className="fixed top-0 left-0 right-0 z-40 mobile-header bg-base-100 shadow-sm md:hidden">
            <div className="flex justify-between items-center px-4 h-full">
                {shouldShowBackButton() ? (
                    <button
                        onClick={handleBackClick}
                        className="flex items-center text-neutral"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        <span className="ml-2 font-semibold">{getPageTitle()}</span>
                    </button>
                ) : (
                    <div className="flex items-center">
                        {/* Company logo using ISW.ico */}
                        <div className="h-8 w-8 mr-2">
                            <Image
                                src="/ISW.ico"
                                alt="ISW Logo"
                                width={32}
                                height={32}
                                priority
                            />
                        </div>

                        <h1 className="text-lg font-semibold truncate max-w-[70%]" style={{ color: logoColor }}>{getPageTitle()}</h1>
                    </div>
                )}
                <div className="flex items-center space-x-3">
                    {themeSwap}
                </div>
            </div>
        </div>
    );
};

export default MobileHeader; 