# Security Guide

## Required Before Launch

- Use HTTPS only
- Store JWT/session tokens in secure HTTP-only cookies
- Hash passwords with bcrypt
- Rate limit authentication and quote request endpoints
- Validate every request with schemas
- Restrict uploaded file types and sizes
- Scan and store uploads outside the app server where possible
- Use role-based access control for admin routes
- Write audit logs for admin actions
- Keep secrets in environment variables only
- Add CSRF protection for authenticated mutations
- Add strict security headers

## Privacy

Repair customers may provide devices containing sensitive personal data. The system must minimise data access, record consent and avoid storing unnecessary device data.
