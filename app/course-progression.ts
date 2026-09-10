import type { CourseManifestItem } from './course-types';

type CompletionState = Record<string, { completed?: boolean } | undefined>;

export type LessonAccessStatus = 'completed' | 'current' | 'locked';

export function lessonAccessStatus(
  course: CourseManifestItem[],
  index: number,
  progress: CompletionState,
): LessonAccessStatus {
  if (index < 0 || index >= course.length) return 'locked';
  const prerequisitesCompleted = course
    .slice(0, index)
    .every((lesson) => progress[lesson.number]?.completed === true);
  if (!prerequisitesCompleted) return 'locked';
  return progress[course[index].number]?.completed === true ? 'completed' : 'current';
}

export function firstIncompleteLesson(
  course: CourseManifestItem[],
  progress: CompletionState,
): CourseManifestItem | undefined {
  return course.find((lesson) => progress[lesson.number]?.completed !== true);
}
