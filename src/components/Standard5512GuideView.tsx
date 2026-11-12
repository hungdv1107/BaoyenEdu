interface Standard5512GuideViewProps {
  onBackToStudio: () => void;
}

export function Standard5512GuideView({ onBackToStudio }: Standard5512GuideViewProps) {
  const activitiesSpec = [
    {
      index: "01",
      name: "Hoạt động 1: Mở đầu / Khởi động",
      ratio: "10% – 15% (~5 phút / tiết 45p)",
      purpose:
        "Xác định vấn đề/nhiệm vụ học tập cần giải quyết; kết nối tri thức, kinh nghiệm sẵn có của học sinh và tạo hứng thú nhận thức (Hook).",
      productNote:
        "Câu trả lời ban đầu, dự đoán hoặc phát hiện mâu thuẫn nhận thức của học sinh (không dạy trước kiến thức mới).",
    },
    {
      index: "02",
      name: "Hoạt động 2: Hình thành kiến thức mới",
      ratio: "40% – 45% (~18–22 phút / tiết 45p)",
      purpose:
        "Giúp học sinh tự chiếm lĩnh kiến thức, khái niệm, định lý, quy tắc mới thông qua chuỗi hoạt động khám phá trên học liệu/SGK.",
      productNote:
        "Định nghĩa, công thức, kết luận khoa học, bảng tổng hợp hoặc câu trả lời hoàn chỉnh cho các câu hỏi thảo luận trong SGK.",
    },
    {
      index: "03",
      name: "Hoạt động 3: Luyện tập",
      ratio: "25% – 30% (~10–13 phút / tiết 45p)",
      purpose:
        "Củng cố, rèn kỹ năng áp dụng trực tiếp kiến thức vừa học để giải các bài tập cơ bản và phân hóa trong SGK; tháo gỡ điểm nghẽn tư duy.",
      productNote:
        "Lời giải chi tiết các bài tập Luyện tập trong SGK, phiếu học tập hoàn chỉnh, nhận xét chấm chéo của học sinh.",
    },
    {
      index: "04",
      name: "Hoạt động 4: Vận dụng",
      ratio: "15% – 20% (~6–8 phút / tiết 45p)",
      purpose:
        "Đưa kiến thức vào giải quyết tình huống thực tiễn đời sống, mở rộng tìm tòi tại lớp hoặc hướng dẫn thực hiện tiếp ở ngoài lớp học.",
      productNote:
        "Mô hình hóa bài toán thực tế, phương án xử lý tình huống đời sống hoặc sản phẩm dự án ngắn hạn ở nhà.",
    },
  ];

  const fourSteps = [
    {
      step: "Bước 1: Chuyển giao nhiệm vụ",
      detail:
        "Giáo viên giao nhiệm vụ rõ ràng, gọn mạch (làm cá nhân, cặp đôi hay nhóm; thời gian bao lâu; làm trên học liệu nào) kèm lời dẫn gợi mở tự nhiên.",
    },
    {
      step: "Bước 2: Thực hiện nhiệm vụ",
      detail:
        "Học sinh độc lập suy nghĩ hoặc hợp tác nhóm tạo ra sản phẩm; giáo viên quan sát, phát hiện khó khăn và đặt câu hỏi gợi mở phân hóa kịp thời.",
    },
    {
      step: "Bước 3: Báo cáo, thảo luận",
      detail:
        "Giáo viên chọn đại diện báo cáo (ưu tiên hiển thị cả cách làm đúng và tình huống sai lầm điển hình để mổ xẻ), tổ chức học sinh nhận xét, phản biện chéo.",
    },
    {
      step: "Bước 4: Kết luận, nhận định",
      detail:
        "Giáo viên đánh giá quá trình & sản phẩm của học sinh, chuẩn hóa kiến thức cốt lõi ghi bảng/vở và chuyển ý mượt mà sang hoạt động kế tiếp.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold text-teal-800">
            Cẩm nang đối chiếu chuyên môn · Phụ lục IV Công văn 5512/BGDĐT-GDTrH
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Tiêu chuẩn thiết kế Kế hoạch bài dạy theo Chương trình GDPT 2018
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Hệ thống Bảo Yến AI Edu tuân thủ nghiêm ngặt khung cấu trúc Phụ lục IV ban hành kèm Công văn 5512 của Bộ Giáo dục và Đào tạo, kết hợp phân tích điểm nghẽn nhận thức trước khi xây dựng tiến trình.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToStudio}
          className="rounded-lg bg-teal-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0"
        >
          Quay lại Không gian soạn
        </button>
      </div>

      {/* Bảng 4 hoạt động */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-slate-900">
          1. Khung phân bổ 4 hoạt động dạy học cốt lõi
        </h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                <th className="py-3 px-4 w-64">Hoạt động</th>
                <th className="py-3 px-4 w-48">Tỷ trọng thời lượng</th>
                <th className="py-3 px-4">Trọng tâm sư phạm</th>
                <th className="py-3 px-4 w-64">Yêu cầu về Sản phẩm (Mục c)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {activitiesSpec.map((item) => (
                <tr key={item.index} className="align-top">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-xs text-teal-800 font-medium">
                    {item.ratio}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 leading-relaxed">
                    {item.purpose}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs leading-relaxed">
                    {item.productNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quy trình 4 mục & 4 bước */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-900">
            2. Bốn thành tố bắt buộc trong mỗi hoạt động
          </h2>
          <ul className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <li>
              <span className="font-semibold text-slate-900">a) Mục tiêu:</span> Nêu rõ yêu cầu học sinh cần đạt được khi tham gia hoạt động (đóng góp trực tiếp vào mục tiêu chung của bài).
            </li>
            <li>
              <span className="font-semibold text-slate-900">b) Nội dung:</span> Mô tả cụ thể nhiệm vụ học tập học sinh phải thực hiện (đọc tư liệu nào, quan sát hình nào, giải câu hỏi/phiếu bài tập nào trong SGK).
            </li>
            <li>
              <span className="font-semibold text-slate-900">c) Sản phẩm:</span> Đáp án cụ thể, lời giải mẫu, kết quả thí nghiệm hoặc tiêu chí đánh giá câu trả lời của học sinh.
            </li>
            <li>
              <span className="font-semibold text-slate-900">d) Tổ chức thực hiện:</span> Trình bày rõ chuỗi tương tác sư phạm giữa Giáo viên và Học sinh theo đúng 4 bước.
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-900">
            3. Chu trình 4 bước tổ chức hoạt động học
          </h2>
          <div className="space-y-3 text-sm">
            {fourSteps.map((s) => (
              <div key={s.step} className="space-y-0.5">
                <p className="font-semibold text-teal-900">{s.step}</p>
                <p className="text-slate-700 leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Động từ đo lường YCCĐ & Hệ phẩm chất năng lực */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-slate-900">
          4. Hệ thống Năng lực chung, Phẩm chất & Động từ viết Mục tiêu (CT GDPT 2018)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900">
              Động từ hành động đo lường được
            </h3>
            <p className="text-xs text-slate-500">
              Tránh dùng từ mơ hồ như “Nắm được”, “Hiểu được”, “Biết được”:
            </p>
            <ul className="space-y-1 text-slate-700 text-xs leading-relaxed">
              <li>• Mức Nhận biết: Nêu được, phát biểu được, nhận dạng được, liệt kê được, chỉ ra được.</li>
              <li>• Mức Thông hiểu: Trình bày được, giải thích được, phân biệt được, so sánh được, mô tả được.</li>
              <li>• Mức Vận dụng: Tính được, chứng minh được, mô hình hóa được, giải quyết được, đề xuất được.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900">
              3 Năng lực chung cốt lõi
            </h3>
            <ul className="space-y-1.5 text-slate-700 text-xs leading-relaxed">
              <li>• Năng lực tự chủ và tự học (tự nghiên cứu SGK, tự đánh giá, điều chỉnh sai sót).</li>
              <li>• Năng lực giao tiếp và hợp tác (phân công nhóm, trình bày lập luận, phản biện tích cực).</li>
              <li>• Năng lực giải quyết vấn đề và sáng tạo (phát hiện vấn đề thực tế, đề xuất giải pháp).</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900">
              5 Phẩm chất chủ yếu
            </h3>
            <ul className="space-y-1.5 text-slate-700 text-xs leading-relaxed">
              <li>• Yêu nước · Nhân ái · Chăm chỉ · Trung thực · Trách nhiệm.</li>
              <li>• Khi soạn KHBD 5512, chỉ chọn 2–3 phẩm chất gắn chặt nhất với hành vi học tập thực tế của học sinh trong tiết dạy (không liệt kê hình thức cả 5 phẩm chất).</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
