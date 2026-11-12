import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("MISSING_GEMINI_API_KEY");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const LESSON_PLAN_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    lessonTitle: {
      type: Type.STRING,
      description: "Tên bài học đầy đủ trích xuất chính xác từ trang sách giáo khoa.",
    },
    sgkComprehensiveInventory: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        "Danh mục kiểm kê đầy đủ tất cả các đề mục, hộp kiến thức, hình vẽ, bảng biểu, câu hỏi thảo luận và bài tập có mặt trong các trang ảnh SGK để đảm bảo không bỏ sót bất kỳ chi tiết nào.",
    },
    skill1: {
      type: Type.OBJECT,
      properties: {
        coreKnowledge: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description:
                  "Phân loại: Khái niệm | Định lý / Quy tắc | Sự kiện / Dữ liệu | Kỹ năng / Phương pháp | Học liệu trực quan & Bài tập SGK",
              },
              title: {
                type: Type.STRING,
                description: "Tên ngắn gọn của đơn vị kiến thức, định lý, sự kiện hoặc kỹ năng.",
              },
              detail: {
                type: Type.STRING,
                description: "Nội dung chi tiết, chính xác theo trang sách giáo khoa.",
              },
              sgkReference: {
                type: Type.STRING,
                description: "Vị trí xuất hiện cụ thể trong ảnh SGK (ví dụ: Mục 1, Hoạt động Khám phá 2, Hình 3.1, Bài tập 1...).",
              },
            },
            required: ["category", "title", "detail", "sgkReference"],
          },
        },
        cognitiveBottlenecks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              bottleneck: {
                type: Type.STRING,
                description: "Tên điểm nghẽn nhận thức hoặc rào cản tư duy của học sinh.",
              },
              studentMisconception: {
                type: Type.STRING,
                description: "Biểu hiện cụ thể chỗ học sinh dễ hiểu nhầm, nhầm lẫn khái niệm hoặc lúng túng khi tiếp cận bài này.",
              },
              pedagogicalRemedy: {
                type: Type.STRING,
                description: "Giải pháp sư phạm, câu hỏi gợi mở hoặc trực quan hóa để giáo viên tháo gỡ điểm nghẽn.",
              },
            },
            required: ["bottleneck", "studentMisconception", "pedagogicalRemedy"],
          },
        },
        hookIdea: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Tên tình huống hoặc ý tưởng mở đầu (Hook).",
            },
            durationMinutes: {
              type: Type.INTEGER,
              description: "Thời lượng cho Hook mở đầu gây tò mò (mặc định 3 phút đầu tiết).",
            },
            realWorldContext: {
              type: Type.STRING,
              description: "Mô tả cụ thể tình huống thực tiễn gần gũi với đời sống học sinh gắn liền với trục xuyên suốt của bài học.",
            },
            openingQuestion: {
              type: Type.STRING,
              description: "Câu hỏi mở đầu tạo xung đột nhận thức hoặc kích thích sự tò mò.",
            },
            teacherOpeningScript: {
              type: Type.STRING,
              description: "Nguyên văn lời dẫn mở đầu tự nhiên, cuốn hút của giáo viên trong 3 phút đầu tiết.",
            },
            expectedCuriosityEffect: {
              type: Type.STRING,
              description: "Tác động tâm lý - nhận thức và cách kết nối xuyên suốt vào nội dung trọng tâm của bài.",
            },
          },
          required: [
            "title",
            "durationMinutes",
            "realWorldContext",
            "openingQuestion",
            "teacherOpeningScript",
            "expectedCuriosityEffect",
          ],
        },
      },
      required: ["coreKnowledge", "cognitiveBottlenecks", "hookIdea"],
    },
    skill2: {
      type: Type.OBJECT,
      properties: {
        objectives: {
          type: Type.OBJECT,
          properties: {
            knowledge: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description:
                "Mục tiêu về kiến thức bám sát Yêu cầu cần đạt của Chương trình GDPT 2018 (bắt đầu bằng động từ đo lường được: nhận biết, nêu, trình bày, phân tích, giải thích, vận dụng...).",
            },
            generalCompetencies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "Tên năng lực chung (Tự chủ và tự học; Giao tiếp và hợp tác; Giải quyết vấn đề và sáng tạo).",
                  },
                  manifestation: {
                    type: Type.STRING,
                    description: "Biểu hiện hành vi cụ thể gắn với nhiệm vụ của bài học này.",
                  },
                },
                required: ["name", "manifestation"],
              },
            },
            specificCompetencies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "Tên năng lực đặc thù của môn học theo CT GDPT 2018.",
                  },
                  manifestation: {
                    type: Type.STRING,
                    description: "Biểu hiện cụ thể học sinh thực hiện được qua các hoạt động trong bài.",
                  },
                },
                required: ["name", "manifestation"],
              },
            },
            qualities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "Tên phẩm chất (Chăm chỉ, Trách nhiệm, Trung thực, Nhân ái, Yêu nước).",
                  },
                  manifestation: {
                    type: Type.STRING,
                    description: "Biểu hiện cụ thể qua thái độ học tập và thực hiện nhiệm vụ.",
                  },
                },
                required: ["name", "manifestation"],
              },
            },
          },
          required: ["knowledge", "generalCompetencies", "specificCompetencies", "qualities"],
        },
        equipmentAndMaterials: {
          type: Type.OBJECT,
          properties: {
            teacher: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Thiết bị dạy học và học liệu giáo viên chuẩn bị (SGK, phiếu học tập, hình ảnh, dụng cụ...).",
            },
            student: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Đồ dùng học tập và chuẩn bị trước của học sinh.",
            },
          },
          required: ["teacher", "student"],
        },
        activities: {
          type: Type.ARRAY,
          description:
            "Đúng 4 hoạt động dạy học theo Công văn 5512: (1) Hoạt động 1: Mở đầu / Khởi động, (2) Hoạt động 2: Hình thành kiến thức mới, (3) Hoạt động 3: Luyện tập, (4) Hoạt động 4: Vận dụng. Tổng durationMinutes của 4 hoạt động phải bằng chính xác tổng thời lượng được cung cấp.",
          items: {
            type: Type.OBJECT,
            properties: {
              activityNumber: {
                type: Type.INTEGER,
                description: "Số thứ tự hoạt động (1, 2, 3, 4).",
              },
              activityName: {
                type: Type.STRING,
                description: "Tên hoạt động (ví dụ: Hoạt động 1: Mở đầu / Khởi động).",
              },
              durationMinutes: {
                type: Type.INTEGER,
                description: "Số phút phân bổ cho hoạt động này.",
              },
              objectives: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "a) Mục tiêu của hoạt động.",
              },
              content: {
                type: Type.STRING,
                description:
                  "b) Nội dung: Nhiệm vụ học tập cụ thể giao cho học sinh (nêu rõ câu hỏi, phiếu học tập, hoạt động khám phá hoặc bài tập cụ thể trong ảnh SGK).",
              },
              expectedProducts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  "c) Sản phẩm: Câu trả lời chi tiết, lời giải cụ thể hoặc kết quả mong đợi của học sinh cho toàn bộ nhiệm vụ/câu hỏi trong mục Nội dung.",
              },
              implementation: {
                type: Type.OBJECT,
                properties: {
                  step1TransferTask: {
                    type: Type.OBJECT,
                    properties: {
                      teacherAction: {
                        type: Type.STRING,
                        description: "Hành động tổ chức, giao nhiệm vụ của giáo viên ở Bước 1: Chuyển giao nhiệm vụ.",
                      },
                      teacherScript: {
                        type: Type.STRING,
                        description: "Lời dẫn gợi mở tự nhiên, chuẩn mực sư phạm của giáo viên khi giao nhiệm vụ.",
                      },
                      studentAction: {
                        type: Type.STRING,
                        description: "Hành động tiếp nhận nhiệm vụ của học sinh.",
                      },
                    },
                    required: ["teacherAction", "teacherScript", "studentAction"],
                  },
                  step2PerformTask: {
                    type: Type.OBJECT,
                    properties: {
                      teacherAction: {
                        type: Type.STRING,
                        description: "Hành động quan sát, điều hành của giáo viên ở Bước 2: Thực hiện nhiệm vụ.",
                      },
                      studentAction: {
                        type: Type.STRING,
                        description: "Hoạt động cá nhân/cặp đôi/nhóm của học sinh để hoàn thành sản phẩm.",
                      },
                      supportForStrugglingStudents: {
                        type: Type.STRING,
                        description: "Gợi ý phân hóa, câu hỏi đỡ đầu của giáo viên dành cho học sinh gặp khó khăn (gắn với điểm nghẽn nhận thức ở Skill 1).",
                      },
                    },
                    required: ["teacherAction", "studentAction", "supportForStrugglingStudents"],
                  },
                  step3ReportDiscuss: {
                    type: Type.OBJECT,
                    properties: {
                      teacherAction: {
                        type: Type.STRING,
                        description: "Cách giáo viên gọi đại diện trình bày và tổ chức phản biện chéo ở Bước 3: Báo cáo, thảo luận.",
                      },
                      teacherScript: {
                        type: Type.STRING,
                        description: "Lời dẫn điều phối thảo luận, đặt câu hỏi đào sâu tự nhiên của giáo viên.",
                      },
                      studentAction: {
                        type: Type.STRING,
                        description: "Học sinh báo cáo kết quả, nhận xét, bổ sung và tranh luận.",
                      },
                    },
                    required: ["teacherAction", "teacherScript", "studentAction"],
                  },
                  step4ConcludeJudge: {
                    type: Type.OBJECT,
                    properties: {
                      teacherAction: {
                        type: Type.STRING,
                        description: "Hành động đánh giá, nhận xét sản phẩm và chuẩn hóa kiến thức ở Bước 4: Kết luận, nhận định.",
                      },
                      teacherScript: {
                        type: Type.STRING,
                        description: "Lời chốt kiến thức chuẩn xác, súc tích và chuyển ý tự nhiên của giáo viên.",
                      },
                      coreBoardNotes: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Nội dung kiến thức trọng tâm chuẩn xác để học sinh ghi vào vở / bảng.",
                      },
                    },
                    required: ["teacherAction", "teacherScript", "coreBoardNotes"],
                  },
                },
                required: [
                  "step1TransferTask",
                  "step2PerformTask",
                  "step3ReportDiscuss",
                  "step4ConcludeJudge",
                ],
              },
            },
            required: [
              "activityNumber",
              "activityName",
              "durationMinutes",
              "objectives",
              "content",
              "expectedProducts",
              "implementation",
            ],
          },
        },
      },
      required: ["objectives", "equipmentAndMaterials", "activities"],
    },
  },
  required: ["lessonTitle", "sgkComprehensiveInventory", "skill1", "skill2"],
};

