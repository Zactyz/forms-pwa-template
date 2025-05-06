import "@/styles/globals.css";
import React, { useEffect } from "react";
import { Titillium_Web } from "next/font/google";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { initializeSampleForm } from "@/lib/sampleForm";
import { initializeSync } from "@/lib/syncService";
import type { Session } from "next-auth";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
    session?: Session | null;
};

const titillium = Titillium_Web({
    weight: ["200", "300", "400", "600", "900"],
    subsets: ["latin"],
});

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page: any) => page);

    useEffect(() => {
        // Initialize sample form on app startup
        const initData = async () => {
            try {
                await initializeSampleForm();
            } catch (error) {
                console.error("Error initializing sample form:", error);
            }
        };

        initData();

        // Initialize sync service for offline submissions
        initializeSync();
    }, []);

    return (
        <SessionProvider session={session}>
            <style jsx global>
                {`
          html {
            font-family: ${titillium.style.fontFamily};
          }
        `}
            </style>
            {getLayout(<Component {...pageProps} />)}
        </SessionProvider>
    );
}
