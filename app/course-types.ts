export type LessonLevel = 'Fondamenti' | 'Intermedio' | 'Avanzato' | 'Progetto';

export type OfficialSource = {
  label: string;
  url: string;
};

export type TheorySection = {
  kicker: string;
  title: string;
  lead: string;
  plain: string;
  analogy?: string;
  points: string[];
  code?: string;
  walkthrough?: string[];
  callout: string;
  question: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: { id: string; label: string }[];
  correct: string;
  explanation: string;
};

export type LabMission = {
  method: string;
  title: string;
  signature: string;
  scenario: string;
  goal: string;
  steps: string[];
  constraints: string[];
  examples: { input: string; output: string; purpose: string }[];
  acceptance: string[];
  reflection: string;
  challenge: string;
};

export type CourseLesson = {
  number: string;
  title: string;
  area: string;
  level: LessonLevel;
  duration: string;
  minimumJdk: string;
  prerequisites: string[];
  keywords: string[];
  sources: OfficialSource[];
  outcome: string;
  objectives: string[];
  guidedExercise: string[];
  summary: string[];
  reviewQuestions: string[];
  theory: TheorySection[];
  quiz: QuizQuestion[];
  lab: LabMission[];
  starterCode: string;
};

export type CourseManifestItem = Pick<
  CourseLesson,
  'number' | 'title' | 'area' | 'level' | 'minimumJdk' | 'duration'
>;
