export interface UploadedPageImage {
  id: string;
  name: string;
  mimeType: string;
  base64Data: string;
  previewUrl: string;
}

export interface LessonInputParams {
  subject: string;
  grade: string;
  textbookSeries: string;
  totalMinutes: number;
  teacherNotes: string;
}

export interface CoreKnowledgeItem {
  category: string;
  title: string;
  detail: string;
  sgkReference: string;
}

export interface CognitiveBottleneckItem {
  bottleneck: string;
  studentMisconception: string;
  pedagogicalRemedy: string;
}

export interface HookIdea {
  title: string;
  durationMinutes: number;
  realWorldContext: string;
  openingQuestion: string;
  teacherOpeningScript: string;
  expectedCuriosityEffect: string;
}

export interface CompetencyItem {
  name: string;
  manifestation: string;
}

export interface ActivityImplementation {
  step1TransferTask: {
    teacherAction: string;
    teacherScript: string;
    studentAction: string;
  };
  step2PerformTask: {
    teacherAction: string;
    studentAction: string;
    supportForStrugglingStudents: string;
  };
  step3ReportDiscuss: {
    teacherAction: string;
    teacherScript: string;
    studentAction: string;
  };
  step4ConcludeJudge: {
    teacherAction: string;
    teacherScript: string;
    coreBoardNotes: string[];
  };
}

export interface LessonActivity5512 {
  activityNumber: number;
  activityName: string;
  durationMinutes: number;
  objectives: string[];
  content: string;
  expectedProducts: string[];
  implementation: ActivityImplementation;
}

export interface PedagogicalAnalysisResult {
  lessonTitle: string;
  sgkComprehensiveInventory: string[];
  skill1: {
    coreKnowledge: CoreKnowledgeItem[];
    cognitiveBottlenecks: CognitiveBottleneckItem[];
    hookIdea: HookIdea;
  };
  skill2: {
    objectives: {
      knowledge: string[];
      generalCompetencies: CompetencyItem[];
      specificCompetencies: CompetencyItem[];
      qualities: CompetencyItem[];
    };
    equipmentAndMaterials: {
      teacher: string[];
      student: string[];
    };
    activities: LessonActivity5512[];
  };
}

export interface SavedLessonRecord {
  id: string;
  createdAt: string;
  params: LessonInputParams;
  thumbnailDataUrl?: string;
  pageCount: number;
  result: PedagogicalAnalysisResult;
}
