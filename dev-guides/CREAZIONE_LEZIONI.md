# Linee guida per creare le lezioni Java

Queste istruzioni sono obbligatorie per ogni nuova lezione o revisione sostanziale. L'obiettivo non è produrre un semplice tutorial, ma un'unità didattica paragonabile a una lezione universitaria di informatica: rigorosa nei contenuti, progressiva nella spiegazione e verificabile attraverso esercizi e laboratorio.

## 1. Principi didattici

Ogni lezione deve:

- spiegare non solo **come** si scrive il codice, ma **perché** funziona e **quando** conviene usarlo;
- collegare sintassi, semantica del linguaggio, comportamento a runtime e qualità del software;
- richiedere ragionamento, previsione del comportamento e progettazione, non sola memorizzazione;
- procedere dal modello mentale all'esempio, poi dall'esempio all'applicazione autonoma;
- distinguere chiaramente Java come linguaggio, API standard, JVM e strumenti di sviluppo;
- includere casi normali, casi limite, input non validi ed errori frequenti;
- usare un linguaggio italiano chiaro senza rinunciare alla terminologia tecnica corretta;
- mantenere separati teoria, verifica della comprensione e laboratorio.

La difficoltà deve derivare dalla profondità del ragionamento, non da trabocchetti sintattici o requisiti nascosti.

## 2. Fonti e versione di Java

Ogni lezione deve dichiarare la versione minima del JDK usata. Per le informazioni tecniche privilegiare fonti primarie:

- Java Language Specification (JLS);
- Java Virtual Machine Specification (JVMS), quando pertinente;
- documentazione Javadoc ufficiale;
- JEP e documentazione OpenJDK;
- note di rilascio del JDK.

Indicare esplicitamente se una funzionalità è:

- definitiva e disponibile nel JDK di riferimento;
- `preview`, quindi soggetta a modifiche e da abilitare esplicitamente;
- `incubator` o sperimentale;
- deprecata o destinata alla rimozione.

Non presentare una novità come stabile senza verificarne lo stato nella versione del JDK indicata.

## 3. Metadati obbligatori

All'inizio di ogni lezione inserire:

- numero e titolo;
- area del corso;
- livello: Fondamenti, Intermedio, Avanzato o Progetto;
- durata stimata per teoria, verifica e laboratorio;
- prerequisiti concettuali e lezioni da completare prima;
- versione minima del JDK;
- parole chiave;
- fonti tecniche principali;
- risultato concreto che lo studente produrrà.

## 4. Obiettivi di apprendimento

Definire da tre a sei obiettivi osservabili e misurabili. Usare verbi come:

- spiegare e distinguere;
- prevedere e tracciare;
- applicare e implementare;
- analizzare e confrontare;
- valutare e motivare;
- progettare e verificare.

Evitare obiettivi vaghi come "capire i cicli". Preferire: "prevedere il numero di iterazioni di un ciclo e motivare il risultato tracciando lo stato delle variabili".

Almeno un obiettivo deve valutare comprensione concettuale e almeno uno applicazione nel codice. Dalla fascia Intermedio in poi, includere anche analisi, confronto o progettazione.

## 5. Struttura obbligatoria della lezione

### 5.1 Problema motivante

Aprire con un problema realistico che renda necessario il concetto. Non mostrare subito la soluzione completa. Lo studente deve comprendere quale limite degli strumenti già conosciuti verrà superato.

### 5.2 Richiamo dei prerequisiti

Proporre due o tre domande brevi per riattivare le conoscenze necessarie. Se una risposta è indispensabile per proseguire, offrire un richiamo sintetico o un collegamento alla lezione precedente.

### 5.3 Teoria

La spiegazione teorica deve contenere, nell'ordine più adatto al tema:

1. definizioni precise dei termini;
2. modello mentale o rappresentazione dello stato;
3. sintassi minima accompagnata dal suo significato;
4. regole di esecuzione passo per passo;
5. vincoli, invarianti e precondizioni, quando applicabili;
6. comportamento in memoria o sulla JVM, se utile a spiegare il risultato;
7. costi temporali e spaziali, quando il tema riguarda algoritmi o strutture dati;
8. confronto con almeno un'alternativa e relativi compromessi;
9. situazioni in cui il costrutto non è appropriato;
10. errori comuni, controesempi e strategia di debug.

