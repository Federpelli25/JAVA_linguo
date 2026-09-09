# JAVA_linguo

[![Versione](https://img.shields.io/badge/versione-0.4.0-006b57)](https://github.com/Federpelli25/JAVA_linguo/releases)
[![Java](https://img.shields.io/badge/Java-25%20LTS-e76f00)](https://www.oracle.com/java/technologies/java-se-support-roadmap.html)

JAVA_linguo è un'applicazione didattica open source per studiare Java con un percorso strutturato: teoria, verifica e laboratorio pratico. Le spiegazioni e gli esercizi hanno un livello di approfondimento simile a un corso universitario.

> **Nuovo materiale ogni due settimane.** Il progetto viene aggiornato con lezioni, esercizi, approfondimenti sulle versioni Java e miglioramenti dell'esperienza di studio.

## Installazione dell'app

Apri la pagina [Releases](https://github.com/Federpelli25/JAVA_linguo/releases), scegli la versione più recente e scarica il file adatto al computer:

- **Windows 64 bit:** `JAVA_linguo-...-windows-x64.setup.exe`;
- **macOS Apple Silicon:** `JAVA_linguo-...-macos-arm64.dmg` per Mac con chip M1 o successivo;
- **macOS Intel:** `JAVA_linguo-...-macos-x64.dmg`;
- **Linux 64 bit:** `JAVA_linguo-...-linux-x64.AppImage` oppure il pacchetto `.deb`.

L'installer contiene l'interfaccia e il server locale: per usare l'app non servono Python, Node.js o un terminale. Il laboratorio richiede invece [Docker Desktop](https://www.docker.com/products/docker-desktop/) o Docker Engine avviato.

Al primo utilizzo del laboratorio scarica l'immagine Java verificata:

```text
docker pull eclipse-temurin:25-jdk@sha256:e787e08ef76f4c16866108cd7f9fcd96a68eef3ac6cc76866897d4d02d5a2262
```

Gli installer della versione iniziale non sono firmati con un certificato commerciale. Windows SmartScreen può quindi mostrare un avviso; su macOS può essere necessario fare clic destro sull'app e scegliere **Apri**. Firma e notarizzazione sono previste come miglioramento futuro.

Su Linux, se scegli AppImage, rendi il file eseguibile e avvialo:

```bash
chmod +x JAVA_linguo-*.AppImage
./JAVA_linguo-*.AppImage
```

## Cosa offre

- teoria progressiva con esempi, analogie e tracciamento dell'esecuzione;
- verifiche con feedback ragionato;
- editor Java e terminale integrati nel laboratorio;
- esecuzione del codice in un container Docker temporaneo e isolato;
- progressi, codice e appunti salvati soltanto sul dispositivo;
- percorso predisposto per ricevere nuove lezioni senza ricreare l'app.

## Alternativa: avvio dal sorgente

Chi preferisce eseguire il progetto direttamente dal codice può usare **Code → Download ZIP** oppure:

```powershell
git clone https://github.com/Federpelli25/JAVA_linguo.git
cd JAVA_linguo
```

Servono Python 3.11 o successivo e Docker. La build web è inclusa nel repository, quindi Node.js non è necessario per studiare.

Su Windows:

```powershell
py -m venv .venv
Copy-Item .env.example .env
.venv\Scripts\python.exe avvia.py
```

È anche possibile fare doppio clic su `AVVIA_JAVA_LINGUO.bat`. Il precedente `AVVIA_STUDIO_JAVA.bat` rimane come alias per chi aggiorna una vecchia installazione.

Su macOS o Linux:

```bash
python3 -m venv .venv
cp .env.example .env
.venv/bin/python avvia.py
```

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
- solo `Main.java` montato in sola lettura, senza condividere repository, Desktop o cartella personale;
- spazio di lavoro in memoria con quota di 32 MB;
- limiti di CPU, memoria, swap, file aperti, processi, output e durata;
- privilegi Linux rimossi e acquisizione di nuovi privilegi disabilitata;
- eliminazione automatica al termine.

L'immagine JDK predefinita è fissata tramite digest, così uno stesso rilascio usa gli stessi byte anche se il tag pubblico viene aggiornato.

Il server locale ascolta esclusivamente su `127.0.0.1` e applica verifiche `Host` e `Origin`, sessione casuale in cookie `HttpOnly`, rate limit, limite di concorrenza e dimensioni massime. Queste protezioni riducono fortemente il rischio, ma la sandbox non è progettata come servizio pubblico multiutente. Esegui soltanto codice che comprendi o proveniente da fonti affidabili. Per segnalazioni riservate consulta [SECURITY.md](SECURITY.md).

## Integrità dei download

Ogni release include checksum SHA-256, SBOM CycloneDX e attestazioni GitHub. Per verificare un installer, confronta il suo hash con il file `.sha256` omonimo. Le pipeline producono separatamente ogni formato sul relativo sistema operativo: gli installer non vengono cross-compilati.

Il repository include inoltre test automatici, lint, build, audit delle dipendenze, CodeQL, Dependency Review e aggiornamenti Dependabot.

## Aggiornamenti e versioni

Se hai installato l'app, scarica la nuova versione dalla pagina [Releases](https://github.com/Federpelli25/JAVA_linguo/releases). Se usi Git:

```powershell
git pull
```

I progressi compatibili restano memorizzati sul dispositivo. JAVA_linguo usa [Semantic Versioning](https://semver.org/lang/it/): `MAJOR` per cambiamenti incompatibili, `MINOR` per nuove lezioni o funzionalità e `PATCH` per correzioni.

## Configurazione `.env`

Le opzioni disponibili sono documentate in `.env.example`. Il file `.env` è locale e non viene pubblicato su GitHub. `JAVA_LINGUO_NO_BROWSER=1` disabilita l'apertura automatica del browser quando si usa l'avvio Python.

## Sviluppo

Per modificare l'interfaccia servono Node.js 22.13 o successivo e npm:

```powershell
npm ci --ignore-scripts
npm run lint
npm run build
py -m unittest discover -s tests -v
```

Per creare l'app desktop servono inoltre Rust, i prerequisiti Tauri del sistema e PyInstaller:

```powershell
py -m pip install -r requirements-desktop.txt
npm run desktop:build
```

Le build ufficiali sono generate dalla pipeline `Installer desktop`. Prima di sviluppare nuove componenti o lezioni, leggere integralmente le istruzioni in `dev-guides`.

## Repository

[Federpelli25/JAVA_linguo](https://github.com/Federpelli25/JAVA_linguo)
