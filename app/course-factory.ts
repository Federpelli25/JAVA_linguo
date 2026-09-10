import type { CourseLesson, LabMission, LessonLevel, OfficialSource, QuizQuestion, TheorySection } from './course-types';

export type TopicSeed = {
  number: string;
  title: string;
  area: string;
  level: LessonLevel;
  minimumJdk: string;
  keywords: string[];
  definition: string;
  mentalModel: string;
  analogy: string;
  syntax: string;
  example: string;
  execution?: string[];
  edgeRule: string;
  tradeoff: string;
  commonError: string;
  source: OfficialSource;
  lab: {
    method: string;
    title: string;
    signature: string;
    scenario: string;
    goal: string;
    main: string;
    stub: string;
    imports?: string;
    constraints?: string[];
    cases: { input: string; output: string; purpose: string }[];
    reflection: string;
    challenge: string;
  };
};

const JLS: OfficialSource = {
  label: 'Java Language Specification — Java SE 25',
  url: 'https://docs.oracle.com/javase/specs/jls/se25/html/index.html',
};

const API: OfficialSource = {
  label: 'Java SE 25 API Specification',
  url: 'https://docs.oracle.com/en/java/javase/25/docs/api/index.html',
};

function duration(level: LessonLevel) {
  if (level === 'Progetto') return '150–210 min';
  if (level === 'Avanzato') return '100–130 min';
  if (level === 'Intermedio') return '85–110 min';
  return '70–90 min';
}

function starterCode(seed: TopicSeed) {
  const imports = seed.lab.imports ? `${seed.lab.imports}\n\n` : '';
  return `${imports}public class Main {
    public static void main(String[] args) throws Exception {
${seed.lab.main.split('\n').map((line) => `        ${line}`).join('\n')}
    }

${seed.lab.stub.split('\n').map((line) => `    ${line}`).join('\n')}
}`;
}

