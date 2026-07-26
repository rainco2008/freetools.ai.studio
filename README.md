# freetools.ai.studio

[简体中文](README.zh-CN.md)

A free browser toolbox for developer, image, and creative-generation workflows. Google sign-in is optional.

## Included tools

- 34 developer utilities for security, encoding, conversion, networking, text, formatting, calculations, and reference.
- 12 image, media, and creative utilities for screenshots, editing, background processing, compression, conversion, viewing, composition, video, and AI bouquet generation.
- Browser-first processing with no subscription or account requirement.

## Technology

- React 19 and TypeScript
- Vite 6 and Tailwind CSS 4
- Express for local and production static serving
- Canvas, WebAssembly, FFmpeg, and browser-native APIs for media processing
- Gemini API for server-side bouquet image generation
- Firebase Authentication and Google Identity Services for optional Google One Tap sign-in
- Consent-gated Google Analytics 4 support

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Configure optional cloud features in `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

The Firebase web configuration and Google OAuth client ID are stored in `firebase-applet-config.json`. Add every production and preview hostname to Firebase Authentication authorized domains and to the Google OAuth client's authorized JavaScript origins.

## Validation

```bash
npm run lint
npm run build
npm run start
```

## Routes

- `#/` — toolbox home and search
- `#/developer` — developer tools workbench
- `#/image` — image tools workbench
- `#/bouquet-generator` — AI Bouquet Generator
- `#/terms` — terms of use
- `#/privacy` — privacy policy

Legacy developer and image tool links are mapped to the new workbench routes.

## License

This project is distributed under the GNU General Public License v3.0 (GPLv3). Included and adapted third-party code remains subject to its upstream license and copyright notices. See [LICENSE](LICENSE) and the upstream repositories below.

## Credits and Attribution

- The developer tools are a derivative of [CorentinTh/it-tools](https://github.com/CorentinTh/it-tools), created by Corentin Thomasset and licensed under GPLv3. This project began adapting those tools from Vue to React on July 24, 2026.
- The image tools include code adapted from [CH563/shot-easy-website](https://github.com/CH563/shot-easy-website), which is licensed under the MIT License. Copyright and attribution notices in the adapted source files are retained.
- The AI Bouquet Generator is a React-based adaptation of [cloudinary-devs/ai-bouquet-generator](https://github.com/cloudinary-devs/ai-bouquet-generator), originally created by Jen Looper / cloudinary-devs and licensed under the MIT License.

Thank you to the upstream authors and contributors. This repository does not claim ownership of their original work.
