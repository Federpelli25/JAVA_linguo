import { courseManifest } from './course-manifest';
import type { CourseLesson } from './course-types';

const lessonCache = new Map<string, CourseLesson>();

function selectLesson(lessons: CourseLesson[], number: string) {
  const lesson = lessons.find((candidate) => candidate.number === number);
  if (!lesson) throw new Error(`La lezione ${number} non è disponibile.`);
  lessonCache.set(number, lesson);
  return lesson;
}

export async function loadLesson(number: string): Promise<CourseLesson> {
  const cached = lessonCache.get(number);
  if (cached) return cached;

  if (number === '01') {
    const { lessonOne } = await import('./course-data');
    lessonCache.set(number, lessonOne);
    return lessonOne;
  }

  const numeric = Number(number);
  if (numeric >= 2 && numeric <= 19) {
    const { lessons02to19 } = await import('./course-lessons-02-19');
    return selectLesson(lessons02to19, number);
  }
  if (numeric >= 20 && numeric <= 37) {
    const { lessons20to37 } = await import('./course-lessons-20-37');
    return selectLesson(lessons20to37, number);
  }
  if (numeric >= 38 && numeric <= 52) {
    const { lessons38to52 } = await import('./course-lessons-38-52');
    return selectLesson(lessons38to52, number);
  }

  throw new Error(`Numero di lezione non valido: ${number}`);
}

export { courseManifest };
