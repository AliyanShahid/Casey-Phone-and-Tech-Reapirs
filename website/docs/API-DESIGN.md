# API Design

Current implementation contains Phase 1 placeholder routes.

## Existing Routes

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/quotes`

## Planned Routes

- `POST /api/auth/verify-otp`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/devices`
- `GET /api/devices/search`
- `GET /api/pricing`
- `POST /api/bookings`
- `GET /api/customer/bookings`
- `POST /api/door-to-door`
- `POST /api/insurance-quotes`
- `POST /api/admin/insurance-quotes/:id/approve`
- `GET /api/admin/dashboard`
- `POST /api/payments/create-intent`

## Response Shape

```json
{
  "ok": true,
  "data": {}
}
```

Errors:

```json
{
  "ok": false,
  "error": "Message"
}
```
