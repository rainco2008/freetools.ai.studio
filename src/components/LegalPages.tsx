import { Locale } from "../freeToolsCatalog";

interface LegalPagesProps {
  page: "terms" | "privacy";
  locale: Locale;
}

const legalCopy = {
  zh: {
    terms: {
      title: "使用条款",
      updated: "更新日期：2026年7月26日",
      sections: [
        ["服务范围", "freetools.ai.studio 提供免费的开发、图片处理与创意生成工具。大多数工具在浏览器中运行，AI 花束生成器使用云端图片生成服务。工具按“现状”和“可用状态”提供。"],
        ["合理使用", "请勿通过自动化请求、恶意输入或其他方式干扰网站稳定性、攻击其他用户或违反适用法律。"],
        ["结果与责任", "用户应自行核验工具输出，并在用于生产系统、加密、安全或重要文件处理前保留备份。"],
        ["开源许可", "本项目及其衍生组件按照各自开源许可证提供；项目主体采用 GPLv3。"],
      ],
    },
    privacy: {
      title: "隐私政策",
      updated: "更新日期：2026年7月26日",
      sections: [
        ["本地处理", "开发工具和大多数图片工具优先在当前浏览器中处理输入。除非具体工具明确说明，文件和文本不会上传到本站服务器。"],
        ["AI 图片生成", "AI 花束生成器会将你选择的花名发送至本站服务端，再由 Google Gemini API 生成图片。请勿在生成内容中提交个人信息或敏感信息。"],
        ["Google 登录", "Google One Tap 和登录按钮通过 Google Identity Services 与 Firebase Authentication 提供。登录时，Google 和 Firebase 会处理账户标识、姓名、邮箱及头像等基本资料；登录不是使用免费工具的必要条件。"],
        ["分析与同意", "Google Analytics 4 仅在你明确允许匿名分析后启用。分析存储默认拒绝，广告存储、广告用户数据和个性化广告始终关闭。你可以随时通过页脚的 Cookie 设置更改选择。"],
        ["本地存储", "网站使用浏览器本地存储保存语言、隐私选择和必要的登录状态，不用于跨站广告追踪。"],
        ["第三方资源", "Google、Firebase、Gemini 以及部分依赖或外部链接由第三方提供，使用时适用其各自的隐私政策。"],
        ["用户控制", "你可以退出 Google 账户、修改 Cookie 设置，或随时从浏览器设置中清除本站本地数据。"],
      ],
    },
  },
  en: {
    terms: {
      title: "Terms of Use",
      updated: "Updated July 26, 2026",
      sections: [
        ["Service scope", "freetools.ai.studio provides free developer, image-processing, and creative-generation tools. Most tools run in the browser; the AI Bouquet Generator uses a cloud image-generation service. Tools are provided as-is and as available."],
        ["Acceptable use", "Do not use automation, malicious inputs, or other techniques to disrupt the site, attack other users, or violate applicable law."],
        ["Results and liability", "Verify tool output and keep backups before using results in production, security, encryption, or important file workflows."],
        ["Open-source licensing", "This project and its derivative components are provided under their respective open-source licenses. The main project uses GPLv3."],
      ],
    },
    privacy: {
      title: "Privacy Policy",
      updated: "Updated July 26, 2026",
      sections: [
        ["Local processing", "Developer tools and most image tools process inputs in your current browser. Files and text are not uploaded to this site's servers unless a specific tool clearly states otherwise."],
        ["AI image generation", "The AI Bouquet Generator sends the flower names you select to this site's server and then to the Google Gemini API to generate an image. Do not submit personal or sensitive information in generation requests."],
        ["Google sign-in", "Google One Tap and the sign-in button are provided through Google Identity Services and Firebase Authentication. When you sign in, Google and Firebase process basic account details such as your account identifier, name, email address, and profile image. Signing in is not required to use the free tools."],
        ["Analytics and consent", "Google Analytics 4 is enabled only after you explicitly allow anonymous analytics. Analytics storage is denied by default; advertising storage, advertising user data, and ad personalization remain disabled. You can change your choice through Cookie settings in the footer."],
        ["Local storage", "The site uses browser storage for language, privacy choices, and essential authentication state, not cross-site advertising tracking."],
        ["Third-party resources", "Google, Firebase, Gemini, and some dependencies or external links are provided by third parties. Their privacy policies apply when you use those services."],
        ["Your control", "You can sign out of Google, update Cookie settings, or clear this site's local data from your browser settings at any time."],
      ],
    },
  },
};

export default function LegalPages({ page, locale }: LegalPagesProps) {
  const content = legalCopy[locale][page];
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <a href="/" className="text-sm font-semibold text-[#E64833]">← freetools.ai.studio</a>
      <h1 className="mt-6 text-4xl font-black tracking-[-0.03em] text-[#1A1A1A]">{content.title}</h1>
      <p className="mt-2 text-sm text-[#8C8984]">{content.updated}</p>
      <div className="mt-10 space-y-8">
        {content.sections.map(([title, body], index) => (
          <section key={title} className="border-t border-[#D8D3CA] pt-6">
            <h2 className="text-base font-bold text-[#1A1A1A]">{index + 1}. {title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#5C5955]">{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
