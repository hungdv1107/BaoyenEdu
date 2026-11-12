import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { LessonInputParams, PedagogicalAnalysisResult } from "../types/lessonPlan";

const FONT_FAMILY = "Times New Roman";
const BODY_SIZE = 26; // 13pt in half-points
const SMALL_SIZE = 24; // 12pt

const CELL_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "94A3B8" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "94A3B8" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "94A3B8" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "94A3B8" },
};

function p(
  text: string,
  opts?: {
    bold?: boolean;
    italics?: boolean;
    size?: number;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    spacingAfter?: number;
    spacingBefore?: number;
    color?: string;
  }
): Paragraph {
  return new Paragraph({
    alignment: opts?.align ?? AlignmentType.LEFT,
    spacing: {
      before: opts?.spacingBefore ?? 60,
      after: opts?.spacingAfter ?? 100,
      line: 312,
    },
    children: [
      new TextRun({
        text,
        font: FONT_FAMILY,
        size: opts?.size ?? BODY_SIZE,
        bold: opts?.bold ?? false,
        italics: opts?.italics ?? false,
        color: opts?.color ?? "0F172A",
      }),
    ],
  });
}

function labeledParagraph(label: string, content: string, italicsContent = false): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 100, line: 312 },
    children: [
      new TextRun({
        text: `${label}: `,
        font: FONT_FAMILY,
        size: BODY_SIZE,
        bold: true,
        color: "0F172A",
      }),
      new TextRun({
        text: content,
        font: FONT_FAMILY,
        size: BODY_SIZE,
        italics: italicsContent,
        color: "0F172A",
      }),
    ],
  });
}

