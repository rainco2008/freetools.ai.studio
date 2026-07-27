# freetools.ai.studio

[English](README.md)

一个面向开发、图片处理和创意生成的浏览器免费工具箱。Google 登录为可选功能。

## 工具内容

- 34 个开发工具：安全、编码、转换、网络、文本、格式化、计算与速查。
- 12 个图片、媒体与创意工具：截图、编辑、背景处理、压缩、格式转换、查看、合成、视频与 AI 花束生成。
- 优先在本地浏览器运行，无需账户和付费订阅。

## 技术栈

- React 19 与 TypeScript
- Vite 6 与 Tailwind CSS 4
- Express 本地开发及生产静态服务
- Canvas、WebAssembly、FFmpeg 与浏览器原生媒体 API
- Gemini API 服务端花束图片生成
- Firebase Authentication 与 Google Identity Services 可选 Google One Tap 登录
- 经用户同意后启用的 Google Analytics 4

## 本地开发

```bash
npm install
npm run dev
```

浏览器访问 `http://localhost:3000`。

在 `.env` 中配置可选云端功能：

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Firebase Web 配置和 Google OAuth Client ID 保存在 `firebase-applet-config.json`。请将所有生产及预览域名加入 Firebase Authentication 授权域名和 Google OAuth 授权 JavaScript 来源。

## 生产环境部署（Google Cloud Run）

本项目生产环境运行在 Google Cloud Run，源代码仓库为
[rainco2008/freetools.ai.studio](https://github.com/rainco2008/freetools.ai.studio)。
Cloud Run 会注入 `PORT`；Express 服务监听 `0.0.0.0`，项目要求 Node.js 22.x。

在仓库根目录使用 Google Cloud CLI 进行源码部署：

```bash
gcloud run deploy freetools-ai-studio \
  --source . \
  --region REGION \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
```

请将 `GEMINI_API_KEY`（或 `GOOGLE_API_KEY`）保存到 Google Secret Manager，
再注入为 Cloud Run 环境变量。不要将密钥提交到 GitHub、写入
`firebase-applet-config.json`，也不要放入前端代码。

```env
NODE_ENV=production
PORT=由 Cloud Run 注入
GEMINI_API_KEY=通过 Secret Manager 注入
GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

`GOOGLE_API_KEY` 可以替代 `GEMINI_API_KEY`；两者同时存在时优先使用
`GEMINI_API_KEY`。`VITE_GA_MEASUREMENT_ID` 为可选配置，只有用户同意后
才启用 Google Analytics 4。当前 AI 花束接口按 IP 限制为每小时最多 5 次请求。

Firebase 用于 Web 应用配置及可选的 Google 登录。公开的 Firebase Web 配置
和 OAuth Client ID 保存在 `firebase-applet-config.json`；服务端 Gemini 密钥
必须仅通过 Cloud Run 的 Secret Manager 配置提供。

部署完成后，将生产域名和所有预览域名加入 Firebase Authentication 的授权域名，
以及 Google OAuth Client 的 Authorized JavaScript origins。上线前验证首页、开发工具、
图片工具、AI 花束生成、Google 登录以及条款和隐私页面。

## 验证与构建

```bash
npm run lint
npm run build
npm run start
```

## 页面路由

- `/` — 工具首页与统一搜索
- `/developer` — 开发工具工作台
- `/image` — 图片工具工作台
- `/bouquet-generator` — AI 花束生成器
- `/terms` — 使用条款
- `/privacy` — 隐私政策

项目采用 HTML5 History API 路由（`pushState`）。后端 Express 已配置将未知路由回退至 `index.html`，同时兼容将带 `#` 的旧版本链接（如 `#/developer` 等）自动平滑重定向。

## 许可证

本项目基于 GNU General Public License v3.0（GPLv3）发布。项目中包含或改编的第三方代码仍分别遵循其上游许可证及版权声明。详见 [LICENSE](LICENSE) 及下方列出的上游仓库。

## 开源项目引用与致谢

- 开发工具基于 Corentin Thomasset 创建的开源项目 [CorentinTh/it-tools](https://github.com/CorentinTh/it-tools) 二次开发，原项目采用 GPLv3 许可证。本项目自 2026 年 7 月 24 日起将相关工具由 Vue 适配为 React。
- 图片工具包含由 [CH563/shot-easy-website](https://github.com/CH563/shot-easy-website) 适配的代码，原项目采用 MIT 许可证；适配源码中原有的版权与引用声明予以保留。
- AI 花束生成器基于 [cloudinary-devs/ai-bouquet-generator](https://github.com/cloudinary-devs/ai-bouquet-generator) 进行 React 适配，原项目由 Jen Looper / cloudinary-devs 创建并采用 MIT 许可证。

感谢上述上游项目的作者和贡献者。本仓库不主张对其原创代码拥有所有权。
