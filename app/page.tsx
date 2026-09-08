'use client';

import { KeyboardEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Code2,
  Container,
  GitBranch as Github,
  GraduationCap,
  Lightbulb,
  LoaderCircle,
  LockKeyhole,
  Play,
  RotateCcw,
  ShieldCheck,
  TerminalSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Progress, ProgressLabel } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { lessonOne, roadmap } from './course-data';
import { APP_VERSION } from './version';

type Answers = Record<string, string>;
type SandboxStatus = {
  available: boolean;
  message: string;
  image: string;
  commands: string[];
};
type CommandResult = {
  ok?: boolean;
  output?: string;
  error?: string;
  exitCode?: number;
  durationMs?: number;
};
type TerminalEntry = {
  id: number;
  command: string;
  output: string;
  ok: boolean;
  meta?: string;
};

const STORAGE_KEY = 'studio-java-progress-v2';
const DEFAULT_GITHUB_URL = 'https://github.com/Federpelli25/JAVA_linguo';
const INITIAL_CODE = `public class Main {
    public static void main(String[] args) {
        String input = "Educazione";
        int actual = countVowels(input);

        System.out.println("Input: " + input);
        System.out.println("Atteso: 6");
        System.out.println("Ottenuto: " + actual);
    }

    static int countVowels(String text) {
        // TODO: valida null, visita ogni char e conta le vocali.
        return 0;
    }
}`;

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
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [code, setCode] = useState(INITIAL_CODE);
  const [command, setCommand] = useState('java Main.java');
  const [terminalEntries, setTerminalEntries] = useState<TerminalEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [githubUrl, setGithubUrl] = useState(DEFAULT_GITHUB_URL);
  const [labApiToken, setLabApiToken] = useState('');
  const [sandbox, setSandbox] = useState<SandboxStatus>({
    available: false,
    message: 'Verifica della sandbox locale…',
    image: 'eclipse-temurin:25-jdk',
    commands: ['java --version', 'javac Main.java', 'java Main.java'],
  });

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
          setCode(saved.code ?? INITIAL_CODE);
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
      setHydrated(true);
    });

    fetch('/app-config.json')
      .then(async (response) => {
        if (!response.ok) throw new Error('Configurazione locale non disponibile');
        return response.json();
      })
      .then((value) => {
        const config = value as { githubRepositoryUrl?: string; labApiToken?: string; labSandbox?: SandboxStatus };
        setGithubUrl(config.githubRepositoryUrl || DEFAULT_GITHUB_URL);
        setLabApiToken(config.labApiToken ?? '');
        if (config.labSandbox) setSandbox(config.labSandbox);
      })
      .catch(() => setSandbox({
        available: false,
        message: 'Apri l’app con avvia.py per usare il terminale Docker locale.',
        image: 'eclipse-temurin:25-jdk',
        commands: ['java --version', 'javac Main.java', 'java Main.java'],
      }));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      tab,
      slide,
      answers,
      quizChecked,
      labChecks,
      notes,
      completed,
      code,
    }));
  }, [tab, slide, answers, quizChecked, labChecks, notes, completed, code, hydrated]);

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
  const lineNumbers = useMemo(() => code.split('\n').map((_, index) => index + 1), [code]);

  function resetProgress() {
    window.localStorage.removeItem(STORAGE_KEY);
    setTab('theory');
    setSlide(0);
    setAnswers({});
    setQuizChecked(false);
    setLabChecks([false, false, false]);
    setNotes('');
    setCompleted(false);
    setCode(INITIAL_CODE);
    setTerminalEntries([]);
  }

  function appendTerminal(entry: Omit<TerminalEntry, 'id'>) {
    setTerminalEntries((current) => [...current, { ...entry, id: Date.now() + current.length }]);
  }

  async function runCommand(requestedCommand = command) {
    const normalized = requestedCommand.trim().replace(/\s+/g, ' ');
    setCommand(normalized);
    if (normalized === 'clear') {
      setTerminalEntries([]);
      return;
    }
    if (normalized === 'help') {
      appendTerminal({
        command: 'help',
        output: `Comandi disponibili:\n${sandbox.commands.join('\n')}\nclear`,
        ok: true,
      });
      return;
    }
    if (!sandbox.available || !labApiToken) {
      appendTerminal({ command: normalized, output: sandbox.message, ok: false });
      return;
    }
    setRunning(true);
    try {
      const response = await fetch('/api/lab/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Studio-Java-Token': labApiToken,
        },
        body: JSON.stringify({ code, command: normalized }),
      });
      const result = await response.json() as CommandResult;
      appendTerminal({
        command: normalized,
        output: result.output ?? result.error ?? 'Nessun output ricevuto.',
        ok: response.ok && result.ok === true,
        meta: result.durationMs !== undefined ? `${result.durationMs} ms · exit ${result.exitCode ?? '—'}` : undefined,
      });
    } catch {
      appendTerminal({
        command: normalized,
        output: 'Il servizio locale non risponde. Riavvia avvia.py e riprova.',
        ok: false,
      });
    } finally {
      setRunning(false);
    }
  }

  function editorShortcut(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      void runCommand('java Main.java');
    }
  }

  return (
    <main className="app-shell">
      <aside className="course-rail">
        <div className="brand-lockup">
          <span className="brand-mark">J_</span>
          <div><strong>Studio Java</strong><span>Corso pratico su GitHub</span></div>
        </div>
        <div className="rail-label">Percorso accademico</div>
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
        <div className="release-note">
          <CalendarClock />
          <div><strong>Nuovo materiale</strong><span>Ogni due settimane</span></div>
        </div>
        <div className="rail-footer">
          <div><span className="status-dot" />Java 25 LTS</div>
          <div><span className="version-dot">v</span>Versione {APP_VERSION}</div>
          <a href={githubUrl} target="_blank" rel="noreferrer"><Github /> GitHub</a>
        </div>
      </aside>

      <section className="workspace">
        <Tabs value={tab} onValueChange={setTab} className="lesson-tabs">
          <header className="topbar">
            <div className="lesson-identity">
              <div className="breadcrumb">Fondamenta <ChevronRight /> Lezione 01</div>
              <h1>{lessonOne.title}</h1>
            </div>
            <TabsList className="header-tabs" aria-label="Fasi della lezione">
              <TabsTrigger value="theory"><BookOpen /> <span>Teoria</span></TabsTrigger>
              <TabsTrigger value="quiz"><CircleDot /> <span>Verifica</span>{quizPassed && <Check className="tab-check" />}</TabsTrigger>
              <TabsTrigger value="lab"><Code2 /> <span>Laboratorio</span></TabsTrigger>
            </TabsList>
            <div className="top-actions">
              <Progress value={progress} className="course-progress">
                <ProgressLabel>Progresso</ProgressLabel><span className="progress-value">{progress}%</span>
              </Progress>
              <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                <AlertDialogTrigger render={<Button variant="ghost" size="icon" />} aria-label="Azzera progressi">
                  <RotateCcw />
                </AlertDialogTrigger>
                <AlertDialogContent className="reset-dialog">
                  <AlertDialogHeader>
                    <AlertDialogMedia className="reset-dialog-icon"><RotateCcw /></AlertDialogMedia>
                    <AlertDialogTitle>Azzerare questa lezione?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Verranno cancellati progressi, risposte, appunti e codice salvati per la lezione 01. L’operazione non può essere annullata.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Continua a studiare</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={() => { resetProgress(); setResetDialogOpen(false); }}>Azzera progressi</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </header>

          <TabsContent value="theory" className="content-panel">
            <div className="theory-layout">
              <article className="lesson-card">
                <div className="card-meta"><span>{section.kicker}</span><span>{slide + 1} / {lessonOne.theory.length}</span></div>
                <h2>{inlineCode(section.title)}</h2>
                <p className="lead">{section.lead}</p>
                <div className="plain-language"><span>In parole semplici</span><p>{inlineCode(section.plain)}</p></div>
                {section.analogy && <div className="analogy"><span>Un’analogia utile</span><p>{inlineCode(section.analogy)}</p></div>}
                <ul className="concept-list">
                  {section.points.map((point) => <li key={point}><span className="concept-bullet" /><span>{inlineCode(point)}</span></li>)}
                </ul>
                {section.code && <pre className="code-window"><span>JAVA</span><code>{section.code}</code></pre>}
                {section.walkthrough && <div className="walkthrough"><span>Passo per passo</span><ol>{section.walkthrough.map((step) => <li key={step}>{inlineCode(step)}</li>)}</ol></div>}
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
                <div className="aside-card question-card"><b>Prima di proseguire</b><p>{inlineCode(section.question)}</p><small>Rispondi a voce senza rileggere.</small></div>
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

          <TabsContent value="lab" className="content-panel lab-panel">
            <div className="lab-heading">
              <div className="section-heading"><span>Scrivi, compila, osserva</span><h2>Laboratorio interattivo</h2><p>Modifica <code>Main.java</code>, prevedi il risultato e verifica la tua ipotesi nel container isolato.</p></div>
              <div className={`sandbox-badge ${sandbox.available ? 'ready' : 'offline'}`}>
                <ShieldCheck /><div><span>Sandbox Docker</span><strong>{sandbox.available ? 'Pronta' : 'Da configurare'}</strong></div>
              </div>
            </div>
            {!quizPassed && <div className="warning-banner"><Lightbulb /> Ti consiglio di superare prima la verifica.<Button variant="link" onClick={() => setTab('quiz')}>Vai alla verifica</Button></div>}

            <div className="lab-studio">
              <section className="editor-card" aria-label="Editor Java">
                <div className="ide-toolbar">
                  <div className="file-tab"><Code2 /> Main.java <span>{code.length} caratteri</span></div>
                  <div className="editor-actions">
                    <Button size="sm" variant="outline" disabled={running || !sandbox.available} onClick={() => void runCommand('javac Main.java')}>Compila</Button>
                    <Button size="sm" disabled={running || !sandbox.available} onClick={() => void runCommand('java Main.java')}>
                      {running ? <LoaderCircle className="spin" /> : <Play />} Esegui
                    </Button>
                  </div>
                </div>
                <div className="editor-surface">
                  <div className="line-numbers" aria-hidden="true">{lineNumbers.map((line) => <span key={line}>{line}</span>)}</div>
                  <textarea
                    aria-label="Codice Java nel file Main.java"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    onKeyDown={editorShortcut}
                    spellCheck={false}
                  />
                </div>
                <div className="editor-footer"><span>Java 25</span><span>Ctrl + Invio per eseguire</span><span>Salvataggio locale automatico</span></div>
              </section>

              <section className="terminal-card" aria-label="Terminale Java limitato">
                <div className="terminal-toolbar">
                  <div><TerminalSquare /><strong>Terminale</strong></div>
                  <button type="button" onClick={() => setTerminalEntries([])}>Pulisci</button>
                </div>
                <div className="terminal-output" aria-live="polite">
                  <div className="terminal-welcome"><Container /><p><strong>Ambiente isolato</strong><span>{sandbox.message}</span></p></div>
                  {terminalEntries.map((entry) => <div className="terminal-entry" key={entry.id}>
                    <div className="terminal-command"><span>$</span> {entry.command}</div>
                    <pre className={entry.ok ? 'success' : 'error'}>{entry.output}</pre>
                    {entry.meta && <small>{entry.meta}</small>}
                  </div>)}
                  {running && <div className="terminal-running"><LoaderCircle className="spin" /> Container in esecuzione…</div>}
                </div>
                <form className="terminal-prompt" onSubmit={(event) => { event.preventDefault(); void runCommand(); }}>
                  <label htmlFor="terminal-command">$</label>
                  <input id="terminal-command" value={command} onChange={(event) => setCommand(event.target.value)} autoComplete="off" spellCheck={false} aria-describedby="terminal-help" />
                  <Button type="submit" size="sm" disabled={running}>Invio</Button>
                </form>
                <small id="terminal-help" className="terminal-help">Scrivi <code>help</code> per vedere i comandi consentiti. Nessuna shell del PC viene esposta.</small>
              </section>
            </div>

            <div className="sandbox-explainer">
              <ShieldCheck />
              <div><strong>Il codice non viene eseguito direttamente sul computer</strong><p>Ogni comando usa un container temporaneo senza rete, con memoria, CPU, processi e tempo limitati. Al termine l’ambiente viene eliminato.</p></div>
            </div>

            <div className="mission-grid">
              {lessonOne.lab.map((mission, index) => <article className="mission-card" key={mission.method}>
                <div className="mission-topline"><span>{mission.title}</span><code>{mission.method}()</code></div>
                <h3>{mission.goal}</h3>
                <div className="mission-columns">
                  <div><h4>Vincoli</h4><ul>{mission.constraints.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <div><h4>Esempi</h4>{mission.examples.map((item) => <code className="example-line" key={item}>{item}</code>)}</div>
                </div>
                <label className="mission-check" htmlFor={`mission-${index}`}><Checkbox id={`mission-${index}`} checked={labChecks[index]} onCheckedChange={(checked) => setLabChecks(labChecks.map((value, itemIndex) => itemIndex === index ? checked === true : value))} />Ho implementato il metodo e verificato i casi limite</label>
              </article>)}
            </div>
            <div className="lab-bottom">
              <div className="command-card"><span>Comando consigliato</span><code>java Main.java</code><small>Compila ed esegue il file sorgente nel container temporaneo.</small></div>
              <label className="notes-card" htmlFor="lab-notes"><span>Diario rapido</span><textarea id="lab-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Errore, causa, cosa hai imparato…" /></label>
            </div>
            {labChecks.every(Boolean) && <div className={`completion-card ${completed ? 'done' : ''}`}><CheckCircle2 /><div><span>{completed ? 'Lezione completata' : 'Ultimo checkpoint'}</span><h3>{completed ? 'Riscrivi domani la parte centrale senza guardare.' : 'Se output e casi limite sono corretti, completa la lezione.'}</h3></div>{!completed && <Button onClick={() => setCompleted(true)}>Segna come completata</Button>}</div>}
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
