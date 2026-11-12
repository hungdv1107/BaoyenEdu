import type {
  LessonInputParams,
  PedagogicalAnalysisResult,
  UploadedPageImage,
} from "../types/lessonPlan";

export interface SampleSgkPreset {
  id: string;
  title: string;
  subtitle: string;
  params: LessonInputParams;
  pageNumberLabel: string;
  renderCanvas: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

export const SAMPLE_SGK_PRESETS: SampleSgkPreset[] = [
  {
    id: "toan-8-pythagore",
    title: "Bài 18: Định lí Pythagore",
    subtitle: "Toán học · Lớp 8 · Kết nối tri thức · 45 phút",
    pageNumberLabel: "Trang 94 — Toán 8 Tập 1",
    params: {
      subject: "Toán học",
      grade: "Lớp 8",
      textbookSeries: "Kết nối tri thức với cuộc sống",
      totalMinutes: 45,
      teacherNotes: "Chú trọng hoạt động trực quan cắt ghép hình và bài toán thực tế tính chiều cao thang.",
    },
    renderCanvas: (ctx, w, h) => {
      ctx.fillStyle = "#FFFDF9";
      ctx.fillRect(0, 0, w, h);

      // Page border & header ribbon
      ctx.fillStyle = "#0F766E";
      ctx.fillRect(48, 42, 110, 36);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("BÀI 18", 68, 66);

      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText("ĐỊNH LÍ PYTHAGORE", 174, 68);

      ctx.strokeStyle = "#CBD5E1";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(48, 94);
      ctx.lineTo(w - 48, 94);
      ctx.stroke();

      // Khái niệm & thuật ngữ box
      ctx.fillStyle = "#F1F5F9";
      ctx.fillRect(48, 112, w - 96, 68);
      ctx.fillStyle = "#0F766E";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("THUẬT NGỮ & KIẾN THỨC TRỌNG TÂM:", 66, 136);
      ctx.fillStyle = "#334155";
      ctx.font = "15px sans-serif";
      ctx.fillText("• Cạnh góc vuông, cạnh huyền   • Định lí Pythagore thuận và định lí Pythagore đảo", 66, 162);

      // Section 1
      let y = 216;
      ctx.fillStyle = "#0F766E";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("1. ĐỊNH LÍ PYTHAGORE", 48, y);
      y += 32;

      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("HĐ1 (Khám phá):", 48, y);
      ctx.font = "16px sans-serif";
      y = drawWrappedText(
        ctx,
        "Vẽ một tam giác vuông có hai cạnh góc vuông bằng 3 cm và 4 cm. Đo độ dài cạnh huyền rồi so sánh bình phương độ dài cạnh huyền với tổng bình phương độ dài hai cạnh góc vuông.",
        188,
        y,
        w - 240,
        25
      );

      y += 16;
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("HĐ2 (Ghép hình):", 48, y);
      ctx.font = "16px sans-serif";
      y = drawWrappedText(
        ctx,
        "Lấy 8 tam giác vuông bằng nhau có cạnh góc vuông a, b và cạnh huyền c; ghép vào hai hình vuông cạnh (a + b) như Hình 9.1. Từ đó rút ra hệ thức liên hệ giữa c², a² và b².",
        192,
        y,
        w - 244,
        25
      );

      // Right triangle geometric figure
      const figY = y + 14;
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#94A3B8";
      ctx.strokeRect(48, figY, w - 96, 195);

      // Draw right triangle ABC
      ctx.beginPath();
      ctx.moveTo(130, figY + 150); // A (right angle)
      ctx.lineTo(130, figY + 45); // B
      ctx.lineTo(310, figY + 150); // C
      ctx.closePath();
      ctx.fillStyle = "#E0F2FE";
      ctx.fill();
      ctx.strokeStyle = "#0369A1";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Right angle square at A
      ctx.strokeRect(130, figY + 134, 16, 16);

      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("A", 108, figY + 158);
      ctx.fillText("B", 112, figY + 42);
      ctx.fillText("C", 320, figY + 158);
      ctx.font = "italic 16px sans-serif";
      ctx.fillText("c = AB", 70, figY + 102);
      ctx.fillText("b = AC", 205, figY + 174);
      ctx.fillText("a = BC (cạnh huyền)", 225, figY + 92);

      // Formula callout inside figure box
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 17px sans-serif";
      ctx.fillText("Hình 9.2. Tam giác ABC vuông tại A:", 430, figY + 68);
      ctx.fillStyle = "#0F766E";
      ctx.font = "bold 24px monospace";
      ctx.fillText("BC² = AB² + AC²", 430, figY + 112);
      ctx.fillStyle = "#475569";
      ctx.font = "15px sans-serif";
      ctx.fillText("(Cạnh huyền đối diện với góc vuông A)", 430, figY + 146);

      y = figY + 228;

      // Định lí box
      ctx.fillStyle = "#F0FDFA";
      ctx.fillRect(48, y, w - 96, 98);
      ctx.strokeStyle = "#0F766E";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(48, y, w - 96, 98);
      ctx.fillStyle = "#0F766E";
      ctx.font = "bold 17px sans-serif";
      ctx.fillText("ĐỊNH LÍ PYTHAGORE:", 68, y + 30);
      ctx.fillStyle = "#0F172A";
      ctx.font = "16px sans-serif";
      drawWrappedText(
        ctx,
        "Trong một tam giác vuông, bình phương của cạnh huyền bằng tổng các bình phương của hai cạnh góc vuông.",
        68,
        y + 58,
        w - 136,
        24
      );

      y += 130;

      // Ví dụ & Luyện tập & Vận dụng
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 17px sans-serif";
      ctx.fillText("Ví dụ 1:", 48, y);
      ctx.font = "16px sans-serif";
      y = drawWrappedText(
        ctx,
        "Cho tam giác ABC vuông tại A có AB = 5 cm, AC = 12 cm. Tính độ dài cạnh BC.",
        124,
        y,
        w - 172,
        24
      );
      ctx.fillStyle = "#334155";
      ctx.font = "italic 15px sans-serif";
      y = drawWrappedText(
        ctx,
        "Giải: Áp dụng định lí Pythagore vào ΔABC vuông tại A: BC² = AB² + AC² = 5² + 12² = 25 + 144 = 169. Suy ra BC = 13 (cm).",
        68,
        y + 4,
        w - 120,
        23
      );

      y += 18;
      ctx.fillStyle = "#0F766E";
      ctx.font = "bold 17px sans-serif";
      ctx.fillText("Luyện tập 1:", 48, y);
      ctx.fillStyle = "#0F172A";
      ctx.font = "16px sans-serif";
      y = drawWrappedText(
        ctx,
        "Tìm độ dài x trong hai trường hợp: a) Tam giác MNP vuông tại M có MN = 6 cm, MP = 8 cm, NP = x; b) Tam giác DEF vuông tại D có DE = x, DF = 12 cm, EF = 15 cm.",
        158,
        y,
        w - 206,
        24
      );

      y += 16;
      ctx.fillStyle = "#B45309";
      ctx.font = "bold 17px sans-serif";
      ctx.fillText("Vận dụng thực tế:", 48, y);
      ctx.fillStyle = "#0F172A";
      ctx.font = "16px sans-serif";
      drawWrappedText(
        ctx,
        "Một chiếc thang dài 5 m đặt dựa vào một bức tường thẳng đứng, chân thang cách chân tường 1,4 m để đảm bảo an toàn. Hỏi đầu trên của thang chạm tường ở độ cao bao nhiêu mét?",
        200,
        y,
        w - 248,
        24
      );

      // Footer page number
      ctx.fillStyle = "#64748B";
      ctx.font = "14px sans-serif";
      ctx.fillText("94 | Sách giáo khoa Toán 8 — Tập 1", 48, h - 28);
    },
  },
  {
    id: "khtn-7-quang-hop",
    title: "Bài 22: Quang hợp ở thực vật",
    subtitle: "Khoa học tự nhiên · Lớp 7 · Chân trời sáng tạo · 45 phút",
    pageNumberLabel: "Trang 102 — KHTN 7",
    params: {
      subject: "Khoa học tự nhiên",
      grade: "Lớp 7",
      textbookSeries: "Chân trời sáng tạo",
      totalMinutes: 45,
      teacherNotes: "Tập trung phân biệt quá trình quang hợp và hô hấp tế bào, giải thích hiện tượng thực tế trồng cây xanh.",
    },
    renderCanvas: (ctx, w, h) => {
      ctx.fillStyle = "#FAFAF9";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#15803D";
      ctx.fillRect(48, 42, 110, 36);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("BÀI 22", 68, 66);

      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 27px sans-serif";
      ctx.fillText("QUANG HỢP Ở THỰC VẬT", 174, 68);

      ctx.strokeStyle = "#CBD5E1";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(48, 94);
      ctx.lineTo(w - 48, 94);
      ctx.stroke();

      // Mục tiêu bài học trên đầu trang SGK
      ctx.fillStyle = "#F0FDF4";
      ctx.fillRect(48, 112, w - 96, 78);
      ctx.fillStyle = "#15803D";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("MỤC TIÊU BÀI HỌC:", 66, 136);
      ctx.fillStyle = "#1E293B";
      ctx.font = "15px sans-serif";
      ctx.fillText("• Mô tả được một cách tổng quát quá trình quang hợp ở tế bào lá cây.", 66, 158);
      ctx.fillText("• Nêu được vai trò của lá cây với chức năng quang hợp và viết phương trình quang hợp dạng chữ.", 66, 179);

      let y = 224;
      ctx.fillStyle = "#15803D";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("1. QUÁ TRÌNH QUANG HỢP Ở THỰC VẬT", 48, y);
      y += 30;

      ctx.fillStyle = "#0F172A";
      ctx.font = "16px sans-serif";
      y = drawWrappedText(
        ctx,
        "Quan sát Hình 22.1 (Sơ đồ trao đổi chất và chuyển hóa năng lượng trong quang hợp ở lá cây) và trả lời các câu hỏi thảo luận sau:",
        48,
        y,
        w - 96,
        24
      );

      // Diagram box
      const diagY = y + 10;
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#94A3B8";
      ctx.strokeRect(48, diagY, w - 96, 210);

      // Leaf ellipse
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(w / 2, diagY + 108, 130, 56, -0.15, 0, Math.PI * 2);
      ctx.fillStyle = "#DCFCE7";
      ctx.fill();
      ctx.strokeStyle = "#15803D";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = "#14532D";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("LỤC LẠP (DIỆP LỤC)", w / 2 - 82, diagY + 106);
      ctx.font = "14px sans-serif";
      ctx.fillText("Chuyển hóa quang năng -> hóa năng", w / 2 - 112, diagY + 128);

      // Inputs & Outputs labels
      ctx.fillStyle = "#B45309";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("Ánh sáng mặt trời (Nguồn năng lượng) ↘", 72, diagY + 42);
      ctx.fillStyle = "#0369A1";
      ctx.fillText("Nước (H₂O từ rễ lên qua mạch gỗ) →", 72, diagY + 112);
      ctx.fillText("Khí Carbon dioxide (CO₂ qua khí khổng) ↗", 72, diagY + 178);

      ctx.fillStyle = "#15803D";
      ctx.fillText("↗ Khí Oxygen (O₂ thải ra môi trường)", w - 335, diagY + 58);
      ctx.fillText("↘ Chất hữu cơ (Glucose / Tinh bột)", w - 335, diagY + 166);

      y = diagY + 242;

      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("Câu hỏi thảo luận 1:", 48, y);
      ctx.font = "16px sans-serif";
      y = drawWrappedText(
        ctx,
        "Xác định các chất tham gia (nguyên liệu), sản phẩm tạo thành và các yếu tố điều kiện cần thiết của quá trình quang hợp trên Hình 22.1.",
        214,
        y,
        w - 262,
        24
      );

      y += 10;
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("Câu hỏi thảo luận 2:", 48, y);
      ctx.font = "16px sans-serif";
      y = drawWrappedText(
        ctx,
        "Trong quá trình quang hợp, năng lượng ánh sáng đã được chuyển hóa thành dạng năng lượng nào tích lũy trong hợp chất hữu cơ?",
        214,
        y,
        w - 262,
        24
      );

      y += 14;
      // Phương trình quang hợp box
      ctx.fillStyle = "#F0FDF4";
      ctx.fillRect(48, y, w - 96, 108);
      ctx.strokeStyle = "#15803D";
      ctx.strokeRect(48, y, w - 96, 108);
      ctx.fillStyle = "#15803D";
      ctx.font = "bold 17px sans-serif";
      ctx.fillText("KIẾN THỨC TRỌNG TÂM — PHƯƠNG TRÌNH QUANG HỢP:", 68, y + 30);
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 18px monospace";
      ctx.fillText("Nước + Carbon dioxide  --(Ánh sáng, Diệp lục)-->  Glucose + Oxygen", 68, y + 66);
      ctx.font = "15px sans-serif";
      ctx.fillText("Quang hợp là quá trình lá cây sử dụng nước và khí CO₂ nhờ năng lượng ánh sáng và diệp lục chế tạo chất hữu cơ.", 68, y + 94);

      y += 138;
      ctx.fillStyle = "#0F766E";
      ctx.font = "bold 17px sans-serif";
      ctx.fillText("2. ĐẶC ĐIỂM HÌNH THÁI LÁ PHÙ HỢP VỚI CHỨC NĂNG QUANG HỢP:", 48, y);
      y += 26;
      ctx.fillStyle = "#1E293B";
      ctx.font = "16px sans-serif";
      y = drawWrappedText(
        ctx,
        "Phiến lá thường dẹt và rộng giúp thu nhận nhiều ánh sáng; mạng gân lá dày đặc dẫn nước và muối khoáng; lớp biểu bì có nhiều khí khổng giúp khí CO₂ khuếch tán vào và O₂ thoát ra.",
        48,
        y,
        w - 96,
        24
      );

      y += 16;
      ctx.fillStyle = "#B45309";
      ctx.font = "bold 17px sans-serif";
      ctx.fillText("Vận dụng:", 48, y);
      ctx.fillStyle = "#0F172A";
      ctx.font = "16px sans-serif";
      drawWrappedText(
        ctx,
        "Vì sao vào ban đêm chúng ta không nên để nhiều chậu cây xanh hoặc hoa tươi trong phòng ngủ đóng kín cửa?",
        138,
        y,
        w - 186,
        24
      );

      ctx.fillStyle = "#64748B";
      ctx.font = "14px sans-serif";
      ctx.fillText("102 | Khoa học tự nhiên 7", 48, h - 28);
    },
  },
  {
    id: "lsdl-8-yen-the",
    title: "Bài 20: Khởi nghĩa Yên Thế (1884 – 1913)",
    subtitle: "Lịch sử và Địa lí · Lớp 8 · Cánh diều · 45 phút",
    pageNumberLabel: "Trang 81 — Lịch sử & Địa lí 8",
    params: {
      subject: "Lịch sử và Địa lí",
      grade: "Lớp 8",
      textbookSeries: "Cánh diều",
      totalMinutes: 45,
      teacherNotes: "Làm rõ điểm khác biệt giữa Khởi nghĩa nông dân Yên Thế với phong trào Cần Vương cùng thời kì.",
    },
    renderCanvas: (ctx, w, h) => {
      ctx.fillStyle = "#FFFDF9";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#9A3412";
      ctx.fillRect(48, 42, 110, 36);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("BÀI 20", 68, 66);

      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("PHONG TRÀO NÔNG DÂN YÊN THẾ (1884 – 1913)", 174, 67);

      ctx.strokeStyle = "#CBD5E1";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(48, 94);
      ctx.lineTo(w - 48, 94);
      ctx.stroke();

      let y = 132;
      ctx.fillStyle = "#9A3412";
      ctx.font = "bold 19px sans-serif";
      ctx.fillText("1. NGUYÊN NHÂN BÙNG NỔ VÀ ĐẶC ĐIỂM CĂN CỨ YÊN THẾ", 48, y);
      y += 28;
      ctx.fillStyle = "#1E293B";
      ctx.font = "16px sans-serif";
      y = drawWrappedText(
        ctx,
        "Yên Thế nằm ở phía tây tỉnh Bắc Giang, địa hình đồi núi hiểm trở, cây cối rậm rạp. Khi thực dân Pháp mở rộng phạm vi chiếm đóng Bắc Kì, nông dân Yên Thế đã đứng lên tự vệ bảo vệ cuộc sống và quê hương bản quán, không chịu sự chi phối của chiếu Cần Vương.",
        48,
        y,
        w - 96,
        25
      );

      y += 22;
      ctx.fillStyle = "#9A3412";
      ctx.font = "bold 19px sans-serif";
      ctx.fillText("2. CÁC GIAI ĐOẠN PHÁT TRIỂN CHÍNH CỦA CUỘC KHỞI NGHĨA", 48, y);
      y += 20;

      // Timeline table
      const stages = [
        {
          period: "1884 – 1892",
          leader: "Đề Nắm (Lương Văn Nắm)",
          events: "Nhiều toán nghĩa quân hoạt động riêng lẻ tại Yên Thế, đẩy lùi nhiều cuộc càn quét của quân Pháp.",
        },
        {
          period: "1893 – 1908",
          leader: "Đề Thám (Hoàng Hoa Thám)",
          events: "Đề Thám thống nhất lực lượng, chủ động giảng hòa hai lần với Pháp để củng cố căn cứ Phồn Xương, vừa sản xuất vừa tích trữ lương thảo, liên lạc với Phan Bội Châu và Phan Châu Trinh.",
        },
        {
          period: "1909 – 1913",
          leader: "Đề Thám chỉ huy chiến đấu",
          events: "Sau vụ đầu độc lính Pháp ở Hà Nội (1908), Pháp tập trung lực lượng lớn tấn công Yên Thế. Tháng 2/1913, Đề Thám hi sinh, phong trào tan rã.",
        },
      ];

      let rowY = y;
      stages.forEach((st) => {
        ctx.fillStyle = "#FFF7ED";
        ctx.fillRect(48, rowY, w - 96, 98);
        ctx.strokeStyle = "#FDBA74";
        ctx.strokeRect(48, rowY, w - 96, 98);

        ctx.fillStyle = "#9A3412";
        ctx.font = "bold 16px monospace";
        ctx.fillText(st.period, 64, rowY + 32);
        ctx.font = "bold 15px sans-serif";
        ctx.fillText(st.leader, 64, rowY + 60);

        ctx.fillStyle = "#1E293B";
        ctx.font = "15px sans-serif";
        drawWrappedText(ctx, st.events, 275, rowY + 28, w - 340, 22);
        rowY += 110;
      });

      y = rowY + 22;

      // Tư liệu lịch sử box
      ctx.fillStyle = "#F8FAFC";
      ctx.fillRect(48, y, w - 96, 108);
      ctx.strokeStyle = "#94A3B8";
      ctx.strokeRect(48, y, w - 96, 108);
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("Tư liệu 20.2:", 66, y + 28);
      ctx.font = "italic 15px sans-serif";
      drawWrappedText(
        ctx,
        "\"Bức tường đất của đồn Phồn Xương có những lỗ châu mai rất hiểm hóc... Đề Thám đã biến vùng rừng núi Yên Thế thành pháo đài kiên cố suốt gần 30 năm khiến nhiều tướng tá Pháp phải kinh hoàng.\" (Theo P. Đu-me)",
        66,
        y + 54,
        w - 132,
        23
      );

      y += 136;
      ctx.fillStyle = "#0F766E";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("Câu hỏi 1:", 48, y);
      ctx.fillStyle = "#0F172A";
      ctx.font = "16px sans-serif";
      y = drawWrappedText(
        ctx,
        "Trình bày nguyên nhân, diễn biến chính và ý nghĩa lịch sử của cuộc khởi nghĩa Yên Thế (1884 – 1913).",
        142,
        y,
        w - 190,
        24
      );

      y += 10;
      ctx.fillStyle = "#B45309";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("Luyện tập & Vận dụng:", 48, y);
      ctx.fillStyle = "#0F172A";
      ctx.font = "16px sans-serif";
      drawWrappedText(
        ctx,
        "So sánh mục tiêu đấu tranh, thành phần lãnh đạo và thời gian tồn tại của khởi nghĩa Yên Thế với các cuộc khởi nghĩa trong phong trào Cần Vương.",
        228,
        y,
        w - 276,
        24
      );

      ctx.fillStyle = "#64748B";
      ctx.font = "14px sans-serif";
      ctx.fillText("81 | Lịch sử và Địa lí 8", 48, h - 28);
    },
  },
];

export function generateSampleSgkImage(preset: SampleSgkPreset): UploadedPageImage {
  const width = 900;
  const height = 1180;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Không thể khởi tạo trang SGK mẫu.");
  }

