# Database Schema Draft

Preferred database: PostgreSQL.

## Core Tables

- users
- customer_profiles
- admin_profiles
- otp_tokens
- password_reset_tokens
- brands
- devices
- repair_types
- repair_prices
- bookings
- repair_jobs
- repair_status_events
- quote_requests
- insurance_quote_requests
- insurance_quote_line_items
- payments
- invoices
- uploaded_files
- notifications
- audit_logs
- blog_posts
- reviews
- settings

## Key Relationships

- users can have one customer profile or admin profile
- brands have many devices
- devices have many repair prices through repair types
- customers have many bookings, quotes, insurance quotes and payments
- repair jobs belong to bookings
- repair jobs have many status events
- insurance quote requests have many line items
- uploaded files can attach to bookings, quote requests and insurance quote requests
- audit logs capture admin actions

## Notes

The schema is still a draft. It should become real migrations during Phase 2.
