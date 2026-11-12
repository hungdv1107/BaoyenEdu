import React, { useRef, useState } from "react";
import {
  Upload,
  Trash2,
  ZoomIn,
  FileCheck2,
  Loader2,
  BookOpen,
} from "lucide-react";
import type { LessonInputParams, UploadedPageImage } from "../types/lessonPlan";
import { SAMPLE_SGK_PRESETS, type SampleSgkPreset } from "../utils/sampleSgkGenerator";

const SUBJECT_OPTIONS = [
  "Toán học",
  "Ngữ văn",
  "Tiếng Anh",
  "Khoa học tự nhiên",
  "Lịch sử và Địa lí",
  "Vật lí",
  "Hóa học",
  "Sinh học",
  "Lịch sử",
  "Địa lí",
  "Giáo dục kinh tế và pháp luật",
  "Giáo dục công dân",
  "Tin học",
  "Công nghệ",
  "Hoạt động trải nghiệm, hướng nghiệp",
  "Tiếng Việt",
  "Tự nhiên và Xã hội",
];

const GRADE_OPTIONS = [
  "Lớp 1",
  "Lớp 2",
  "Lớp 3",
  "Lớp 4",
  "Lớp 5",
  "Lớp 6",
  "Lớp 7",
  "Lớp 8",
  "Lớp 9",
  "Lớp 10",
  "Lớp 11",
  "Lớp 12",
];

const TEXTBOOK_SERIES_OPTIONS = [
  "Kết nối tri thức với cuộc sống",
  "Chân trời sáng tạo",
  "Cánh diều",
  "Tài liệu giáo dục địa phương / Chuyên đề",
];

const DURATION_PRESETS = [
  { label: "1 tiết (45p)", minutes: 45 },
  { label: "Tiểu học (35p)", minutes: 35 },
  { label: "2 tiết (90p)", minutes: 90 },
  { label: "3 tiết (135p)", minutes: 135 },
];

interface SgkInputPanelProps {
  images: UploadedPageImage[];
  params: LessonInputParams;
  isAnalyzing: boolean;
  analysisStageText: string;
  onFilesSelected: (files: FileList | File[]) => void;
  onRemoveImage: (id: string) => void;
  onClearAllImages: () => void;
  onPreviewImage: (img: UploadedPageImage) => void;
  onChangeParams: (next: LessonInputParams) => void;
  onSubmitAnalyze: () => void;
  onLoadSamplePreset: (preset: SampleSgkPreset, autoRunAi: boolean) => void;
}

