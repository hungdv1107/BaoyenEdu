import { useMemo, useState } from "react";
import { Search, Download, Trash2, FolderOpen, ArrowUpRight } from "lucide-react";
import type { SavedLessonRecord } from "../types/lessonPlan";

interface SavedLibraryViewProps {
  records: SavedLessonRecord[];
  onOpenRecord: (record: SavedLessonRecord) => void;
  onExportRecordDocx: (record: SavedLessonRecord) => void;
  onDeleteRecord: (id: string) => void;
  onGoToStudio: () => void;
}

export function SavedLibraryView({
  records,
  onOpenRecord,
  onExportRecordDocx,
  onDeleteRecord,
  onGoToStudio,
}: SavedLibraryViewProps) {
  const [query, setQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("ALL");

  const subjects = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => set.add(r.params.subject));
    return Array.from(set);
  }, [records]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((rec) => {
      if (selectedSubject !== "ALL" && rec.params.subject !== selectedSubject) {
        return false;
      }
      if (!q) return true;
      return (
        rec.result.lessonTitle.toLowerCase().includes(q) ||
        rec.params.subject.toLowerCase().includes(q) ||
        rec.params.grade.toLowerCase().includes(q) ||
        rec.params.textbookSeries.toLowerCase().includes(q)
      );
    });
  }, [records, query, selectedSubject]);

  if (records.length === 0) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-10 text-center space-y-4">
        <FolderOpen className="mx-auto h-10 w-10 text-slate-400" />
        <h1 className="font-display text-xl font-bold text-slate-900">
          Kho bài dạy cá nhân chưa có hồ sơ nào được lưu
        </h1>
        <p className="mx-auto max-w-lg text-sm text-slate-600 leading-relaxed">
          Sau khi phân tích ảnh trang Sách giáo khoa và tạo Kế hoạch bài dạy chuẩn Công văn 5512, thầy/cô bấm nút “Lưu vào kho” trên thanh công cụ để lưu trữ hồ sơ tại đây và tải lại hoặc xuất tệp Word bất cứ lúc nào.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={onGoToStudio}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 transition-colors whitespace-nowrap"
          >
            <span>Bắt đầu soạn Kế hoạch bài dạy đầu tiên</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-teal-800">
            Lưu trữ cục bộ trên trình duyệt
          </p>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Kho Kế hoạch bài dạy đã lưu ({records.length})
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm tên bài, môn, lớp..."
              className="w-64 rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            aria-label="Lọc theo môn học"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
          >
            <option value="ALL">Tất cả môn học</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          Không tìm thấy bài dạy nào khớp với từ khóa lọc hiện tại.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                <th className="py-3 px-4">Bài dạy & Bộ sách</th>
                <th className="py-3 px-4 w-48">Môn · Khối lớp</th>
                <th className="py-3 px-4 text-right w-32">Thời lượng</th>
                <th className="py-3 px-4 text-right w-40">Ngày lưu</th>
                <th className="py-3 px-4 text-right w-56">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((rec) => {
                const formattedDate = new Date(rec.createdAt).toLocaleDateString(
                  "vi-VN",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );
                return (
                  <tr
                    key={rec.id}
                    className="hover:bg-slate-50/70 transition-colors align-middle"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {rec.thumbnailDataUrl && (
                          <img
                            src={rec.thumbnailDataUrl}
                            alt={rec.result.lessonTitle}
                            referrerPolicy="no-referrer"
                            className="h-12 w-9 rounded border border-slate-200 object-cover shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate max-w-md">
                            {rec.result.lessonTitle}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {rec.params.textbookSeries} · {rec.pageCount} trang SGK
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {rec.params.subject} · {rec.params.grade}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-800">
                      {rec.params.totalMinutes} phút
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-xs text-slate-500">
                      {formattedDate}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenRecord(rec)}
                          className="inline-flex items-center gap-1 rounded-md bg-teal-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>Mở</span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onExportRecordDocx(rec)}
                          title="Xuất tệp Word (.docx)"
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                        >
                          <Download className="h-3.5 w-3.5 shrink-0" />
                          <span>.docx</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRecord(rec.id)}
                          title="Xóa khỏi kho"
                          className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
