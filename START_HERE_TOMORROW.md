# Casey Website - Tomorrow Start Here

Last updated: 7 July 2026

## Project folders

- Main source folder: `D:\Casey Phone & Tech Repairs\website`
- Clean running/test copy: `C:\Users\aliya\Claude_n8n\casey-website`
- Local preview URL: `http://127.0.0.1:3000`

The main folder name contains `&`, so the website is copied into the clean folder before running checks or previewing.

## What is done

- Built the Casey Phone & Tech Repairs website in Next.js.
- Added the correct Casey logo style.
- Improved the header/navigation with animations and better active states.
- Added passwordless email OTP login/register flow.
- Login checks if the email is already registered.
- Register asks for email, Australian mobile number, and OTP.
- Logged-in users return to the home page.
- Header swaps Login/Register for Logout after login.
- Admin section is separate from the public website.
- Admin pages now include dashboard, users, bookings, quotes, queries, and pricing.
- Services page has animations and added Refurbished laptop/mobile and IT Support.
- Pricing is renamed to Repair Costs / Repair Cost Pricing.
- Repair Costs page has animated search, filters, pagination, fallback request form, and model help.
- Added broad pricing data for iPhone, Samsung, Oppo, Vivo, Realme, Xiaomi, Redmi, POCO, OnePlus, Motorola, Huawei, Nokia, Sony, Nothing, Asus, and common repair issues.
- Added custom query flow when customers cannot find their device or repair.
- Query submissions appear in Admin Queries and include a mailto reply action.
- Motherboard pricing now appears once as a global diagnostic item instead of repeating under every iPhone/device.
- Admin pricing edits now persist and update the public Repair Costs page.
- Door-to-door page is now a professional mobile repair workflow.
- Door-to-door customer intake starts with two clear options: call or send a quick request.
- Door-to-door quick form is simplified for stressed customers: essential details first, quick issue buttons, optional photos, and hidden model-help fields.
- Customers do not need to know the exact device model; they can add colour/logo/camera/power clues if needed.
- Admin Bookings can manage door-to-door requests with total amount, deposit, automatically calculated remaining balance, pickup/drop-off ETA date-time fields, customer notification, send-to-customer action, and delete request.
- Customer tracking shows latest update, pickup/drop-off ETA, total/deposit/remaining balance, simplified progress, and Stripe-style payment actions.

## Latest verified checks

These passed from the clean running folder:

- `npm.cmd run typecheck`
- `npm.cmd run build`

## Important files

- Public Repair Costs page: `website\components\pricing-experience.tsx`
- Door-to-door page: `website\app\door-to-door\page.tsx`
- Door-to-door customer form: `website\components\door-to-door-form.tsx`
- Admin bookings workflow: `website\components\admin-bookings.tsx`
- Customer tracking workflow: `website\components\track-repair.tsx`
- Pricing/admin/query data store: `website\lib\local-store.ts`
- Admin pricing page: `website\components\admin-pricing.tsx`
- Header/navigation: `website\components\header.tsx`
- Logo: `website\components\casey-logo.tsx`
- Site styles: `website\app\globals.css`
- Change history: `website\CHANGELOG.md`

## Continue next

- Connect real email sending for OTP and customer query notifications using SMTP.
- Connect real Stripe payment links/webhooks for deposit and balance payments.
- Connect real email notifications for door-to-door approval, deposit request, pickup ETA, device received, repair fixed, delivery ETA, and final payment.
- Add the real phone number in the call-us fallback section.
- Review Repair Costs page visually after any pricing data changes.
- If more pricing rows are added, keep motherboard/Face ID/board-level items as global diagnostic rows instead of duplicating them for every device.

## Tomorrow workflow

After changing source files in `D:\Casey Phone & Tech Repairs\website`, copy them to the clean folder:

```powershell
robocopy 'D:\Casey Phone & Tech Repairs\website' 'C:\Users\aliya\Claude_n8n\casey-website' /E /XD node_modules .next
```

Then check:

```powershell
npm.cmd run typecheck
npm.cmd run build
```
