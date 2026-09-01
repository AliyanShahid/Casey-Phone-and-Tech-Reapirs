# Deployment Guide Draft

## Target Options

- Vercel for the Next.js frontend and route handlers
- DigitalOcean or AWS for a separate Node/Express API if the backend is split later
- Managed PostgreSQL for production database
- Cloudinary or S3 for uploaded images

## Pre-Launch Checklist

- Add real environment variables
- Connect PostgreSQL
- Configure SMTP
- Configure Stripe
- Configure file storage
- Add production domain
- Run typecheck, lint and build
- Review legal pages
- Test all customer and admin flows
