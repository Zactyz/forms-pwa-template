import Meta from "@/components/meta";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
    const cspContent = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://cognito-idp.*.amazonaws.com;
    frame-ancestors 'none';
    form-action 'self';
  `;

    return (
        <Html className="scroll-smooth" style={{ scrollBehavior: "smooth" }} lang="en">
            <Head>
                <Meta />
                <meta
                    httpEquiv="Content-Security-Policy"
                    content={cspContent}
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
