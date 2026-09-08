# Studio Java

[![Versione](https://img.shields.io/badge/versione-0.3.1-006b57)](https://github.com/Federpelli25/JAVA_linguo/releases)
[![Java](https://img.shields.io/badge/Java-25%20LTS-e76f00)](https://www.oracle.com/java/technologies/java-se-support-roadmap.html)

Studio Java è un'applicazione didattica locale disponibile pubblicamente su GitHub per studiare Java con un percorso strutturato: prima la teoria, poi la verifica e infine il laboratorio pratico. Le spiegazioni e gli esercizi seguono un livello di approfondimento simile a un corso universitario.

> **Nuovo materiale ogni due settimane.** Il progetto viene aggiornato con lezioni, esercizi, approfondimenti sulle versioni Java e miglioramenti dell'esperienza di studio.

## Cosa offre

- teoria progressiva con esempi, analogie e tracciamento dell'esecuzione;
- verifiche con feedback ragionato;
- editor Java e terminale integrati nel laboratorio;
- esecuzione del codice in un container Docker temporaneo e isolato;
- progressi, codice e appunti salvati soltanto nel browser del dispositivo;
- percorso predisposto per ricevere nuove lezioni senza ricreare l'app.

## Installazione rapida

### Requisiti

- [Python 3.11 o successivo](https://www.python.org/downloads/);
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) avviato, necessario soltanto per compilare ed eseguire il codice nel laboratorio;
- Git, facoltativo se scarichi il progetto come archivio ZIP.

### 1. Scarica il progetto

Puoi usare **Code → Download ZIP** dalla pagina GitHub oppure eseguire:

```powershell
git clone https://github.com/Federpelli25/JAVA_linguo.git
cd JAVA_linguo
```

### 2. Prepara la configurazione

Su Windows:

```powershell
py -m venv .venv
Copy-Item .env.example .env
docker pull eclipse-temurin:25-jdk@sha256:e787e08ef76f4c16866108cd7f9fcd96a68eef3ac6cc76866897d4d02d5a2262
```

Su macOS o Linux:

```bash
python3 -m venv .venv
cp .env.example .env
docker pull eclipse-temurin:25-jdk@sha256:e787e08ef76f4c16866108cd7f9fcd96a68eef3ac6cc76866897d4d02d5a2262
```

L'immagine Docker viene scaricata una sola volta. L'applicazione web già compilata è inclusa nel repository, quindi per studiare non occorre installare Node.js.

### 3. Avvia Studio Java

Su Windows fai doppio clic su `AVVIA_STUDIO_JAVA.bat`, oppure usa:

```powershell
.venv\Scripts\python.exe avvia.py
```

Su macOS o Linux:

```bash
.venv/bin/python avvia.py
```

Il browser si apre automaticamente. Per chiudere l'app premi `Ctrl+C` nel terminale da cui l'hai avviata.

## Come funziona la sandbox

Il terminale dell'app non espone PowerShell, Prompt dei comandi o la shell del computer. Accetta soltanto:

```text
java --version
javac Main.java
java Main.java
```

Ogni esecuzione avviene in un nuovo container Docker con:

- rete disabilitata;
- processo Java eseguito come utente non-root;
- filesystem del container in sola lettura;
- sorgente montato singolarmente in sola lettura, senza condividere repository, Desktop o cartella personale;
- spazio di lavoro in memoria con quota di 32 MB;
- limiti di CPU, memoria, swap, file aperti, processi, output e durata;
- privilegi Linux rimossi;
- acquisizione di nuovi privilegi disabilitata e profilo seccomp Docker mantenuto attivo;
- eliminazione automatica al termine.

L'immagine JDK predefinita è fissata tramite digest, così uno stesso rilascio usa gli stessi byte anche se il tag pubblico viene aggiornato. Il vecchio valore `eclipse-temurin:25-jdk` viene convertito automaticamente al digest sicuro previsto dalla release.

Anche il server locale applica:

- ascolto esclusivo su `127.0.0.1` e verifica degli header `Host` e `Origin`;
- sessione casuale conservata in un cookie `HttpOnly` e `SameSite=Strict`, mai esposta al codice JavaScript;
- una sola esecuzione contemporanea e massimo 12 richieste al minuto;
- richieste, sorgenti e output con dimensione massima;
- Content Security Policy e header contro inclusione in iframe, sniffing e accesso a funzionalità del browser.

Queste protezioni riducono fortemente il rischio, ma la sandbox locale non è progettata come servizio pubblico multiutente. È comunque buona pratica eseguire soltanto codice che si comprende o che proviene da fonti affidabili. Per segnalazioni riservate consulta [SECURITY.md](SECURITY.md).

## Sicurezza del repository

Il repository include controlli automatici per:

- test Python, lint, build e audit delle dipendenze a ogni modifica;
- analisi statica CodeQL per Python e TypeScript;
- revisione delle nuove dipendenze nelle pull request;
- aggiornamenti settimanali di pacchetti npm e GitHub Actions tramite Dependabot;
- archivio ZIP, SBOM CycloneDX, checksum SHA-256 e attestazione di provenienza per ogni nuova release.

Le GitHub Actions sono fissate a commit completi per ridurre il rischio di sostituzione dei tag.

## Aggiornare il progetto

Se hai usato Git:

```powershell
git pull
```

Se hai scaricato lo ZIP, scarica la versione più recente dalla sezione [Releases](https://github.com/Federpelli25/JAVA_linguo/releases). I progressi dell'app restano nel browser; prima di sostituire la cartella conserva eventuali file personali esterni al progetto.

## Versioni e rilasci

Il progetto usa [Semantic Versioning](https://semver.org/lang/it/):

- **MAJOR** per cambiamenti incompatibili;
- **MINOR** per nuove lezioni o funzionalità;
- **PATCH** per correzioni e piccoli miglioramenti.

La versione corrente è riportata nell'app, nel file `VERSION`, in `package.json` e nelle release GitHub. Le modifiche sono riassunte in [CHANGELOG.md](CHANGELOG.md).

## Configurazione `.env`

Le opzioni disponibili sono documentate in `.env.example`:

```dotenv
APP_PORT=8765
GITHUB_REPOSITORY_URL=https://github.com/Federpelli25/JAVA_linguo
JAVA_SANDBOX_IMAGE=eclipse-temurin:25-jdk
```

Il file `.env` è locale e non viene pubblicato su GitHub.

## Sviluppo

Per modificare l'interfaccia servono Node.js 22.13 o successivo e npm:

```powershell
npm install
npm run dev
npm run lint
npm run build
py -m unittest discover -s tests -v
```

La build in `dist/client` viene versionata perché l'avvio con Python funzioni anche per chi vuole soltanto studiare. Prima di creare nuove lezioni leggere integralmente le istruzioni in `dev-guides`.

## Repository

[Federpelli25/JAVA_linguo](https://github.com/Federpelli25/JAVA_linguo)