Ogni blocco teorico deve essere breve abbastanza da poter essere seguito da un esempio o da una domanda. Le analogie sono ammesse, ma devono essere seguite dalla spiegazione tecnica e devono dichiarare i propri limiti.

### 5.4 Esempi svolti

Inserire almeno due esempi:

- uno fondamentale, analizzato riga per riga;
- uno con caso limite o errore ragionato.

Quando opportuno, usare una tabella di traccia con iterazione, variabili, condizione e output. Prima di rivelare il risultato, chiedere allo studente di prevederlo. Gli esempi non devono coincidere con la soluzione del laboratorio.

### 5.5 Verifica della comprensione

Alternare tipi di domanda:

- previsione dell'output con motivazione;
- individuazione e spiegazione di un errore;
- confronto tra due implementazioni;
- completamento di una porzione limitata di codice;
- domanda concettuale a risposta aperta;
- scelta multipla con spiegazione per ogni opzione.

Ogni domanda deve avere feedback formativo: spiegare il ragionamento corretto, non limitarsi a indicare "giusto" o "sbagliato". Almeno una domanda deve richiedere una motivazione scritta.

### 5.6 Esercitazione guidata

Prima del laboratorio proporre un esercizio più piccolo, diviso in passaggi. Ridurre gradualmente gli aiuti:

1. primo passaggio con indicazioni esplicite;
2. secondo con suggerimenti concettuali;
3. ultimo da completare in autonomia.

### 5.7 Laboratorio

Il laboratorio deve includere:

- scenario e requisiti funzionali;
- esempi di input e output;
- vincoli tecnici motivati;
- starter code minimo, senza soluzione nascosta;
- criteri di accettazione verificabili;
- test per casi normali, limite e non validi;
- richiesta di spiegare almeno una scelta progettuale;
- estensione facoltativa più impegnativa.

La consegna non deve suggerire una singola implementazione quando esistono più soluzioni corrette. I test devono verificare il contratto osservabile, evitando di imporre dettagli interni non richiesti.

### 5.8 Chiusura e consolidamento

Terminare con:

- sintesi dei concetti essenziali;
- mappa dei collegamenti con lezioni precedenti e successive;
- tre domande di ripasso differito;
- breve autovalutazione dello studente;
- riferimenti ufficiali per approfondire.

## 6. Livelli di difficoltà

### Fondamenti — equivalente a un corso introduttivo

Richiede traccia manuale dell'esecuzione, uso corretto della sintassi, scomposizione di problemi semplici e primi test. Non presuppone esperienza professionale.

### Intermedio — equivalente a programmazione 2

Richiede progettazione orientata agli oggetti, collezioni, generics, eccezioni, test, analisi di complessità e confronto tra soluzioni. Lo studente deve motivare le proprie scelte.

### Avanzato — equivalente a un corso specialistico

Richiede ragionamento su concorrenza, memoria, JVM, API design, prestazioni o funzionalità moderne del linguaggio. Includere trade-off, limiti e osservazione sperimentale.

### Progetto — equivalente a una prova d'esame o capstone

Richiede integrare più argomenti, definire un'architettura, scrivere test, documentare decisioni e discutere alternative. I requisiti devono essere chiari, ma il percorso risolutivo deve restare aperto.

Una lezione può introdurre un solo salto concettuale importante alla volta. La complessità complessiva cresce cumulando conoscenze già consolidate.

## 7. Progressione degli esercizi

Ogni lezione deve prevedere almeno quattro livelli:

1. **Riscaldamento:** applicazione diretta di una singola regola.
2. **Analisi:** previsione, debug o confronto motivato.
3. **Laboratorio principale:** problema nuovo che combina i concetti della lezione.
4. **Sfida:** variante con requisito aggiuntivo, prestazioni, generalizzazione o scelta progettuale.

Quando utile, aggiungere una domanda da colloquio orale: lo studente deve spiegare il codice senza eseguirlo e rispondere a una modifica ipotetica del requisito.