function buildPedagogicalSystemInstruction(params: {
  subject: string;
  grade: string;
  textbookSeries: string;
  totalMinutes: number;
  teacherNotes?: string;
}): string {
  return `Bạn là Chuyên gia Thiết kế Chương trình & Sư phạm cấp cao của hệ sinh thái "Bảo Yến AI Edu".
Nhiệm vụ của bạn là đọc thật kỹ từng chi tiết trong tất cả ảnh trang Sách giáo khoa (SGK) do giáo viên tải lên và thực hiện đồng thời 2 kỹ năng chuyên sâu:
- SKILL 1: Phân tích SGK & Ý tưởng kịch bản sư phạm
- SKILL 2: Thiết kế Kế hoạch bài dạy (KHBD) chuẩn chuyên môn theo Chương trình GDPT 2018 và Công văn 5512/BGDĐT-GDTrH.

THÔNG SỐ BÀI DẠY GIÁO VIÊN CUNG CẤP:
- Môn học: ${params.subject}
- Khối lớp: ${params.grade}
- Bộ sách giáo khoa: ${params.textbookSeries}
- Tổng thời lượng tiết dạy: ${params.totalMinutes} phút
${params.teacherNotes ? `- Ghi chú / Yêu cầu sư phạm bổ sung của giáo viên: ${params.teacherNotes}` : ""}

CÁC NGUYÊN TẮC BẮT BUỘC KHÔNG ĐƯỢC VI PHẠM:
1. KHÔNG BỎ SÓT CHI TIẾT TRONG ẢNH SGK:
   - Quét toàn bộ văn bản, tiêu đề, mục con, hộp "Khám phá / Hoạt động", hộp "Kiến thức trọng tâm / Ghi nhớ", hình ảnh minh họa, sơ đồ, bảng số liệu, ví dụ mẫu, câu hỏi thảo luận, phần "Luyện tập" và "Vận dụng" có trong ảnh SGK.
   - Liệt kê đầy đủ vào danh mục kiểm kê (sgkComprehensiveInventory) và đưa toàn bộ các đơn vị kiến thức, câu hỏi, bài tập đó vào tiến trình dạy học cùng lời giải/sản phẩm mong đợi tương ứng.
2. CHUẨN XÁC SKILL 1 (PHÂN TÍCH SGK & Ý TƯỞNG KỊCH BẢN):
   - Trích xuất kiến thức cốt lõi: Phân loại rõ khái niệm, định lý/quy tắc, sự kiện/dữ liệu, kỹ năng và dẫn chiếu vị trí cụ thể trong trang SGK.
   - Điểm nghẽn nhận thức: Dự đoán sâu sắc những chỗ học sinh lớp ${params.grade} dễ hiểu lầm, ngộ nhận hoặc gặp khó khăn tư duy khi tiếp cận bài học này, kèm cách tháo gỡ sư phạm cụ thể.
   - Ý tưởng trục xuyên suốt (Hook): Thiết kế 1 tình huống thực tiễn sống động hoặc câu hỏi gây tò mò trong đúng 3 phút đầu tiết, tạo trục kết nối xuyên suốt bài học, kèm nguyên văn lời dẫn mở đầu tự nhiên của giáo viên.
3. CHUẨN XÁC SKILL 2 (KẾ HOẠCH BÀI DẠY CÔNG VĂN 5512):
   - I. MỤC TIÊU BÀI HỌC:
     + Kiến thức: Bám sát Yêu cầu cần đạt của CT GDPT 2018 môn ${params.subject} ${params.grade} (dùng động từ đo lường được, không viết chung chung kiểu "Hiểu được...", "Nắm được...").
     + Năng lực: Tách rõ Năng lực chung (Tự chủ và tự học, Giao tiếp và hợp tác, Giải quyết vấn đề và sáng tạo) và Năng lực đặc thù của môn ${params.subject}.
     + Phẩm chất: Chăm chỉ, Trách nhiệm, Trung thực (hoặc Nhân ái, Yêu nước tùy đặc thù bài) gắn với hành vi cụ thể của học sinh trong tiết học.
   - II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU: Thiết thực, khả thi tại trường phổ thông Việt Nam cho cả Giáo viên và Học sinh.
   - III. TIẾN TRÌNH DẠY HỌC:
     + Bắt buộc chia đúng 4 hoạt động chuẩn Công văn 5512:
       1. Hoạt động 1: Mở đầu / Khởi động
       2. Hoạt động 2: Hình thành kiến thức mới (nếu bài có nhiều mục nhỏ trong SGK, hãy lồng ghép mạch lạc các nhiệm vụ tiểu mục 2.1, 2.2... ngay trong Nội dung, Sản phẩm và 4 bước Tổ chức thực hiện của Hoạt động 2)
       3. Hoạt động 3: Luyện tập
       4. Hoạt động 4: Vận dụng
     + TỔNG SỐ PHÚT (durationMinutes) của cả 4 hoạt động cộng lại PHẢI BẰNG CHÍNH XÁC ${params.totalMinutes} phút! (Ví dụ với 45 phút: HĐ1 khoảng 5 phút, HĐ2 khoảng 20-22 phút, HĐ3 khoảng 10-12 phút, HĐ4 khoảng 6-8 phút sao cho tổng đúng bằng ${params.totalMinutes}).
     + Mỗi hoạt động bắt buộc đầy đủ 4 mục con: a) Mục tiêu; b) Nội dung (nhiệm vụ cụ thể giao cho HS); c) Sản phẩm (đáp án, câu trả lời/lời giải chi tiết mong đợi của HS); d) Tổ chức thực hiện đủ 4 bước (Bước 1: Chuyển giao nhiệm vụ -> Bước 2: Thực hiện nhiệm vụ -> Bước 3: Báo cáo, thảo luận -> Bước 4: Kết luận, nhận định) kèm lời dẫn gợi mở tự nhiên, ấm áp, chuẩn mực sư phạm Việt Nam của giáo viên.`;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "30mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/analyze-sgk", async (req, res) => {
    try {
      const { images, params } = req.body as {
        images?: Array<{ mimeType: string; base64Data: string; name?: string }>;
        params?: {
          subject?: string;
          grade?: string;
          textbookSeries?: string;
          totalMinutes?: number;
          teacherNotes?: string;
        };
      };

      if (!images || !Array.isArray(images) || images.length === 0) {
        res.status(400).json({
          error: "Vui lòng tải lên ít nhất 1 ảnh chụp trang Sách giáo khoa (SGK) để phân tích.",
        });
        return;
      }

      const subject = (params?.subject || "Toán học").trim();
      const grade = (params?.grade || "Lớp 8").trim();
      const textbookSeries = (params?.textbookSeries || "Kết nối tri thức với cuộc sống").trim();
      const totalMinutes = Math.max(15, Math.min(270, Number(params?.totalMinutes) || 45));
      const teacherNotes = (params?.teacherNotes || "").trim();

      const ai = getGenAIClient();

      const imageParts = images.map((img) => ({
        inlineData: {
          mimeType: img.mimeType || "image/jpeg",
          data: img.base64Data,
        },
      }));

      const userPromptText = `Hãy phân tích toàn diện ${images.length} trang ảnh Sách giáo khoa đính kèm (Môn: ${subject}, ${grade}, Bộ sách: ${textbookSeries}, Tổng thời lượng: ${totalMinutes} phút${
        teacherNotes ? `, Yêu cầu thêm: ${teacherNotes}` : ""
      }).
Thực hiện đầy đủ và chi tiết cả PHẦN 1: PHÂN TÍCH SGK & Ý TƯỞNG KỊCH BẢN (SKILL 1) và PHẦN 2: KẾ HOẠCH BÀI DẠY CHUẨN CÔNG VĂN 5512 (SKILL 2).
Đảm bảo không bỏ sót bất kỳ khái niệm, hình vẽ, câu hỏi hay bài tập nào trên trang sách, và kiểm tra tổng thời lượng của 4 hoạt động bằng đúng ${totalMinutes} phút.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: {
          parts: [...imageParts, { text: userPromptText }],
        },
        config: {
          systemInstruction: buildPedagogicalSystemInstruction({
            subject,
            grade,
            textbookSeries,
            totalMinutes,
            teacherNotes,
          }),
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.MEDIUM,
          },
          responseMimeType: "application/json",
          responseSchema: LESSON_PLAN_RESPONSE_SCHEMA,
        },
      });

      const rawJson = (response.text ?? "").trim();
      if (!rawJson) {
        res.status(502).json({
          error: "Hệ thống chưa nhận được nội dung phản hồi từ mô hình phân tích. Vui lòng thử lại.",
        });
        return;
      }

      const parsed = JSON.parse(rawJson);

      // Normalize total duration strictly to totalMinutes if off by 1-2 minutes due to rounding
      if (
        parsed?.skill2?.activities &&
        Array.isArray(parsed.skill2.activities) &&
        parsed.skill2.activities.length > 0
      ) {
        const sumMinutes = parsed.skill2.activities.reduce(
          (acc: number, act: { durationMinutes?: number }) => acc + (Number(act.durationMinutes) || 0),
          0
        );
        if (sumMinutes !== totalMinutes) {
          const diff = totalMinutes - sumMinutes;
          // Adjust Activity 2 (Hình thành kiến thức mới) which has the largest share
          const targetIdx = parsed.skill2.activities.length >= 2 ? 1 : 0;
          const adjusted = Math.max(
            5,
            (Number(parsed.skill2.activities[targetIdx].durationMinutes) || 15) + diff
          );
          parsed.skill2.activities[targetIdx].durationMinutes = adjusted;
        }
      }

      res.json({ result: parsed });
    } catch (err: unknown) {
      console.error("Error in /api/analyze-sgk:", err);
      const message = err instanceof Error ? err.message : String(err);

      if (
        message.includes("MISSING_GEMINI_API_KEY") ||
        message.includes("PERMISSION_DENIED") ||
        message.includes("API_KEY_INVALID") ||
        message.includes("403")
      ) {
        res.status(403).json({
          error:
            "Không thể xác thực khóa kết nối Gemini API. Vui lòng kiểm tra khóa API trong bảng Settings > Secrets của AI Studio.",
        });
        return;
      }

      if (message.includes("RESOURCE_EXHAUSTED") || message.includes("429")) {
        res.status(429).json({
          error:
            "Đã chạm giới hạn lưu lượng truy cập tạm thời (Quota). Vui lòng đợi ít giây rồi thử lại hoặc nâng cấp khóa API trong mục Settings > Secrets.",
        });
        return;
      }

      res.status(500).json({
        error: `Đã xảy ra lỗi khi phân tích trang SGK: ${message}`,
      });
    }
  });

  app.post("/api/regenerate-hook", async (req, res) => {
    try {
      const { lessonTitle, subject, grade, coreSummary, currentHookTitle } = req.body as {
        lessonTitle?: string;
        subject?: string;
        grade?: string;
        coreSummary?: string;
        currentHookTitle?: string;
      };

      const ai = getGenAIClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Hãy đề xuất 1 Ý tưởng trục xuyên suốt (Hook) MỚI, hoàn toàn khác với ý tưởng "${
          currentHookTitle || ""
        }" cho bài học "${lessonTitle}" (Môn ${subject}, ${grade}).
Tóm tắt kiến thức cốt lõi của bài: ${coreSummary}.
Yêu cầu: Tình huống thực tiễn gần gũi đời sống Việt Nam hoặc nghịch lý khoa học/xã hội gây tò mò trong đúng 3 phút đầu tiết, kèm câu hỏi mở đầu và nguyên văn lời dẫn tự nhiên của giáo viên.`,
        config: {
          systemInstruction:
            "Bạn là Chuyên gia Thiết kế Sư phạm của hệ sinh thái Bảo Yến AI Edu. Văn phong chuẩn mực sư phạm Việt Nam, lôi cuốn và giàu tính thực tiễn.",
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              durationMinutes: { type: Type.INTEGER },
              realWorldContext: { type: Type.STRING },
              openingQuestion: { type: Type.STRING },
              teacherOpeningScript: { type: Type.STRING },
              expectedCuriosityEffect: { type: Type.STRING },
            },
            required: [
              "title",
              "durationMinutes",
              "realWorldContext",
              "openingQuestion",
              "teacherOpeningScript",
              "expectedCuriosityEffect",
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? "{}").trim());
      res.json({ hookIdea: parsed });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        error: `Không thể tạo mới ý tưởng mở đầu: ${message}`,
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bảo Yến AI Edu server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
