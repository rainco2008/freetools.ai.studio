# AI Search Research Assistant | 智能搜索研究助手

这是一个全栈式、基于 Google 搜索增强（Grounding）的智能研究应用。该项目通过 **React 19** 与 **Express.js** 协同工作，依托 **Gemini 核心模型**，为用户提供可信度高、来源明确、结构清晰的智能搜索研究报告。

---

## 🌟 核心特性

- **基于搜索增强的汇总 (Search-Grounded Synthesis)**: 实时整合多个权威网页源的信息，将查询与真实、有据可查的搜索结果进行匹配。
- **事实与观点拆解 (Fact vs. Opinion Classification)**: 自动处理原始文本，将论断分类为可验证的事实和主观观点，从而加强批判性分析。
- **信息可信度评估 (Credibility Analysis)**: 对来源进行评分和分析，提供报告可信度的直观视觉指标。
- **高阶交互界面 (Premium Interactive UI)**: 拥有自定义排版处理、基于 `motion` 的流畅页面和状态过渡动画，以及完全响应式的专业布局。
- **客户端 PDF 导出 (Client-Side PDF Export)**: 通过 `jsPDF` 在浏览器中直接无缝排版、分页并生成专业的 PDF 研究报告。
- **智能缓存策略 (Intelligent Cache Controls)**: 实施优化后的生产环境 HTTP 响应头，确保 Vite 的哈希静态资源可以长期缓存，同时动态阻止 `index.html` 以及 API 接口被缓存，从而保证用户的更新立即可见。

---

## 🛠️ 技术栈

### 前端 (Frontend)
- **核心框架**: `React 19.0.1`（函数式组件、Hooks、高效虚拟 DOM）
- **构建工具**: `Vite 6.2.3`（极速开发服务器与生产环境资源打包管道）
- **样式处理**: `Tailwind CSS v4.1.14`（实用优先样式、自定义主题 Token，以及通过 `@tailwindcss/vite` 实现的高性能构建引擎）
- **动画效果**: `Motion (Framer Motion) 12.23.24`（基于物理的微交互、布局过渡和流畅的页面状态）
- **图标库**: `Lucide React 0.546.0`（统一、现代、支持摇树优化的矢量图标包）
- **PDF 生成**: `jsPDF 4.2.1`（客户端自定义 PDF 绘制、画布测量与文档布局格式化）

### 后端 (Backend)
- **服务端平台**: `Express 4.21.2`（轻量级 Node.js Web 服务器和安全 API 代理路由）
- **AI 集成**: `Google Gen AI SDK (@google/genai ^2.4.0)`（用于集成 Gemini API 的官方最新 SDK，在服务端启用 Google 搜索增强和高级 Prompt 配置）
- **TypeScript 支持**: `tsx`（TypeScript 执行器，处理本地开发中的实时运行）
- **打包工具**: `esbuild 0.25.0`（高速生产环境打包器，将后端模块编译为稳定且单文件的 CommonJS 格式 `dist/server.cjs`）

---

## 📐 架构与数据流

为了对客户端完全隐藏敏感的 API 密钥，应用程序采用了严格的**全栈架构**：

```
[ 客户端浏览器 (React) ] 
          │
          ▼ (HTTPS 请求)
[ Express API 代理服务器 (端口 3000) ] ◄── [ .env 配置文件 (GEMINI_API_KEY) ]
          │
          ▼ (官方 @google/genai SDK)
[ Google Gemini 模型 (启用了 Google 搜索增强) ]
          │
          ▼ (实时搜索与推理)
[ 生成的研究报告与引用来源 ]
          │
          ▼ (流式传输 / 返回 JSON)
[ Express 服务器 ] ──► [ 客户端 UI 解析器 ] ──► [ 渲染 UI 并下载 PDF ]
```

---

## ⚡ 缓存优化设计

为了确保代码更新（如英文翻译、版面设计）在部署后能够立即呈现给用户，我们在 `server.ts` 中通过自定义中间件绕过了默认的中间缓存：

1. **哈希静态资源 (Hashed Assets)**: 文件名中包含指纹哈希的文件（如 `.js`、`.css`、字体、图片等）会被赋予长期的不可变（immutable）缓存头：
   ```http
   Cache-Control: public, max-age=31536000, immutable
   ```
2. **动态入口与 API**: 主入口文件（`index.html`）和所有 API 请求将完全绕过缓存，防止浏览器渲染旧版本：
   ```http
   Cache-Control: no-cache, no-store, must-revalidate
   ```

---

## 🚀 本地开发与运行

### 前提条件
- **Node.js** (v18+) 或 **Bun**

### 1. 配置环境变量
在根目录下创建一个 `.env` 文件（可参考 `.env.example`）：
```env
# 服务端密钥（AI 生成所必需，绝不能泄露给客户端）
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
通过 Vite 中间件同时运行 React 客户端和 Express 服务端：
```bash
npm run dev
```
在浏览器中打开 `http://localhost:3000` 即可访问应用程序。

### 4. 生产环境打包
将静态资源编译至 `dist/`，并将 `server.ts` 打包合并为单文件 `dist/server.cjs`：
```bash
npm run build
```

### 5. 启动生产环境服务器
直接运行打包编译后的服务端程序：
```bash
npm run start
```

---

## 📋 目录结构

```text
├── .env.example          # 必需的环境变量模板
├── metadata.json         # 应用名称、描述与权限配置
├── server.ts             # Express 服务器入口与 API 路由处理器
├── vite.config.ts        # Vite 客户端与 Tailwind 插件配置
├── package.json          # 依赖列表与 npm 脚本
├── src/
│   ├── main.tsx          # 客户端挂载脚本
│   ├── App.tsx           # 主路由与应用布局
│   ├── index.css         # Tailwind 全局样式导入与变量主题
│   ├── types.ts          # 共享 TypeScript 类型定义
│   └── components/       # UI 页面、视图与共享组件
│       ├── LandingPage.tsx
│       ├── ReportRenderer.tsx
│       ├── ToolDetailPage.tsx
│       └── ... (其他布局与功能组件)
```

---

## 📜 许可

本项目基于 MIT 许可协议分发。详细信息可在工作区配置中查看。
