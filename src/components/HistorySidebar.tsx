import { Trash2, FileText, Calendar, Search, Briefcase, ShieldAlert, ChevronLeft } from "lucide-react";
import { SavedReport } from "../types";

interface HistorySidebarProps {
  history: SavedReport[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function HistorySidebar({
  history,
  selectedId,
  onSelect,
  onDelete,
  isOpen,
  setIsOpen,
}: HistorySidebarProps) {
  
  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "competitive":
        return <Briefcase className="h-3 w-3 text-[#1A1A1A]" />;
      case "factcheck":
        return <ShieldAlert className="h-3 w-3 text-[#E64833]" />;
      case "brief":
      default:
        return <FileText className="h-3 w-3 text-[#8C8984]" />;
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "competitive":
        return "Competitor";
      case "factcheck":
        return "Fact Audit";
      case "brief":
      default:
        return "Research Brief";
    }
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1A1A1A]/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        id="history-sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#D1CEC7] bg-[#FCFAF7] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#D1CEC7] px-4 bg-[#F5F2EC]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center border border-[#1A1A1A] bg-[#1A1A1A] text-white font-serif italic font-extrabold text-sm">
              S
            </div>
            <span className="font-serif font-black tracking-tight text-[#1A1A1A] text-base">History Archive</span>
            <span className="border border-[#1A1A1A] bg-white px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#1A1A1A]">
              {history.length}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center border border-transparent text-[#8C8984] hover:text-[#1A1A1A] hover:bg-[#EAE6DF] lg:hidden transition-colors"
            title="Close Sidebar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FCFAF7]">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <Search className="h-7 w-7 text-[#8C8984] mb-3 stroke-[1.5]" />
              <p className="text-xs font-serif italic text-[#8C8984]">No History Found</p>
              <p className="text-[10px] text-[#8C8984] mt-2 leading-relaxed">
                Submit a research topic above to populate this ledger.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const isSelected = item.id === selectedId;
              const dateObj = new Date(item.createdAt);
              const formattedDate = isNaN(dateObj.getTime())
                ? "Unknown Date"
                : `${dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${dateObj.getHours().toString().padStart(2, "0")}:${dateObj.getMinutes().toString().padStart(2, "0")}`;

              return (
                <div
                  key={item.id}
                  id={`history-item-${item.id}`}
                  className={`group relative flex flex-col border p-3 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-[#E64833] bg-[#F2EFE9] shadow-[2px_2px_0px_0px_#E64833]"
                      : "border-[#D1CEC7] bg-white hover:border-[#1A1A1A] hover:bg-[#F2EFE9]"
                  }`}
                  onClick={() => {
                    onSelect(item.id);
                    // Close on mobile
                    if (window.innerWidth < 1024) {
                      setIsOpen(false);
                    }
                  }}
                >
                  {/* Category Badge & Date */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 border border-[#D1CEC7] px-1 py-0.5 text-[9px] font-mono uppercase font-bold text-[#5C5955] bg-white">
                      {getReportTypeIcon(item.reportType)}
                      <span>{getReportTypeLabel(item.reportType)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-mono text-[#8C8984]">
                      <Calendar className="h-2.5 w-2.5" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {/* Query Title */}
                  <h4 className="text-xs font-serif font-bold text-[#1A1A1A] line-clamp-2 pr-4 leading-relaxed">
                    {item.query}
                  </h4>

                  {/* Subtitle / Styled output */}
                  <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-dashed border-[#D1CEC7]">
                    <span className="text-[9px] text-[#8C8984] font-mono uppercase tracking-wider">
                      Style: {item.languageStyle === "academic" ? "ACADEMIC" : item.languageStyle === "simple" ? "SIMPLE" : "OBJECTIVE"}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    id={`delete-btn-${item.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Are you sure you want to permanently remove this report from your history?")) {
                        onDelete(item.id);
                      }
                    }}
                    className="absolute top-2.5 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 flex h-6 w-6 items-center justify-center border border-[#D1CEC7] bg-white text-[#8C8984] hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-200"
                    title="Delete record"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-[#D1CEC7] p-3 bg-[#F5F2EC] text-center">
          <p className="text-[10px] font-mono tracking-widest text-[#8C8984] uppercase">
            ARCHIVE SIZE: {localStorage.getItem("research_history") ? `${(JSON.stringify(history).length / 1024).toFixed(1)} KB` : "0 KB"}
          </p>
        </div>
      </div>
    </>
  );
}
