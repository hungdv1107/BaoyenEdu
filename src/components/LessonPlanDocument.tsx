import { useState } from "react";
import {
  Download,
  Copy,
  Check,
  Printer,
  BookmarkPlus,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  Columns2,
  ListOrdered,
} from "lucide-react";
import type {
  HookIdea,
  LessonInputParams,
  PedagogicalAnalysisResult,
} from "../types/lessonPlan";

type SectionFilter = "all" | "skill1" | "skill2";
type ActivityLayoutMode = "two_column" | "sequential";

interface LessonPlanDocumentProps {
  result: PedagogicalAnalysisResult | null;
  params: LessonInputParams;
  isAnalyzing: boolean;
  analysisStageText: string;
  isRegeneratingHook: boolean;
  onUpdateResult: (next: PedagogicalAnalysisResult) => void;
  onRegenerateHook: () => void;
  onSaveToLibrary: () => void;
  onExportDocx: (mode: "full" | "5512_only") => void;
  onCopyMarkdown: () => void;
  onLoadExemplarInstant: () => void;
  onOpenSamplesTab: () => void;
}

export function LessonPlanDocument({
  result,
  params,
  isAnalyzing,
  analysisStageText,
  isRegeneratingHook,
  onUpdateResult,
  onRegenerateHook,
  onSaveToLibrary,
  onExportDocx,
  onCopyMarkdown,
  onLoadExemplarInstant,
  onOpenSamplesTab,
}: LessonPlanDocumentProps) {
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [activityLayout, setActivityLayout] = useState<ActivityLayoutMode>("two_column");
  const [showInventory, setShowInventory] = useState(false);
  const [copiedFlag, setCopiedFlag] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);

  const handleCopyClick = () => {
    onCopyMarkdown();
    setCopiedFlag(true);
    setTimeout(() => setCopiedFlag(false), 2000);
  };

  const handleAdjustActivityMinutes = (activityIndex: number, delta: number) => {
    if (!result) return;
    const nextActivities = result.skill2.activities.map((act, idx) => {
      if (idx !== activityIndex) return act;
      return {
        ...act,
        durationMinutes: Math.max(2, act.durationMinutes + delta),
      };
    });
    onUpdateResult({
      ...result,
      skill2: {
        ...result.skill2,
        activities: nextActivities,
      },
    });
  };

  if (isAnalyzing) {
    return (
      <section
        aria-busy="true"
        className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-8"
      >
        <div className="border-b border-slate-200 pb-6 space-y-3">
          <p className="text-xs font-medium text-teal-700">{analysisStageText}</p>
          <div className="h-7 w-3/4 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-slate-100 animate-pulse" />
        </div>

        <div className="space-y-4">
          <div className="h-5 w-64 rounded bg-slate-200 animate-pulse" />
          <div className="space-y-2.5">
            <div className="h-12 w-full rounded bg-slate-100 animate-pulse" />
            <div className="h-12 w-full rounded bg-slate-100 animate-pulse" />
            <div className="h-12 w-full rounded bg-slate-100 animate-pulse" />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 space-y-4">
          <div className="h-5 w-72 rounded bg-slate-200 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-28 rounded bg-slate-100 animate-pulse" />
            <div className="h-28 rounded bg-slate-100 animate-pulse" />
          </div>
          <div className="h-48 w-full rounded bg-slate-100 animate-pulse" />
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white p-6 sm:p-10 flex flex-col justify-between space-y-8">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-medium text-teal-800">
            Hệ sinh thái Bảo Yến AI Edu · Chương trình GDPT 2018 & Công văn 5512
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Từ ảnh chụp trang Sách giáo khoa đến Kế hoạch bài dạy chuẩn chuyên môn
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Tải lên ảnh chụp trang sách giáo khoa bên khung trái kèm thông tin Môn, Lớp và Thời lượng. Hệ thống sẽ quét toàn bộ đơn vị kiến thức, hình vẽ, câu hỏi và bài tập trên trang sách để xuất bản đồng thời 2 phần chuyên sâu:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-y border-slate-200 py-6">
          <div className="space-y-2.5">
            <h2 className="font-display text-base font-semibold text-slate-900">
              01. Phân tích SGK & Ý tưởng kịch bản (Skill 1)
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 leading-relaxed">
              <li>• Trích xuất đầy đủ khái niệm, định lý, sự kiện, hình vẽ và kỹ năng theo đúng vị trí trang sách.</li>
              <li>• Nhận diện điểm nghẽn nhận thức — dự đoán chỗ học sinh dễ hiểu nhầm và đề xuất cách tháo gỡ.</li>
              <li>• Thiết kế ý tưởng trục xuyên suốt (Hook) gây tò mò trong 3 phút đầu tiết kèm lời dẫn mở bài.</li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h2 className="font-display text-base font-semibold text-slate-900">
              02. Kế hoạch bài dạy chuẩn Công văn 5512 (Skill 2)
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 leading-relaxed">
              <li>• Mục tiêu bài học bám sát Yêu cầu cần đạt CT GDPT 2018 (Kiến thức, Năng lực chung & đặc thù, Phẩm chất).</li>
              <li>• Tiến trình 4 hoạt động (Mở đầu, Hình thành kiến thức, Luyện tập, Vận dụng) khớp chính xác tổng số phút.</li>
              <li>• Đủ 4 mục con (Mục tiêu, Nội dung, Sản phẩm, Tổ chức thực hiện 4 bước) và xuất trực tiếp tệp Word (.docx).</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onLoadExemplarInstant}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 whitespace-nowrap shrink-0"
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span>Xem ngay Hồ sơ mẫu (Toán 8 — Định lí Pythagore)</span>
          </button>
          <button
            type="button"
            onClick={onOpenSamplesTab}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            <span>Thử nghiệm với trang SGK mẫu</span>
          </button>
        </div>
      </section>
    );
  }

  const totalAllocatedMinutes = result.skill2.activities.reduce(
    (sum, act) => sum + (Number(act.durationMinutes) || 0),
    0
  );
  const isDurationMatched = totalAllocatedMinutes === params.totalMinutes;

  return (
    <section className="flex-1 min-w-0 space-y-4">
      {/* Workspace Action & Filter Toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div
          role="tablist"
          aria-label="Chọn phần hiển thị"
          className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 overflow-x-auto"
        >
          {(
            [
              { id: "all", label: "Toàn bộ (Skill 1 + 2)" },
              { id: "skill1", label: "Phần 1: Phân tích SGK" },
              { id: "skill2", label: "Phần 2: KHBD 5512" },
            ] as const
          ).map((tab) => {
            const active = sectionFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSectionFilter(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSaveToLibrary}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            <BookmarkPlus className="h-3.5 w-3.5 shrink-0" />
            <span>Lưu vào kho</span>
          </button>

          <button
            type="button"
            onClick={handleCopyClick}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            {copiedFlag ? (
              <>
                <Check className="h-3.5 w-3.5 text-teal-700 shrink-0" />
                <span className="text-teal-800 font-semibold">Đã sao chép</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 shrink-0" />
                <span>Sao chép</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="h-3.5 w-3.5 shrink-0" />
            <span>In / PDF</span>
          </button>

          <button
            type="button"
            onClick={() => onExportDocx("5512_only")}
            title="Xuất riêng Phần 2: Kế hoạch bài dạy chuẩn Công văn 5512 để nộp tổ chuyên môn"
            className="inline-flex items-center gap-1.5 rounded-lg border border-teal-700 bg-white px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="h-3.5 w-3.5 shrink-0" />
            <span>Word 5512 (.docx)</span>
          </button>

          <button
            type="button"
            onClick={() => onExportDocx("full")}
            title="Xuất đầy đủ cả Phần 1 (Phân tích SGK) và Phần 2 (KHBD 5512)"
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="h-3.5 w-3.5 shrink-0" />
            <span>Xuất trọn bộ (.docx)</span>
          </button>
        </div>
      </div>

      {/* Main Pedagogical Sheet */}
      <article className="print-sheet rounded-xl border border-slate-200 bg-white p-6 sm:p-9 space-y-10">
        {/* Document Header */}
        <header className="border-b border-slate-200 pb-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-teal-800">Bảo Yến AI Edu</span>
            <span aria-hidden="true">·</span>
            <span>{params.subject}</span>
            <span aria-hidden="true">·</span>
            <span>{params.grade}</span>
            <span aria-hidden="true">·</span>
            <span>Bộ sách: {params.textbookSeries}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums font-medium text-slate-700">
              Thời lượng: {params.totalMinutes} phút
            </span>
          </div>

          {editingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={result.lessonTitle}
                onChange={(e) =>
                  onUpdateResult({ ...result, lessonTitle: e.target.value })
                }
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setEditingTitle(false);
                }}
                autoFocus
                className="w-full rounded-lg border border-teal-700 px-3 py-1.5 font-display text-xl sm:text-2xl font-bold text-slate-900 focus:outline-none"
              />
            </div>
          ) : (
            <h1
              onClick={() => setEditingTitle(true)}
              title="Nhấp để chỉnh sửa tên bài dạy"
              className="cursor-pointer font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 hover:text-teal-900 transition-colors"
            >
              {result.lessonTitle}
            </h1>
          )}

          {result.sgkComprehensiveInventory.length > 0 && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowInventory((prev) => !prev)}
                className="no-print inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-700 shrink-0" />
                <span>
                  Đã đối chiếu <span className="font-mono tabular-nums font-semibold">{result.sgkComprehensiveInventory.length}</span> chi tiết trên trang SGK (bấm để {showInventory ? "thu gọn" : "kiểm tra danh mục"})
                </span>
                {showInventory ? (
                  <ChevronUp className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                )}
              </button>

              {showInventory && (
                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-800 mb-2">
                    Danh mục kiểm kê toàn diện các thành phần trích xuất từ ảnh SGK:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-700">
                    {result.sgkComprehensiveInventory.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <span className="font-mono tabular-nums text-slate-400 mr-1.5">
                          {String(idx + 1).padStart(2, "0")}.
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </header>

        {/* === PHẦN 1: PHÂN TÍCH SGK & Ý TƯỞNG KỊCH BẢN (SKILL 1) === */}
        {(sectionFilter === "all" || sectionFilter === "skill1") && (
          <section className="space-y-8">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-teal-800">
                Phần 1 · Skill 1
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Phân tích Sách giáo khoa & Ý tưởng kịch bản sư phạm
              </h2>
            </div>

            {/* 1. Trích xuất kiến thức cốt lõi */}
            <div className="space-y-3">
              <h3 className="font-display text-base font-semibold text-slate-900">
                1. Trích xuất kiến thức cốt lõi từ trang sách
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                      <th className="py-3 px-4 w-40">Phân loại</th>
                      <th className="py-3 px-4 w-56">Đơn vị kiến thức / Kỹ năng</th>
                      <th className="py-3 px-4">Nội dung chi tiết xuất hiện trong SGK</th>
                      <th className="py-3 px-4 w-44">Dẫn chiếu trang SGK</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {result.skill1.coreKnowledge.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors align-top">
                        <td className="py-3 px-4 text-xs font-medium text-teal-800">
                          {item.category}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {item.title}
                        </td>
                        <td className="py-3 px-4 text-slate-700 leading-relaxed">
                          {item.detail}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500">
                          {item.sgkReference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Điểm nghẽn nhận thức */}
            <div className="space-y-3">
              <h3 className="font-display text-base font-semibold text-slate-900">
                2. Điểm nghẽn nhận thức (Dự đoán khó khăn của học sinh)
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                      <th className="py-3 px-4 w-1/4">Điểm nghẽn tư duy</th>
                      <th className="py-3 px-4 w-3/8">Chỗ học sinh dễ hiểu nhầm / gặp khó khăn</th>
                      <th className="py-3 px-4 w-3/8">Chiến lược sư phạm tháo gỡ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {result.skill1.cognitiveBottlenecks.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors align-top">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {b.bottleneck}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 leading-relaxed">
                          {b.studentMisconception}
                        </td>
                        <td className="py-3.5 px-4 text-slate-800 leading-relaxed">
                          {b.pedagogicalRemedy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Ý tưởng trục xuyên suốt (Hook) */}
            <HookShowcaseBlock
              hook={result.skill1.hookIdea}
              isRegenerating={isRegeneratingHook}
              onRegenerate={onRegenerateHook}
            />
          </section>
        )}

        {sectionFilter === "all" && <hr className="border-slate-200" />}

        {/* === PHẦN 2: KẾ HOẠCH BÀI DẠY CHUẨN CÔNG VĂN 5512 (SKILL 2) === */}
        {(sectionFilter === "all" || sectionFilter === "skill2") && (
          <section className="space-y-9">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-teal-800">
                  Phần 2 · Skill 2 · Công văn 5512/BGDĐT-GDTrH
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Kế hoạch bài dạy chuẩn Chương trình GDPT 2018
                </h2>
              </div>

              <div className="no-print flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setActivityLayout("two_column")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    activityLayout === "two_column"
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Columns2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Bảng 2 cột (GV-HS / Sản phẩm)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivityLayout("sequential")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    activityLayout === "sequential"
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ListOrdered className="h-3.5 w-3.5 shrink-0" />
                  <span>Tuần tự 4 mục (a, b, c, d)</span>
                </button>
              </div>
            </div>

            {/* I. MỤC TIÊU BÀI HỌC */}
            <div className="space-y-5">
              <h3 className="font-display text-lg font-bold text-slate-900">
                I. MỤC TIÊU BÀI HỌC
              </h3>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-900">
                  1. Về kiến thức (Yêu cầu cần đạt CT GDPT 2018)
                </h4>
                <ul className="space-y-1.5 text-sm text-slate-700 leading-relaxed pl-4 list-disc">
                  {result.skill2.objectives.knowledge.map((k, idx) => (
                    <li key={idx}>{k}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">
                  2. Về năng lực
                </h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                        <th className="py-2.5 px-4 w-44">Nhóm năng lực</th>
                        <th className="py-2.5 px-4 w-64">Thành phần năng lực</th>
                        <th className="py-2.5 px-4">Biểu hiện cụ thể trong bài học</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {result.skill2.objectives.generalCompetencies.map((c, idx) => (
                        <tr key={`gen-${idx}`} className="align-top">
                          <td className="py-3 px-4 text-xs text-slate-500">
                            Năng lực chung
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {c.name}
                          </td>
                          <td className="py-3 px-4 text-slate-700 leading-relaxed">
                            {c.manifestation}
                          </td>
                        </tr>
                      ))}
                      {result.skill2.objectives.specificCompetencies.map((c, idx) => (
                        <tr key={`spec-${idx}`} className="align-top">
                          <td className="py-3 px-4 text-xs font-medium text-teal-800">
                            Năng lực đặc thù ({params.subject})
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {c.name}
                          </td>
                          <td className="py-3 px-4 text-slate-700 leading-relaxed">
                            {c.manifestation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-900">
                  3. Về phẩm chất
                </h4>
                <ul className="space-y-1.5 text-sm text-slate-700 leading-relaxed pl-4 list-disc">
                  {result.skill2.objectives.qualities.map((q, idx) => (
                    <li key={idx}>
                      <span className="font-semibold text-slate-900">{q.name}:</span>{" "}
                      {q.manifestation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU */}
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-900">
                II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-slate-900">
                    1. Chuẩn bị của Giáo viên
                  </h4>
                  <ul className="space-y-1.5 text-sm text-slate-700 leading-relaxed pl-4 list-disc">
                    {result.skill2.equipmentAndMaterials.teacher.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-slate-900">
                    2. Chuẩn bị của Học sinh
                  </h4>
                  <ul className="space-y-1.5 text-sm text-slate-700 leading-relaxed pl-4 list-disc">
                    {result.skill2.equipmentAndMaterials.student.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* III. TIẾN TRÌNH DẠY HỌC */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  III. TIẾN TRÌNH DẠY HỌC
                </h3>

                <div className="flex items-center gap-2 text-xs">
                  {isDurationMatched ? (
                    <span className="inline-flex items-center gap-1.5 font-mono tabular-nums font-medium text-teal-800">
                      <CheckCircle2 className="h-4 w-4 text-teal-700 shrink-0" />
                      <span>
                        Khớp chuẩn thời lượng: {totalAllocatedMinutes}/{params.totalMinutes} phút
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-mono tabular-nums font-medium text-amber-800">
                      <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
                      <span>
                        Tổng 4 hoạt động: {totalAllocatedMinutes} phút (Mục tiêu: {params.totalMinutes} phút)
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Time Allocation Summary Strip */}
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                      <th className="py-2.5 px-4">Cấu trúc 4 hoạt động chuẩn Công văn 5512</th>
                      <th className="py-2.5 px-4 text-right w-40">Thời lượng (phút)</th>
                      <th className="py-2.5 px-4 text-right w-28">Tỷ trọng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {result.skill2.activities.map((act, idx) => {
                      const pct =
                        totalAllocatedMinutes > 0
                          ? Math.round((act.durationMinutes / totalAllocatedMinutes) * 100)
                          : 0;
                      return (
                        <tr key={act.activityNumber}>
                          <td className="py-2.5 px-4 font-medium text-slate-900">
                            {act.activityName}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                            <div className="inline-flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleAdjustActivityMinutes(idx, -1)}
                                title="Giảm 1 phút"
                                className="no-print rounded border border-slate-200 p-0.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-14 text-center font-semibold text-slate-900">
                                {act.durationMinutes} phút
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAdjustActivityMinutes(idx, 1)}
                                title="Tăng 1 phút"
                                className="no-print rounded border border-slate-200 p-0.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-500">
                            {pct}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Detailed 4 Activities */}
              <div className="space-y-8">
                {result.skill2.activities.map((act) => {
                  const imp = act.implementation;
                  return (
                    <div
                      key={act.activityNumber}
                      className="print-break-inside-avoid rounded-xl border border-slate-200 bg-white overflow-hidden"
                    >
                      {/* Activity Title Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3.5">
                        <h4 className="font-display text-base font-bold text-slate-900">
                          {act.activityName}
                        </h4>
                        <span className="font-mono tabular-nums text-xs font-semibold text-teal-800">
                          Thời lượng: {act.durationMinutes} phút
                        </span>
                      </div>

                      <div className="p-5 space-y-5">
                        {/* a) Mục tiêu & b) Nội dung & c) Sản phẩm */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-900">
                              a) Mục tiêu hoạt động
                            </p>
                            <ul className="space-y-1 text-sm text-slate-700 leading-relaxed pl-4 list-disc">
                              {act.objectives.map((obj, oIdx) => (
                                <li key={oIdx}>{obj}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-900">
                              b) Nội dung nhiệm vụ giao cho học sinh
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                              {act.content}
                            </p>
                          </div>
                        </div>

                        {activityLayout === "sequential" && (
                          <div className="border-t border-slate-200 pt-4 space-y-2">
                            <p className="text-xs font-bold text-slate-900">
                              c) Sản phẩm học tập mong đợi của học sinh
                            </p>
                            <ul className="space-y-1.5 text-sm text-slate-700 leading-relaxed pl-4 list-disc">
                              {act.expectedProducts.map((prod, pIdx) => (
                                <li key={pIdx}>{prod}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* d) Tổ chức thực hiện */}
                        <div className="border-t border-slate-200 pt-4 space-y-3">
                          <p className="text-xs font-bold text-slate-900">
                            {activityLayout === "two_column"
                              ? "c) Sản phẩm & d) Tổ chức thực hiện (Bảng 2 cột chuẩn chuyên môn)"
                              : "d) Tổ chức thực hiện (4 bước chuẩn Công văn 5512)"}
                          </p>

                          {activityLayout === "two_column" ? (
                            <div className="overflow-x-auto rounded-lg border border-slate-200">
                              <table className="w-full border-collapse text-left text-sm">
                                <thead>
                                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                                    <th className="py-3 px-4 w-3/5">
                                      HOẠT ĐỘNG CỦA GIÁO VIÊN VÀ HỌC SINH (4 BƯỚC)
                                    </th>
                                    <th className="py-3 px-4 w-2/5 border-l border-slate-200">
                                      SẢN PHẨM DỰ KIẾN / KIẾN THỨC GHI BẢNG
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="align-top">
                                    <td className="p-4 space-y-4">
                                      <ImplementationStepsList imp={imp} />
                                    </td>
                                    <td className="p-4 border-l border-slate-200 bg-slate-50/40 space-y-4">
                                      <div className="space-y-2">
                                        <p className="text-xs font-semibold text-slate-800">
                                          Sản phẩm câu trả lời / kết quả của HS:
                                        </p>
                                        <ul className="space-y-2 text-sm text-slate-700 leading-relaxed pl-4 list-disc">
                                          {act.expectedProducts.map((prod, pIdx) => (
                                            <li key={pIdx}>{prod}</li>
                                          ))}
                                        </ul>
                                      </div>

                                      {imp.step4ConcludeJudge.coreBoardNotes.length > 0 && (
                                        <div className="border-t border-slate-200 pt-3 space-y-2">
                                          <p className="text-xs font-semibold text-teal-800">
                                            Kiến thức trọng tâm ghi vở / bảng:
                                          </p>
                                          <ul className="space-y-1.5 text-sm font-medium text-slate-900 leading-relaxed">
                                            {imp.step4ConcludeJudge.coreBoardNotes.map(
                                              (note, nIdx) => (
                                                <li key={nIdx}>• {note}</li>
                                              )
                                            )}
                                          </ul>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="rounded-lg border border-slate-200 p-4 space-y-4">
                              <ImplementationStepsList imp={imp} />
                              {imp.step4ConcludeJudge.coreBoardNotes.length > 0 && (
                                <div className="border-t border-slate-200 pt-3 space-y-1.5">
                                  <p className="text-xs font-semibold text-teal-800">
                                    Nội dung chốt kiến thức ghi vở:
                                  </p>
                                  <ul className="space-y-1 text-sm font-medium text-slate-900">
                                    {imp.step4ConcludeJudge.coreBoardNotes.map((note, nIdx) => (
                                      <li key={nIdx}>• {note}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </article>
    </section>
  );
}

function HookShowcaseBlock({
  hook,
  isRegenerating,
  onRegenerate,
}: {
  hook: HookIdea;
  isRegenerating: boolean;
  onRegenerate: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-base font-semibold text-slate-900">
          3. Ý tưởng trục xuyên suốt (Hook — {hook.durationMinutes} phút đầu tiết)
        </h3>
        <button
          type="button"
          disabled={isRegenerating}
          onClick={onRegenerate}
          className="no-print inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
        >
          <RefreshCw className={`h-3.5 w-3.5 shrink-0 ${isRegenerating ? "animate-spin" : ""}`} />
          <span>{isRegenerating ? "Đang sáng tạo Hook mới..." : "Đổi ý tưởng mở đầu khác"}</span>
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-3">
          <h4 className="font-display text-base font-bold text-teal-900">
            {hook.title}
          </h4>
          <span className="font-mono tabular-nums text-xs text-slate-500">
            Thời lượng mở đầu: {hook.durationMinutes} phút
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-700">
              Tình huống thực tiễn gắn kết bài học
            </p>
            <p className="text-slate-800 leading-relaxed">{hook.realWorldContext}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-700">
              Câu hỏi mở đầu gây tò mò nhận thức
            </p>
            <p className="font-medium text-slate-900 leading-relaxed">
              {hook.openingQuestion}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-1.5">
          <p className="text-xs font-semibold text-teal-800">
            Lời dẫn gợi mở tự nhiên của Giáo viên (3 phút đầu tiết):
          </p>
          <p className="text-sm italic text-slate-800 leading-relaxed">
            “{hook.teacherOpeningScript}”
          </p>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-800">Hiệu quả kết nối trục bài học:</span>{" "}
          {hook.expectedCuriosityEffect}
        </p>
      </div>
    </div>
  );
}

function ImplementationStepsList({
  imp,
}: {
  imp: PedagogicalAnalysisResult["skill2"]["activities"][number]["implementation"];
}) {
  return (
    <div className="space-y-4 text-sm leading-relaxed">
      {/* Bước 1 */}
      <div className="space-y-1.5">
        <p className="font-semibold text-slate-900">
          Bước 1: Chuyển giao nhiệm vụ
        </p>
        <p className="text-slate-700">
          <span className="font-medium text-slate-900">• Giáo viên:</span>{" "}
          {imp.step1TransferTask.teacherAction}
        </p>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-800">
          <span className="text-xs font-semibold text-teal-800 block mb-0.5">
            Lời dẫn gợi mở của GV:
          </span>
          <span className="italic">“{imp.step1TransferTask.teacherScript}”</span>
        </div>
        <p className="text-slate-700">
          <span className="font-medium text-slate-900">• Học sinh:</span>{" "}
          {imp.step1TransferTask.studentAction}
        </p>
      </div>

      {/* Bước 2 */}
      <div className="space-y-1.5 border-t border-slate-100 pt-3">
        <p className="font-semibold text-slate-900">
          Bước 2: Thực hiện nhiệm vụ
        </p>
        <p className="text-slate-700">
          <span className="font-medium text-slate-900">• Học sinh:</span>{" "}
          {imp.step2PerformTask.studentAction}
        </p>
        <p className="text-slate-700">
          <span className="font-medium text-slate-900">• Giáo viên quan sát:</span>{" "}
          {imp.step2PerformTask.teacherAction}
        </p>
        <p className="text-xs text-slate-600">
          <span className="font-semibold text-slate-800">Gợi ý hỗ trợ HS gặp khó khăn:</span>{" "}
          {imp.step2PerformTask.supportForStrugglingStudents}
        </p>
      </div>

      {/* Bước 3 */}
      <div className="space-y-1.5 border-t border-slate-100 pt-3">
        <p className="font-semibold text-slate-900">
          Bước 3: Báo cáo, thảo luận
        </p>
        <p className="text-slate-700">
          <span className="font-medium text-slate-900">• Giáo viên điều phối:</span>{" "}
          {imp.step3ReportDiscuss.teacherAction}
        </p>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-800">
          <span className="text-xs font-semibold text-teal-800 block mb-0.5">
            Lời dẫn điều phối thảo luận của GV:
          </span>
          <span className="italic">“{imp.step3ReportDiscuss.teacherScript}”</span>
        </div>
        <p className="text-slate-700">
          <span className="font-medium text-slate-900">• Học sinh báo cáo & phản biện:</span>{" "}
          {imp.step3ReportDiscuss.studentAction}
        </p>
      </div>

      {/* Bước 4 */}
      <div className="space-y-1.5 border-t border-slate-100 pt-3">
        <p className="font-semibold text-slate-900">
          Bước 4: Kết luận, nhận định
        </p>
        <p className="text-slate-700">
          <span className="font-medium text-slate-900">• Giáo viên nhận xét & chuẩn hóa:</span>{" "}
          {imp.step4ConcludeJudge.teacherAction}
        </p>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-800">
          <span className="text-xs font-semibold text-teal-800 block mb-0.5">
            Lời chốt & chuyển ý của GV:
          </span>
          <span className="italic">“{imp.step4ConcludeJudge.teacherScript}”</span>
        </div>
      </div>
    </div>
  );
}
