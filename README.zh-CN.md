# freetools.ai.studio

[English](README.md)

一个无需注册、无需订阅的浏览器免费工具箱，专注开发与图片处理。

## 工具内容

- 34 个开发工具：安全、编码、转换、网络、文本、格式化、计算与速查。
- 11 个图片与媒体工具：截图、编辑、背景处理、压缩、格式转换、查看、合成与视频。
- 优先在本地浏览器运行，无需账户和付费订阅。

## 技术栈

- React 19 与 TypeScript
- Vite 6 与 Tailwind CSS 4
- Express 本地开发及生产静态服务
- Canvas、WebAssembly、FFmpeg 与浏览器原生媒体 API

## 本地开发

```bash
npm install
npm run dev
```

浏览器访问 `http://localhost:3000`。

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
- `#/terms` — 使用条款
- `#/privacy` — 隐私政策

旧版开发与图片工具链接会兼容映射至新的工作台路由。

## 许可证

GPLv3。开发工具基于开源 IT Tools 项目，图片工具包含由 shot-easy-website 适配的代码。详见 [LICENSE](LICENSE)。
