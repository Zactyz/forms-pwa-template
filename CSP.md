# Content Security Policy (CSP) in Next.js PWA

## What is CSP?

Content Security Policy (CSP) is a security standard that helps prevent cross-site scripting (XSS), clickjacking, and other code injection attacks. CSP works by controlling which resources (like scripts, stylesheets, images) can be loaded and executed by the browser.

## Why is CSP important?

- **Prevents XSS attacks**: CSP can block malicious scripts from executing
- **Secures your PWA**: PWAs often store sensitive data locally, making security critical
- **Browser compatibility**: Supported by all modern browsers
- **SEO benefits**: Security is a ranking factor for search engines

## Implementing CSP in Next.js

For this Next.js PWA template, implementing CSP is **recommended** for the following reasons:

1. The application handles user authentication
2. The PWA stores data in IndexedDB
3. The app potentially loads third-party resources (like fonts, CDN assets)

### Implementation Options

#### 1. Using custom `_document.tsx` (Recommended for this project)

```typescript
// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Define your CSP */}
          <meta
            httpEquiv="Content-Security-Policy"
            content={`
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              font-src 'self';
              connect-src 'self' https://cognito-idp.*.amazonaws.com;
              frame-ancestors 'none';
              form-action 'self';
            `}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

#### 2. Using Next.js middleware (Recommended for flexibility)

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add CSP header
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self' https://cognito-idp.*.amazonaws.com;
    frame-ancestors 'none';
    form-action 'self';
  `;
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|favicon.ico).*)',
};
```

## CSP Policy Recommendations for this Project

| Directive | Recommended Value | Explanation |
|-----------|-------------------|-------------|
| `default-src` | `'self'` | Restricts resources to only come from your own domain |
| `script-src` | `'self' 'unsafe-inline' 'unsafe-eval'` | Allows scripts from your domain and inline scripts (necessary for Next.js) |
| `style-src` | `'self' 'unsafe-inline'` | Allows styles from your domain and inline styles |
| `img-src` | `'self' data: https:` | Allows images from your domain, data URIs, and HTTPS sources |
| `font-src` | `'self'` | Restricts fonts to your domain |
| `connect-src` | `'self' https://cognito-idp.*.amazonaws.com` | Allows connections to your domain and Cognito |
| `frame-ancestors` | `'none'` | Prevents your site from being embedded in iframes |
| `form-action` | `'self'` | Restricts form submissions to your domain |

## Balancing Security and Functionality

You may need to adjust these policies based on:

1. Third-party services you integrate
2. External resources you load
3. Development vs. production environments

## Next Steps

1. Implement one of the CSP options above
2. Test thoroughly to ensure no legitimate resources are blocked
3. Monitor CSP violations in production
4. Consider using `report-uri` directive to collect violation reports

For this Next.js PWA template with Cognito authentication, implementing CSP is recommended for enhanced security, especially in production. 