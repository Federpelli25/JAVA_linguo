# Changelog

Tutte le modifiche rilevanti di JAVA_linguo sono documentate in questo file. Il progetto segue il versionamento semantico.

## [0.4.2] - 2026-09-09

### Corretto

- resa deterministica la creazione degli installer desktop usando il frontend `dist` già versionato e verificato dalla pipeline di qualità;
- rimossa la ricompilazione ridondante del frontend su ciascun sistema operativo durante la pubblicazione.

## [0.4.1] - 2026-09-09

### Corretto

- separata la generazione del frontend e del sidecar per usare la shell nativa di ogni runner GitHub;
- inoltrata correttamente a Cargo l'opzione `--locked` durante le build Tauri;
- letta la versione degli installer direttamente dal file `VERSION`, evitando sintassi dipendente dalla shell.

## [0.4.0] - 2026-09-09

### Aggiunto

- applicazione desktop nativa basata su Tauri per Windows, macOS Apple Silicon, macOS Intel e Linux;
- backend Python incorporato come sidecar: l'utente finale non deve installare Python o Node.js;
- installer e checksum SHA-256 creati automaticamente su ogni sistema operativo e pubblicati nelle release GitHub;
- schermata di avvio, icona coordinata e controllo automatico di disponibilità del server locale.

### Migliorato

- nome del prodotto uniformato a `JAVA_linguo` nell'interfaccia, nei pacchetti e nella documentazione;
- migrazione trasparente dei progressi salvati con il precedente nome dell'app;
- dipendenze Cloudflare e Sharp aggiornate per mantenere l'audit privo di vulnerabilità note.

### Sicurezza

- permessi Tauri ridotti all'avvio del solo sidecar dichiarato con argomenti validati;
- server e sandbox Docker invariati nei loro confini: loopback, cookie HttpOnly, allowlist dei comandi e limiti di risorse;
- build native separate per piattaforma con attestazione di provenienza GitHub.

## [0.3.1] - 2026-09-08

### Corretto

- reso il lockfile npm portabile anche sui runner Linux includendo esplicitamente le dipendenze WebAssembly necessarie alla build;
- disattivati gli script di installazione npm nelle pipeline CI e di release per ridurre la superficie di attacco della supply chain.

## [0.3.0] - 2026-09-08

### Sicurezza

- sessione del laboratorio spostata in un cookie `HttpOnly` e `SameSite=Strict`;
- richieste locali protette con controlli `Host` e `Origin`, rate limit e singola esecuzione concorrente;
- sandbox eseguita come utente non-root con filesystem read-only, capability azzerate e nuovi limiti su swap, file e spazio temporaneo;
- file Java montato singolarmente in sola lettura e output acquisito con limite prima di raggiungere la memoria del processo Python;
- immagine Eclipse Temurin 25 fissata tramite digest verificabile;
- Content Security Policy e ulteriori header di sicurezza applicati a tutte le risposte;
- dipendenze vulnerabili aggiornate e audit npm portato a zero segnalazioni;
- aggiunti CI, CodeQL, Dependency Review, Dependabot e politica privata di segnalazione.

## [0.2.2] - 2026-09-08

### Migliorato

- consegne delle tre missioni di laboratorio ampliate con scenario, contratto e procedura guidata;
- casi normali, limite e non validi presentati insieme al motivo per cui devono essere provati;
- criteri di completamento, riflessione progettuale e sfida facoltativa resi espliciti;
- flusso del laboratorio riordinato per leggere la consegna prima di usare editor e terminale.

## [0.2.1] - 2026-09-08

### Migliorato

- finestra di conferma per l'azzeramento coerente con lo stile dell'app e accessibile da tastiera;
- barre di scorrimento verticali nascoste mantenendo rotellina, touchpad e navigazione da tastiera.

## [0.2.0] - 2026-09-08

### Aggiunto

- editor Java e terminale interattivo nel laboratorio;
- esecuzione tramite container Docker temporaneo senza accesso alla rete;
- limiti di CPU, memoria, processi e tempo di esecuzione;
- versione visibile nell'app e procedura di rilascio su GitHub;
- guida pubblica di installazione e aggiornamento.

### Migliorato

- navigazione Teoria, Verifica e Laboratorio integrata nell'header;
- presentazione del prodotto, stato della sandbox e utilizzo su dispositivi mobili;
- messaggio sulla pubblicazione di nuovo materiale ogni due settimane.

## [0.1.0] - 2026-09-07

### Aggiunto

- prima lezione su stringhe, cicli e casi limite;
- percorso Teoria → Verifica → Laboratorio;
- salvataggio locale di progressi e appunti;
- avvio locale tramite Python.
