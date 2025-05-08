import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

const ISW_BLUE = "#1E90FF"; // Define the ISW blue color

const config: Config = {
    content: ["./pages/**/*.{js,ts,jsx,tsx,md,mdx}", "./components/**/*.{js,ts,jsx,tsx,md,mdx}"],
    daisyui: {
        darkTheme: "iswDark",
        themes: [
            {
                iswLight: {
                    ...require("daisyui/src/theming/themes")["light"],
                    primary: ISW_BLUE,
                    secondary: "#4EACFA",
                    accent: "#4051B5",
                    neutral: "#1E293B",
                    "base-100": "#FFFFFF",
                    "base-200": "#F1F5F9",
                    "base-300": "#E2E8F0",
                    "base-content": "#1E293B",
                    "#main": {
                        "--gradient-light": "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(243,244,246,1) 100%)",
                        "--bg-light": "url(/backgrounds/texture-light.svg)",
                        background: "var(--gradient-light)",
                        "background-repeat": "no-repeat",
                        "background-size": "cover",
                        "min-height": "100vh",
                        "border-bottom-width": "1px",
                        "--tw-border-opacity": "0.1",
                        "border-bottom-color": "var(--fallback-p,oklch(var(--p)/var(--tw-border-opacity)))",
                        padding: "4rem 0.5rem 0.5rem 0.5rem",
                    },
                },
                iswDark: {
                    ...require("daisyui/src/theming/themes")["dark"],
                    primary: ISW_BLUE,
                    secondary: "#1D4ED8",
                    accent: "#8B5CF6",
                    neutral: "#1E293B",
                    "base-100": "#0F172A",
                    "base-200": "#1E293B",
                    "base-300": "#334155",
                    "base-content": "#F1F5F9",
                    "#main": {
                        background: "var(--b1)",
                        "background-repeat": "no-repeat",
                        "background-size": "cover",
                        "min-height": "100vh",
                        "border-bottom-width": "1px",
                        "--tw-border-opacity": "0.1",
                        "border-bottom-color": "var(--fallback-p,oklch(var(--p)/var(--tw-border-opacity)))",
                        padding: "4rem 0.5rem 0.5rem 0.5rem",
                    },
                },
            },
        ],
    },
    theme: {
        extend: {
            colors: {
                iswBlue: ISW_BLUE,
                iswLightBlue: "#4EACFA",
                iswDarkBlue: "#1D4ED8",
                iswAccent: "#8B5CF6",
                iswSuccess: "#10B981",
                iswWarning: "#F59E0B",
                iswError: "#EF4444",
                iswInfo: ISW_BLUE
            },
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'button': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'nav': '0 -1px 10px rgba(0, 0, 0, 0.1)',
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
            }
        }
    },
    plugins: [typography, daisyui],
};

export default config;
