# Studio Java

[![Versione](https://img.shields.io/badge/versione-0.2.2-006b57)](https://github.com/Federpelli25/JAVA_linguo/releases)
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
docker pull eclipse-temurin:25-jdk
```

Su macOS o Linux:

```bash
python3 -m venv .venv
cp .env.example .env
docker pull eclipse-temurin:25-jdk
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
- filesystem del container in sola lettura;
- una sola cartella temporanea condivisa;
- limiti di CPU, memoria, processi e durata;
- privilegi Linux rimossi;
- eliminazione automatica al termine.

Queste protezioni riducono fortemente il rischio, ma è comunque buona pratica eseguire soltanto codice che si comprende o che proviene da fonti affidabili.

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
