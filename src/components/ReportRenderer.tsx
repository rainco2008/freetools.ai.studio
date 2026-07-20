import { useState, useRef } from "react";
import { 
  AlertTriangle, ExternalLink, Calendar, Shield, ShieldCheck, ShieldAlert, 
  Clock, Download, Printer, MessageSquare, ChevronRight, CheckCircle2,
  AlertCircle, HelpCircle, ArrowUpRight, Copy, Check
} from "lucide-react";
import { ResearchReport, GroundingSource } from "../types";

interface ReportRendererProps {
  report: ResearchReport;
  groundingSources: GroundingSource[];
  query: string;
}

export default function ReportRenderer({ report, groundingSources, query }: ReportRendererProps) {
  const [highlightedSource, setHighlightedSource] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const sourceRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const handleCitationClick = (index: number) => {
    setHighlightedSource(index);
    const element = sourceRefs.current[index];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("ring-4", "ring-emerald-500/30", "bg-emerald-50/50");
      setTimeout(() => {
        element.classList.remove("ring-4", "ring-emerald-500/30", "bg-emerald-50/50");
      }, 3000);
    }
  };

  const getCredibilityStyles = (score: string) => {
    switch (score) {
      case "High":
        return {
          bg: "bg-white text-[#22C55E] border-[#22C55E] font-mono",
          icon: <ShieldCheck className="h-3 w-3 text-[#22C55E]" />,
          label: "TRUST: HIGH",
        };
      case "Medium":
        return {
          bg: "bg-white text-[#EAB308] border-[#EAB308] font-mono",
          icon: <Shield className="h-3 w-3 text-[#EAB308]" />,
          label: "TRUST: MED",
        };
      case "Low":
      default:
        return {
          bg: "bg-white text-[#EF4444] border-[#EF4444] font-mono",
          icon: <ShieldAlert className="h-3 w-3 text-[#EF4444]" />,
          label: "TRUST: LOW",
        };
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    // Generate simple clean markdown representation of the report
    let md = `# ${report.title}\n\n`;
    md += `## Research Query\n> ${query}\n\n`;
    md += `## Executive Summary\n${report.summary}\n\n`;
    if (report.isTimeSensitive) {
      md += `⚠️ **Time-Sensitivity Alert**: ${report.timeSensitiveReason}\n\n`;
    }
    md += `## Key Findings\n`;
    report.conclusions.forEach((c) => {
      md += `- ${c.text} [Source: ${c.citations.map(idx => idx + 1).join(", ")}]\n`;
    });
    md += `\n## Facts, Opinions & Speculations Analysis\n`;
    report.factOpinionAnalysis.forEach((fo) => {
      md += `### [${fo.type === 'Fact' ? 'Fact' : fo.type === 'Opinion' ? 'Opinion' : 'Speculation'}] ${fo.statement}\n`;
      md += `- **Rationale**: ${fo.rationale}\n`;
      md += `- **Source**: ${fo.citations.map(idx => idx + 1).join(", ")}\n\n`;
    });
    if (report.timeline && report.timeline.length > 0) {
      md += `## Chronological Timeline\n`;
      report.timeline.forEach((t) => {
        md += `- **${t.date}**: ${t.event} - ${t.description} [Source: ${t.citations.map(idx => idx + 1).join(", ")}]\n`;
      });
      md += `\n`;
    }
    if (report.conflictAnalysis && report.conflictAnalysis.length > 0) {
      md += `## Controversy Analysis\n`;
      report.conflictAnalysis.forEach((conf) => {
        md += `### ${conf.topic}\n`;
        md += `*Disagreement description*: ${conf.description}\n`;
        conf.contradictoryViews.forEach((v) => {
          md += `- **${v.sourceName}**: ${v.view} [Source: ${v.citations.map(idx => idx + 1).join(", ")}]\n`;
        });
        md += `\n`;
      });
    }
    md += `## References & Source Veracity\n`;
    report.sources.forEach((s) => {
      md += `### [${s.chunkIndex + 1}] ${s.title}\n`;
      md += `- **URL**: ${s.url}\n`;
      md += `- **Publish Date**: ${s.publishDate}\n`;
      md += `- **Credibility**: ${s.credibilityScore} (${s.credibilityRationale})\n`;
      md += `- **Quote Snippet**: _"${s.snippet}"_\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHTML = () => {
    // Generate a standalone HTML document
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${report.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 40px auto; padding: 0 20px; }
    h1 { border-bottom: 2px solid #e64833; padding-bottom: 10px; color: #0f172a; }
    h2 { color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; }
    h3 { color: #334155; }
    .alert { background-color: #fef3c7; border-left: 4px solid #d97706; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
    .summary { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 35px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .badge-fact { background-color: #d1fae5; color: #065f46; }
    .badge-opinion { background-color: #dbeafe; color: #1e40af; }
    .badge-speculation { background-color: #fef3c7; color: #92400e; }
    .badge-high { background-color: #d1fae5; color: #065f46; border: 1px solid #10b981; }
    .badge-medium { background-color: #fef3c7; color: #92400e; border: 1px solid #f59e0b; }
    .badge-low { background-color: #fee2e2; color: #991b1b; border: 1px solid #ef4444; }
    .source-box { border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 15px; background: #fff; }
    .timeline-item { padding-left: 20px; border-left: 2px solid #cbd5e1; position: relative; margin-bottom: 20px; }
    .timeline-item::before { content: ""; width: 10px; height: 10px; background: #e64833; border-radius: 50%; position: absolute; left: -6px; top: 6px; }
    .quote { font-style: italic; color: #64748b; background: #f8fafc; padding: 10px; border-left: 3px solid #cbd5e1; margin-top: 5px; }
    .citation-link { color: #e64833; text-decoration: none; font-weight: bold; font-family: monospace; }
  </style>
</head>
<body>
  <h1>${report.title}</h1>
  <p><strong>Search Query:</strong> ${query}</p>
  <p><strong>Generated At:</strong> ${new Date().toLocaleString("en-US")}</p>

  ${report.isTimeSensitive ? `
  <div class="alert">
    <strong>⚠️ Time-Sensitivity Alert:</strong> ${report.timeSensitiveReason}
  </div>` : ""}

  <div class="summary">
    <h2>Executive Summary</h2>
    <p>${report.summary}</p>
  </div>

  <h2>I. Key Findings</h2>
  <ul>
    ${report.conclusions.map(c => `
      <li>${c.text} <sup><a class="citation-link" href="#source-${c.citations[0]}">[${c.citations.map(x=>x+1).join(",")}]</a></sup></li>
    `).join("")}
  </ul>

  <h2>II. Truth Claim Analysis</h2>
  ${report.factOpinionAnalysis.map(fo => `
    <div>
      <h3>
        <span class="badge ${fo.type === 'Fact' ? 'badge-fact' : fo.type === 'Opinion' ? 'badge-opinion' : 'badge-speculation'}">
          ${fo.type === 'Fact' ? 'FACT' : fo.type === 'Opinion' ? 'OPINION' : 'SPECULATION'}
        </span>
        ${fo.statement}
      </h3>
      <p><strong>Rationale:</strong> ${fo.rationale}</p>
      <p><strong>Source Citations:</strong> ${fo.citations.map(idx => `<a class="citation-link" href="#source-${idx}">[${idx+1}]</a>`).join(" ")}</p>
    </div>
  `).join("")}

  ${report.timeline && report.timeline.length > 0 ? `
  <h2>III. Chronological Timeline</h2>
  <div>
    ${report.timeline.map(t => `
      <div class="timeline-item">
        <strong>${t.date}</strong> - <strong>${t.event}</strong>
        <p>${t.description}</p>
        <p><small>Evidence: ${t.citations.map(idx => `<a class="citation-link" href="#source-${idx}">[${idx+1}]</a>`).join(" ")}</small></p>
      </div>
    `).join("")}
  </div>` : ""}

  ${report.conflictAnalysis && report.conflictAnalysis.length > 0 ? `
  <h2>IV. Controversy Analysis</h2>
  ${report.conflictAnalysis.map(conf => `
    <div style="border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <h3>🎯 Topic: ${conf.topic}</h3>
      <p><strong>Core Controversy Description:</strong> ${conf.description}</p>
      <div style="margin-top: 10px; padding-left: 15px; border-left: 3px solid #e64833;">
        ${conf.contradictoryViews.map(v => `
          <p><strong>${v.sourceName}:</strong> ${v.view} <sup><a class="citation-link" href="#source-${v.citations[0]}">[${v.citations.map(x=>x+1).join(",")}]</a></sup></p>
        `).join("")}
      </div>
    </div>
  `).join("")}
  ` : ""}

  <h2>V. References & Source Veracity</h2>
  <div>
    ${report.sources.map(s => `
      <div id="source-${s.chunkIndex}" class="source-box">
        <h3>[${s.chunkIndex + 1}] ${s.title}</h3>
        <p><strong>URL:</strong> <a href="${s.url}" target="_blank">${s.url}</a></p>
        <p><strong>Publish Date:</strong> ${s.publishDate} | 
           <strong>Credibility:</strong> 
           <span class="badge ${s.credibilityScore === 'High' ? 'badge-high' : s.credibilityScore === 'Medium' ? 'badge-medium' : 'badge-low'}">
             ${s.credibilityScore === 'High' ? 'HIGH' : s.credibilityScore === 'Medium' ? 'MEDIUM' : 'LOW'}
           </span>
        </p>
        <p><strong>Rationale:</strong> ${s.credibilityRationale}</p>
        <div class="quote">
          "${s.snippet}"
        </div>
      </div>
    `).join("")}
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.title.replace(/\s+/g, "_")}_Research_Report.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="report-view-container" className="space-y-8 print:p-0 print:shadow-none">
      
      {/* Print-only CSS injection to style printing perfectly */}
      <style>{`
        @media print {
          body {
            color: #1a1a1a !important;
            background: #FCFAF7 !important;
          }
          header, nav, #history-sidebar, #search-form-section, .no-print {
            display: none !important;
          }
          #report-view-container {
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Header Controls */}
      <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#D1CEC7] pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C8984] block mb-1">
            RESEARCH DOSSIER
          </span>
          <h2 className="text-2xl font-serif italic font-black text-[#1A1A1A] tracking-tight">
            Dossier Synthesis & Fact Engine
          </h2>
        </div>
        
        {/* Export / Copy Panel */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopyMarkdown}
            className="px-4 py-2 border border-[#1A1A1A] text-[10px] uppercase font-bold tracking-widest hover:bg-[#1A1A1A] hover:text-[#FCFAF7] transition-colors bg-white font-mono"
            title="Copy as raw Markdown formatted text"
          >
            {copied ? "COPIED MD!" : "COPY MARKDOWN"}
          </button>

          <button
            onClick={handleDownloadHTML}
            className="px-4 py-2 border border-[#1A1A1A] text-[10px] uppercase font-bold tracking-widest hover:bg-[#1A1A1A] hover:text-[#FCFAF7] transition-colors bg-white font-mono"
            title="Download standalone offline HTML file"
          >
            DOWNLOAD HTML
          </button>

          <button
            id="print-pdf-btn"
            onClick={handlePrint}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white text-[10px] uppercase font-bold tracking-widest font-mono"
            title="Print or export as standardized PDF format"
          >
            PRINT / EXPORT PDF
          </button>
        </div>
      </div>

      {/* Main Report Visual Frame */}
      <div className="border border-[#D1CEC7] bg-[#FCFAF7] p-6 md:p-10 print:border-none print:p-0">
        
        {/* Report Main Header */}
        <div className="border-b border-[#D1CEC7] pb-6 mb-8 text-left">
          <div className="inline-block px-2.5 py-0.5 bg-[#E64833] text-[#FCFAF7] text-[10px] font-bold uppercase tracking-widest mb-4 font-mono">
            RESEARCH BRIEF: INTEGRATED SYNTHESIS
          </div>
          
          <h1 className="text-3xl md:text-5xl font-serif font-black text-[#1A1A1A] tracking-tight leading-[1.15] mb-4">
            {report.title || "In-Depth Research Brief"}
          </h1>
          
          <div className="mt-6 flex flex-wrap items-center gap-4 text-[10px] text-[#8C8984] font-mono uppercase tracking-wider">
            <div>
              <span className="opacity-60">QUERY:</span>{" "}
              <span className="font-bold text-[#1A1A1A] break-all max-w-md inline-block">{query}</span>
            </div>
            <div className="hidden sm:block text-[#D1CEC7]">•</div>
            <div>
              <span className="opacity-60">DATE:</span>{" "}
              <span className="font-bold text-[#1A1A1A]">{new Date().toLocaleDateString("en-US")}</span>
            </div>
            <div className="hidden sm:block text-[#D1CEC7]">•</div>
            <div className="flex items-center gap-1">
              <span className="opacity-60">CRAWLER:</span>{" "}
              <span className="text-[#E64833] font-bold">
                GOOGLE GROUNDING
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Time Sensitivity Notice */}
        {report.isTimeSensitive && (
          <div id="time-sensitivity-banner" className="mb-8 border border-[#E64833] bg-[#FCFAF7] p-5 flex items-start gap-4">
            <AlertTriangle className="h-5 w-5 text-[#E64833] shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#E64833] flex items-center gap-1.5 font-mono">
                REAL-TIME UPDATE ALERT / TEMPORAL SENSITIVITY
              </h4>
              <p className="text-xs text-[#1A1A1A] leading-relaxed font-serif italic">
                {report.timeSensitiveReason || "This research brief contains highly time-sensitive topics. Rapid developments in technology, financial markets, or geopolitical events may alter specifications, version configurations, or metrics post-generation. Please cross-reference original URL citations directly before final decision-making."}
              </p>
            </div>
          </div>
        )}

        {/* Executive Summary Block */}
        <div className="mb-10 border border-[#D1CEC7] p-6 bg-white">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8C8984] mb-3 font-mono">
            EXECUTIVE SUMMARY
          </h3>
          <p className="text-sm font-serif text-[#3D3A36] leading-relaxed text-justify">
            {report.summary}
          </p>
        </div>

        {/* Section 1: Key Conclusions */}
        <div className="mb-12">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8C8984] mb-5 border-b border-[#D1CEC7] pb-2 font-mono">
            01. KEY FINDINGS / SYNTHESISED CONCLUSIONS
          </h3>
          
          <div className="space-y-4">
            {report.conclusions.map((con, index) => (
              <div 
                key={con.id || index}
                className="flex items-start gap-3 border-b border-dashed border-[#D1CEC7] pb-4 last:border-b-0 last:pb-0"
              >
                <span className="text-[#E64833] font-serif italic text-lg leading-none shrink-0 w-8">
                  {(index + 1).toString().padStart(2, "0")}.
                </span>
                <div className="flex-1">
                  <p className="text-xs text-[#1A1A1A] leading-relaxed text-justify">
                    {con.text}
                    {/* Inline citation links */}
                    {con.citations && con.citations.map((citeIdx) => (
                      <button
                        key={citeIdx}
                        onClick={() => handleCitationClick(citeIdx)}
                        className="ml-1 px-1 bg-[#F2EFE9] border border-[#D1CEC7] text-[9px] font-bold text-[#E64833] font-mono hover:bg-[#1A1A1A] hover:text-[#FCFAF7] transition-colors"
                        title={`View Source: [${citeIdx + 1}]`}
                      >
                        [{citeIdx + 1}]
                      </button>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Fact, Opinion and Speculation Assessment */}
        <div className="mb-12">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8C8984] mb-5 border-b border-[#D1CEC7] pb-2 font-mono">
            02. TRUTH CLAIM CLASSIFICATION / FACTUAL VERACITY
          </h3>

          <p className="text-xs font-serif italic text-[#8C8984] mb-5">
            To isolate speculative claims and maintain strict objectivity, this module classifies key public claims into established facts, subjective opinions, and forward-looking speculations.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {report.factOpinionAnalysis.map((item, idx) => {
              const isFact = item.type === "Fact";
              const isOpinion = item.type === "Opinion";

              let badgeStyle = "border-[#E64833] text-[#E64833]";
              let badgeText = "SPECULATION";
              if (isFact) {
                badgeStyle = "border-[#1A1A1A] text-white bg-[#1A1A1A]";
                badgeText = "FACT";
              } else if (isOpinion) {
                badgeStyle = "border-[#1A1A1A] text-[#1A1A1A] bg-[#F2EFE9]";
                badgeText = "OPINION";
              }

              return (
                <div 
                  key={idx}
                  className="flex flex-col border border-[#D1CEC7] p-5 bg-white transition-all duration-200"
                >
                  <div className="mb-3">
                    <span className={`inline-block border px-1.5 py-0.5 text-[9px] font-bold tracking-wider font-mono uppercase ${badgeStyle}`}>
                      {badgeText}
                    </span>
                  </div>

                  <h4 className="text-xs font-serif italic font-bold text-[#1A1A1A] leading-relaxed mb-4 flex-1">
                    &ldquo;{item.statement}&rdquo;
                  </h4>

                  <div className="border-t border-[#D1CEC7] pt-3 mt-3">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C8984] block mb-1 font-mono">EVIDENCE RATIONALE</span>
                    <p className="text-xs text-[#5C5955] leading-relaxed">
                      {item.rationale}
                    </p>
                  </div>

                  {item.citations && item.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#D1CEC7] flex items-center justify-between">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C8984]">SOURCE EVIDENCE</span>
                      <div className="flex gap-1">
                        {item.citations.map((citeIdx) => (
                          <button
                            key={citeIdx}
                            onClick={() => handleCitationClick(citeIdx)}
                            className="inline-flex h-4 px-1.5 items-center justify-center border border-[#D1CEC7] bg-[#FCFAF7] text-[9px] font-mono font-bold text-[#1A1A1A] hover:bg-[#E64833] hover:text-white hover:border-[#E64833] transition-colors"
                          >
                            {citeIdx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Timeline */}
        {report.timeline && report.timeline.length > 0 && (
          <div className="mb-12">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8C8984] mb-6 border-b border-[#D1CEC7] pb-2 font-mono">
              03. CHRONOLOGICAL TIMELINE / HISTORICAL EVOLUTION
            </h3>

            <div className="relative border-l border-[#D1CEC7] pl-6 ml-2 space-y-6">
              {report.timeline.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-[28.5px] top-1.5 h-1.5 w-1.5 bg-[#E64833] border border-[#E64833]" />

                  {/* Timeline details */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-[11px] font-bold text-[#E64833] font-mono">
                        [{item.date}]
                      </span>
                      <h4 className="text-xs font-serif font-black text-[#1A1A1A]">
                        {item.event}
                      </h4>
                    </div>
                    <p className="text-xs text-[#5C5955] leading-relaxed text-justify max-w-3xl">
                      {item.description}
                    </p>
                    
                    {item.citations && item.citations.length > 0 && (
                      <div className="flex gap-1.5 items-center mt-1">
                        <span className="text-[9px] font-mono uppercase text-[#8C8984]">CITED:</span>
                        {item.citations.map((citeIdx) => (
                          <button
                            key={citeIdx}
                            onClick={() => handleCitationClick(citeIdx)}
                            className="inline-flex h-3.5 px-1 items-center justify-center border border-[#D1CEC7] bg-white text-[9px] font-bold text-[#1A1A1A] font-mono hover:bg-[#E64833] hover:text-white hover:border-[#E64833] transition-colors"
                          >
                            [{citeIdx + 1}]
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Controversy Analysis */}
        {report.conflictAnalysis && report.conflictAnalysis.length > 0 && (
          <div className="mb-12">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8C8984] mb-5 border-b border-[#D1CEC7] pb-2 font-mono">
              04. CONTROVERSY COMPARISON / DIVERGENT VIEWPOINTS
            </h3>

            <p className="text-xs font-serif italic text-[#8C8984] mb-5">
              Consolidated major disagreements between prominent scientific publications or institutions, identifying blind spots in singular narrative channels.
            </p>

            <div className="space-y-6">
              {report.conflictAnalysis.map((conf, index) => (
                <div 
                  key={index}
                  className="border border-[#D1CEC7] bg-[#F2EFE9] p-5 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-1 py-0.5 bg-[#E64833] text-white text-[9px] font-mono font-bold tracking-wider">
                      CONTROVERSY
                    </span>
                    <h4 className="text-xs font-serif font-bold text-[#1A1A1A]">
                      Controversy: {conf.topic}
                    </h4>
                  </div>

                  <p className="text-xs font-serif text-[#1A1A1A] bg-white border border-[#D1CEC7] p-3 leading-relaxed">
                    <strong className="text-[#E64833] font-bold font-mono text-[10px] uppercase tracking-wider block mb-1">Description</strong>
                    {conf.description}
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {conf.contradictoryViews.map((viewItem, viewIdx) => (
                      <div 
                        key={viewIdx}
                        className="border border-[#D1CEC7] bg-white p-4 space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[9px] font-mono font-bold text-[#8C8984] uppercase tracking-wider block">
                            {viewItem.sourceName || "PERSPECTIVE"}
                          </span>
                          <p className="text-xs font-serif italic text-[#3D3A36] leading-relaxed mt-1">
                            &ldquo;{viewItem.view}&rdquo;
                          </p>
                        </div>

                        {viewItem.citations && viewItem.citations.length > 0 && (
                          <div className="text-right mt-3 pt-2 border-t border-[#D1CEC7] border-dashed">
                            <span className="text-[9px] font-mono text-[#8C8984] uppercase mr-2">EVIDENCE:</span>
                            {viewItem.citations.map((citeIdx) => (
                              <button
                                key={citeIdx}
                                onClick={() => handleCitationClick(citeIdx)}
                                className="inline-flex h-4 px-1.5 items-center justify-center border border-[#D1CEC7] bg-[#FCFAF7] text-[9px] font-bold text-[#1A1A1A] font-mono hover:bg-[#E64833] hover:text-white hover:border-[#E64833] transition-colors"
                              >
                                [{citeIdx + 1}]
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Sources Analysis Table */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8C8984] mb-5 border-b border-[#D1CEC7] pb-2 font-mono">
            05. SOURCE VERACITY INDEX / RECONSTRUCTED CITATIONS
          </h3>

          <p className="text-xs font-serif italic text-[#8C8984] mb-6">
            The following table logs all retrieved web materials. Individual findings above correspond directly to the index markers below.
          </p>

          <div className="space-y-6">
            {report.sources && report.sources.map((src) => {
              const credibility = getCredibilityStyles(src.credibilityScore);
              
              return (
                <div
                  key={src.chunkIndex}
                  ref={(el) => { sourceRefs.current[src.chunkIndex] = el; }}
                  id={`source-card-${src.chunkIndex}`}
                  className="border border-[#D1CEC7] bg-white p-5 transition-all duration-500 flex flex-col justify-between"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D1CEC7] pb-3 mb-4">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-[#1A1A1A] text-white font-serif italic text-xs font-semibold">
                        {src.chunkIndex + 1}
                      </span>
                      <h4 className="text-xs font-serif font-bold text-[#1A1A1A] truncate pr-4">
                        {src.title || "Untitled Web Resource"}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Publish Date Badge */}
                      <span className="inline-flex items-center gap-1 border border-[#D1CEC7] bg-[#FCFAF7] px-1.5 py-0.5 text-[9px] font-mono text-[#5C5955]">
                        <Calendar className="h-2.5 w-2.5" />
                        {src.publishDate || "RECENT"}
                      </span>

                      {/* Credibility Badge */}
                      <span className={`inline-flex items-center gap-1 border px-1.5 py-0.5 text-[9px] font-bold ${credibility.bg}`}>
                        {credibility.label}
                      </span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="space-y-3 mb-4">
                    <p className="text-xs text-[#5C5955] leading-relaxed">
                      <strong className="text-[#1A1A1A] font-bold uppercase tracking-wider text-[9px] font-mono block mb-1">CREDIBILITY AUDIT RATIONALE</strong>
                      {src.credibilityRationale || "Retrieved and vetted via multi-source consensus, showing robust consistency with primary industry registers."}
                    </p>

                    {/* Excerpt Snippet */}
                    <div className="border-l-2 border-[#D1CEC7] bg-[#F5F2EC] p-3 italic">
                      <p className="text-xs font-serif text-[#3D3A36] leading-relaxed text-justify">
                        &ldquo;{src.snippet || "No exact quote snapshot returned, but the associated web address hosts key corroborating claims."}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* URL Link */}
                  <div className="text-right">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer referrer"
                      className="inline-flex items-center gap-1 border border-[#1A1A1A] px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase bg-[#FCFAF7] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
                    >
                      <span>VIEW SOURCE CLIP</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
