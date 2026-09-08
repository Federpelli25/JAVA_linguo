'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronRight, CircleDot, Code2, GitBranch as Github, GraduationCap, Lightbulb, LockKeyhole, RotateCcw, TerminalSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress, ProgressLabel } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { lessonOne, roadmap } from './course-data';

type Answers = Record<string, string>;
const STORAGE_KEY = 'studio-java-progress-v1';

function inlineCode(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, index) =>
    part.startsWith('`') && part.endsWith('`')
      ? <code key={`${part}-${index}`}>{part.slice(1, -1)}</code>
      : part,
  );
}

export default function Home() {
  const [tab, setTab] = useState('theory');
  const [slide, setSlide] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [labChecks, setLabChecks] = useState([false, false, false]);
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');

  useEffect(() => {
    queueMicrotask(() => {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const saved = JSON.parse(raw);
          setTab(saved.tab ?? 'theory');
          setSlide(saved.slide ?? 0);
          setAnswers(saved.answers ?? {});
          setQuizChecked(saved.quizChecked ?? false);
          setLabChecks(saved.labChecks ?? [false, false, false]);
          setNotes(saved.notes ?? '');
          setCompleted(saved.completed ?? false);
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
      setHydrated(true);
    });
    fetch('/app-config.json')
      .then((response) => response.json())
      .then((config: unknown) => {
        if (typeof config === 'object' && config !== null && 'githubRepositoryUrl' in config && typeof config.githubRepositoryUrl === 'string') {
          setGithubUrl(config.githubRepositoryUrl);
        }
      })
      .catch(() => setGithubUrl(''));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ tab, slide, answers, quizChecked, labChecks, notes, completed }));
  }, [tab, slide, answers, quizChecked, labChecks, notes, completed, hydrated]);

  const quizScore = useMemo(
    () => lessonOne.quiz.filter((question) => answers[question.id] === question.correct).length,
    [answers],
  );
  const quizPassed = quizChecked && quizScore === lessonOne.quiz.length;
  const progress = completed ? 100 : Math.min(99, Math.round(
    ((slide + 1) / lessonOne.theory.length) * 35
      + (quizPassed ? 30 : quizChecked ? (quizScore / lessonOne.quiz.length) * 30 : 0)
      + (labChecks.filter(Boolean).length / labChecks.length) * 35,
  ));
  const section = lessonOne.theory[slide];

  function resetProgress() {
    if (!window.confirm('Vuoi azzerare i progressi della lezione 01?')) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setTab('theory'); setSlide(0); setAnswers({}); setQuizChecked(false);
    setLabChecks([false, false, false]); setNotes(''); setCompleted(false);
  }

  return (
    <main className="app-shell">
      <aside className="course-rail">
        <div className="brand-lockup">
          <span className="brand-mark">J_</span>
          <div><strong>Studio Java</strong><span>Personal learning lab</span></div>
        </div>
        <div className="rail-label">Percorso</div>
        <nav aria-label="Lezioni del corso" className="lesson-list">
          {roadmap.map((item) => (
            <button className={`lesson-row ${item.status === 'available' ? 'active' : ''}`} disabled={item.status !== 'available'} key={item.number}>
              <span className="lesson-number">{item.number}</span>
              <span className="lesson-copy">
                <strong>{item.title}</strong>
                <small>{item.status === 'available' ? (completed ? 'Completata' : 'In corso') : item.status === 'next' ? 'Prossima lezione' : 'Bloccata'}</small>
              </span>
              {item.status === 'available' ? <ChevronRight /> : <LockKeyhole />}
            </button>
          ))}
        </nav>
        <div className="rail-footer">
          <div><span className="status-dot" />Baseline JDK 25 LTS</div>
          {githubUrl ? <a href={githubUrl} target="_blank" rel="noreferrer"><Github /> Apri repository</a> : <span><Github /> GitHub da collegare</span>}
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div><div className="breadcrumb">Fondamenta <ChevronRight /> Lezione 01</div><h1>{lessonOne.title}</h1></div>
          <div className="top-actions">
            <Progress value={progress} className="course-progress"><ProgressLabel>Progresso</ProgressLabel><span className="progress-value">{progress}%</span></Progress>
            <Button variant="ghost" size="icon" onClick={resetProgress} aria-label="Azzera progressi"><RotateCcw /></Button>
          </div>
        </header>

        <Tabs value={tab} onValueChange={setTab} className="lesson-tabs">
          <TabsList variant="line" className="tab-strip" aria-label="Fasi della lezione">
            <TabsTrigger value="theory"><BookOpen /> Teoria</TabsTrigger>
            <TabsTrigger value="quiz"><CircleDot /> Verifica {quizPassed && <Check className="tab-check" />}</TabsTrigger>
            <TabsTrigger value="lab"><Code2 /> Laboratorio</TabsTrigger>
          </TabsList>

          <TabsContent value="theory" className="content-panel">
            <div className="theory-layout">
              <article className="lesson-card">
                <div className="card-meta"><span>{section.kicker}</span><span>{slide + 1} / {lessonOne.theory.length}</span></div>
                <h2>{inlineCode(section.title)}</h2>
                <p className="lead">{section.lead}</p>
                <ul className="concept-list">
                  {section.points.map((point) => <li key={point}><span className="concept-bullet" /><span>{inlineCode(point)}</span></li>)}
                </ul>
                {section.code && <pre className="code-window"><span>JAVA</span><code>{section.code}</code></pre>}
                <div className="callout"><Lightbulb /><p>{inlineCode(section.callout)}</p></div>
                <div className="lesson-controls">
                  <Button variant="outline" onClick={() => setSlide(Math.max(0, slide - 1))} disabled={slide === 0}><ArrowLeft /> Indietro</Button>
                  {slide < lessonOne.theory.length - 1
                    ? <Button onClick={() => setSlide(slide + 1)}>Continua <ArrowRight /></Button>
                    : <Button onClick={() => setTab('quiz')}>Vai alla verifica <ArrowRight /></Button>}
                </div>
              </article>
              <aside className="study-aside">
                <div className="session-card"><GraduationCap /><div><span>Sessione</span><strong>{lessonOne.duration}</strong></div></div>
                <div className="aside-card"><b>Prima di proseguire</b><p>Spiega il concetto a voce senza rileggere la scheda.</p></div>
                <div className="slide-map">
                  {lessonOne.theory.map((item, index) => (
                    <button key={item.title} className={index === slide ? 'current' : index < slide ? 'visited' : ''} onClick={() => setSlide(index)} aria-label={`Scheda ${index + 1}`}>
                      <span>{index < slide ? <Check /> : index + 1}</span><small>{item.kicker}</small>
                    </button>
                  ))}
                </div>
              </aside>
            </div>
          </TabsContent>

          <TabsContent value="quiz" className="content-panel">
            <div className="section-heading"><span>Checkpoint</span><h2>Verifica ciò che hai capito</h2><p>Rispondi senza tornare alla teoria. Puoi riprovare tutte le volte che vuoi.</p></div>
            <div className="quiz-grid">
              {lessonOne.quiz.map((question, index) => {
                const correct = answers[question.id] === question.correct;
                return <article className={`quiz-card ${quizChecked ? (correct ? 'correct' : 'incorrect') : ''}`} key={question.id}>
                  <div className="question-number">0{index + 1}</div><h3>{question.question}</h3>
                  <RadioGroup value={answers[question.id] ?? ''} onValueChange={(value) => { setAnswers({ ...answers, [question.id]: String(value) }); setQuizChecked(false); }} aria-label={question.question}>
                    {question.options.map((option) => <label className="option-row" key={option.id}><RadioGroupItem value={option.id} /><span>{option.label}</span></label>)}
                  </RadioGroup>
                  {quizChecked && <p className="answer-feedback">{correct ? <CheckCircle2 /> : <Lightbulb />}{question.explanation}</p>}
                </article>;
              })}
            </div>
            <div className="quiz-actions">
              {quizChecked && <div className={`score ${quizPassed ? 'passed' : ''}`}>{quizScore}/{lessonOne.quiz.length} corrette</div>}
              <Button variant={quizPassed ? 'outline' : 'default'} disabled={Object.keys(answers).length !== lessonOne.quiz.length} onClick={() => setQuizChecked(true)}>Controlla risposte</Button>
              {quizPassed && <Button onClick={() => setTab('lab')}>Apri il laboratorio <ArrowRight /></Button>}
            </div>
          </TabsContent>

          <TabsContent value="lab" className="content-panel">
            <div className="lab-heading">
              <div className="section-heading"><span>Scrivi tu il codice</span><h2>Statistiche di testo</h2><p>Lavora nel file indicato, una missione alla volta. I test sono la tua specifica.</p></div>
              <div className="path-card"><TerminalSquare /><div><span>File da modificare</span><code>src/main/java/.../Exercise001TextStatistics.java</code></div></div>
            </div>
            {!quizPassed && <div className="warning-banner"><Lightbulb /> Ti consiglio di superare prima la verifica.<Button variant="link" onClick={() => setTab('quiz')}>Vai alla verifica</Button></div>}
            <div className="mission-grid">
              {lessonOne.lab.map((mission, index) => <article className="mission-card" key={mission.method}>
                <div className="mission-topline"><span>{mission.title}</span><code>{mission.method}()</code></div>
                <h3>{mission.goal}</h3>
                <div className="mission-columns">
                  <div><h4>Vincoli</h4><ul>{mission.constraints.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <div><h4>Esempi</h4>{mission.examples.map((item) => <code className="example-line" key={item}>{item}</code>)}</div>
                </div>
                <label className="mission-check" htmlFor={`mission-${index}`}><Checkbox id={`mission-${index}`} checked={labChecks[index]} onCheckedChange={(checked) => setLabChecks(labChecks.map((value, itemIndex) => itemIndex === index ? checked === true : value))} />Ho scritto il metodo e i test passano</label>
              </article>)}
            </div>
            <div className="lab-bottom">
              <div className="command-card"><span>Quando sei pronto</span><code>mvn test</code><small>Prima rimuovi @Disabled dal test dell’esercizio 001.</small></div>
              <label className="notes-card" htmlFor="lab-notes"><span>Diario rapido</span><textarea id="lab-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Errore, causa, cosa hai imparato…" /></label>
            </div>
            {labChecks.every(Boolean) && <div className={`completion-card ${completed ? 'done' : ''}`}><CheckCircle2 /><div><span>{completed ? 'Lezione completata' : 'Ultimo checkpoint'}</span><h3>{completed ? 'Riscrivi domani la parte centrale senza guardare.' : 'Se tutti i test sono verdi, completa la lezione.'}</h3></div>{!completed && <Button onClick={() => setCompleted(true)}>Segna come completata</Button>}</div>}
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
