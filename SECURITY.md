# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly.

**Email:** hello@vcode.sh

Please do NOT open a public GitHub issue for security vulnerabilities.

## Scope

popser is a client-side React component library. Security concerns typically involve:

- XSS through toast content (title, description, custom render)
- DOM injection via unsanitized user input
- Dependency vulnerabilities

## Response

We aim to acknowledge reports within 48 hours and provide a fix within 7 days for confirmed vulnerabilities.