export async function downloadDocxLessonPlan(
  result: PedagogicalAnalysisResult,
  params: LessonInputParams,
  mode: "full" | "5512_only" = "full"
): Promise<void> {
  const children: Array<Paragraph | Table> = [];

  // Header
  children.push(
    p("HỆ SINH THÁI SƯ PHẠM BẢO YẾN AI EDU", {
      bold: true,
      size: SMALL_SIZE,
      align: AlignmentType.CENTER,
      color: "0F766E",
      spacingAfter: 40,
    }),
    p(
      mode === "full"
        ? "HỒ SƠ PHÂN TÍCH SÁCH GIÁO KHOA & KẾ HOẠCH BÀI DẠY (CÔNG VĂN 5512)"
        : "KẾ HOẠCH BÀI DẠY CHUẨN CÔNG VĂN 5512/BGDĐT-GDTrH",
      {
        bold: true,
        size: 30,
        align: AlignmentType.CENTER,
        spacingAfter: 80,
      }
    ),
    p(`TÊN BÀI DẠY: ${result.lessonTitle.toUpperCase()}`, {
      bold: true,
      size: 28,
      align: AlignmentType.CENTER,
      spacingAfter: 60,
    }),
    p(
      `Môn học: ${params.subject}  |  Khối lớp: ${params.grade}  |  Bộ sách: ${params.textbookSeries}  |  Thời lượng: ${params.totalMinutes} phút`,
      {
        italics: true,
        align: AlignmentType.CENTER,
        spacingAfter: 240,
      }
    )
  );

  if (mode === "full") {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 140 },
        children: [
          new TextRun({
            text: "PHẦN 1: PHÂN TÍCH SGK & Ý TƯỞNG KỊCH BẢN (SKILL 1)",
            font: FONT_FAMILY,
            size: 28,
            bold: true,
            color: "0F766E",
          }),
        ],
      })
    );

    // 1. Kiến thức cốt lõi
    children.push(
      p("1. Trích xuất kiến thức cốt lõi từ trang Sách giáo khoa", {
        bold: true,
        spacingBefore: 140,
      })
    );

    const coreRows = [
      new TableRow({
        tableHeader: true,
        children: ["Phân loại", "Đơn vị kiến thức / Kỹ năng", "Nội dung chi tiết trong SGK", "Vị trí SGK"].map(
          (headerText, idx) =>
            new TableCell({
              borders: CELL_BORDERS,
              shading: { fill: "F1F5F9" },
              width: { size: idx === 2 ? 42 : idx === 1 ? 24 : 17, type: WidthType.PERCENTAGE },
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [p(headerText, { bold: true, size: SMALL_SIZE })],
            })
        ),
      }),
      ...result.skill1.coreKnowledge.map(
        (item) =>
          new TableRow({
            children: [item.category, item.title, item.detail, item.sgkReference].map(
              (val, idx) =>
                new TableCell({
                  borders: CELL_BORDERS,
                  margins: { top: 80, bottom: 80, left: 100, right: 100 },
                  children: [p(val, { bold: idx === 1, size: SMALL_SIZE })],
                })
            ),
          })
      ),
    ];

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: coreRows,
      })
    );

    // 2. Điểm nghẽn nhận thức
    children.push(
      p("2. Điểm nghẽn nhận thức (Dự đoán khó khăn của học sinh & Giải pháp tháo gỡ)", {
        bold: true,
        spacingBefore: 200,
      })
    );

    const bottleneckRows = [
      new TableRow({
        tableHeader: true,
        children: ["Điểm nghẽn nhận thức", "Biểu hiện hiểu nhầm của học sinh", "Giải pháp sư phạm tháo gỡ"].map(
          (headerText) =>
            new TableCell({
              borders: CELL_BORDERS,
              shading: { fill: "F1F5F9" },
              width: { size: 33, type: WidthType.PERCENTAGE },
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [p(headerText, { bold: true, size: SMALL_SIZE })],
            })
        ),
      }),
      ...result.skill1.cognitiveBottlenecks.map(
        (b) =>
          new TableRow({
            children: [b.bottleneck, b.studentMisconception, b.pedagogicalRemedy].map(
              (textVal, idx) =>
                new TableCell({
                  borders: CELL_BORDERS,
                  margins: { top: 80, bottom: 80, left: 100, right: 100 },
                  children: [p(textVal, { bold: idx === 0, size: SMALL_SIZE })],
                })
            ),
          })
      ),
    ];

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: bottleneckRows,
      })
    );

    // 3. Hook
    const hook = result.skill1.hookIdea;
    children.push(
      p(`3. Ý tưởng trục xuyên suốt (Hook - ${hook.durationMinutes} phút đầu tiết): ${hook.title}`, {
        bold: true,
        spacingBefore: 200,
      }),
      labeledParagraph("- Tình huống thực tế", hook.realWorldContext),
      labeledParagraph("- Câu hỏi mở đầu gây tò mò", hook.openingQuestion),
      labeledParagraph("- Lời dẫn gợi mở của giáo viên", `"${hook.teacherOpeningScript}"`, true),
      labeledParagraph("- Hiệu quả kết nối bài học", hook.expectedCuriosityEffect)
    );
  }

  // PHẦN 2: KHBD 5512
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 280, after: 140 },
      children: [
        new TextRun({
          text:
            mode === "full"
              ? "PHẦN 2: KẾ HOẠCH BÀI DẠY CHUẨN CÔNG VĂN 5512 (SKILL 2)"
              : "NỘI DUNG KẾ HOẠCH BÀI DẠY",
          font: FONT_FAMILY,
          size: 28,
          bold: true,
          color: "0F766E",
        }),
      ],
    })
  );

  // I. MỤC TIÊU
  children.push(p("I. MỤC TIÊU BÀI HỌC", { bold: true, spacingBefore: 140 }));
  children.push(p("1. Về kiến thức:", { bold: true }));
  result.skill2.objectives.knowledge.forEach((k) => {
    children.push(p(`- ${k}`));
  });

  children.push(p("2. Về năng lực:", { bold: true, spacingBefore: 100 }));
  children.push(p("* Năng lực chung:", { italics: true, bold: true }));
  result.skill2.objectives.generalCompetencies.forEach((c) => {
    children.push(labeledParagraph(`  + ${c.name}`, c.manifestation));
  });
  children.push(p("* Năng lực đặc thù:", { italics: true, bold: true }));
  result.skill2.objectives.specificCompetencies.forEach((c) => {
    children.push(labeledParagraph(`  + ${c.name}`, c.manifestation));
  });

  children.push(p("3. Về phẩm chất:", { bold: true, spacingBefore: 100 }));
  result.skill2.objectives.qualities.forEach((q) => {
    children.push(labeledParagraph(`- ${q.name}`, q.manifestation));
  });

  // II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
  children.push(p("II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU", { bold: true, spacingBefore: 180 }));
  children.push(p("1. Đối với giáo viên:", { bold: true }));
  result.skill2.equipmentAndMaterials.teacher.forEach((item) => {
    children.push(p(`- ${item}`));
  });
  children.push(p("2. Đối với học sinh:", { bold: true, spacingBefore: 80 }));
  result.skill2.equipmentAndMaterials.student.forEach((item) => {
    children.push(p(`- ${item}`));
  });

  // III. TIẾN TRÌNH DẠY HỌC
  children.push(
    p(`III. TIẾN TRÌNH DẠY HỌC (Tổng thời lượng: ${params.totalMinutes} phút)`, {
      bold: true,
      spacingBefore: 200,
    })
  );

  for (const act of result.skill2.activities) {
    children.push(
      p(`${act.activityName.toUpperCase()} (${act.durationMinutes} phút)`, {
        bold: true,
        spacingBefore: 180,
        color: "0F766E",
      })
    );

    children.push(p("a) Mục tiêu:", { bold: true }));
    act.objectives.forEach((obj) => children.push(p(`- ${obj}`)));

    children.push(labeledParagraph("b) Nội dung", act.content));

    children.push(p("c) Sản phẩm:", { bold: true }));
    act.expectedProducts.forEach((prod) => children.push(p(`- ${prod}`)));

    children.push(p("d) Tổ chức thực hiện:", { bold: true, spacingAfter: 80 }));

    const imp = act.implementation;
    const leftCellParagraphs: Paragraph[] = [
      p("Bước 1: Chuyển giao nhiệm vụ", { bold: true }),
      p(`- GV: ${imp.step1TransferTask.teacherAction}`),
      p(`  Lời dẫn GV: "${imp.step1TransferTask.teacherScript}"`, { italics: true }),
      p(`- HS: ${imp.step1TransferTask.studentAction}`),
      p("Bước 2: Thực hiện nhiệm vụ", { bold: true, spacingBefore: 100 }),
      p(`- HS: ${imp.step2PerformTask.studentAction}`),
      p(`- GV: ${imp.step2PerformTask.teacherAction}`),
      p(`- Hỗ trợ phân hóa: ${imp.step2PerformTask.supportForStrugglingStudents}`, { italics: true }),
      p("Bước 3: Báo cáo, thảo luận", { bold: true, spacingBefore: 100 }),
      p(`- GV: ${imp.step3ReportDiscuss.teacherAction}`),
      p(`  Lời dẫn GV: "${imp.step3ReportDiscuss.teacherScript}"`, { italics: true }),
      p(`- HS: ${imp.step3ReportDiscuss.studentAction}`),
      p("Bước 4: Kết luận, nhận định", { bold: true, spacingBefore: 100 }),
      p(`- GV: ${imp.step4ConcludeJudge.teacherAction}`),
      p(`  Lời chốt GV: "${imp.step4ConcludeJudge.teacherScript}"`, { italics: true }),
    ];

    const rightCellParagraphs: Paragraph[] = [
      p("Sản phẩm / Kiến thức trọng tâm ghi vở:", { bold: true }),
      ...act.expectedProducts.map((prod) => p(`- ${prod}`)),
      ...(imp.step4ConcludeJudge.coreBoardNotes.length > 0
        ? [
            p("Chốt kiến thức ghi bảng:", { bold: true, spacingBefore: 100 }),
            ...imp.step4ConcludeJudge.coreBoardNotes.map((note) => p(`• ${note}`)),
          ]
        : []),
    ];

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                borders: CELL_BORDERS,
                shading: { fill: "F1F5F9" },
                width: { size: 62, type: WidthType.PERCENTAGE },
                margins: { top: 80, bottom: 80, left: 100, right: 100 },
                children: [p("HOẠT ĐỘNG CỦA GIÁO VIÊN VÀ HỌC SINH", { bold: true, size: SMALL_SIZE })],
              }),
              new TableCell({
                borders: CELL_BORDERS,
                shading: { fill: "F1F5F9" },
                width: { size: 38, type: WidthType.PERCENTAGE },
                margins: { top: 80, bottom: 80, left: 100, right: 100 },
                children: [p("SẢN PHẨM DỰ KIẾN / KIẾN THỨC CẦN ĐẠT", { bold: true, size: SMALL_SIZE })],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: CELL_BORDERS,
                width: { size: 62, type: WidthType.PERCENTAGE },
                margins: { top: 100, bottom: 100, left: 120, right: 120 },
                children: leftCellParagraphs,
              }),
              new TableCell({
                borders: CELL_BORDERS,
                width: { size: 38, type: WidthType.PERCENTAGE },
                margins: { top: 100, bottom: 100, left: 120, right: 120 },
                children: rightCellParagraphs,
              }),
            ],
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeName = result.lessonTitle
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `KHBD-5512-${safeName || "bao-yen-ai-edu"}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function buildMarkdownExport(
  result: PedagogicalAnalysisResult,
  params: LessonInputParams
): string {
  const lines: string[] = [];
  lines.push(`# HỒ SƠ BÀI DẠY: ${result.lessonTitle.toUpperCase()}`);
  lines.push(
    `**Hệ sinh thái:** Bảo Yến AI Edu · **Môn:** ${params.subject} · **Lớp:** ${params.grade} · **Bộ sách:** ${params.textbookSeries} · **Thời lượng:** ${params.totalMinutes} phút`
  );
  lines.push("");
  lines.push(`=== PHẦN 1: PHÂN TÍCH SGK & Ý TƯỞNG KỊCH BẢN (SKILL 1) ===`);
  lines.push("");
  lines.push(`### 1. Trích xuất kiến thức cốt lõi`);
  result.skill1.coreKnowledge.forEach((item, i) => {
    lines.push(
      `${i + 1}. **[${item.category}] ${item.title}** (${item.sgkReference}): ${item.detail}`
    );
  });
  lines.push("");
  lines.push(`### 2. Điểm nghẽn nhận thức (Dự đoán khó khăn của học sinh)`);
  result.skill1.cognitiveBottlenecks.forEach((b, i) => {
    lines.push(`${i + 1}. **${b.bottleneck}**`);
    lines.push(`   - *Dễ hiểu nhầm:* ${b.studentMisconception}`);
    lines.push(`   - *Giải pháp tháo gỡ:* ${b.pedagogicalRemedy}`);
  });
  lines.push("");
  const hook = result.skill1.hookIdea;
  lines.push(`### 3. Ý tưởng trục xuyên suốt (Hook - ${hook.durationMinutes} phút đầu tiết): ${hook.title}`);
  lines.push(`- **Tình huống thực tế:** ${hook.realWorldContext}`);
  lines.push(`- **Câu hỏi mở đầu gây tò mò:** ${hook.openingQuestion}`);
  lines.push(`- **Lời dẫn mở bài của giáo viên:** *"${hook.teacherOpeningScript}"*`);
  lines.push(`- **Hiệu quả kết nối:** ${hook.expectedCuriosityEffect}`);
  lines.push("");
  lines.push(`=== PHẦN 2: KẾ HOẠCH BÀI DẠY CHUẨN CÔNG VĂN 5512 (SKILL 2) ===`);
  lines.push("");
  lines.push(`## I. MỤC TIÊU BÀI HỌC`);
  lines.push(`### 1. Kiến thức`);
  result.skill2.objectives.knowledge.forEach((k) => lines.push(`- ${k}`));
  lines.push(`### 2. Năng lực`);
  lines.push(`- **Năng lực chung:**`);
  result.skill2.objectives.generalCompetencies.forEach((c) =>
    lines.push(`  + *${c.name}:* ${c.manifestation}`)
  );
  lines.push(`- **Năng lực đặc thù:**`);
  result.skill2.objectives.specificCompetencies.forEach((c) =>
    lines.push(`  + *${c.name}:* ${c.manifestation}`)
  );
  lines.push(`### 3. Phẩm chất`);
  result.skill2.objectives.qualities.forEach((q) =>
    lines.push(`- *${q.name}:* ${q.manifestation}`)
  );
  lines.push("");
  lines.push(`## II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU`);
  lines.push(`- **Chuẩn bị của giáo viên:** ${result.skill2.equipmentAndMaterials.teacher.join("; ")}`);
  lines.push(`- **Chuẩn bị của học sinh:** ${result.skill2.equipmentAndMaterials.student.join("; ")}`);
  lines.push("");
  lines.push(`## III. TIẾN TRÌNH DẠY HỌC (${params.totalMinutes} phút)`);

  result.skill2.activities.forEach((act) => {
    lines.push("");
    lines.push(`### ${act.activityName} (${act.durationMinutes} phút)`);
    lines.push(`- **a) Mục tiêu:** ${act.objectives.join(" ")}`);
    lines.push(`- **b) Nội dung:** ${act.content}`);
    lines.push(`- **c) Sản phẩm:**`);
    act.expectedProducts.forEach((prod) => lines.push(`  + ${prod}`));
    lines.push(`- **d) Tổ chức thực hiện:**`);
    const imp = act.implementation;
    lines.push(`  1. **Bước 1 (Chuyển giao nhiệm vụ):**`);
    lines.push(`     - GV: ${imp.step1TransferTask.teacherAction}`);
    lines.push(`     - *Lời dẫn GV:* "${imp.step1TransferTask.teacherScript}"`);
    lines.push(`     - HS: ${imp.step1TransferTask.studentAction}`);
    lines.push(`  2. **Bước 2 (Thực hiện nhiệm vụ):**`);
    lines.push(`     - HS: ${imp.step2PerformTask.studentAction}`);
    lines.push(`     - GV: ${imp.step2PerformTask.teacherAction} (*Hỗ trợ HS gặp khó khăn:* ${imp.step2PerformTask.supportForStrugglingStudents})`);
    lines.push(`  3. **Bước 3 (Báo cáo, thảo luận):**`);
    lines.push(`     - GV: ${imp.step3ReportDiscuss.teacherAction}`);
    lines.push(`     - *Lời dẫn GV:* "${imp.step3ReportDiscuss.teacherScript}"`);
    lines.push(`     - HS: ${imp.step3ReportDiscuss.studentAction}`);
    lines.push(`  4. **Bước 4 (Kết luận, nhận định):**`);
    lines.push(`     - GV: ${imp.step4ConcludeJudge.teacherAction}`);
    lines.push(`     - *Lời chốt GV:* "${imp.step4ConcludeJudge.teacherScript}"`);
    if (imp.step4ConcludeJudge.coreBoardNotes.length > 0) {
      lines.push(`     - *Kiến thức ghi vở:* ${imp.step4ConcludeJudge.coreBoardNotes.join(" | ")}`);
    }
  });

  return lines.join("\n");
}