export function createLesson(seed: TopicSeed): CourseLesson {
  const previous = String(Number(seed.number) - 1).padStart(2, '0');
  const execution = seed.execution ?? [
    'Leggi i valori iniziali e verifica le precondizioni.',
    'Applica l’operazione centrale rispettando tipi e ordine di valutazione.',
    'Osserva il risultato e confrontalo con il contratto dichiarato.',
  ];
  const objectives = [
    `Spiegare ${seed.definition.charAt(0).toLowerCase()}${seed.definition.slice(1)}`,
    `Prevedere il comportamento di un programma che usa ${seed.keywords.slice(0, 2).join(' e ')}.`,
    `Applicare ${seed.title.toLowerCase()} rispettando contratto e casi limite.`,
    `Confrontare la soluzione con un’alternativa e motivare il compromesso: ${seed.tradeoff}`,
  ];

  const theory: TheorySection[] = [
    {
      kicker: '01 · Problema e obiettivi',
      title: `Perché servono ${seed.title.toLowerCase()}`,
      lead: seed.lab.scenario,
      plain: seed.definition,
      analogy: seed.analogy,
      points: objectives,
      callout: `Risultato della lezione: ${seed.lab.goal}`,
      question: `Quale limite del codice già conosciuto viene superato da ${seed.keywords[0]}?`,
    },
    {
      kicker: '02 · Modello mentale',
      title: 'Rappresenta lo stato prima della sintassi',
      lead: seed.mentalModel,
      plain: 'Disegna valori, riferimenti e passaggi di controllo. Una rappresentazione corretta permette di prevedere il programma senza affidarsi a tentativi casuali.',
      analogy: `${seed.analogy} L’analogia aiuta a orientarsi, ma il comportamento reale resta quello definito dalla specifica Java.`,
      points: [
        `Concetto centrale: ${seed.definition}`,
        `Regola di confine: ${seed.edgeRule}`,
        'Distingui sempre stato iniziale, trasformazione e risultato osservabile.',
        'Scrivi una previsione prima di eseguire il codice.',
      ],
      callout: seed.mentalModel,
      question: 'Quale informazione deve rimanere vera durante tutta l’esecuzione?',
    },
    {
      kicker: '03 · Sintassi con significato',
      title: 'Leggi il costrutto come un contratto',
      lead: 'La sintassi è utile soltanto quando sai collegare ogni parte al suo effetto sul programma.',
      plain: `Nel frammento seguente individua input, operazione, risultato e possibile punto di errore. ${seed.definition}`,
      points: [
        `Parole chiave: ${seed.keywords.join(', ')}.`,
        `Versione minima dichiarata: JDK ${seed.minimumJdk}.`,
        'I tipi rendono espliciti i valori ammessi e le operazioni disponibili.',
        'Il compilatore verifica la forma; i test verificano il comportamento.',
      ],
      code: seed.syntax,
      walkthrough: execution,
      callout: `Pronuncia a voce cosa promette: ${seed.syntax.split('\n')[0]}`,
      question: 'Quale parte del frammento stabilisce il tipo del risultato?',
    },
    {
      kicker: '04 · Esempio svolto',
      title: 'Prevedi, traccia, poi verifica',
      lead: 'Prima di leggere il risultato, esegui il frammento a mano e annota ogni cambiamento rilevante.',
      plain: seed.mentalModel,
      points: [
        'Individua i valori iniziali.',
        'Applica una sola regola di esecuzione per volta.',
        'Annota il risultato parziale dopo ogni passaggio.',
        'Confronta la previsione con l’output soltanto alla fine.',
      ],
      code: seed.example,
      walkthrough: execution,
      callout: 'Un output corretto senza una spiegazione non dimostra ancora padronanza del concetto.',
      question: 'Quale singolo cambiamento all’input produrrebbe un caso limite?',
    },
    {
      kicker: '05 · Limiti e alternative',
      title: 'Una soluzione corretta può non essere la scelta migliore',
      lead: seed.tradeoff,
      plain: `Caso limite da rendere esplicito: ${seed.edgeRule}`,
      points: [
        `Errore frequente: ${seed.commonError}`,
        `Compromesso progettuale: ${seed.tradeoff}`,
        'Controlla separatamente caso normale, limite e input non valido.',
        'Preferisci il costrutto che rende evidente il contratto, non quello con meno caratteri.',
      ],
      code: `// Caso limite da discutere\n${seed.lab.cases.map((item) => `// ${item.input} -> ${item.output}`).join('\n')}`,
      walkthrough: [
        'Il caso normale conferma la funzione principale.',
        'Il caso limite controlla confini e stato minimo.',
        'Il caso non valido verifica la politica di errore.',
      ],
      callout: seed.commonError,
      question: 'Come distingueresti un errore di compilazione, uno a runtime e uno logico in questo argomento?',
    },
    {
      kicker: '06 · Consolidamento',
      title: 'Dal concetto a una decisione autonoma',
      lead: 'Completa l’esercitazione guidata riducendo gli aiuti a ogni passaggio, poi affronta il laboratorio senza copiare una soluzione.',
      plain: `Sintesi: ${seed.definition} ${seed.tradeoff}`,
      points: [
        `Riscaldamento: riscrivi e commenta ${seed.syntax.split('\n')[0]}.`,
        `Analisi: spiega perché ${seed.edgeRule.charAt(0).toLowerCase()}${seed.edgeRule.slice(1)}`,
        `Autonomia: progetta tre test prima del metodo ${seed.lab.method}.`,
        'Autovalutazione: assegna 25 punti alla teoria, 25 alla correttezza, 20 ai test, 15 alla progettazione, 10 all’analisi e 5 alla riflessione.',
      ],
      callout: `Fonte principale: ${seed.source.label}.`,
      question: `Sapresti spiegare quando non usare ${seed.keywords[0]}?`,
    },
  ];

  const quiz: QuizQuestion[] = [
    {
      id: `${seed.number}-q1`,
      question: `Quale affermazione descrive correttamente ${seed.keywords[0]}?`,
      options: [
        { id: 'a', label: seed.definition },
        { id: 'b', label: 'È soltanto una convenzione grafica senza effetti sul programma.' },
        { id: 'c', label: 'Viene controllato esclusivamente dopo la terminazione della JVM.' },
      ],
      correct: 'a',
      explanation: seed.definition,
    },
    {
      id: `${seed.number}-q2`,
      question: 'Qual è il modo migliore per prevedere il frammento studiato?',
      options: [
        { id: 'a', label: 'Tracciare stato e passaggi prima dell’esecuzione' },
        { id: 'b', label: 'Cambiare istruzioni finché l’output sembra corretto' },
        { id: 'c', label: 'Ignorare tipi e precondizioni' },
      ],
      correct: 'a',
      explanation: seed.mentalModel,
    },
    {
      id: `${seed.number}-q3`,
      question: 'Quale regola deve comparire nei test?',
      options: [
        { id: 'a', label: seed.edgeRule },
        { id: 'b', label: 'È sufficiente provare un solo input casuale.' },
        { id: 'c', label: 'I casi limite possono essere ignorati se il codice compila.' },
      ],
      correct: 'a',
      explanation: `Il confine fa parte del contratto: ${seed.edgeRule}`,
    },
    {
      id: `${seed.number}-q4`,
      question: 'Quale valutazione progettuale è più corretta?',
      options: [
        { id: 'a', label: seed.tradeoff },
        { id: 'b', label: 'L’implementazione più corta è sempre la migliore.' },
        { id: 'c', label: 'Le alternative hanno sempre lo stesso costo e la stessa leggibilità.' },
      ],
      correct: 'a',
      explanation: seed.tradeoff,
    },
    {
      id: `${seed.number}-q5`,
      question: 'Quale comportamento richiede una correzione?',
      options: [
        { id: 'a', label: seed.commonError },
        { id: 'b', label: 'Scrivere prima i risultati attesi dei test.' },
        { id: 'c', label: 'Motivare la scelta della struttura dati.' },
      ],
      correct: 'a',
      explanation: `È l’errore tipico da riconoscere: ${seed.commonError}`,
    },
  ];

  const lab: LabMission[] = [
    {
      method: seed.lab.method,
      title: `Laboratorio · ${seed.lab.title}`,
      signature: seed.lab.signature,
      scenario: seed.lab.scenario,
      goal: seed.lab.goal,
      steps: [
        `Riscaldamento: prevedi a mano i risultati di ${seed.lab.cases[0].input} e ${seed.lab.cases[1].input}.`,
        `Analisi: collega ogni requisito alla firma ${seed.lab.signature}.`,
        'Implementa il TODO senza cambiare il contratto pubblico e senza copiare una soluzione completa.',
        'Compila ed esegui; aggiungi nel main almeno un caso normale, uno limite e uno non valido.',
        `Spiega nel diario la scelta principale: ${seed.lab.reflection}`,
      ],
      constraints: seed.lab.constraints ?? [
        `Usa esplicitamente ${seed.keywords.slice(0, 2).join(' e ')}: la scelta deve essere visibile e motivata.`,
        'Mantieni il metodo piccolo, assegna nomi descrittivi e non nascondere errori con valori sentinella ambigui.',
        'Non cambiare la firma richiesta; gestisci il caso limite prima dell’elaborazione principale.',
      ],
      examples: seed.lab.cases,
      acceptance: [
        'Il file Main.java compila con il JDK dichiarato.',
        'I casi normale, limite e non valido producono il comportamento atteso.',
        `Il metodo rispetta esattamente la firma ${seed.lab.signature}.`,
        'Il diario contiene una motivazione tecnica e non soltanto la descrizione del codice.',
      ],
      reflection: seed.lab.reflection,
      challenge: seed.lab.challenge,
    },
  ];

  return {
    number: seed.number,
    title: seed.title,
    area: seed.area,
    level: seed.level,
    duration: duration(seed.level),
    minimumJdk: seed.minimumJdk,
    prerequisites: [`Lezione ${previous}`, `Conoscere i concetti consolidati nel modulo precedente`],
    keywords: seed.keywords,
    sources: [seed.source, JLS, API],
    outcome: seed.lab.goal,
    objectives,
    guidedExercise: [
      `Riproduci l’esempio usando ${seed.syntax.split('\n')[0]}.`,
      `Modifica l’input per osservare questa regola: ${seed.edgeRule}`,
      `Progetta autonomamente il primo test del laboratorio ${seed.lab.title}.`,
    ],
    summary: [seed.definition, seed.mentalModel, seed.edgeRule, seed.tradeoff],
    reviewQuestions: [
      `Che cosa garantisce ${seed.keywords[0]}?`,
      `Quale errore produce ${seed.commonError.charAt(0).toLowerCase()}${seed.commonError.slice(1)}`,
      `Quando preferiresti un’alternativa a ${seed.keywords[0]}?`,
    ],
    theory,
    quiz,
    lab,
    starterCode: starterCode(seed),
  };
}
