# freetools.ai.studio

[简体中文](README.zh-CN.md)

A free, no-sign-up browser toolbox for developer and image workflows.

## Included tools

- 34 developer utilities for security, encoding, conversion, networking, text, formatting, calculations, and reference.
- 11 image and media utilities for screenshots, editing, background processing, compression, conversion, viewing, composition, and video.
- Browser-first processing with no subscription or account requirement.

## Technology

- React 19 and TypeScript
- Vite 6 and Tailwind CSS 4
- Express for local and production static serving
- Canvas, WebAssembly, FFmpeg, and browser-native APIs for media processing

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

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
- `#/terms` — terms of use
- `#/privacy` — privacy policy

Legacy developer and image tool links are mapped to the new workbench routes.

## License

GPLv3. The developer tools are based on the open-source IT Tools project, and the image tools include code adapted from shot-easy-website. See [LICENSE](LICENSE).
