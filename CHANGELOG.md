# Changelog

Tutte le modifiche rilevanti di Studio Java sono documentate in questo file. Il progetto segue il versionamento semantico.

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
