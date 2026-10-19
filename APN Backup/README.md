# Answered Prayer Network Website

A professional React website for Answered Prayer Network — Expert Legal & Business Consultancy.

## Color Scheme
- **Navy:** `#1a2744` (primary)
- **Gold:** `#c9a84c` (accent)
- **White / Off-white:** backgrounds
- No gradients, no rounded corners — sharp, professional edges throughout.

## Pages
- **Home** — Hero, Welcome + 2×2 services grid, Why Us section, Stats bar
- **About** — Full About page with team photo, core services strip, Values section, Meet the Team grid
- **Services** — Detailed 6-service listing with features + process steps
- **Contact** — Contact info, embedded Google Map, working contact form

## Tech Stack
- React 18
- React Router v6
- Google Fonts: Playfair Display + Lato
- Pure CSS (no Tailwind, no CSS frameworks)

## Getting Started

### Prerequisites
- Node.js 16+ installed

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

Output will be in the `/build` folder — ready to deploy to any static host (Netlify, Vercel, GitHub Pages, etc.).

## Project Structure

```
camsey-consulting/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx / Navbar.css
│   │   ├── Footer.jsx / Footer.css
│   │   ├── PageHeader.jsx / PageHeader.css
│   │   └── Icons.jsx
│   ├── pages/
│   │   ├── Home.jsx / Home.css
│   │   ├── About.jsx / About.css
│   │   ├── Services.jsx / Services.css
│   │   └── Contact.jsx / Contact.css
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── index.js
└── package.json
```

## Customization

- **Colors:** Edit CSS variables in `src/styles/globals.css`
- **Content:** Update text directly in each page JSX file
- **Images:** Replace Unsplash URLs with your own images
- **Contact details:** Update address/phone/email in `Contact.jsx`
- **Map:** Replace the Google Maps embed `src` in `Contact.jsx` with your actual location

## Deployment

### Netlify (recommended)
1. `npm run build`
2. Drag the `/build` folder into [app.netlify.com/drop](https://app.netlify.com/drop)

### Vercel
```bash
npm install -g vercel
vercel
```
