# Minimal Calc

Minimal Calc is a lightweight React and TypeScript calculator for estimating the revenue impact of improving close rate.

It is designed as a single-page app with mobile-first spacing, live-editable assumptions, and a restrained liquid-glass interface that prioritizes readability over decoration.

## What it models

Inputs:
- Monthly leads
- Close rate
- Average deal value
- Conversion lift
- Projected duration

Outputs:
- Current customers
- Improved close rate
- Improved customers
- Additional customers per month
- Monthly revenue lift
- Projected revenue lift
- Suggested quote
- ROI

The suggested quote in this version is calculated as 10% of projected revenue lift.

## Design notes

This implementation uses liquid-glass selectively:
- Glass is reserved for the main summary rail and primary panels
- Inputs and smaller cards remain mostly solid for clarity and usability
- Contrast stays high and blur stays limited
- A solid fallback is provided for browsers without backdrop blur support

## Local development

Requirements:
- Node.js 20 or newer
- npm

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## GitHub Pages deployment

This project is configured for GitHub Pages with the Vite base path set to:

```txt
/minimal-calc/
```

A GitHub Actions workflow is included at `.github/workflows/deploy.yml`.

### Recommended repository settings

In GitHub:
1. Open the repository settings
2. Go to Pages
3. Set the source to GitHub Actions

After that, every push to `main` will build and deploy the app automatically.

## Tech stack

- React 19
- TypeScript
- Vite 7

## Notes

- The app intentionally stays dependency-light
- All assumptions are controlled inputs and update results immediately
- The calculator logic is simple on purpose so the outputs are easy to trust and explain
