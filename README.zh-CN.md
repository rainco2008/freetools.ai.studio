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

## 验证与构建

```bash
npm run lint
npm run build
npm run start
```

## 页面路由

- `#/` — 工具首页与统一搜索
- `#/developer` — 开发工具工作台
- `#/image` — 图片工具工作台
- `#/bouquet-generator` — AI 花束生成器
- `#/terms` — 使用条款
- `#/privacy` — 隐私政策

旧版开发与图片工具链接会兼容映射至新的工作台路由。

## 许可证

本项目基于 GNU General Public License v3.0（GPLv3）发布。项目中包含或改编的第三方代码仍分别遵循其上游许可证及版权声明。详见 [LICENSE](LICENSE) 及下方列出的上游仓库。

## 开源项目引用与致谢

- 开发工具基于 Corentin Thomasset 创建的开源项目 [CorentinTh/it-tools](https://github.com/CorentinTh/it-tools) 二次开发，原项目采用 GPLv3 许可证。本项目自 2026 年 7 月 24 日起将相关工具由 Vue 适配为 React。
- 图片工具包含由 [CH563/shot-easy-website](https://github.com/CH563/shot-easy-website) 适配的代码，原项目采用 MIT 许可证；适配源码中原有的版权与引用声明予以保留。
- AI 花束生成器基于 [cloudinary-devs/ai-bouquet-generator](https://github.com/cloudinary-devs/ai-bouquet-generator) 进行 React 适配，原项目由 Jen Looper / cloudinary-devs 创建并采用 MIT 许可证。

感谢上述上游项目的作者和贡献者。本仓库不主张对其原创代码拥有所有权。
