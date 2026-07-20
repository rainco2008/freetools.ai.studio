import { useState, useEffect } from "react";
import { Loader2, Search, Database, Scale, Clock, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface LoadingOverlayProps {
  isLoading: boolean;
  query: string;
}

const STEPS = [
  { text: "Submitting retrieval instructions to Google Search...", icon: Search },
  { text: "Fetching live web pages and filtering outbound SEO noise...", icon: Database },
  { text: "Evaluating source credibility indexes and publication dates...", icon: Clock },
  { text: "Identifying conflicts and analyzing source cross-references...", icon: Scale },
  { text: "Dissecting content: separating facts, opinions, and speculations...", icon: Scale },
  { text: "Tailoring report formatting and linguistic narrative styles...", icon: CheckCircle },
  { text: "Executing final fact-auditing and typography layouts, please standby...", icon: Loader2 },
];

export default function LoadingOverlay({ isLoading, query }: LoadingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 4500);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1A1A1A]/95 backdrop-blur-sm px-6 text-center">
      <div className="w-full max-w-lg">
        {/* Animated Minimal Loader */}
        <div className="relative mb-6 flex justify-center">
          <div className="absolute inset-0 m-auto h-20 w-20 animate-ping rounded-none border border-[#E64833]/20" />
          <div className="relative flex h-14 w-14 items-center justify-center border border-[#E64833] bg-black text-[#E64833] shadow-lg">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-xl font-serif font-bold tracking-tight text-[#FCFAF7] sm:text-2xl italic">
          DEEP COGNITIVE RESEARCH SYNTHESIS IN PROGRESS
        </h3>
        <p className="mb-8 text-[11px] text-[#8C8984] font-mono uppercase tracking-wider max-w-md mx-auto truncate">
          QUERY: &ldquo;{query}&rdquo;
        </p>

        {/* Status Stepper */}
        <div className="border border-[#333333] bg-[#222222] p-6 shadow-2xl rounded-none">
          <div className="space-y-4 text-left">
            {STEPS.map((step, idx) => {
              const isCurrent = idx === currentStep;
              const isPast = idx < currentStep;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    isCurrent
                      ? "text-[#E64833] font-bold"
                      : isPast
                      ? "text-[#5C5955] line-through font-serif italic"
                      : "text-[#8C8984]"
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center border text-[9px] font-mono transition-colors duration-500 rounded-none ${
                      isCurrent
                        ? "border-[#E64833] bg-[#E64833] text-white"
                        : isPast
                        ? "border-[#444444] bg-[#222222] text-[#5C5955]"
                        : "border-[#333333] bg-black text-[#8C8984]"
                    }`}
                  >
                    {isPast ? "✓" : idx + 1}
                  </div>
                  <span className="text-xs truncate sm:text-sm">{step.text}</span>
                  {isCurrent && (
                    <motion.span
                      layoutId="loading-indicator"
                      className="ml-auto flex h-1.5 w-1.5 bg-[#E64833]"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Encouraging Quote */}
        <p className="mt-8 text-xs text-[#8C8984] italic font-serif max-w-sm mx-auto leading-relaxed">
          &ldquo;Truth is not born of thin air; only through the rigorous cross-examination of multi-lateral sources and raw evidence can we unveil reality.&rdquo;
        </p>
      </div>
    </div>
  );
}
