import { useEffect, useState } from "react";
import { Play, ZoomIn, ArrowRight, FileCheck2 } from "lucide-react";
import {
  SAMPLE_SGK_PRESETS,
  generateSampleSgkImage,
  type SampleSgkPreset,
} from "../utils/sampleSgkGenerator";
import type { UploadedPageImage } from "../types/lessonPlan";

interface SampleGalleryViewProps {
  onSelectPreset: (preset: SampleSgkPreset, autoRunAi: boolean) => void;
  onPreviewImage: (img: UploadedPageImage) => void;
  onLoadInstantExemplar: () => void;
}

export function SampleGalleryView({
  onSelectPreset,
  onPreviewImage,
  onLoadInstantExemplar,
}: SampleGalleryViewProps) {
  const [renderedSamples, setRenderedSamples] = useState<
    Record<string, UploadedPageImage>
  >({});

  useEffect(() => {
    const map: Record<string, UploadedPageImage> = {};
    for (const preset of SAMPLE_SGK_PRESETS) {
      map[preset.id] = generateSampleSgkImage(preset);
    }
    setRenderedSamples(map);
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold text-teal-800">
            Học liệu đối chuẩn · Chương trình GDPT 2018
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Thư viện trang Sách giáo khoa mẫu để kiểm thử trực tiếp
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Chọn bất kỳ trang SGK mẫu bên dưới để nạp trực tiếp vào bộ nhận diện thị giác của Bảo Yến AI Edu và kiểm chứng khả năng trích xuất toàn diện khái niệm, hình vẽ, câu hỏi thảo luận và bài tập thực tế.
          </p>
        </div>

        <button
          type="button"
          onClick={onLoadInstantExemplar}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
        >
          <FileCheck2 className="h-4 w-4 text-teal-700 shrink-0" />
          <span>Mở ngay Hồ sơ mẫu hoàn chỉnh (0 giây)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {SAMPLE_SGK_PRESETS.map((preset) => {
          const rendered = renderedSamples[preset.id];
          return (
            <div
              key={preset.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white overflow-hidden"
            >
              <div>
                <div className="relative aspect-[3/4] bg-slate-100 border-b border-slate-200 overflow-hidden group">
                  {rendered ? (
                    <img
                      src={rendered.previewUrl}
                      alt={preset.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      Đang dựng trang SGK...
                    </div>
                  )}

                  {rendered && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-white">
                        {preset.pageNumberLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => onPreviewImage(rendered)}
                        className="inline-flex items-center gap-1 rounded bg-white/95 px-2.5 py-1 text-xs font-medium text-slate-900 hover:bg-white transition-colors whitespace-nowrap shrink-0"
                      >
                        <ZoomIn className="h-3.5 w-3.5 shrink-0" />
                        <span>Xem rõ chữ</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <p className="text-xs text-slate-500">{preset.subtitle}</p>
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    {preset.title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ghi chú gợi ý: {preset.params.teacherNotes}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 p-4 flex items-center gap-2.5 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => onSelectPreset(preset, true)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-700 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-800 transition-colors whitespace-nowrap"
                >
                  <Play className="h-3.5 w-3.5 shrink-0" />
                  <span>Phân tích AI ngay</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectPreset(preset, false)}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Nạp vào khung</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
