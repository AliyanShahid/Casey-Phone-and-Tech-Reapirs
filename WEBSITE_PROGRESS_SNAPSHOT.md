# Casey Website Progress Snapshot

Last updated: 2026-08-03

This file records the current website build state so future sessions can quickly understand what has already been created and where to continue.

## Project Location

Primary source folder:

`D:\Casey Phone & Tech Repairs\website`

Runnable clean copy:

`C:\Users\aliya\Claude_n8n\casey-website`

The clean copy is used because the main folder path contains `&`, which can break some Windows Node commands.

## Run Website

From the clean copy:

```bash
cd C:\Users\aliya\Claude_n8n\casey-website
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

Open:

`http://127.0.0.1:3000`

## Sync Source To Runnable Copy

After editing the main source folder, sync to the runnable folder:

```bash
robocopy "D:\Casey Phone & Tech Repairs\website" "C:\Users\aliya\Claude_n8n\casey-website" /E /XD node_modules .next
```

Robocopy exit code `1` usually means files copied successfully.

## Verify

Run from:

`C:\Users\aliya\Claude_n8n\casey-website`

```bash
npm.cmd run typecheck
npm.cmd run build
```

Both were passing at the time of this snapshot.

## Main Website Features Built

- Public homepage with Casey branding, animated modern hero, repair search/finder flow, and cleaner service positioning.
- Navigation with tabs for Services, Repair Booking, Door-to-door, IT services, Refurbished Devices, Insurance quote, Track, Contact, Login, Register, and Book Repair.
- OTP-style login/register flow foundation with email OTP concept, Australian mobile validation, login/logout state, customer dashboard, and admin visibility.
- Admin section separated into dashboard areas instead of one crowded page.
- Admin pages for bookings, pricing, queries, quotes, users, and dashboard.
- Repair cost pricing page with search, categories, pagination, admin-editable pricing foundation, and broad device/issue pricing data.
- Door-to-door booking flow with admin approval, deposit/payment status concept, pickup/return ETA, customer/admin status updates, and query tracking.
- Insurance quote page with request flow, admin quote handling, payment approval concept, branded PDF quote/invoice output, and invoice data in admin.
- Contact page improved.
- IT services and Refurbished Devices tabs/pages added.
- Refurbished devices shop concept with buy flow, add-ons, delivery details, and payment/booking direction.

## Latest Repair Booking Flow

The repair model page now supports a guided multi-service repair booking flow.

Example route:

`/repair/apple/apple-iphone-16-pro-max`

Customer flow:

- Customer chooses a device from the home finder or repair booking flow.
- Customer lands on device-specific URL for SEO, for example `/repair/apple/apple-iphone-16-pro-max`.
- Customer sees a clear prompt: select one or more services.
- Customer can choose multiple repairs before booking.
- Screen and Battery open quality options before adding:
  - Screen: Aftermarket, Premium, Genuine.
  - Battery: Standard, Premium.
- Other services add directly to the booking side panel.
- Side panel shows selected repairs, remove buttons, bundle discount, total, and payment-style breakdown.
- Continue booking opens final service details.
- Final booking stores all selected repair services together.

## Important Repair Flow Files

`website\components\repair-flow.tsx`

- Main device/repair booking component.
- Controls brand/device selection, repair selection, multi-service basket, repair quality choices, booking summary, service method, customer form, and booking creation.

`website\lib\repair-flow-data.ts`

- Device brands, series, models, repair options, prices, repair choices, and SEO slugs.
- Update this file when adding brands, devices, repair types, prices, or choice options.

`website\public\repair-parts`

- Casey-style SVG part images for repair cards:
  - screen
  - battery
  - charging
  - back glass
  - diagnostic
  - water
  - data
  - motherboard
  - camera
  - speaker
  - software

`website\app\repair\[[...slug]]\page.tsx`

- Dynamic repair route.
- Handles SEO-friendly repair URLs such as `/repair/apple/apple-iphone-16-pro-max`.

`website\app\globals.css`

- Main styling file.
- Contains homepage, navigation, pricing, admin, insurance, door-to-door, refurbished, and repair-flow styles.
- Latest repair-flow styling is under selectors like `.repair-flow-device`, `.repair-selection-guide`, `.repair-card-grid`, `.repair-option-card`, `.repair-choice-drawer`, and `.repair-summary-card`.

## Other Important Files

`website\app\page.tsx`

- Homepage.

`website\components\home-repair-finder.tsx`

- Homepage repair search/finder.
- Sends customer to device-specific repair URL.

`website\components\site-header.tsx`

- Main header/navigation.

`website\lib\local-store.ts`

- Local browser storage helpers for users, bookings, queries, quotes, pricing, and mock admin/customer data.

`website\app\admin\*`

- Admin dashboard sections.

`website\app\door-to-door\page.tsx`

- Door-to-door repair page and booking flow.

`website\app\insurance-quote\page.tsx`

- Insurance quote request/payment/PDF flow.

