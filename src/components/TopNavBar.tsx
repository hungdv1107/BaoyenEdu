export type WorkspaceTab = "studio" | "samples" | "library" | "guide5512";

interface TopNavBarProps {
  activeTab: WorkspaceTab;
  savedCount: number;
  onSelectTab: (tab: WorkspaceTab) => void;
  onNewLesson: () => void;
}

export function TopNavBar({
  activeTab,
  savedCount,
  onSelectTab,
  onNewLesson,
}: TopNavBarProps) {
  const navItems: Array<{ id: WorkspaceTab; label: string }> = [
    { id: "studio", label: "Không gian soạn" },
    { id: "samples", label: "Mẫu SGK thử nghiệm" },
    { id: "library", label: savedCount > 0 ? `Kho bài dạy (${savedCount})` : "Kho bài dạy" },
    { id: "guide5512", label: "Chuẩn CV 5512" },
  ];

  return (
    <header className="no-print sticky top-0 z-30 flex items-center justify-between gap-8 border-b border-slate-200 bg-white/95 px-6 py-3.5 backdrop-blur">
      <a
        href="#studio"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab("studio");
        }}
        className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
      >
        Bảo Yến AI Edu
      </a>

      <nav
        aria-label="Điều hướng chính"
        className="flex items-center gap-6 overflow-x-auto text-sm font-medium text-slate-600"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
                isActive
                  ? "border-teal-700 text-slate-900 font-semibold"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onNewLesson}
          className="rounded-lg bg-teal-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 whitespace-nowrap shrink-0"
        >
          Tạo bài dạy mới
        </button>
      </div>
    </header>
  );
}
