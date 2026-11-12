import type { UploadedPageImage } from "../types/lessonPlan";

const MAX_DIMENSION = 1600;
const THUMB_MAX_DIMENSION = 240;

export async function processImageFile(file: File): Promise<UploadedPageImage> {
  const bitmapUrl = await readFileAsDataUrl(file);
  const img = await loadImageElement(bitmapUrl);

  const { width, height } = computeScaledDimensions(img.naturalWidth, img.naturalHeight, MAX_DIMENSION);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Không thể khởi tạo bộ xử lý ảnh trên trình duyệt.");
  }

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  const mimeType = "image/jpeg";
  const previewUrl = canvas.toDataURL(mimeType, 0.88);
  const base64Data = previewUrl.split(",")[1] || "";

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name || "trang-sgk.jpg",
    mimeType,
    base64Data,
    previewUrl,
  };
}

export async function createThumbnailFromDataUrl(dataUrl: string): Promise<string> {
  const img = await loadImageElement(dataUrl);
  const { width, height } = computeScaledDimensions(
    img.naturalWidth,
    img.naturalHeight,
    THUMB_MAX_DIMENSION
  );
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.72);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Không thể đọc tệp hình ảnh."));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Định dạng tệp ảnh không hợp lệ."));
    img.src = src;
  });
}

function computeScaledDimensions(
  origWidth: number,
  origHeight: number,
  maxSide: number
): { width: number; height: number } {
  if (origWidth <= maxSide && origHeight <= maxSide) {
    return { width: origWidth, height: origHeight };
  }
  const ratio = Math.min(maxSide / origWidth, maxSide / origHeight);
  return {
    width: Math.max(1, Math.round(origWidth * ratio)),
    height: Math.max(1, Math.round(origHeight * ratio)),
  };
}
