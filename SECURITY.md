# Politica di sicurezza

## Versioni supportate

Le correzioni di sicurezza vengono applicate all'ultima versione pubblicata di Studio Java. Prima di segnalare un problema, verifica che sia ancora presente nella release più recente.

## Segnalare una vulnerabilità

Non aprire una issue pubblica con dettagli sfruttabili, token, dati personali o codice dimostrativo pericoloso.

Usa invece la funzione privata **Report a vulnerability** nella sezione Security del repository:

<https://github.com/Federpelli25/JAVA_linguo/security/advisories/new>

Includi, quando possibile:

- versione di Studio Java, sistema operativo e versione di Docker;
- componente interessato e impatto osservato;
- passaggi minimi per riprodurre il problema;
- eventuali mitigazioni già provate.

La segnalazione verrà analizzata privatamente. Una correzione e una release correttiva verranno preparate prima di pubblicare i dettagli tecnici.

## Confini della sandbox

Il laboratorio esegue codice Java non fidato in un container temporaneo con rete disattivata, utente non-root, filesystem di base in sola lettura e limiti di risorse. Queste difese riducono il rischio ma non rendono sicuro eseguire consapevolmente exploit contro Docker, il kernel o la JVM.
