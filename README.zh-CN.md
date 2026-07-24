# freetools.ai.studio

[English](README.md) | 简体中文

一个由 Google Gemini 驱动的全栈 AI 工具平台，运行在 Google AI Studio 环境中。

项目地址：**https://freetools.ai.studio**

## 项目简介

freetools.ai.studio 使用 React 19、Express 和 Google Gemini，提供研究、写作、语言、数据、开发及创意类工具。

项目面向 Google AI Studio Build 模式及其兼容 Linux 的全栈运行环境设计。Gemini API 调用由服务端处理，API Key 不会暴露在浏览器代码中。

## 主要 Studio 应用

### Development Tools Workbench

Development 工具工作台包含 34 个本地优先的开发工具，包括：

- JSON、XML、SQL、URL、Base64、JWT、UUID 和 ULID 工具
- Hash、HMAC、加密和 Basic Auth 工具
- Cron、chmod、IPv4 子网、百分比和数学计算器
- 二维码生成、文本统计、正则表达式和 Git 参考工具
- 颜色转换、大小写转换、Slugify 和日期时间工具

访问路径：`#/studio/development-tools`

### Bouquet Generator

Bouquet Generator 是一个 React 创意 Studio 应用，由原 Astro/Vue 项目迁移而来，支持：

- 按花名或花语搜索 118 种花卉
- 单独选择花卉或根据寓意批量选择
- 展示花束组合后的花语
- 使用 Gemini 生成 Victorian tussie-mussie 风格花束图片
- 下载生成的花束图片

正式访问地址：**https://freetools.ai.studio/bouquetgenerator**

前端通过服务端 `/api/bouquet/image` 接口生成图片，花卉数据保存在 `public/flowers.json`。

## 一键部署入口

仓库在本部署说明中包含合成后的 Google Cloud 部署图标：

```text
public/branding/google-ai-studio-deploy-badge.png
```

![Google AI Studio 部署图标](public/branding/google-ai-studio-deploy-badge.png)

按钮会打开 Google AI Studio。发布本项目的步骤如下：

1. 进入 Google AI Studio 的 Build 模式。
2. 通过 **Add files (+) → Import from GitHub** 导入本仓库。
3. 检查项目构建，并在 Secrets 面板配置 `GEMINI_API_KEY`。
4. 点击 **Publish → Get Started → Publish App**。

Google AI Studio 会将应用部署为 Cloud Run 服务，并可以提供 `ai.studio` 域名。自定义子域名是否可用取决于名称占用、账户资格、配额及 Google Cloud 计费设置。

## 技术栈

### 前端

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Lucide React
- Motion
- jsPDF

### 后端

- Node.js 和 Express
- TypeScript 与 `tsx`
- `@google/genai`
- esbuild

## 本地开发

### 环境要求

- Node.js 18 或更高版本，或 Bun
- Gemini API Key

### 配置环境变量

在项目根目录创建 `.env`：

```env
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=http://localhost:3000
```

在 Google AI Studio 中运行时，应通过 Secrets 面板配置 `GEMINI_API_KEY`，不要将密钥提交到 Git。

### 安装并运行

```bash
npm install
npm run dev
```

浏览器访问 `http://localhost:3000`。

### 检查和构建

```bash
npm run lint
npm run build
npm run start
```

## 项目结构

```text
├── public/
│   ├── flowers.json
│   └── branding/google-ai-studio-deploy-badge.png
├── server.ts                         # Express 服务端与 Gemini API 路由
├── vite.config.ts                    # Vite 与 Tailwind 配置
├── package.json                      # 依赖和脚本
└── src/
    ├── App.tsx                       # 主路由与应用外壳
    ├── data.ts                       # 工具目录和 Studio 应用元数据
    ├── index.css                     # 全局 Tailwind 主题
    └── components/
        ├── BouquetGenerator.tsx
        ├── DevelopmentToolsWorkbench.tsx
        ├── StudioAppSandbox.tsx
        └── ...
```

## 部署说明

- Gemini 功能需要现有的 `GEMINI_API_KEY` Secret。
- 不要将 API Key 放入前端代码或提交到 Git。
- Google AI Studio 部署运行在 Cloud Run 服务上。
- Cloudinary 和电子贺卡功能是 Bouquet Generator 的后续可选增强功能。

## 许可证

本项目基于 MIT 许可证发布。