export function SgkInputPanel({
  images,
  params,
  isAnalyzing,
  analysisStageText,
  onFilesSelected,
  onRemoveImage,
  onClearAllImages,
  onPreviewImage,
  onChangeParams,
  onSubmitAnalyze,
  onLoadSamplePreset,
}: SgkInputPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  return (
    <aside className="no-print w-full lg:w-[400px] xl:w-[420px] shrink-0 space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
        <div className="space-y-1">
          <h2 className="font-display text-base font-semibold text-slate-900">
            1. Tải ảnh trang Sách giáo khoa
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hỗ trợ tải từ 1 đến 5 trang liên tiếp của bài học hoặc dán ảnh chụp màn hình trực tiếp bằng tổ hợp phím Ctrl+V.
          </p>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (!isAnalyzing) fileInputRef.current?.click();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`cursor-pointer rounded-lg border border-dashed p-5 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
            isDragging
              ? "border-teal-700 bg-teal-50/60"
              : "border-slate-300 bg-slate-50/70 hover:border-teal-700 hover:bg-slate-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onFilesSelected(e.target.files);
                e.target.value = "";
              }
            }}
          />
          <Upload className="mx-auto h-6 w-6 text-teal-700" />
          <p className="mt-2.5 text-sm font-semibold text-slate-900">
            Chọn ảnh trang SGK hoặc kéo thả vào đây
          </p>
          <p className="mt-1 text-xs text-slate-500">
            PNG, JPG, WEBP · Tối đa 5 trang / lượt phân tích
          </p>
        </div>

        {images.length > 0 && (
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium text-slate-800 font-mono tabular-nums">
                Đã nạp {images.length}/5 trang SGK
              </span>
              <button
                type="button"
                onClick={onClearAllImages}
                disabled={isAnalyzing}
                className="text-slate-500 hover:text-red-700 transition-colors whitespace-nowrap shrink-0"
              >
                Xóa tất cả
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100 aspect-[3/4]"
                >
                  <img
                    src={img.previewUrl}
                    alt={`Trang SGK ${idx + 1}: ${img.name}`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-2 py-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-mono tabular-nums font-medium text-white">
                      Trang {idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewImage(img);
                        }}
                        title="Phóng to kiểm tra chữ trên trang SGK"
                        className="rounded p-1 text-white/90 hover:bg-white/20 hover:text-white transition-colors"
                      >
                        <ZoomIn className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveImage(img.id);
                        }}
                        disabled={isAnalyzing}
                        title="Gỡ trang này"
                        className="rounded p-1 text-white/90 hover:bg-red-600/80 hover:text-white transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length === 0 && (
          <div className="border-t border-slate-200 pt-4 space-y-2.5">
            <p className="text-xs font-medium text-slate-700">
              Chưa có sẵn ảnh chụp? Nạp nhanh trang SGK mẫu để thử nghiệm:
            </p>
            <div className="space-y-1.5">
              {SAMPLE_SGK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => onLoadSamplePreset(preset, false)}
                  className="w-full flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-left text-xs hover:border-teal-700 hover:bg-white transition-colors"
                >
                  <span className="font-medium text-slate-800 truncate">
                    {preset.title}
                  </span>
                  <span className="text-slate-500 whitespace-nowrap shrink-0">
                    {preset.params.grade}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <h2 className="font-display text-base font-semibold text-slate-900">
          2. Thông tin chuyên môn bài dạy
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label htmlFor="subject-select" className="block text-xs font-medium text-slate-700">
              Môn học (GDPT 2018)
            </label>
            <select
              id="subject-select"
              value={params.subject}
              disabled={isAnalyzing}
              onChange={(e) => onChangeParams({ ...params, subject: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
            >
              {SUBJECT_OPTIONS.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="grade-select" className="block text-xs font-medium text-slate-700">
              Khối lớp
            </label>
            <select
              id="grade-select"
              value={params.grade}
              disabled={isAnalyzing}
              onChange={(e) => onChangeParams({ ...params, grade: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
            >
              {GRADE_OPTIONS.map((gr) => (
                <option key={gr} value={gr}>
                  {gr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="series-select" className="block text-xs font-medium text-slate-700">
            Bộ sách giáo khoa
          </label>
          <select
            id="series-select"
            value={params.textbookSeries}
            disabled={isAnalyzing}
            onChange={(e) => onChangeParams({ ...params, textbookSeries: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
          >
            {TEXTBOOK_SERIES_OPTIONS.map((sr) => (
              <option key={sr} value={sr}>
                {sr}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="duration-input" className="text-xs font-medium text-slate-700">
              Tổng thời lượng tiết dạy (phút)
            </label>
            <span className="font-mono tabular-nums text-xs font-semibold text-teal-800">
              {params.totalMinutes} phút
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 rounded-lg bg-slate-100 p-1">
            {DURATION_PRESETS.map((preset) => {
              const active = params.totalMinutes === preset.minutes;
              return (
                <button
                  key={preset.minutes}
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => onChangeParams({ ...params, totalMinutes: preset.minutes })}
                  className={`rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <input
            id="duration-input"
            type="number"
            min={15}
            max={270}
            step={5}
            disabled={isAnalyzing}
            value={params.totalMinutes}
            onChange={(e) =>
              onChangeParams({
                ...params,
                totalMinutes: Math.max(15, Math.min(270, Number(e.target.value) || 45)),
              })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono tabular-nums text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="notes-textarea" className="block text-xs font-medium text-slate-700">
            Định hướng sư phạm / Ghi chú thêm (Tùy chọn)
          </label>
          <textarea
            id="notes-textarea"
            rows={2}
            disabled={isAnalyzing}
            placeholder="Ví dụ: Học sinh đại trà, ưu tiên kỹ thuật mảnh ghép hoặc trò chơi khởi động..."
            value={params.teacherNotes}
            onChange={(e) => onChangeParams({ ...params, teacherNotes: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none"
          />
        </div>

        <button
          type="button"
          disabled={isAnalyzing || images.length === 0}
          onClick={onSubmitAnalyze}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 whitespace-nowrap"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              <span className="truncate">{analysisStageText}</span>
            </>
          ) : (
            <>
              <FileCheck2 className="h-4 w-4 shrink-0" />
              <span>Phân tích SGK & Soạn KHBD 5512</span>
            </>
          )}
        </button>

        {images.length === 0 && (
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <BookOpen className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>Tải ít nhất 1 ảnh trang SGK để kích hoạt phân tích chuyên môn.</span>
          </p>
        )}
      </div>
    </aside>
  );
}