`website\app\refurbished-devices\page.tsx`

- Refurbished devices storefront.

## Current Design Direction

- Brand theme: Casey black, white, and lime green.
- Avoid yellow-heavy styling.
- Keep interfaces clean, professional, and easy for stressed repair customers.
- Use clear actions and short guidance, not long text.
- Repair pages should feel like a guided booking assistant, not a static price list.

## 2026-08-04 Apple Watch Update

- Added Apple Watch support to the repair booking device picker under Apple > Smartwatch.
- Watch models are grouped like the reference UI:
  - Series Ultra
  - Series 11
  - Series 10
  - Series 9
  - Series SE
  - Series 8
  - Series 7
  - Series 6
  - Series 5
  - Series 4
  - Series 3
  - Series 2
  - Series 1
  - 1st Gen
- Added 33 Apple Watch model/size entries from Ultra 3 through 1st generation.
- Added local Casey-style Apple Watch SVG images in `website\public\watches\apple-watch-*.svg`.
- Updated `website\components\repair-flow.tsx` so all series groups show instead of only the first six, and series filter buttons now filter watches more accurately.
- Updated `website\lib\repair-flow-data.ts` with grouped Apple Watch data.
- Reworked Apple Watch SVG assets to look more like product photos with visible watch faces and bands instead of text-label icons.
- iPhone repair model cards now prefer real full product photos from existing `website\public\refurbished\` stock images where available, with the original `website\public\apple-official\` images kept as fallback. Do not replace these with generated/cartoon-style images.
- Tightened iPhone image matching so similar models do not borrow the wrong photo, especially Pro vs Pro Max.
- Added explicit image overrides for the currently sensitive iPhone cards: iPhone 6, iPhone 6 Plus, iPhone 6s, iPhone 6s Plus, iPhone 16 Pro Max, and iPhone 17 Pro.
- Updated the next set of problematic Apple images called out by the user: iPhone X, iPhone 12 Pro Max, iPhone SE 2022, and refreshed the iPhone 6 / 6s / 16 Pro Max overrides to cleaner full product shots.
- Added another model-specific override batch for iPhone 13 Pro Max, iPhone 14, 14 Plus, 14 Pro, iPhone 15, 15 Pro, iPhone 16, 16 Pro, iPhone 17 Pro, and Apple iPhone Air, so these no longer depend on stock-photo matching.
- Replaced the disputed newer iPhone image overrides with cleaner real product thumbnails from `website\public\refurbished\` so the booking grid keeps the product-photo look and avoids cropped/blurry official thumbnails.
- Corrected Apple iPhone Air back to its dedicated Air image and varied Pro vs Pro Max image choices for iPhone 14, 15, 16, and 17 families so adjacent model cards do not repeat the same thumbnail.
- Created card-ready cropped versions for iPhone 14 Pro, 15 Pro, 16 Pro, and 17 Pro in `website\public\apple-official\card-ready\` so the repair booking cards show full-size phones instead of tiny images inside large white canvases.
- Switched iPhone 14 Pro, 15 Pro, 16 Pro, and 17 Pro away from the front-only cropped images after visual review; they now use cleaner front/back product-photo style images that match the rest of the repair booking grid.
- Added `website\public\apple-official\iphone-air-card.png` from the approved iPhone Air front/back reference and mapped Apple iPhone Air to it.

## 2026-08-30 Admin Catalog Manager Update

- Rebuilt `website\components\admin-pricing.tsx` from a flat pricing table into a repair booking catalog manager.
- Admin Pricing now has three sections:
  - Models: add/edit/delete custom brands, device types, series, model names, and uploaded model pictures.
  - Repair categories: add/edit/delete custom repair services with uploaded repair images, summary text, warranty, badge, and base price.
  - Model prices: map an exact repair price to a specific model and repair category.
- Added `website\lib\custom-repair-catalog.ts` for browser-local catalog storage, image upload conversion, catalog subscriptions, and helpers that merge admin catalog data into the customer booking flow.
- Updated `website\components\repair-flow.tsx` so admin-added brands/models/repair categories/prices appear in Repair Booking without changing the static built-in catalog.
- Added optional `image` support to `RepairOption` in `website\lib\repair-flow-data.ts`, allowing admin repair category images to show on customer-facing repair cards.
- Added admin catalog styles to `website\app\globals.css` using the Casey black/white/lime theme.
- Verified in preview folder with:
  - `npm.cmd run typecheck`
  - `npm.cmd run build`

## Next Recommended Work

- Visually review the repair model page after the latest card changes.
- Visually review `/admin/pricing` and test adding one new model, one repair category, and one price override in the browser.
- Add more realistic repair part image assets if needed.
- Connect real payment provider later, likely Stripe.
- Connect real email/SMTP for OTPs, booking notifications, quote notifications, and admin alerts.
- Replace local storage with a real database when ready.
- Add production business details: ABN, address, phone number, email, and final policies.
