import Link from "next/link";
import { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "@/lib/icons";
import usePersistentStorageValue from "@/hooks/usePersistentStorageValue";
import useThemeDetect from "@/hooks/useThemeDetect";
import { useSession, signOut } from "next-auth/react";
import { createError, ErrorType } from "@/lib/errorHandler";
import { useRouter } from "next/router";
import Image from "next/image";

const Header = ({ }: any) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";
    const isDarkThemeByDefault = useThemeDetect();
    const [localTheme, setLocalTheme] = usePersistentStorageValue(
        "theme",
        isDarkThemeByDefault ? "iswDark" : "iswLight",
    );
    const [smMenuVisibile, setSmMenuVisibile] = useState(false as boolean);
    const [error, setError] = useState<null | any>(null);

    // Apply theme change to document
    useEffect(() => {
        if (document) {
            document.documentElement.setAttribute("data-theme", localTheme);
        }
    }, [localTheme]);

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: "/" });
        } catch (err) {
            setError(createError(ErrorType.AUTH, "Failed to sign out", undefined, err));
            console.error("Sign out error:", err);
        }
    };

    // Check if a path is active
    const isActive = (path: string) => {
        if (path === '/') {
            return router.pathname === path;
        }
        return router.pathname.startsWith(path);
    };

    // Get nav link class based on active state
    const getLinkClass = (path: string) => {
        const baseClass = "mx-2 font-medium transition-colors";
        return `${baseClass} ${isActive(path) ? 'text-primary font-semibold' : 'hover:text-primary'}`;
    };

    const menuLink = (src: string) => (
        <>
            <li key={"homeLink" + src}>
                <Link
                    key="homeLink"
                    className={getLinkClass('/')}
                    href="/"
                    scroll={false}
                >
                    Home
                </Link>
            </li>
            <li key={"formsLink" + src}>
                <Link
                    key="formsLink"
                    className={getLinkClass('/forms')}
                    href="/forms"
                >
                    Forms
                </Link>
            </li>
            <li key={"draftsLink" + src}>
                <Link
                    key="draftsLink"
                    className={getLinkClass('/drafts')}
                    href="/drafts"
                >
                    Drafts
                </Link>
            </li>
            <li key={"assignedLink" + src}>
                <Link
                    key="assignedLink"
                    className={getLinkClass('/assigned')}
                    href="/assigned"
                >
                    Assigned
                </Link>
            </li>
            <li key={"adminLink" + src}>
                <details className="dropdown">
                    <summary className={`mx-2 font-medium transition-colors ${router.pathname.startsWith('/admin') ? 'text-primary font-semibold' : 'hover:text-primary'}`}>Admin</summary>
                    <ul className="p-2 shadow-card menu dropdown-content z-[1] bg-base-100 rounded-xl w-52">
                        <li>
                            <Link
                                href="/admin/form-builder"
                                className={router.pathname === '/admin/form-builder' ? 'bg-base-200 text-primary font-semibold' : 'hover:bg-base-200'}
                            >
                                Form Builder
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/form-responses"
                                className={router.pathname === '/admin/form-responses' ? 'bg-base-200 text-primary font-semibold' : 'hover:bg-base-200'}
                            >
                                Form Responses
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/settings"
                                className={router.pathname === '/admin/settings' ? 'bg-base-200 text-primary font-semibold' : 'hover:bg-base-200'}
                            >
                                Settings
                            </Link>
                        </li>
                    </ul>
                </details>
            </li>
            <li key={"dbLink" + src}>
                <Link
                    key="dbLink"
                    className={getLinkClass('/items')}
                    href="/items"
                >
                    Demo DB
                </Link>
            </li>
            <li key={"aboutLink" + src}>
                <Link
                    key="aboutLink"
                    className={getLinkClass('/about')}
                    href="/about"
                >
                    About
                </Link>
            </li>
            {isAuthenticated ? (
                <>
                    <li key={"profileLink" + src}>
                        <Link
                            key="profileLink"
                            className={getLinkClass('/profile')}
                            href="/profile"
                        >
                            Profile
                        </Link>
                    </li>
                    <li key={"signoutLink" + src}>
                        <button
                            className="mx-2 font-medium hover:text-primary transition-colors"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </button>
                    </li>
                </>
            ) : (
                <li key={"signinLink" + src}>
                    <Link
                        key="signinLink"
                        className={getLinkClass('/auth/signin')}
                        href="/auth/signin"
                    >
                        Sign In
                    </Link>
                </li>
            )}
        </>
    );

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
        <>
            <div className="navbar p-4 bg-base-100 text-base-content fixed top-0 z-30 h-16 md:justify-center bg-opacity-90 backdrop-blur-lg shadow-card">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div
                            tabIndex={0}
                            onClick={() => setSmMenuVisibile(true)}
                            role="button"
                            className="btn btn-sm btn-ghost md:hidden"
                            aria-label="Menu"
                            title="Menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </div>
                        {/* MOBILE */}
                        <ul
                            id="mobileMenu"
                            key="mobileMenu"
                            onClick={() => setSmMenuVisibile(!smMenuVisibile)}
                            tabIndex={0}
                            className={`${!smMenuVisibile && "hidden"} menu menu-sm dropdown-content mt-3 p-2 shadow-card bg-base-100 rounded-xl w-64 space-y-1`}
                        >
                            {menuLink("MOBILE")}
                        </ul>
                    </div>
                    <Link href="/" className="flex items-center">
                        <div className="h-8 w-8 mr-2">
                            <Image
                                src="/ISW.ico"
                                alt="ISW Logo"
                                width={32}
                                height={32}
                                priority
                            />
                        </div>
                        <span className="text-xl font-bold">ISW Forms</span>
                    </Link>
                    {/* MOBILE */}
                    <div className="md:hidden">
                        {themeSwap}
                    </div>
                </div>
                <div className="navbar-center hidden md:flex">
                    {/* DESKTOP */}
                    <ul id="desktopMenu" className="menu-horizontal px-1">
                        {menuLink("DESKTOP")}
                    </ul>
                </div>
                <div className="navbar-end hidden md:flex pr-1">
                    {/* DESKTOP */}
                    <div className="pr-2">
                        {themeSwap}
                    </div>
                    {isAuthenticated && (
                        <div className="ml-4 flex items-center">
                            <div className="avatar placeholder">
                                <div className="bg-primary text-white rounded-full w-8">
                                    <span>{session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
