/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";
import { TopNavBar, type WorkspaceTab } from "./components/TopNavBar";
import { SgkInputPanel } from "./components/SgkInputPanel";
import { LessonPlanDocument } from "./components/LessonPlanDocument";
import { SampleGalleryView } from "./components/SampleGalleryView";
import { SavedLibraryView } from "./components/SavedLibraryView";
import { Standard5512GuideView } from "./components/Standard5512GuideView";
import {
  createThumbnailFromDataUrl,
  processImageFile,
} from "./utils/imageProcessor";
import {
  EXEMPLAR_RESULT_PYTHAGORE,
  SAMPLE_SGK_PRESETS,
  generateSampleSgkImage,
  type SampleSgkPreset,
} from "./utils/sampleSgkGenerator";
import {
  buildMarkdownExport,
  downloadDocxLessonPlan,
} from "./utils/exportLessonPlan";
import type {
  LessonInputParams,
  PedagogicalAnalysisResult,
  SavedLessonRecord,
  UploadedPageImage,
} from "./types/lessonPlan";

const STORAGE_KEY = "bao_yen_ai_edu_saved_plans_v1";

const DEFAULT_PARAMS: LessonInputParams = {
  subject: "Toán học",
  grade: "Lớp 8",
  textbookSeries: "Kết nối tri thức với cuộc sống",
  totalMinutes: 45,
  teacherNotes: "",
};

