export type TheorySection = {
  kicker: string;
  title: string;
  lead: string;
  points: string[];
  code?: string;
  callout: string;
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
  goal: string;
  constraints: string[];
  examples: string[];
};

export const lessonOne = {
  number: '01',
  title: 'Stringhe, cicli e casi limite',
  duration: '45–60 min',
  theory: [
    {
      kicker: 'Il modello mentale',
      title: 'Un metodo è un piccolo contratto',
      lead: 'Prima di scriverne il corpo, devi capire cosa riceve un metodo, cosa promette di restituire e quali input non accetta.',
      points: [
        '`public` rende il metodo richiamabile da altre classi.',
        '`static` permette di usarlo senza costruire un oggetto.',
        'Il tipo prima del nome indica il valore che deve essere restituito.',
        'Nome e parametri descrivono l’operazione richiesta.',
      ],
      code: 'public static int countDigits(String value)',
      callout: 'Leggila ad alta voce: “riceve una String chiamata value e restituisce un int”.',
    },
    {
      kicker: 'Tre stati diversi',
      title: '`null`, vuoto e spazio non sono la stessa cosa',
      lead: 'Una variabile String può non riferirsi ad alcun oggetto, riferirsi a una stringa senza caratteri oppure contenere caratteri invisibili.',
      points: [
        '`null`: nessun oggetto; non puoi chiamare `length()` o `charAt()`.',
        '`""`: oggetto valido con lunghezza zero.',
        '`"   "`: oggetto valido con tre caratteri spazio.',
        'Controlla `null` prima di usare il parametro.',
      ],
      code: 'if (name == null) {\n    throw new IllegalArgumentException("name non può essere null");\n}',
      callout: 'Validare presto rende l’errore intenzionale e comprensibile.',
    },
    {
      kicker: 'Orientarsi nel testo',
      title: 'Gli indici iniziano da zero',
      lead: 'In una stringa lunga n, il primo indice è 0 e l’ultimo è n − 1. È la causa di molti errori “off by one”.',
      points: [
        '`text.length()` restituisce il numero di caratteri.',
        '`text.charAt(index)` legge il carattere in quella posizione.',
        'Un `char` usa apici singoli: `\'a\'`.',
        'Una `String` usa virgolette doppie: `"a"`.',
      ],
      code: 'String text = "Java";\nchar first = text.charAt(0);  // J\nchar last = text.charAt(3);   // a',
      callout: 'Per “Java”, length() vale 4 ma l’indice 4 non esiste.',
    },
    {
      kicker: 'Visitare ogni carattere',
      title: 'Il ciclo controlla posizione e confine',
      lead: 'Un ciclo indicizzato permette di osservare un carattere alla volta e conservare la sua posizione.',
      points: [
        'Parti dall’indice 0.',
        'Continua mentre `index < text.length()`.',
        'Leggi il carattere corrente con `charAt(index)`.',
        'Incrementa l’indice dopo ogni iterazione.',
      ],
      code: 'for (int index = 0; index < text.length(); index++) {\n    char current = text.charAt(index);\n    // osserva current\n}',
      callout: 'Con una stringa vuota, 0 < 0 è falso: il corpo non viene mai eseguito.',
    },
    {
      kicker: 'Memoria del risultato',
      title: 'L’accumulatore conserva ciò che hai trovato',
      lead: 'Quando conti elementi, una variabile parte da zero e viene aggiornata soltanto quando la condizione è vera.',
      points: [
        'Inizializza il contatore prima del ciclo.',
        'Valuta un solo carattere per iterazione.',
        'Incrementa solo quando il carattere soddisfa la regola.',
        'Restituisci il totale dopo il ciclo.',
      ],
      code: 'int count = 0;\nif (matchesRule) {\n    count++;\n}',
      callout: 'Invariante: count rappresenta sempre le corrispondenze già esaminate.',
    },
    {
      kicker: 'Elementi vs sequenze',
      title: 'Un gruppo si conta quando inizia',
      lead: 'Contare ogni simbolo pieno non equivale a contare gruppi consecutivi. Per i gruppi devi riconoscere una transizione.',
      points: [
        '■■■□□■■ contiene cinque simboli pieni ma due gruppi.',
        'Un gruppo inizia quando entri da “fuori” a “dentro”.',
        'Uno stato booleano può ricordare se eri già dentro.',
        'Il separatore ti riporta nello stato “fuori”.',
      ],
      callout: 'Applicherai questo modello alle parole, definendo tu quando inizia e termina una parola.',
    },
    {
      kicker: 'Costruire testo',
      title: '`StringBuilder` evita copie inutili',
      lead: 'String è immutabile. Se produci un risultato carattere per carattere, StringBuilder è lo strumento adatto.',
      points: [
        'Crea il builder prima del ciclo.',
        'Aggiungi un carattere con `append(...)`.',
        'Decidi con attenzione direzione e confini degli indici.',
        'Alla fine usa `toString()`.',
      ],
      code: 'StringBuilder builder = new StringBuilder();\nbuilder.append(\'x\');\nString result = builder.toString();',
      callout: 'Prima di invertire una sequenza, chiediti: da quale indice parto e quando mi fermo?',
    },
    {
      kicker: 'Prima di eseguire',
      title: 'I casi limite fanno parte dell’algoritmo',
      lead: 'Un metodo è completo quando il comportamento degli input al confine è deliberato, non fortunato.',
      points: [
        'Testo normale: verifica il percorso principale.',
        'Stringa vuota: il ciclo deve comportarsi correttamente.',
        'Un carattere: controlla i confini degli indici.',
        'Spazi ripetuti: verifica le transizioni.',
        '`null`: verifica l’eccezione richiesta.',
      ],
      callout: 'Scrivi su carta risultato atteso e motivo per almeno cinque input.',
    },
  ] satisfies TheorySection[],
  quiz: [
    { id: 'q1', question: 'Qual è l’ultimo indice valido di una String lunga 6?', options: [{ id: 'a', label: '6' }, { id: 'b', label: '5' }, { id: 'c', label: '7' }], correct: 'b', explanation: 'Gli indici partono da 0: l’ultimo è length − 1, quindi 5.' },
    { id: 'q2', question: 'Quale valore è una String valida lunga zero?', options: [{ id: 'a', label: 'null' }, { id: 'b', label: '" "' }, { id: 'c', label: '""' }], correct: 'c', explanation: '"" è un oggetto String esistente che contiene zero caratteri.' },
    { id: 'q3', question: 'Perché il ciclo usa index < text.length()?', options: [{ id: 'a', label: 'Per non accedere a un indice inesistente' }, { id: 'b', label: 'Per ignorare l’ultimo carattere' }, { id: 'c', label: 'Perché length() parte da zero' }], correct: 'a', explanation: 'L’indice uguale a length() è già oltre l’ultimo carattere.' },
    { id: 'q4', question: 'Quando va incrementato il contatore di gruppi?', options: [{ id: 'a', label: 'Per ogni elemento del gruppo' }, { id: 'b', label: 'Quando si entra in un nuovo gruppo' }, { id: 'c', label: 'Quando termina il ciclo' }], correct: 'b', explanation: 'Il passaggio da “fuori” a “dentro” identifica un nuovo gruppo.' },
    { id: 'q5', question: 'Perché usare StringBuilder in una costruzione iterativa?', options: [{ id: 'a', label: 'String non può contenere spazi' }, { id: 'b', label: 'Per evitare molte String intermedie' }, { id: 'c', label: 'Converte automaticamente in maiuscolo' }], correct: 'b', explanation: 'String è immutabile; StringBuilder accumula senza ricreare il testo a ogni append.' },
  ] satisfies QuizQuestion[],
  lab: [
    { method: 'countVowels', title: 'Missione A · Conta le vocali', goal: 'Visita il testo e conta a, e, i, o, u ignorando maiuscole e minuscole.', constraints: ['Niente stream o espressioni regolari.', 'Gestisci null prima del ciclo.', 'Normalizza il singolo carattere.'], examples: ['"Educazione" → 6', '"rhythm" → 0', '"" → 0'] },
    { method: 'countWords', title: 'Missione B · Conta le parole', goal: 'Conta le sequenze separate da uno o più caratteri spazio.', constraints: ['Non contare ogni spazio.', 'Riconosci la transizione fuori → dentro.', 'Solo spazi significa zero parole.'], examples: ['"Java si impara" → 3', '"  uno   due  " → 2', '"   " → 0'] },
    { method: 'reverse', title: 'Missione C · Inverti il testo', goal: 'Costruisci una nuova stringa visitando i caratteri nella direzione corretta.', constraints: ['Usa un ciclo e StringBuilder.', 'Non usare reverse() della libreria.', 'Verifica zero e un carattere.'], examples: ['"Java" → "avaJ"', '"A" → "A"', '"" → ""'] },
  ] satisfies LabMission[],
};

export const roadmap = [
  { number: '01', title: lessonOne.title, status: 'available' },
  { number: '02', title: 'Metodi, scope e debug', status: 'next' },
  { number: '03', title: 'Array e collezioni', status: 'locked' },
  { number: '04', title: 'Classi, record e oggetti', status: 'locked' },
  { number: '05', title: 'Eccezioni e file', status: 'locked' },
  { number: '06', title: 'Generics e contratti', status: 'locked' },
  { number: '07', title: 'Lambda e Stream', status: 'locked' },
  { number: '08', title: 'Concorrenza moderna', status: 'locked' },
] as const;
