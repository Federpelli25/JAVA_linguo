import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
const moduleCache = new Map();

function loadTypeScript(relativePath) {
  const filename = path.resolve(root, relativePath);
  if (moduleCache.has(filename)) return moduleCache.get(filename).exports;
  const module = { exports: {} };
  moduleCache.set(filename, module);
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: filename,
  }).outputText;
  const localRequire = (specifier) => {
    if (!specifier.startsWith('.')) throw new Error(`Import esterno non consentito: ${specifier}`);
    const resolved = path.resolve(path.dirname(filename), `${specifier}.ts`);
    return loadTypeScript(path.relative(root, resolved));
  };
  const wrapper = vm.runInThisContext(`(function(require, module, exports) {${output}\n})`, { filename });
  wrapper(localRequire, module, module.exports);
  return module.exports;
}

const { lessonOne } = loadTypeScript('app/course-data.ts');
const { lessons02to19 } = loadTypeScript('app/course-lessons-02-19.ts');
const { lessons20to37 } = loadTypeScript('app/course-lessons-20-37.ts');
const { lessons38to52 } = loadTypeScript('app/course-lessons-38-52.ts');
const { courseManifest } = loadTypeScript('app/course-manifest.ts');
const lessons = [lessonOne, ...lessons02to19, ...lessons20to37, ...lessons38to52];

if (lessons.length !== 52 || courseManifest.length !== 52) {
  throw new Error(`Il corso deve contenere 52 lezioni: contenuti=${lessons.length}, indice=${courseManifest.length}.`);
}

for (const [index, lesson] of lessons.entries()) {
  const expected = String(index + 1).padStart(2, '0');
  const manifest = courseManifest[index];
  if (lesson.number !== expected || manifest.number !== expected || lesson.title !== manifest.title) {
    throw new Error(`Indice incoerente alla posizione ${index + 1}.`);
  }
  if (lesson.theory.length < 6 || lesson.quiz.length < 5 || lesson.lab.length < 1) {
    throw new Error(`Lezione ${expected}: teoria, verifica o laboratorio non raggiungono la soglia minima.`);
  }
  if (!lesson.sources.length || !lesson.objectives.length || !lesson.starterCode.includes('public class Main')) {
    throw new Error(`Lezione ${expected}: metadati didattici o Main.java mancanti.`);
  }
}

const compileRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'java-linguo-course-'));
try {
  for (const lesson of lessons) {
    const lessonDirectory = path.join(compileRoot, lesson.number);
    fs.mkdirSync(lessonDirectory);
    fs.writeFileSync(path.join(lessonDirectory, 'Main.java'), lesson.starterCode, 'utf8');
    const result = spawnSync('javac', ['--release', lesson.minimumJdk, 'Main.java'], {
      cwd: lessonDirectory,
      encoding: 'utf8',
    });
    if (result.status !== 0) {
      throw new Error(`Main.java della lezione ${lesson.number} non compila:\n${result.stderr || result.stdout}`);
    }
  }
} finally {
  fs.rmSync(compileRoot, { recursive: true, force: true });
}

console.log('Corso validato: 52 lezioni complete e 52 starter Main.java compilabili.');
