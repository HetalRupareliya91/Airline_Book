# AirlineRoom

AirlineRoom is a premium airplane appointment booking landing page built with Next.js.  
The project is designed for fast flight appointment requests with a modern, light-blue luxury UI and responsive sections optimized for desktop and mobile users.

## Project Purpose

AirlineRoom helps travelers and business teams:

- request airplane booking appointments quickly
- submit travel details in a structured form
- choose country code and flag for phone contact
- review highlighted routes and service benefits
- engage with clear conversion sections and FAQ content

## Key Features

- Professional landing page layout with smooth section-based navigation
- Full-width animated header with contained page sections
- Hero area with airplane-themed Lottie animation
- Appointment form with:
  - full name, email, phone, destination, and notes
  - country flag + country code selector
  - custom date picker
- Trust bar, switchback section, conversion panel, and FAQ accordion
- Social icon links in footer
- Responsive design for all major screen sizes

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS v4
- Framer Motion
- Lottie React
- React Day Picker
- Date-fns
- Lucide React

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Scripts

- `npm run dev` - Start the development server
- `npm run lint` - Run ESLint checks
- `npm run build` - Create a production build
- `npm run start` - Start the production server

## Project Structure

- `src/app/layout.tsx` - Global layout and SEO metadata
- `src/app/page.tsx` - Landing page sections and interactions
- `src/app/globals.css` - Global styling and design system
- `public/flags` - Country flag assets used by the phone selector

## SEO

The project includes metadata configuration in `src/app/layout.tsx`:

- title and description
- keywords
- Open Graph metadata
- Twitter card metadata

## Notes

- Build output and cache directories (such as `.next`) are generated locally and should not be committed.
- The design direction follows a professional U.S. airline appointment booking style with light-blue as the primary color.
