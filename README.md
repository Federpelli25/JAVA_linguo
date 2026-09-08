# Studio Java — applicazione locale

## Avvio

Fai doppio clic su `AVVIA_STUDIO_JAVA.bat`, oppure esegui:

```powershell
.venv\Scripts\python.exe avvia.py
```

Il browser si apre automaticamente. Per chiudere premi `Ctrl+C` nel terminale.

La lezione segue tre fasi: teoria a schede, verifica con feedback e laboratorio. Progressi, risposte e diario rapido restano salvati nel browser.

## Aggiungere lezioni

Il percorso è già predisposto. I contenuti si trovano in `app/course-data.ts`; dopo un aggiornamento si esegue `npm run build`. Non è necessario ricreare l’app.

## GitHub

Non inserire token in `.env`. Dopo aver creato un repository vuoto su GitHub, esegui:

```powershell
.venv\Scripts\python.exe collega_github.py
```

Lo script configura il remote `origin`; autenticazione e credenziali restano nel gestore Git del computer.

## Sviluppo

```powershell
npm install
npm run dev
npm run build
```

La build dentro `dist/client` viene conservata affinché l’avvio Python funzioni senza ricompilare.
