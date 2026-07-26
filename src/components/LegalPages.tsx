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
        ["服务范围", "freetools.ai.studio 提供可在浏览器中直接使用的免费开发与图片处理工具。工具按“现状”和“可用状态”提供。"],
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
        ["本地存储", "网站仅使用浏览器本地存储保存语言和界面偏好，不用于跨站广告追踪。"],
        ["第三方资源", "部分字体、依赖或外部链接可能由第三方提供。访问第三方网站时适用其各自的隐私政策。"],
        ["用户控制", "关闭页面即可结束当前处理会话；你也可以随时从浏览器设置中清除本站本地数据。"],
      ],
    },
  },
  en: {
    terms: {
      title: "Terms of Use",
      updated: "Updated July 26, 2026",
      sections: [
        ["Service scope", "freetools.ai.studio provides free developer and image utilities that run directly in the browser. Tools are provided as-is and as available."],
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
        ["Local storage", "The site uses browser storage only for language and interface preferences, not cross-site advertising tracking."],
        ["Third-party resources", "Some fonts, dependencies, or external links may be provided by third parties. Their privacy policies apply when you visit those services."],
        ["Your control", "Closing the page ends the current processing session. You can clear this site's local data from your browser settings at any time."],
      ],
    },
  },
};

export default function LegalPages({ page, locale }: LegalPagesProps) {
  const content = legalCopy[locale][page];
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <a href="#/" className="text-sm font-semibold text-[#E64833]">← freetools.ai.studio</a>
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
