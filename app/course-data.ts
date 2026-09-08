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
  goal: string;
  constraints: string[];
  examples: string[];
};

export const lessonOne = {
  number: '01',
  title: 'Stringhe, cicli e casi limite',
  duration: '60–75 min',
  theory: [
    {
      kicker: '01 · Il modello mentale',
      title: 'Un metodo è un piccolo contratto',
      lead: 'Un metodo riceve dei dati, svolge un compito preciso e produce un risultato. La sua firma è la descrizione sintetica di questo accordo.',
      plain: 'Prima di pensare alle istruzioni da scrivere, traduci la firma in una frase italiana. Questo riduce la confusione: sai già quale dato entra, quale risultato deve uscire e quale nome userai per riferirti al dato.',
      analogy: 'Pensa a una macchina per il caffè: inserisci una capsula, scegli il comando e ricevi una bevanda. Parametro, operazione e valore restituito hanno ruoli simili.',
      points: [
        '`public` indica che il metodo può essere richiamato anche da altre classi.',
        '`static` significa che puoi chiamarlo tramite la classe, senza creare prima un oggetto.',
        '`int` è il tipo del risultato promesso: un numero intero.',
        '`String value` è il parametro: il testo ricevuto dal chiamante.',
      ],
      code: 'public static int countDigits(String value)',
      walkthrough: [
        'Il chiamante passa, per esempio, `"A7B20"`.',
        'Dentro il metodo quel testo viene chiamato `value`.',
        'Il metodo esamina il testo e alla fine deve restituire un `int`.',
      ],
      callout: 'Non iniziare dal ciclo: inizia sempre dal contratto.',
      question: 'Come leggeresti a voce `public static String clean(String text)`?',
    },
    {
      kicker: '02 · Riferimenti',
      title: '`null`, stringa vuota e spazi sono tre input diversi',
      lead: 'Una variabile `String` non contiene necessariamente del testo visibile. Può anche non indicare alcun oggetto oppure indicare una sequenza di lunghezza zero.',
      plain: '`null` non è una stringa speciale: è l’assenza di una String. Per questo non puoi chiedergli lunghezza o caratteri. `""`, invece, è un oggetto vero ma vuoto. Uno spazio è un carattere reale, anche se sullo schermo sembra invisibile.',
      analogy: 'Immagina tre scatole: la prima non esiste (`null`), la seconda esiste ma è vuota (`""`), la terza contiene tre fogli bianchi (`"   "`). Sembrano simili, ma non puoi trattarle allo stesso modo.',
      points: [
        '`null`: nessun oggetto; usare `length()` causerebbe una `NullPointerException`.',
        '`""`: String valida con `length()` uguale a 0.',
        '`"   "`: String valida con tre caratteri spazio.',
        'Se il contratto richiede `IllegalArgumentException`, controlla `null` prima di usare il parametro.',
      ],
      code: 'if (name == null) {\n    throw new IllegalArgumentException("name non può essere null");\n}',
      walkthrough: [
        'Prima domanda: il riferimento è `null`?',
        'Se sì, interrompi intenzionalmente il metodo con l’eccezione richiesta.',
        'Solo dopo puoi chiamare in sicurezza `isEmpty()`, `length()` o `charAt(...)`.',
      ],
      callout: 'La validazione va prima dell’elaborazione.',
      question: 'Perché `" "` non può essere considerata una stringa vuota?',
    },
    {
      kicker: '03 · Tipi di testo',
      title: '`String` e `char` rappresentano cose differenti',
      lead: 'Una `String` è una sequenza di zero o più caratteri. Un `char` rappresenta un singolo carattere.',
      plain: 'Quando visiti una parola carattere per carattere, la variabile che contiene l’intera parola resta una `String`; il singolo elemento letto con `charAt` è invece un `char`. Java usa una sintassi diversa per impedire di confonderli.',
      analogy: 'Una String è come un treno; ogni char è un singolo vagone. Puoi studiare il treno intero oppure un vagone alla volta.',
      points: [
        'Le stringhe usano virgolette doppie: `"a"`.',
        'I caratteri usano apici singoli: `\'a\'`.',
        '`String` è immutabile: le sue operazioni non cambiano l’oggetto originale.',
        '`Character.toLowerCase(current)` normalizza un singolo carattere.',
      ],
      code: 'String word = "Casa";\nchar first = word.charAt(0);\nchar normalized = Character.toLowerCase(first);',
      walkthrough: [
        '`word` continua a valere `"Casa"`.',
        '`first` vale `\'C\'`.',
        '`normalized` vale `\'c\'`.',
      ],
      callout: 'Normalizzare il carattere letto non modifica la String originale.',
      question: 'Che tipo hanno rispettivamente `"J"` e `\'J\'`?',
    },
    {
      kicker: '04 · Posizioni',
      title: 'Gli indici iniziano da zero',
      lead: 'Ogni carattere ha una posizione numerica. In Java la prima posizione è 0, non 1.',
      plain: 'La lunghezza indica quanti caratteri esistono, non l’ultimo indice. Se una String ha quattro caratteri, gli indici validi sono 0, 1, 2 e 3. Cercare l’indice 4 significa andare oltre la fine.',
      analogy: 'È come numerare quattro cassetti partendo da zero: 0, 1, 2, 3. Il numero dei cassetti è 4, ma non esiste il cassetto 4.',
      points: [
        '`text.length()` restituisce il numero totale di caratteri.',
        '`text.charAt(index)` legge il carattere nella posizione indicata.',
        'Il primo indice valido è sempre 0, se la String non è vuota.',
        'L’ultimo indice valido è sempre `length() - 1`.',
      ],
      code: 'String text = "Java";\n// indici:     0123\nchar first = text.charAt(0); // J\nchar last  = text.charAt(3); // a',
      walkthrough: [
        '`text.length()` restituisce 4.',
        '`text.charAt(3)` è valido e restituisce l’ultima `a`.',
        '`text.charAt(4)` produce `StringIndexOutOfBoundsException`.',
      ],
      callout: 'Lunghezza 4 significa ultimo indice 3.',
      question: 'Qual è l’ultimo indice valido della String `"codice"`?',
    },
    {
      kicker: '05 · Ripetizione',
      title: 'Il ciclo `for` visita un carattere alla volta',
      lead: 'Un ciclo indicizzato ripete le stesse istruzioni cambiando la posizione osservata.',
      plain: 'Il `for` contiene tre parti: inizializzazione, condizione e aggiornamento. Prima crea `index` con valore 0; prima di ogni giro verifica il confine; dopo ogni giro incrementa l’indice.',
      analogy: 'Immagina un lettore che sposta il dito lungo una parola: parte dalla prima lettera, la legge, avanza di una posizione e si ferma appena non ci sono più lettere.',
      points: [
        '`int index = 0` viene eseguito una sola volta.',
        '`index < text.length()` viene controllato prima di ogni iterazione.',
        '`index++` viene eseguito alla fine di ogni iterazione.',
        '`text.charAt(index)` legge il carattere corrente.',
      ],
      code: 'for (int index = 0; index < text.length(); index++) {\n    char current = text.charAt(index);\n    System.out.println(current);\n}',
      walkthrough: [
        'Con `"OK"`, index 0 legge `\'O\'`.',
        'Poi index diventa 1 e legge `\'K\'`.',
        'Infine index diventa 2: `2 < 2` è falso e il ciclo termina.',
      ],
      callout: 'Usare `<=` tenterebbe un’iterazione di troppo.',
      question: 'Quante volte entra nel ciclo una String di lunghezza zero?',
    },
    {
      kicker: '06 · Tracciamento',
      title: 'Esegui mentalmente il ciclo prima del computer',
      lead: 'Il modo più efficace per capire un ciclo è annotare come cambiano le variabili a ogni iterazione.',
      plain: 'Crea una piccola tabella con indice, carattere corrente e risultato parziale. Questa tecnica si chiama dry run: esecuzione a secco. Ti permette di scoprire errori nei confini senza modificare codice a tentativi.',
      points: [
        'Scrivi il valore iniziale delle variabili.',
        'Valuta la condizione del ciclo come vero o falso.',
        'Esegui mentalmente il corpo usando il carattere corrente.',
        'Aggiorna indice e risultato, poi ripeti.',
      ],
      code: 'String text = "A2B";\n// index | current | è una cifra? | count\n//   0   |   A     | no          | 0\n//   1   |   2     | sì          | 1\n//   2   |   B     | no          | 1',
      walkthrough: [
        'Il contatore parte da 0.',
        'Cambia soltanto quando il carattere soddisfa la condizione.',
        'Dopo l’ultimo carattere il risultato resta 1.',
      ],
      callout: 'Se non sai prevedere la tabella, non sei ancora pronto a scrivere il ciclo.',
      question: 'Nel testo `"3A7"`, quali iterazioni cambiano il contatore delle cifre?',
    },
    {
      kicker: '07 · Risultato parziale',
      title: 'Un accumulatore ricorda ciò che hai già trovato',
      lead: 'Il ciclo osserva un elemento per volta; l’accumulatore conserva il risultato costruito fino a quel momento.',
      plain: 'Per contare, inizializzi normalmente una variabile a zero. Ogni volta che la regola è soddisfatta la incrementi. Alla fine del ciclo la variabile contiene il totale, perché nessun carattere è stato saltato.',
      analogy: 'È come usare un contapersone all’ingresso: parte da zero e fai uno scatto soltanto quando entra una persona valida.',
      points: [
        'L’accumulatore viene dichiarato prima del ciclo.',
        'La condizione decide se aggiornarlo.',
        '`count++` equivale a `count = count + 1`.',
        'Il `return` viene normalmente eseguito dopo aver visitato tutti gli elementi.',
      ],
      code: 'int count = 0;\nfor (...) {\n    if (matchesRule) {\n        count++;\n    }\n}\nreturn count;',
      walkthrough: [
        'Prima del ciclo non hai trovato nulla: count è 0.',
        'Dopo ogni iterazione count descrive ciò che hai esaminato finora.',
        'Questa frase sempre vera è chiamata invariante del ciclo.',
      ],
      callout: 'Aggiorna il contatore soltanto nel punto in cui riconosci una corrispondenza.',
      question: 'Perché dichiarare `count` dentro il ciclo renderebbe impossibile conservare il totale?',
    },
    {
      kicker: '08 · Stato',
      title: 'Contare elementi non è come contare gruppi',
      lead: 'Quando cerchi sequenze consecutive, devi sapere non solo cosa stai leggendo adesso, ma anche in quale stato eri prima.',
      plain: 'Nella sequenza ■■■□□■■ ci sono cinque simboli pieni ma soltanto due gruppi. Un nuovo gruppo va contato solo quando passi dallo stato “fuori” allo stato “dentro”. I simboli successivi appartengono allo stesso gruppo.',
      analogy: 'In un tunnel conti gli ingressi, non ogni metro percorso. Entri una volta, rimani dentro per un tratto ed esci; il tunnel successivo produce un nuovo ingresso.',
      points: [
        'Un booleano può ricordare se sei dentro una sequenza.',
        'Elemento valido mentre sei fuori: nasce un nuovo gruppo.',
        'Elemento valido mentre sei dentro: il gruppo continua.',
        'Separatore: torni nello stato fuori.',
      ],
      code: '// simboli: ■ ■ ■ □ □ ■ ■\n// stato:   IN IN IN OUT OUT IN IN\n// ingressi: 1             2',
      walkthrough: [
        'Il primo ■ provoca la transizione OUT → IN: conta 1.',
        'Gli altri due ■ non cambiano stato.',
        '□ porta lo stato a OUT; il successivo ■ provoca il secondo ingresso.',
      ],
      callout: 'Nell’esercizio userai questo modello per riconoscere l’inizio delle parole.',
      question: 'Quanti gruppi contiene `□□■■□■□□■■■` e in quali posizioni iniziano?',
    },
    {
      kicker: '09 · Costruzione',
      title: '`StringBuilder` costruisce testo senza continue copie',
      lead: 'Una `String` è immutabile: una volta creata non cambia. Le operazioni che sembrano modificarla producono in realtà un nuovo oggetto.',
      plain: 'Concatenare con `+` a ogni iterazione crea molte String intermedie. `StringBuilder` mantiene invece un contenitore modificabile: aggiungi i caratteri e lo converti in String soltanto alla fine.',
      analogy: 'Con `+` fotografi il foglio dopo ogni lettera; con StringBuilder continui a scrivere sullo stesso foglio e fai una sola fotografia alla fine.',
      points: [
        'Crea un solo builder prima del ciclo.',
        '`append(...)` aggiunge un elemento in fondo.',
        '`toString()` produce il risultato finale.',
        'Per cambiare ordine devi scegliere correttamente indice iniziale, direzione e condizione di arresto.',
      ],
      code: 'StringBuilder builder = new StringBuilder();\nbuilder.append(\'C\');\nbuilder.append(\'i\');\nbuilder.append(\'a\');\nString result = builder.toString(); // "Cia"',
      walkthrough: [
        'Il builder nasce vuoto.',
        'Ogni append conserva ciò che era già presente e aggiunge un carattere.',
        'Solo alla fine ottieni una String immutabile.',
      ],
      callout: 'Per invertire non serve una scorciatoia: ragiona sulla direzione degli indici.',
      question: 'Se vuoi leggere una String dalla fine, quale dovrebbe essere il primo indice?',
    },
    {
      kicker: '10 · Progettazione',
      title: 'I casi limite fanno parte dell’algoritmo',
      lead: 'Un’implementazione non è completa finché non sai spiegare cosa accade con input normali, vuoti, minimi e non validi.',
      plain: 'Prima di programmare prepara esempi e risultati attesi. Poi traduci ogni caso in un test. I test non servono soltanto a trovare errori: rendono esplicito il contratto che il metodo deve rispettare.',
      analogy: 'Un ponte non viene collaudato soltanto con il traffico ideale: si controllano anche carico minimo, massimo e condizioni anomale.',
      points: [
        'Caso normale: verifica il comportamento principale.',
        'Caso vuoto: controlla che il ciclo possa non partire.',
        'Un solo carattere: controlla i confini.',
        'Valori ripetuti: controlla stato e transizioni.',
        '`null`: controlla l’eccezione richiesta dal contratto.',
      ],
      code: '// Preparazione → Azione → Verifica\nString input = "A2";\nint result = countDigits(input);\nassertEquals(1, result);',
      walkthrough: [
        'Scegli un input che rappresenta una regola precisa.',
        'Esegui una sola operazione.',
        'Confronta risultato reale e risultato atteso.',
      ],
      callout: 'Un test rosso è informazione: indica quale parte del contratto manca ancora.',
      question: 'Quali cinque categorie di input testeresti prima di considerare completo un metodo sulle String?',
    },
  ] satisfies TheorySection[],
  quiz: [
    { id: 'q1', question: 'Qual è l’ultimo indice valido di una String lunga 6?', options: [{ id: 'a', label: '6' }, { id: 'b', label: '5' }, { id: 'c', label: '7' }], correct: 'b', explanation: 'Gli indici partono da 0: l’ultimo è length − 1, quindi 5.' },
    { id: 'q2', question: 'Quale valore è una String valida lunga zero?', options: [{ id: 'a', label: 'null' }, { id: 'b', label: '" "' }, { id: 'c', label: '""' }], correct: 'c', explanation: '"" è un oggetto String esistente che contiene zero caratteri.' },
    { id: 'q3', question: 'Perché il ciclo usa index < text.length()?', options: [{ id: 'a', label: 'Per non accedere a un indice inesistente' }, { id: 'b', label: 'Per ignorare l’ultimo carattere' }, { id: 'c', label: 'Perché length() parte da zero' }], correct: 'a', explanation: 'L’indice uguale a length() è già oltre l’ultimo carattere.' },
    { id: 'q4', question: 'Quando va incrementato il contatore di gruppi?', options: [{ id: 'a', label: 'Per ogni elemento del gruppo' }, { id: 'b', label: 'Quando si entra in un nuovo gruppo' }, { id: 'c', label: 'Quando termina il ciclo' }], correct: 'b', explanation: 'Il passaggio da “fuori” a “dentro” identifica un nuovo gruppo.' },
    { id: 'q5', question: 'Perché usare StringBuilder in una costruzione iterativa?', options: [{ id: 'a', label: 'String non può contenere spazi' }, { id: 'b', label: 'Per evitare molte String intermedie' }, { id: 'c', label: 'Converte automaticamente in maiuscolo' }], correct: 'b', explanation: 'String è immutabile; StringBuilder accumula senza ricreare il testo a ogni append.' },
    { id: 'q6', question: 'Quando va controllato un parametro null?', options: [{ id: 'a', label: 'Dopo aver chiamato length()' }, { id: 'b', label: 'Prima di usare il parametro' }, { id: 'c', label: 'Soltanto dentro il test' }], correct: 'b', explanation: 'Il controllo deve precedere qualsiasi accesso alla String.' },
    { id: 'q7', question: 'Quante volte entra nel ciclo una String vuota?', options: [{ id: 'a', label: 'Zero' }, { id: 'b', label: 'Una' }, { id: 'c', label: 'Dipende dal carattere' }], correct: 'a', explanation: 'All’inizio 0 < 0 è già falso, quindi il corpo non viene eseguito.' },
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
