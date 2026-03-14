# Indeed Immobilier – Real Estate Platform

Professional real estate website for **Indeed Immobilier**, an agency based in Ariana, Tunisia. Buy, sell, and rent apartments, villas, houses, and land across Tunisia.

## Live Site

**[indeedimmobilier.com](https://indeedimmobilier.com)**

## Contact

- Instagram: [@indeed_immobilier](https://www.instagram.com/indeed_immobilier/)
- Google Maps: [View location](https://maps.app.goo.gl/mSMDc1rwtRgSvVhs5?g_st=ic)
- Email: fouratiimmo@gmail.com
- Phone: +216 26 454 266

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | PostgreSQL (Supabase) + Prisma ORM |
| Auth | NextAuth v4 (JWT) |
| UI | Tailwind CSS + shadcn/ui |
| Image Storage | Cloudinary via Supabase Storage |
| Deployment | Vercel |

## Features

- Property listings with filters (governorate, delegation, type, price range)
- Detailed property pages with image gallery
- Contact form with lead management
- Secure admin panel (login with math captcha + rate limiting)
- Mobile-responsive design

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
