# freetools.ai.studio

English | [简体中文](README.zh-CN.md)

An open, full-stack AI tools workspace powered by Google Gemini and designed to run in Google AI Studio.

Project URL: **https://freetools.ai.studio**

## Overview

freetools.ai.studio combines a React 19 frontend with an Express server and Google's Gemini models. It provides research, writing, language, data, development, and creative tools in one browser-based workspace.

The application is designed for Google AI Studio Build mode and its Linux-compatible full-stack runtime. Gemini API calls are handled server-side so the API key is not exposed in browser code.

## Featured Studio Apps

### Development Tools Workbench

The Development workbench contains 34 local-first developer utilities, including:

- JSON, XML, SQL, URL, Base64, JWT, UUID, and ULID tools
- Hashing, HMAC, encryption, and Basic Auth utilities
- Cron, chmod, IPv4 subnet, percentage, and math calculators
- QR code generation, text statistics, regex, and Git reference tools
- Color conversion, case conversion, slugification, and date/time utilities

Open it at `#/studio/development-tools`.

### Bouquet Generator

Bouquet Generator is a React-based creative Studio app migrated from the original Astro/Vue project. It supports:

- Searching 118 flowers by name or symbolic meaning
- Selecting flowers individually or by meaning keyword
- Displaying the combined language of the selected bouquet
- Generating a Victorian tussie-mussie image with Gemini
- Downloading the generated bouquet image

Canonical route: **https://freetools.ai.studio/bouquetgenerator**

The frontend calls the server-side `/api/bouquet/image` endpoint. The flower catalog is stored in `public/flowers.json`.

## One-click deployment entry

The application header includes a **Deploy with Google AI Studio** button using the combined Google Cloud deployment badge at:

```text
public/branding/google-ai-studio-deploy-badge.png
```

The button opens Google AI Studio Apps. To publish this repository:

1. Open Build mode in Google AI Studio.
2. Use **Add files (+) → Import from GitHub** and select this repository.
3. Verify the build and configure `GEMINI_API_KEY` in the Secrets panel.
4. Click **Publish → Get Started → Publish App**.

Google AI Studio deploys the application as a Cloud Run service. It can provide an `ai.studio` URL, and a custom subdomain such as `freetools.ai.studio` can be selected when available. Deployment quotas, billing, and account eligibility are controlled by Google AI Studio and Google Cloud.

## Technology stack

### Frontend

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Lucide React
- Motion
- jsPDF

### Backend

- Node.js and Express
- TypeScript with `tsx`
- `@google/genai`
- esbuild for the production server bundle

## Local development

### Requirements

- Node.js 18 or later, or Bun
- A Gemini API key

### Configure secrets

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=http://localhost:3000
```

When running inside Google AI Studio, configure `GEMINI_API_KEY` through the Secrets panel instead of committing it to the repository.

### Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

### Validate and build

```bash
npm run lint
npm run build
npm run start
```

## Project structure

```text
├── public/
│   ├── flowers.json
│   └── branding/google-ai-studio-deploy-badge.png
├── server.ts                         # Express server and Gemini API routes
├── vite.config.ts                    # Vite and Tailwind configuration
├── package.json                      # Dependencies and scripts
└── src/
    ├── App.tsx                       # Main routing and application shell
    ├── data.ts                       # Catalog and Studio app metadata
    ├── index.css                     # Global Tailwind theme
    └── components/
        ├── BouquetGenerator.tsx
        ├── DevelopmentToolsWorkbench.tsx
        ├── StudioAppSandbox.tsx
        └── ...
```

## Deployment notes

- The existing `GEMINI_API_KEY` secret is required for Gemini-powered features.
- No API keys should be placed in client-side code or committed to Git.
- Google AI Studio deployments run as Cloud Run services.
- Cloudinary and electronic card delivery are optional future enhancements for Bouquet Generator.

## License

This project is distributed under the MIT License.