## 8. Valutazione

Usare una rubrica trasparente su 100 punti:

| Area | Punti | Cosa valutare |
| --- | ---: | --- |
| Comprensione concettuale | 25 | Terminologia, modello mentale, motivazioni |
| Correttezza funzionale | 25 | Requisiti soddisfatti e casi limite |
| Test e robustezza | 20 | Qualità dei test, errori e input non validi |
| Progettazione e leggibilità | 15 | Responsabilità, nomi, struttura e semplicità |
| Analisi tecnica | 10 | Trade-off, complessità o comportamento runtime |
| Riflessione | 5 | Limiti della soluzione e miglioramenti possibili |

La soglia consigliata è 70/100. Un programma che produce l'output atteso ma non soddisfa i concetti centrali della lezione non può ottenere la valutazione massima.

## 9. Modalità di tutoraggio

Durante il laboratorio l'applicazione deve favorire l'autonomia:

- chiedere prima un tentativo o una previsione;
- offrire indizi progressivi, dal concetto alla porzione di codice;
- analizzare l'errore dello studente prima di proporre modifiche;
- non mostrare la soluzione completa salvo richiesta esplicita dopo un tentativo;
- porre una domanda di controllo dopo ogni spiegazione decisiva;
- distinguere errore di compilazione, eccezione a runtime ed errore logico;
- invitare lo studente a scrivere il codice a mano e poi verificarlo con compilatore e test.

## 10. Errori di progettazione da evitare

Non creare lezioni che:

- siano soltanto una raccolta di frammenti da copiare;
- comprimano molti concetti nuovi in poche schede superficiali;
- anticipino nel testo la soluzione completa del laboratorio;
- valutino esclusivamente il ricordo di definizioni;
- usino framework esterni prima di consolidare il corrispondente concetto Java;
- nascondano requisiti nei test;
- confondano buone pratiche con regole assolute senza discutere il contesto;
- usino funzionalità preview senza segnalarlo;
- dichiarino una complessità o un comportamento della JVM senza motivarlo.

## 11. Quality gate della singola lezione

Prima di considerare pronta una lezione, verificare che:

- tutti i metadati e gli obiettivi siano presenti;
- ogni obiettivo sia valutato da almeno un'attività;
- la teoria risponda a cosa, perché, come e quando;
- siano presenti almeno due esempi e un caso limite;
- esempi e starter code compilino con il JDK dichiarato;
- il laboratorio non contenga la soluzione completa;
- i test coprano casi normali, limite e non validi;
- feedback e indizi aiutino a ragionare;
- la rubrica sia coerente con la consegna;
- fonti e stato delle funzionalità Java siano aggiornati;
- la lezione sia utilizzabile da tastiera e leggibile nell'interfaccia;
- siano superati anche i quality gate tecnici indicati nel `README.md` di questa cartella.

Eseguire sempre `npm run course:validate`: il comando verifica numero, ordine, metadati e soglie didattiche dell'intero catalogo e compila con `javac --release` lo starter code di tutte le 52 lezioni.

## 12. Modello sintetico

Usare questo schema come indice minimo:

```markdown
# Lezione N — Titolo

## Metadati
Livello, durata, prerequisiti, JDK, parole chiave e fonti.

## Obiettivi di apprendimento
Da tre a sei risultati misurabili.

## Problema motivante
Scenario e domanda iniziale.

## Richiamo dei prerequisiti
Domande brevi e collegamenti.

## Teoria
Definizioni, modello mentale, regole, trade-off ed errori comuni.

## Esempi svolti
Esempio fondamentale e caso limite.

## Verifica
Domande con feedback ragionato.

## Esercitazione guidata
Aiuti progressivamente ridotti.

## Laboratorio
Requisiti, starter code, test, criteri di accettazione e sfida.

## Valutazione
Rubrica e autovalutazione.

## Sintesi e ripasso
Concetti chiave, domande differite e fonti.
```

Questo modello è il minimo comune. La forma dell'interfaccia può cambiare, ma profondità, progressione, verifica e laboratorio non devono essere eliminati.