const PROGRESS_STAGES = [
  "Đang quét văn bản, hình vẽ và bài tập trên trang SGK...",
  "Skill 1: Trích xuất kiến thức cốt lõi & nhận diện điểm nghẽn nhận thức...",
  "Skill 1: Thiết kế tình huống mở đầu (Hook 3 phút đầu tiết)...",
  "Skill 2: Xây dựng tiến trình 4 hoạt động chuẩn Công văn 5512...",
];

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("studio");
  const [images, setImages] = useState<UploadedPageImage[]>([]);
  const [params, setParams] = useState<LessonInputParams>(DEFAULT_PARAMS);
  const [result, setResult] = useState<PedagogicalAnalysisResult | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stageIdx, setStageIdx] = useState(0);
  const [isRegeneratingHook, setIsRegeneratingHook] = useState(false);

  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<UploadedPageImage | null>(null);

  const [savedRecords, setSavedRecords] = useState<SavedLessonRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  useEffect(() => {
    if (!isAnalyzing) {
      setStageIdx(0);
      return;
    }
    const timer = setInterval(() => {
      setStageIdx((prev) => (prev + 1 < PROGRESS_STAGES.length ? prev + 1 : prev));
    }, 3400);
    return () => clearInterval(timer);
  }, [isAnalyzing]);

  const handleFilesSelected = useCallback(
    async (fileList: FileList | File[]) => {
      setErrorBanner(null);
      const incoming = Array.from(fileList).filter((f) =>
        f.type.startsWith("image/")
      );
      if (incoming.length === 0) {
        setErrorBanner("Vui lòng chọn tệp định dạng hình ảnh (JPG, PNG, WEBP).");
        return;
      }

      const remainingSlots = Math.max(0, 5 - images.length);
      if (remainingSlots === 0) {
        setErrorBanner("Mỗi lượt phân tích hỗ trợ tối đa 5 trang SGK. Vui lòng xóa bớt trang cũ nếu muốn thay thế.");
        return;
      }

      const toProcess = incoming.slice(0, remainingSlots);
      try {
        const processed = await Promise.all(toProcess.map((f) => processImageFile(f)));
        setImages((prev) => [...prev, ...processed]);
        setActiveTab("studio");
        showToast(`Đã nạp ${processed.length} trang Sách giáo khoa.`);
      } catch (err: unknown) {
        setErrorBanner(
          err instanceof Error ? err.message : "Không thể xử lý ảnh vừa tải lên."
        );
      }
    },
    [images.length, showToast]
  );

  // Clipboard Ctrl+V support for teachers pasting Zalo / Snipping Tool screenshots
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (!e.clipboardData?.files || e.clipboardData.files.length === 0) return;
      const imageFiles = Array.from(e.clipboardData.files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (imageFiles.length > 0) {
        e.preventDefault();
        void handleFilesSelected(imageFiles);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFilesSelected]);

  const runAnalysis = useCallback(
    async (
      targetImages: UploadedPageImage[],
      targetParams: LessonInputParams
    ) => {
      if (targetImages.length === 0) {
        setErrorBanner("Vui lòng tải lên ít nhất 1 ảnh chụp trang Sách giáo khoa.");
        return;
      }

      setErrorBanner(null);
      setIsAnalyzing(true);
      setActiveTab("studio");

      try {
        const response = await fetch("/api/analyze-sgk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            images: targetImages.map((img) => ({
              mimeType: img.mimeType,
              base64Data: img.base64Data,
              name: img.name,
            })),
            params: targetParams,
          }),
        });

        const data = (await response.json()) as {
          result?: PedagogicalAnalysisResult;
          error?: string;
        };

        if (!response.ok || !data.result) {
          throw new Error(
            data.error || "Không thể hoàn tất phân tích trang SGK. Vui lòng thử lại."
          );
        }

        setResult(data.result);
        showToast("Đã hoàn thành Phân tích SGK (Skill 1) & Kế hoạch bài dạy 5512 (Skill 2).");
      } catch (err: unknown) {
        setErrorBanner(
          err instanceof Error
            ? err.message
            : "Lỗi kết nối khi phân tích trang Sách giáo khoa."
        );
      } finally {
        setIsAnalyzing(false);
      }
    },
    [showToast]
  );

  const handleLoadSamplePreset = useCallback(
    (preset: SampleSgkPreset, autoRunAi: boolean) => {
      setErrorBanner(null);
      const sampleImage = generateSampleSgkImage(preset);
      setImages([sampleImage]);
      setParams(preset.params);
      setActiveTab("studio");

      if (autoRunAi) {
        void runAnalysis([sampleImage], preset.params);
      } else {
        showToast(`Đã nạp trang mẫu "${preset.title}". Bấm Phân tích SGK để bắt đầu.`);
      }
    },
    [runAnalysis, showToast]
  );

  const handleLoadExemplarInstant = useCallback(() => {
    setErrorBanner(null);
    const pythagorePreset = SAMPLE_SGK_PRESETS[0];
    const sampleImg = generateSampleSgkImage(pythagorePreset);
    setImages([sampleImg]);
    setParams(pythagorePreset.params);
    setResult(EXEMPLAR_RESULT_PYTHAGORE);
    setActiveTab("studio");
    showToast("Đã mở Hồ sơ mẫu chuẩn Công văn 5512 (Bài 18: Định lí Pythagore).");
  }, [showToast]);

  const handleRegenerateHook = useCallback(async () => {
    if (!result) return;
    setErrorBanner(null);
    setIsRegeneratingHook(true);
    try {
      const coreSummary = result.skill1.coreKnowledge
        .map((k) => `${k.title}: ${k.detail}`)
        .join("; ");

      const response = await fetch("/api/regenerate-hook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonTitle: result.lessonTitle,
          subject: params.subject,
          grade: params.grade,
          coreSummary,
          currentHookTitle: result.skill1.hookIdea.title,
        }),
      });

      const data = (await response.json()) as {
        hookIdea?: PedagogicalAnalysisResult["skill1"]["hookIdea"];
        error?: string;
      };

      if (!response.ok || !data.hookIdea) {
        throw new Error(data.error || "Không thể tạo mới ý tưởng mở đầu.");
      }

      setResult({
        ...result,
        skill1: {
          ...result.skill1,
          hookIdea: data.hookIdea,
        },
      });
      showToast("Đã cập nhật ý tưởng mở đầu (Hook 3 phút đầu tiết) mới.");
    } catch (err: unknown) {
      setErrorBanner(
        err instanceof Error ? err.message : "Không thể làm mới ý tưởng Hook."
      );
    } finally {
      setIsRegeneratingHook(false);
    }
  }, [params.grade, params.subject, result, showToast]);

  const persistRecords = (next: SavedLessonRecord[]) => {
    setSavedRecords(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      setErrorBanner("Bộ nhớ trình duyệt đã đầy, vui lòng xóa bớt các bài cũ trong Kho bài dạy.");
    }
  };

  const handleSaveToLibrary = async () => {
    if (!result) return;
    let thumb = "";
    if (images[0]?.previewUrl) {
      try {
        thumb = await createThumbnailFromDataUrl(images[0].previewUrl);
      } catch {
        thumb = "";
      }
    }

    const record: SavedLessonRecord = {
      id: `plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      params,
      thumbnailDataUrl: thumb || undefined,
      pageCount: Math.max(1, images.length),
      result,
    };

    const next = [record, ...savedRecords].slice(0, 30);
    persistRecords(next);
    showToast("Đã lưu hồ sơ bài dạy vào Kho bài dạy cá nhân.");
  };

  const handleNewLesson = () => {
    setErrorBanner(null);
    setImages([]);
    setResult(null);
    setActiveTab("studio");
  };

  const handleExportDocx = async (mode: "full" | "5512_only") => {
    if (!result) return;
    try {
      await downloadDocxLessonPlan(result, params, mode);
      showToast(
        mode === "full"
          ? "Đã tải xuống tệp Word (.docx) trọn bộ Skill 1 & Skill 2."
          : "Đã tải xuống tệp Word (.docx) Kế hoạch bài dạy Công văn 5512."
      );
    } catch (err: unknown) {
      setErrorBanner(
        err instanceof Error ? err.message : "Không thể xuất tệp Word (.docx)."
      );
    }
  };

  const handleCopyMarkdown = () => {
    if (!result) return;
    const md = buildMarkdownExport(result, params);
    void navigator.clipboard.writeText(md);
    showToast("Đã sao chép toàn bộ nội dung bài dạy vào bộ nhớ tạm.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopNavBar
        activeTab={activeTab}
        savedCount={savedRecords.length}
        onSelectTab={setActiveTab}
        onNewLesson={handleNewLesson}
      />

      {/* Feedback & Error Notification Strip */}
      {errorBanner && (
        <div
          role="alert"
          className="no-print mx-auto mt-4 w-full max-w-[1440px] px-4 sm:px-6"
        >
          <div className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 text-red-700 shrink-0" />
              <span>{errorBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorBanner(null)}
              aria-label="Đóng thông báo lỗi"
              className="rounded p-0.5 text-red-700 hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {toastMessage && (
        <div
          role="status"
          className="no-print fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-lg"
        >
          <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 mx-auto w-full max-w-[1440px] px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === "studio" && (
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <SgkInputPanel
              images={images}
              params={params}
              isAnalyzing={isAnalyzing}
              analysisStageText={PROGRESS_STAGES[stageIdx]}
              onFilesSelected={handleFilesSelected}
              onRemoveImage={(id) =>
                setImages((prev) => prev.filter((item) => item.id !== id))
              }
              onClearAllImages={() => setImages([])}
              onPreviewImage={(img) => setLightboxImage(img)}
              onChangeParams={setParams}
              onSubmitAnalyze={() => void runAnalysis(images, params)}
              onLoadSamplePreset={handleLoadSamplePreset}
            />

            <LessonPlanDocument
              result={result}
              params={params}
              isAnalyzing={isAnalyzing}
              analysisStageText={PROGRESS_STAGES[stageIdx]}
              isRegeneratingHook={isRegeneratingHook}
              onUpdateResult={setResult}
              onRegenerateHook={() => void handleRegenerateHook()}
              onSaveToLibrary={() => void handleSaveToLibrary()}
              onExportDocx={(mode) => void handleExportDocx(mode)}
              onCopyMarkdown={handleCopyMarkdown}
              onLoadExemplarInstant={handleLoadExemplarInstant}
              onOpenSamplesTab={() => setActiveTab("samples")}
            />
          </div>
        )}

        {activeTab === "samples" && (
          <SampleGalleryView
            onSelectPreset={handleLoadSamplePreset}
            onPreviewImage={(img) => setLightboxImage(img)}
            onLoadInstantExemplar={handleLoadExemplarInstant}
          />
        )}

        {activeTab === "library" && (
          <SavedLibraryView
            records={savedRecords}
            onOpenRecord={(rec) => {
              setParams(rec.params);
              setResult(rec.result);
              setImages(
                rec.thumbnailDataUrl
                  ? [
                      {
                        id: `thumb-${rec.id}`,
                        name: "trang-sgk-da-luu.jpg",
                        mimeType: "image/jpeg",
                        base64Data: rec.thumbnailDataUrl.split(",")[1] || "",
                        previewUrl: rec.thumbnailDataUrl,
                      },
                    ]
                  : []
              );
              setActiveTab("studio");
            }}
            onExportRecordDocx={(rec) => {
              void downloadDocxLessonPlan(rec.result, rec.params, "full");
            }}
            onDeleteRecord={(id) => {
              const next = savedRecords.filter((r) => r.id !== id);
              persistRecords(next);
              showToast("Đã xóa bài dạy khỏi kho lưu trữ.");
            }}
            onGoToStudio={() => setActiveTab("studio")}
          />
        )}

        {activeTab === "guide5512" && (
          <Standard5512GuideView onBackToStudio={() => setActiveTab("studio")} />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="no-print border-t border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-4 max-w-[1440px] text-xs text-slate-500">
          <span>
            Hệ sinh thái Bảo Yến AI Edu · Chuyên gia Thiết kế Chương trình & Sư phạm (CT GDPT 2018 — Công văn 5512)
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("guide5512")}
              className="hover:text-slate-900 transition-colors"
            >
              Quy chuẩn Phụ lục IV CV 5512
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveTab("samples")}
              className="hover:text-slate-900 transition-colors"
            >
              Trang SGK mẫu
            </button>
          </div>
        </div>
      </footer>

      {/* SGK Page Zoom Lightbox */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Xem phóng to trang Sách giáo khoa"
          onClick={() => setLightboxImage(null)}
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="text-xs font-semibold text-slate-800 truncate">
                Đối chiếu trang SGK: {lightboxImage.name}
              </span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                <X className="h-3.5 w-3.5" />
                <span>Đóng</span>
              </button>
            </div>
            <div className="overflow-auto bg-slate-100 p-4">
              <img
                src={lightboxImage.previewUrl}
                alt={lightboxImage.name}
                referrerPolicy="no-referrer"
                className="mx-auto max-w-full h-auto rounded border border-slate-200 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
