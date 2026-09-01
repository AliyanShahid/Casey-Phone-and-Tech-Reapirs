# Authentication Flow

## Passwordless Email OTP Login

1. Customer enters email.
2. Server validates input.
3. OTP is generated and stored with expiry.
4. OTP is emailed to customer.
5. Customer enters OTP.
6. If email is new, a customer account is created automatically.
7. If email already exists, the existing customer account is reused.
8. Session starts after OTP verification.

No password is required. There is no separate account creation form in the intended production flow.

## Local MVP Behaviour

The current local MVP displays the OTP on screen as a test inbox. In production, this OTP should be emailed through SMTP and never shown in the browser.

## Admin Login

Admin authentication still needs a separate protected implementation before launch. Options:

- owner-only email OTP with an admin allowlist
- passkey or stronger admin login
- role-based access control after OTP login

## Security Requirements

- short-lived OTPs
- rate limiting on auth routes
- secure HTTP-only cookies for sessions
- audit logs for admin access
- admin email allowlist
