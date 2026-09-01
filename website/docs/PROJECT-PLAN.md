# Project Plan

## Goal

Build a complete mobile repair business management website for Casey Phone & Tech Repairs.

## Phases

### Phase 1 - Foundation

- Public homepage and core marketing pages
- Authentication UI
- Customer dashboard foundation
- Admin dashboard foundation
- Initial API route structure
- Documentation and changelog

### Phase 2 - Pricing, Search and Bookings

- PostgreSQL schema implementation
- Device, brand, model and repair CRUD
- Repair price lookup
- Booking flow with availability slots
- Quote request persistence and admin review

### Phase 3 - Door-to-Door Repairs

- Address intake
- Google Maps pin capture
- Preferred time windows
- Admin approval and ETA assignment
- Status notifications

### Phase 4 - Insurance Quotes and PDF

- Insurance quote request workflow
- Admin costing fields
- Branded PDF generation
- Customer download and email delivery

### Phase 5 - Payments, Emails and Analytics

- Stripe advance payments
- Payment history and invoices
- Nodemailer SMTP notifications
- Revenue and operations analytics

### Phase 6 - SEO, Security, Testing and Deployment

- Sitemap, robots and schema expansion
- Rate limiting and CSRF hardening
- End-to-end tests
- Performance pass
- Deployment guide validation

## Current Status

Phase 1 foundation started on 2026-07-05.

## Functional MVP Note

The first interactive slice now runs in browser local storage:

- Customers can submit booking requests.
- Customers can submit quote requests.
- Customers can track bookings or quotes by reference.
- Customers can log in with email OTP locally. New and returning emails use the same OTP flow.
- Admin can view bookings and quotes.
- Admin can update status, quoted price and notes.
- Admin can add, edit and delete repair pricing.
- Public pricing reads from the editable local price list.

This is intentionally not the final production backend. The next upgrade is replacing local storage with PostgreSQL-backed API routes and authentication.
