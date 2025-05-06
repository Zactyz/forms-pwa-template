import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";

const MobileNavBar = () => {
    const router = useRouter();
    const currentPath = router.pathname;
    const [showAdminMenu, setShowAdminMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowAdminMenu(false);
            }
        };

        if (showAdminMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showAdminMenu]);

    // Close menu when navigating
    useEffect(() => {
        setShowAdminMenu(false);
    }, [currentPath]);

    // Function to check if a route is active
    const isActive = (path: string) => {
        if (path === "/" && currentPath === "/") return true;
        if (path !== "/" && currentPath.startsWith(path)) return true;
        return false;
    };

    // More specific check for exact path matches
    const isExactPath = (path: string) => {
        return currentPath === path;
    };

    // Function to generate nav item - use button instead of Link if already on that route
    const NavItem = ({ path, label, icon, onClick }: { path: string; label: string; icon: React.ReactNode; onClick?: () => void }) => {
        const active = isActive(path);
        const className = `flex flex-col items-center justify-center px-2 py-1 ${active ? "text-primary" : "text-neutral opacity-80"}`;

        if ((active && isExactPath(path)) || onClick) {
            return (
                <button className={className} onClick={onClick}>
                    <div className="mb-1">{icon}</div>
                    <span className="text-xs font-medium">{label}</span>
                </button>
            );
        }

        return (
            <Link href={path} className={className}>
                <div className="mb-1">{icon}</div>
                <span className="text-xs font-medium">{label}</span>
            </Link>
        );
    };

    const HomeIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
        </svg>
    );

    const FormsIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
        </svg>
    );

    const DraftsIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
        </svg>
    );

    const AssignedIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        </svg>
    );

    const ProfileIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
        </svg>
    );

    return (
        <div className="fixed bottom-0 left-0 right-0 btm-nav z-50 bg-base-100 shadow-nav md:hidden">
            <NavItem path="/" label="Home" icon={HomeIcon} />
            <NavItem path="/forms" label="Forms" icon={FormsIcon} />
            <NavItem path="/drafts" label="Drafts" icon={DraftsIcon} />
            <NavItem path="/assigned" label="Assigned" icon={AssignedIcon} />
            <NavItem path="/profile" label="Profile" icon={ProfileIcon} />
        </div>
    );
};

export default MobileNavBar; 