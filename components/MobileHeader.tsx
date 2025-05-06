import { MoonIcon, SunIcon } from "@/lib/icons";
import usePersistentStorageValue from "@/hooks/usePersistentStorageValue";
import useThemeDetect from "@/hooks/useThemeDetect";
import { useRouter } from "next/router";
import { useEffect } from "react";

const MobileHeader = () => {
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
        <div className="fixed top-0 left-0 right-0 z-40 mobile-header bg-base-100 bg-opacity-90 backdrop-blur-md md:hidden">
            <div className="flex justify-between items-center px-4 h-full">
                <h1 className="text-lg font-semibold text-primary truncate max-w-[70%]">{getPageTitle()}</h1>
                <div className="flex items-center space-x-3">
                    {themeSwap}
                </div>
            </div>
        </div>
    );
};

export default MobileHeader; 