  preset.renderCanvas(ctx, width, height);

  const mimeType = "image/jpeg";
  const previewUrl = canvas.toDataURL(mimeType, 0.92);
  const base64Data = previewUrl.split(",")[1] || "";

  return {
    id: `sample-${preset.id}-${Date.now()}`,
    name: `${preset.id}.jpg`,
    mimeType,
    base64Data,
    previewUrl,
  };
}

export const EXEMPLAR_RESULT_PYTHAGORE: PedagogicalAnalysisResult = {
  lessonTitle: "Bài 18: Định lí Pythagore (Tiết 1: Định lí Pythagore thuận)",
  sgkComprehensiveInventory: [
    "Hộp Thuật ngữ & Kiến thức trọng tâm: Cạnh góc vuông, cạnh huyền, Định lí Pythagore",
    "Mục 1: Định lí Pythagore — Hoạt động khám phá HĐ1 (vẽ tam giác vuông cạnh 3 cm, 4 cm và đo cạnh huyền)",
    "Hoạt động ghép hình HĐ2: Ghép 8 tam giác vuông bằng nhau cạnh a, b, c vào hai hình vuông cạnh (a + b)",
    "Hình 9.2: Tam giác ABC vuông tại A với hệ thức BC² = AB² + AC²",
    "Khung Định lí Pythagore chuẩn hóa",
    "Ví dụ 1: Tính cạnh huyền BC khi biết AB = 5 cm, AC = 12 cm",
    "Luyện tập 1: Ý a (tính cạnh huyền NP = x) và Ý b (tính cạnh góc vuông DE = x)",
    "Vận dụng thực tế: Bài toán chiếc thang dài 5 m dựa tường, chân thang cách tường 1,4 m",
  ],
  skill1: {
    coreKnowledge: [
      {
        category: "Định lý / Quy tắc",
        title: "Định lí Pythagore trong tam giác vuông",
        detail:
          "Trong một tam giác vuông, bình phương của cạnh huyền bằng tổng các bình phương của hai cạnh góc vuông (ΔABC vuông tại A ⇒ BC² = AB² + AC²).",
        sgkReference: "Mục 1 — Khung Định lí & Hình 9.2",
      },
      {
        category: "Khái niệm",
        title: "Nhận diện cạnh huyền và hai cạnh góc vuông",
        detail:
          "Cạnh huyền là cạnh đối diện với góc vuông và là cạnh lớn nhất trong tam giác vuông; hai cạnh kề góc vuông là hai cạnh góc vuông.",
        sgkReference: "Hộp Thuật ngữ & Hình 9.2",
      },
      {
        category: "Kỹ năng / Phương pháp",
        title: "Kỹ năng tính độ dài cạnh chưa biết trong tam giác vuông",
        detail:
          "Biết độ dài hai cạnh bất kỳ của tam giác vuông, thiết lập đẳng thức Pythagore để tính cạnh còn lại (cả trường hợp tìm cạnh huyền và tìm cạnh góc vuông).",
        sgkReference: "Ví dụ 1 & Luyện tập 1 (ý a, ý b)",
      },
      {
        category: "Học liệu trực quan & Bài tập SGK",
        title: "Mô hình hóa tam giác vuông trong bài toán thực tiễn",
        detail:
          "Chuyển bài toán chiếc thang 5 m dựa vào bức tường thẳng đứng, cách chân tường 1,4 m về bài toán tìm cạnh góc vuông của tam giác vuông.",
        sgkReference: "Mục Vận dụng thực tế cuối trang 94",
      },
    ],
    cognitiveBottlenecks: [
      {
        bottleneck: "Quên điều kiện tam giác vuông hoặc xác định sai cạnh huyền khi đổi tên đỉnh",
        studentMisconception:
          "Học sinh học thuộc máy móc công thức BC² = AB² + AC² nên khi gặp ΔDEF vuông tại D hoặc ΔMNP vuông tại N vẫn viết cạnh cuối cùng bình phương bằng tổng hai cạnh kia, hoặc áp dụng cho cả tam giác thường.",
        pedagogicalRemedy:
          "Yêu cầu học sinh luôn khoanh tròn đỉnh góc vuông trước tiên, xác định cạnh đối diện với đỉnh đó là 'cạnh huyền' rồi mới viết hệ thức chữ tương ứng.",
      },
      {
        bottleneck: "Nhầm phép cộng - trừ khi tìm cạnh góc vuông (Luyện tập 1b) và quên khai căn bậc hai",
        studentMisconception:
          "Ở Luyện tập 1b (biết cạnh huyền EF = 15 cm, cạnh góc vuông DF = 12 cm), học sinh dễ lấy x² = 15² + 12² theo quán tính từ Ví dụ 1, hoặc tính ra x² = 81 rồi kết luận luôn x = 81 cm mà quên lấy căn bậc hai dương.",
        pedagogicalRemedy:
          "Rèn quy trình 3 dòng chuẩn: (1) Viết định lí gốc theo cạnh huyền, (2) Thay số và chuyển vế tìm x², (3) Khai căn x = √(...) kèm kiểm tra điều kiện x > 0 và nhỏ hơn cạnh huyền.",
      },
    ],
    hookIdea: {
      title: "Bí quyết căng dây vuông góc của những người thợ xây kim tự tháp Ai Cập cổ đại",
      durationMinutes: 3,
      realWorldContext:
        "Cách đây hơn 4.000 năm, khi chưa hề có thước ê-ke kim loại hay máy bắn tia laser hiện đại, những người thợ xây Ai Cập chỉ dùng một sợi dây thừng thắt 12 nút chia đều nhau (tạo thành các đoạn 3 phần – 4 phần – 5 phần) để dựng nên những góc nền kim tự tháp vuông vức tuyệt đối.",
      openingQuestion:
        "Vì sao chỉ với một sợi dây chia thành ba đoạn dài 3 – 4 – 5 đơn vị căng thành hình tam giác, người xưa lại chắc chắn tạo ra được một góc vuông 90° chuẩn xác? Con số bí ẩn nào ẩn giấu đằng sau bộ ba 3, 4, 5?",
      teacherOpeningScript:
        "Các em thân mến, trên tay thầy/cô là một sợi dây thừng được đánh dấu đúng 12 đoạn bằng nhau. Nếu hôm nay chúng ta đóng vai những kiến trúc sư cổ đại không có ê-ke hay thước đo góc, làm thế nào để kẻ được góc tường vuông 90°? Người Ai Cập xưa đã căng sợi dây này thành tam giác có ba cạnh 3 – 4 – 5. Điều kỳ diệu gì nằm giữa ba con số ấy? Chúng ta cùng giải mã trong bài học hôm nay: Định lí Pythagore!",
      expectedCuriosityEffect:
        "Tạo xung đột nhận thức thú vị kết nối trực tiếp vào HĐ1 (tam giác vuông 3 cm – 4 cm – 5 cm) và giữ mạch xuyên suốt tới bài toán chiếc thang an toàn ở cuối tiết.",
    },
  },
  skill2: {
    objectives: {
      knowledge: [
        "Giải thích được Định lí Pythagore thuận thông qua hoạt động đo đạc và cắt ghép diện tích hình vuông (HĐ1, HĐ2).",
        "Phát biểu và viết đúng hệ thức Định lí Pythagore cho tam giác vuông với các cách đặt tên đỉnh khác nhau.",
        "Tính được độ dài cạnh chưa biết trong tam giác vuông khi biết độ dài hai cạnh kia và giải quyết bài toán thực tiễn (chiếc thang dựa tường).",
      ],
      generalCompetencies: [
        {
          name: "Tự chủ và tự học",
          manifestation:
            "Chủ động thực hiện phép đo ở HĐ1, tự hoàn thành bài tính độ dài cạnh ở Luyện tập 1a, 1b và tự kiểm tra kết quả.",
        },
        {
          name: "Giao tiếp và hợp tác",
          manifestation:
            "Thảo luận cặp đôi/nhóm 4 người để ghép hình vuông ở HĐ2, trình bày rõ ràng lập luận so sánh diện tích trước lớp.",
        },
        {
          name: "Giải quyết vấn đề và sáng tạo",
          manifestation:
            "Mô hình hóa tình huống thực tế chiếc thang dựa vào bức tường thành tam giác vuông để tính chiều cao tiếp xúc an toàn.",
        },
      ],
      specificCompetencies: [
        {
          name: "Năng lực tư duy và lập luận toán học",
          manifestation:
            "Suy luận từ sự bằng nhau của phần diện tích còn lại trong hai hình vuông cạnh (a + b) ở HĐ2 để rút ra đẳng thức c² = a² + b².",
        },
        {
          name: "Năng lực mô hình hóa toán học",
          manifestation:
            "Chuyển đổi các yếu tố thực tế (chiều dài thang 5 m, khoảng cách chân thang 1,4 m, tường thẳng đứng) sang mô hình tam giác vuông và sử dụng hệ thức Pythagore.",
        },
        {
          name: "Năng lực sử dụng công cụ, phương tiện học toán",
          manifestation:
            "Sử dụng thành thạo thước thẳng có vạch chia, ê-ke trong HĐ1 và máy tính cầm tay để khai căn bậc hai ở bài toán Vận dụng.",
        },
      ],
      qualities: [
        {
          name: "Chăm chỉ",
          manifestation:
            "Tích cực tham gia thao tác vẽ hình, đo đạc và hoàn thành đầy đủ các nhiệm vụ học tập cá nhân và nhóm.",
        },
        {
          name: "Trung thực",
          manifestation:
            "Ghi nhận trung thực số liệu đo thực tế ở HĐ1 và khách quan khi nhận xét chéo bài làm của bạn.",
        },
        {
          name: "Trách nhiệm",
          manifestation:
            "Hoàn thành phần việc được giao trong nhóm ghép hình HĐ2 và có ý thức an toàn lao động qua bài toán đặt thang thực tế.",
        },
      ],
    },
    equipmentAndMaterials: {
      teacher: [
        "Sách giáo khoa Toán 8 (Kết nối tri thức), Kế hoạch bài dạy chuẩn Công văn 5512.",
        "Sợi dây thừng thắt 12 nút chia đều minh họa tình huống mở đầu (Hook).",
        "Bộ bìa cứng gồm 8 tam giác vuông bằng nhau (cạnh góc vuông a, b; cạnh huyền c) và 2 khung hình vuông cạnh (a + b) cho HĐ2.",
        "Phiếu học tập số 1 (Luyện tập 1a, 1b) và thước thẳng, ê-ke bảng.",
      ],
      student: [
        "Sách giáo khoa Toán 8, vở ghi, thước thẳng có chia vạch milimét, ê-ke, máy tính cầm tay.",
        "Bộ giấy cắt sẵn 8 tam giác vuông nhỏ theo nhóm 4 học sinh.",
      ],
    },
    activities: [
      {
        activityNumber: 1,
        activityName: "Hoạt động 1: Mở đầu / Khởi động",
        durationMinutes: 5,
        objectives: [
          "Khơi gợi sự tò mò về mối liên hệ đặc biệt giữa ba cạnh của tam giác vuông (3 – 4 – 5).",
          "Tạo tâm thế hứng khởi dẫn dắt vào hoạt động khám phá Định lí Pythagore.",
        ],
        content:
          "Học sinh quan sát mô hình sợi dây thừng 12 nút của thợ xây Ai Cập cổ đại (chia thành 3 đoạn tỉ lệ 3 : 4 : 5) và dự đoán mối quan hệ toán học giữa bình phương độ dài ba đoạn dây.",
        expectedProducts: [
          "Học sinh nhận thấy khi căng ba đoạn dây 3 – 4 – 5 thì góc đối diện đoạn dài nhất (5 đơn vị) tạo thành góc vuông.",
          "Dự đoán ban đầu: 3² + 4² = 9 + 16 = 25 = 5².",
        ],
        implementation: {
          step1TransferTask: {
            teacherAction:
              "Trình chiếu hình ảnh kim tự tháp Ai Cập và trực tiếp căng sợi dây 12 nút thành tam giác có độ dài 3 – 4 – 5 trên bảng từ, nêu câu hỏi mở đầu.",
            teacherScript:
              "Các em hãy quan sát sợi dây thắt 12 nút mà những người thợ xây Ai Cập cổ đại từng dùng. Khi thầy/cô cố định ba đỉnh tạo thành ba cạnh dài 3 phần, 4 phần và 5 phần, hãy thử đoán góc tạo bởi hai cạnh 3 và 4 có gì đặc biệt? Và nếu lấy bình phương các số 3, 4, 5 thì có điều gì thú vị xảy ra?",
            studentAction:
              "Quan sát trực quan mô hình dây trên bảng, lắng nghe câu hỏi và suy nghĩ cá nhân trong 1 phút.",
          },
          step2PerformTask: {
            teacherAction:
              "Mời 1 học sinh lên dùng ê-ke kiểm chứng góc trên bảng, đồng thời quan sát phản ứng tính nhẩm của cả lớp.",
            studentAction:
              "Một đại diện kiểm tra bằng ê-ke tại bảng; học sinh dưới lớp nhẩm nhanh 3², 4² và 5².",
            supportForStrugglingStudents:
              "Gợi ý học sinh tính lần lượt 3² = 9, 4² = 16, 5² = 25 rồi thử thực hiện phép cộng hai số nhỏ hơn.",
          },
          step3ReportDiscuss: {
            teacherAction: "Gọi 2 học sinh nêu phát hiện về số đo góc và đẳng thức số học giữa 9, 16 và 25.",
            teacherScript:
              "Bạn vừa đặt ê-ke vào và cả lớp đều thấy góc đó khít 90°! Vậy còn mối liên hệ giữa 3², 4² và 5² thì sao? Thầy/cô mời em chia sẻ phát hiện của mình nào!",
            studentAction:
              "Báo cáo kết quả: góc giữa cạnh 3 và cạnh 4 là góc vuông, đồng thời 3² + 4² = 5².",
          },
          step4ConcludeJudge: {
            teacherAction:
              "Ghi nhận phát hiện của học sinh và đặt vấn đề dẫn dắt vào bài mới (liệu tính chất này có đúng với mọi tam giác vuông hay không).",
            teacherScript:
              "Phát hiện của các em rất nhạy bén! Nhưng liệu đẳng thức 3² + 4² = 5² chỉ là sự trùng hợp ngẫu nhiên của bộ ba 3 – 4 – 5, hay nó đúng với MỌI tam giác vuông bất kỳ? Chúng ta cùng bước vào Bài 18: Định lí Pythagore để tìm câu trả lời chắc chắn.",
            coreBoardNotes: ["BÀI 18: ĐỊNH LÍ PYTHAGORE"],
          },
        },
      },
      {
        activityNumber: 2,
        activityName: "Hoạt động 2: Hình thành kiến thức mới",
        durationMinutes: 20,
        objectives: [
          "Thực hiện được HĐ1 (đo đạc) và HĐ2 (ghép hình diện tích) để tự khám phá hệ thức c² = a² + b².",
          "Phát biểu chính xác Định lí Pythagore và vận dụng trình bày mẫu Ví dụ 1 trong SGK.",
        ],
        content:
          "Thực hiện tuần tự 3 nhiệm vụ bám sát SGK trang 94: (1) Cá nhân vẽ và đo ở HĐ1; (2) Thảo luận nhóm 4 thực hiện ghép hình HĐ2 trên bộ học liệu bìa để suy ra c² = a² + b²; (3) Phát biểu Định lí Pythagore, ghi hệ thức với ΔABC vuông tại A (Hình 9.2) và giải Ví dụ 1 (AB = 5 cm, AC = 12 cm, tính BC).",
        expectedProducts: [
          "HĐ1: Tam giác vuông hai cạnh góc vuông 3 cm, 4 cm đo được cạnh huyền bằng 5 cm; 5² = 3² + 4² = 25.",
          "HĐ2: Cả hai hình vuông lớn đều có diện tích (a + b)². Sau khi đặt 4 tam giác vuông bằng nhau vào mỗi hình vuông, phần diện tích không bị che ở Hình 1 là c², ở Hình 2 là a² + b². Suy ra c² = a² + b².",
          "Hệ thức Hình 9.2: ΔABC vuông tại A ⇒ BC² = AB² + AC².",
          "Lời giải Ví dụ 1: Áp dụng Định lí Pythagore cho ΔABC vuông tại A: BC² = AB² + AC² = 5² + 12² = 25 + 144 = 169 ⇒ BC = √169 = 13 (cm).",
        ],
        implementation: {
          step1TransferTask: {
            teacherAction:
              "Chia nhiệm vụ làm 2 chặng: Chặng 1 (7 phút) thực hiện HĐ1 cá nhân và HĐ2 theo nhóm 4 với bộ bìa ghép hình; Chặng 2 (6 phút) rút ra Định lí và hoàn thành Ví dụ 1.",
            teacherScript:
              "Trước hết, mỗi em hãy nhanh tay vẽ vào vở tam giác vuông hai cạnh 3 cm, 4 cm ở HĐ1. Ngay sau đó, các nhóm 4 bạn hãy mở phong bì học liệu để ghép 8 tam giác vuông vào 2 khung hình vuông cạnh (a + b) như HĐ2 trong SGK trang 94. Hãy quan sát thật kỹ phần diện tích màu trắng còn lại ở hai khung nhé!",
            studentAction:
              "Cá nhân vẽ hình HĐ1, sau đó hợp tác nhóm 4 người sắp xếp các mảnh tam giác vuông vào hai khung hình vuông và ghi nhận xét ra bảng nhóm.",
          },
          step2PerformTask: {
            teacherAction:
              "Đi quanh các nhóm kiểm tra cách đặt 4 tam giác vuông sao cho không chồng lấn, đặt câu hỏi gợi mở về diện tích phần trống.",
            studentAction:
              "Thao tác ghép hình, biểu diễn diện tích phần không bị che của khung thứ nhất theo c và khung thứ hai theo a, b; sau đó đọc khung Định lí và tự làm Ví dụ 1.",
            supportForStrugglingStudents:
              "Nếu nhóm lúng túng vì sao phần trống ở khung 1 là hình vuông cạnh c: gợi ý học sinh tính tổng hai góc nhọn của tam giác vuông bằng 90°, suy ra góc của tứ giác ở giữa bằng 180° - 90° = 90°.",
          },
          step3ReportDiscuss: {
            teacherAction:
              "Mời 1 nhóm gắn sản phẩm ghép hình HĐ2 lên bảng thuyết trình, các nhóm khác nhận xét; tiếp tục gọi 1 học sinh lên bảng trình bày Ví dụ 1.",
            teacherScript:
              "Nhóm 2 đã hoàn thành mô hình ghép rất trực quan! Xin mời đại diện nhóm chỉ rõ cho cả lớp: vì sao dù cách sắp xếp ở hai khung khác nhau nhưng phần diện tích còn lại ở hai khung chắc chắn bằng nhau? Và từ đó ta rút ra công thức gì cho Ví dụ 1?",
            studentAction:
              "Đại diện nhóm giải thích dựa trên diện tích hai hình vuông gốc bằng nhau cùng trừ đi diện tích 4 tam giác vuông; cả lớp nhận xét lời giải Ví dụ 1 trên bảng.",
          },
          step4ConcludeJudge: {
            teacherAction:
              "Chuẩn hóa phát biểu Định lí Pythagore, khắc sâu quy tắc 'khoanh đỉnh góc vuông -> tìm cạnh huyền đối diện' để phòng ngừa điểm nghẽn nhận thức.",
            teacherScript:
              "Chính xác! Từ trực quan diện tích, nhà toán học Pythagore đã đúc kết thành định lí bất hủ. Các em lưu ý một bí quyết vàng: trước khi viết công thức, hãy luôn xác định ĐỈNH GÓC VUÔNG trước; cạnh nằm đối diện góc vuông đó chính là cạnh huyền đứng một mình ở vế trái!",
            coreBoardNotes: [
              "1. Định lí Pythagore: Trong một tam giác vuông, bình phương của cạnh huyền bằng tổng các bình phương của hai cạnh góc vuông.",
              "ΔABC vuông tại A ⇒ BC² = AB² + AC²",
              "Ví dụ 1: ΔABC vuông tại A ⇒ BC² = 5² + 12² = 169 ⇒ BC = 13 (cm).",
            ],
          },
        },
      },
      {
        activityNumber: 3,
        activityName: "Hoạt động 3: Luyện tập",
        durationMinutes: 12,
        objectives: [
          "Vận dụng thành thạo Định lí Pythagore cho cả hai dạng bài: tính cạnh huyền (Luyện tập 1a) và tính cạnh góc vuông (Luyện tập 1b) với tên đỉnh thay đổi.",
          "Khắc phục triệt để lỗi nhầm lẫn cộng/trừ khi tìm cạnh góc vuông và lỗi quên khai căn bậc hai.",
        ],
        content:
          "Hoàn thành Phiếu học tập số 1 giải trọn vẹn Luyện tập 1 trong SGK trang 94:\n- Ý a) Cho ΔMNP vuông tại M có MN = 6 cm, MP = 8 cm. Tính NP = x.\n- Ý b) Cho ΔDEF vuông tại D có DF = 12 cm, EF = 15 cm. Tính DE = x.",
        expectedProducts: [
          "Ý a) Áp dụng Định lí Pythagore vào ΔMNP vuông tại M (cạnh huyền NP): x² = NP² = MN² + MP² = 6² + 8² = 36 + 64 = 100 ⇒ x = √100 = 10 (cm).",
          "Ý b) Áp dụng Định lí Pythagore vào ΔDEF vuông tại D (cạnh huyền EF): EF² = DE² + DF² ⇒ 15² = x² + 12² ⇒ x² = 225 - 144 = 81 ⇒ x = √81 = 9 (cm).",
        ],
        implementation: {
          step1TransferTask: {
            teacherAction:
              "Phát Phiếu học tập số 1 (Luyện tập 1a, 1b), yêu cầu học sinh làm cá nhân trong 5 phút rồi đổi chéo vở kiểm tra theo cặp đôi trong 2 phút.",
            teacherScript:
              "Bây giờ chúng ta cùng thử sức với Luyện tập 1 ở SGK trang 94. Hãy cẩn thận ở ý b nhé: tam giác DEF vuông tại đỉnh nào, cạnh nào mới là cạnh huyền đã biết? Các em có 5 phút làm bài cá nhân trước khi đổi vở chấm chéo cùng bạn bên cạnh.",
            studentAction: "Nhận phiếu học tập, xác định góc vuông và cạnh huyền ở từng ý rồi trình bày lời giải chi tiết.",
          },
          step2PerformTask: {
            teacherAction:
              "Quan sát vở học sinh, đặc biệt lưu ý những bài làm ở ý b xem có học sinh nào cộng nhầm 15² + 12² hay không để chọn làm tình huống phân tích sai lầm.",
            studentAction:
              "Cá nhân giải bài, sau đó trao đổi vở với bạn cùng bàn để đối chiếu bước viết hệ thức và bước khai căn.",
            supportForStrugglingStudents:
              "Nhắc học sinh viết dòng gốc EF² = DE² + DF² trước, sau đó thay số 15² = x² + 12² rồi mới thực hiện phép trừ tìm số hạng chưa biết x².",
          },
          step3ReportDiscuss: {
            teacherAction:
              "Mời 2 học sinh lên bảng trình bày song song ý a và ý b; nêu tình huống giả định lỗi cộng nhầm ở ý b để cả lớp phân tích.",
            teacherScript:
              "Cả lớp cùng nhìn lên bài giải ý b của bạn. Nếu có một bạn viết x² = 15² + 12² = 369 thì bạn ấy đã mắc 'bẫy' ở đâu? Làm cách nào kiểm tra nhanh xem kết quả x tìm được có hợp lý hay không?",
            studentAction:
              "Chỉ rõ EF là cạnh huyền nên DE = x là cạnh góc vuông phải nhỏ hơn 15 cm (nếu cộng lại sẽ lớn hơn cạnh huyền là vô lý).",
          },
          step4ConcludeJudge: {
            teacherAction:
              "Nhận xét, tuyên dương các cặp đôi chấm chéo chính xác và chốt quy trình 3 bước trình bày bài toán tính cạnh.",
            teacherScript:
              "Rất tuyệt vời! Các em hãy nhớ dấu hiệu tự kiểm tra cực nhanh: cạnh góc vuông tìm được bao giờ cũng phải NHỎ HƠN cạnh huyền. Nắm vững nguyên tắc này, các em sẽ không bao giờ nhầm dấu cộng và dấu trừ nữa.",
            coreBoardNotes: [
              "2. Luyện tập 1:",
              "a) ΔMNP vuông tại M: x² = 6² + 8² = 100 ⇒ x = 10 (cm).",
              "b) ΔDEF vuông tại D: 15² = x² + 12² ⇒ x² = 15² - 12² = 81 ⇒ x = 9 (cm).",
            ],
          },
        },
      },
      {
        activityNumber: 4,
        activityName: "Hoạt động 4: Vận dụng",
        durationMinutes: 8,
        objectives: [
          "Giải quyết trọn vẹn bài toán thực tế cuối trang 94 (chiếc thang dài 5 m dựa vào tường).",
          "Kết nối kiến thức toán học với quy tắc an toàn lao động trong đời sống gia đình.",
        ],
        content:
          "Giải bài toán Vận dụng SGK trang 94: Một chiếc thang dài 5 m đặt dựa vào một bức tường thẳng đứng, chân thang cách chân tường 1,4 m để đảm bảo an toàn. Tính độ cao đầu trên của thang chạm tường (làm tròn đến hàng phần mười hoặc tính chính xác). Giao thêm nhiệm vụ về nhà kiểm tra góc vuông mặt bàn/góc phòng bằng thước dây.",
        expectedProducts: [
          "Vẽ hình minh họa tam giác ABC vuông tại A (chân tường), trong đó cạnh huyền BC = 5 m (chiều dài thang), cạnh góc vuông AB = 1,4 m (khoảng cách từ chân thang tới chân tường), cần tính chiều cao AC.",
          "Áp dụng Định lí Pythagore cho ΔABC vuông tại A: BC² = AB² + AC² ⇒ 5² = 1,4² + AC² ⇒ AC² = 25 - 1,96 = 23,04 ⇒ AC = √23,04 = 4,8 (m).",
          "Kết luận: Đầu trên của thang chạm tường ở độ cao đúng 4,8 m.",
        ],
        implementation: {
          step1TransferTask: {
            teacherAction:
              "Trình chiếu hình vẽ chiếc thang dựa vào bức tường ở mục Vận dụng SGK trang 94, yêu cầu học sinh hoạt động cặp đôi vẽ phác tam giác vuông mô hình hóa và tính độ cao.",
            teacherScript:
              "Từ kim tự tháp cổ đại đầu giờ, bây giờ chúng ta trở về ngay ngôi nhà của mình! Khi bố mẹ dùng chiếc thang 5 m dựa vào tường, để thang không bị trượt ngã, chân thang phải đặt cách chân tường 1,4 m. Vậy đầu thang vươn tới độ cao bao nhiêu mét trên tường? Các cặp đôi hãy vẽ nhanh mô hình tam giác vuông và tìm đáp số trong 3 phút!",
            studentAction: "Thảo luận cặp đôi, đặt tên các đỉnh A, B, C cho chân tường, chân thang, đỉnh thang và thực hiện phép tính.",
          },
          step2PerformTask: {
            teacherAction:
              "Quan sát cách học sinh đặt ký hiệu trên hình vẽ thực tế và kiểm tra phép tính số thập phân 1,4².",
            studentAction:
              "Vẽ hình phác thảo, thiết lập AC² = 5² - 1,4² = 23,04 và bấm máy tính khai căn được AC = 4,8 m.",
            supportForStrugglingStudents:
              "Hướng dẫn học sinh xác định góc vuông nằm ở đâu trong thực tế (giữa bức tường thẳng đứng và mặt đất nằm ngang tại chân tường).",
          },
          step3ReportDiscuss: {
            teacherAction: "Gọi 1 đại diện cặp đôi đọc nhanh mô hình hóa và kết quả, cả lớp đối chiếu.",
            teacherScript:
              "Xin mời cặp đôi bàn 3 chia sẻ: trong hình ảnh chiếc thang dựa tường, yếu tố nào đóng vai trò là cạnh huyền và kết quả độ cao các em tính được là bao nhiêu?",
            studentAction:
              "Trình bày rõ: chiếc thang dài 5 m nghiêng tạo thành cạnh huyền, tường và mặt đất là hai cạnh góc vuông; độ cao tính được chính xác là 4,8 m.",
          },
          step4ConcludeJudge: {
            teacherAction:
              "Khẳng định đáp số 4,8 m, liên hệ quy tắc an toàn đặt thang (tỉ lệ khoảng 1 : 4) và dặn dò nhiệm vụ trải nghiệm ở nhà.",
            teacherScript:
              "Đáp số 4,8 m hoàn toàn chính xác! Các em thấy đấy, toán học giúp chúng ta tính toán chính xác độ cao làm việc mà vẫn giữ an toàn tuyệt đối. Về nhà, mỗi em hãy dùng thước cuộn đo thử ba đoạn 60 cm – 80 cm – 100 cm ở góc bàn học hoặc góc tường phòng mình để kiểm tra xem thợ mộc, thợ xây đã làm vuông góc chuẩn chưa nhé! Tiết học của chúng ta khép lại tại đây.",
            coreBoardNotes: [
              "3. Vận dụng thực tế:",
              "Gọi chiều cao đầu thang chạm tường là h (m, h > 0). Ta có: h² = 5² - 1,4² = 23,04 ⇒ h = 4,8 (m).",
              "Nhiệm vụ về nhà: Hoàn thành bài tập SGK và thực hành kiểm tra góc vuông tại nhà bằng bộ ba 60 – 80 – 100 (cm).",
            ],
          },
        },
      },
    ],
  },
};
