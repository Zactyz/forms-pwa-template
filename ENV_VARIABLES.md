# Environment Variables Documentation

This document outlines all the environment variables used in this Next.js PWA application.

## Setup Instructions

1. Create a `.env.local` file in the root of your project
2. Copy the variables below and provide your values

## Required Environment Variables

### Application Settings

```bash
# App
NEXT_PUBLIC_APP_NAME="Next PWA Template"
NEXT_PUBLIC_APP_DESCRIPTION="A Next.js PWA Template with Authentication"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### NextAuth.js Configuration

```bash
# Required for NextAuth.js authentication
NEXTAUTH_URL="http://localhost:3000"
# Generate a secure random secret: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-key"
```

### Amazon Cognito Configuration

```bash
# These values should be obtained from your AWS Cognito User Pool
COGNITO_CLIENT_ID="your-cognito-client-id"
COGNITO_CLIENT_SECRET="your-cognito-client-secret"
# Format: https://cognito-idp.{region}.amazonaws.com/{userPoolId}
COGNITO_ISSUER="https://cognito-idp.{region}.amazonaws.com/{userPoolId}"
```

## Environment Variables Usage

| Variable | Description | Required | Used In |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_APP_NAME` | The name of your application | Yes | Title tags, metadata |
| `NEXT_PUBLIC_APP_DESCRIPTION` | Short description of your app | Yes | Meta description |
| `NEXT_PUBLIC_APP_URL` | Base URL of your application | Yes | Absolute URLs |
| `NEXTAUTH_URL` | Base URL for NextAuth authentication | Yes | NextAuth.js authentication |
| `NEXTAUTH_SECRET` | Secret key for NextAuth sessions | Yes | NextAuth.js JWT encryption |
| `COGNITO_CLIENT_ID` | Client ID from your AWS Cognito User Pool | Yes | NextAuth Cognito provider |
| `COGNITO_CLIENT_SECRET` | Client Secret from your AWS Cognito User Pool | Yes | NextAuth Cognito provider |
| `COGNITO_ISSUER` | Issuer URL from your AWS Cognito User Pool | Yes | NextAuth Cognito provider |

## Development vs. Production

- For development: Use `.env.local` file
- For production: Set these variables in your hosting platform (Vercel, AWS, etc.)
- For testing: Create a `.env.test` file with test-specific values

## Security Considerations

- Never commit `.env` files to version control
- Use different secrets for development and production
- Regularly rotate your secrets, especially `NEXTAUTH_SECRET`
- Only expose variables to the browser when necessary (use `NEXT_PUBLIC_` prefix) 