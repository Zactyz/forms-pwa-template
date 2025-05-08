import Link from "next/link";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer p-10 bg-base-200 text-base-content border-t border-base-300">
            <div className="flex flex-col">
                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary mr-2"
                    >
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xl font-semibold">ISW Forms</span>
                </div>
                <p className="mt-2">A powerful mobile form solution for data collection</p>
                <p className="text-xs opacity-70 mt-2">
                    © {currentYear} ISW Forms. All rights reserved.
                </p>
            </div>

            <div>
                <span className="footer-title">Product</span>
                <Link href="/forms" className="link link-hover">Forms</Link>
                <Link href="/drafts" className="link link-hover">Drafts</Link>
                <Link href="/assigned" className="link link-hover">Assigned</Link>
            </div>

            <div>
                <span className="footer-title">Admin</span>
                <Link href="/admin/form-builder" className="link link-hover">Form Builder</Link>
                <Link href="/admin/form-responses" className="link link-hover">Form Responses</Link>
                <Link href="/admin/settings" className="link link-hover">Settings</Link>
            </div>

            <div>
                <span className="footer-title">Company</span>
                <Link href="/about" className="link link-hover">About</Link>
                <a href="#" className="link link-hover">Privacy Policy</a>
                <a href="#" className="link link-hover">Terms of Service</a>
            </div>
        </footer>
    );
};

export default Footer;
