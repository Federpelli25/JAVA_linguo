# Procedura di rilascio

JAVA_linguo usa il versionamento semantico `MAJOR.MINOR.PATCH`.

- incrementare `MAJOR` per modifiche incompatibili;
- incrementare `MINOR` per nuove lezioni o funzionalità;
- incrementare `PATCH` per correzioni compatibili.

## File da sincronizzare

Ogni rilascio deve riportare lo stesso numero in:

- `VERSION`;
- `app/version.ts`;
- `package.json` e `package-lock.json`;
- `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock` e `src-tauri/tauri.conf.json`;
- badge del `README.md`;
- nuova sezione di `CHANGELOG.md`.

## Verifiche

Eseguire nell'ordine:

```powershell
npx oxlint app
npm run build
npm audit --audit-level=high
.venv\Scripts\python.exe -m unittest discover -s tests -v
.venv\Scripts\python.exe -m py_compile avvia.py collega_github.py
cargo check --manifest-path src-tauri/Cargo.toml --locked
```

Avviare poi `avvia.py` e controllare:

- risposta HTTP 200 della pagina principale;
- versione mostrata nell'interfaccia;
- stato corretto di Docker;
- compilazione ed esecuzione di un programma Java nel container;
- rifiuto di un comando non presente nella lista consentita.
- rifiuto di una richiesta priva di origine locale valida;
- interruzione di un programma che supera il limite di output.

## GitHub

Dopo i controlli:

1. creare un commit con il contenuto esatto del rilascio;
2. creare il tag annotato `vMAJOR.MINOR.PATCH` sul commit;
3. pubblicare branch e tag;
4. attendere che la pipeline `Pubblica release` crei la GitHub Release dal tag;
5. verificare che la pagina Releases offra il sorgente ZIP e il tag corretto.
6. verificare che la stessa pipeline pubblichi `.exe`, `.dmg`, `.AppImage`, `.deb` e i relativi checksum.

Gli installer devono essere compilati sul sistema operativo di destinazione. Non dichiarare un pacchetto firmato o notarizzato senza aver configurato e verificato i certificati relativi.

Non pubblicare mai `.env`, token, credenziali o cartelle temporanee del laboratorio.
