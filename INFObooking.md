# Esportazione calendario Booking → GitHub → Sito

Questa pipeline automatizza la sincronizzazione delle disponibilità delle camere:

Booking: ogni camera espone un link ICS (file calendario).

GitHub Actions: scarica i file ICS dalle URL segrete e li salva in /ics nel repository.

Sito: la pagina Prenota legge i file ICS RAW da GitHub, estrae le date occupate e disabilita i giorni in flatpickr.

Repository: simonesugliano/booking-calendar

Percorso file ICS: /ics/*.ics (es: /ics/berta.ics)

## Esportare i calendari ICS da Booking

Per ogni camera, ottenere da Booking.com l’URL Export/ICS (di solito in “Calendario → Esporta calendario”).
Creare un secret in GitHub per ogni camera:

Camera	Nome Secret GitHub
Berta	ICS_URL_BERTA
Fede	ICS_URL_FEDE
Fabi	ICS_URL_FABI
Vita	ICS_URL_VITA
Bertorella	ICS_URL_BERTORELLA

I secrets non mostrano mai il valore dopo il salvataggio (è normale).

## Sincronizzazione automatica su GitHub (Actions)

Il workflow Fetch Booking ICS Calendars (.github/workflows/update-ical.yml) esegue:

Aggiornamento automatico ogni ora (cron) o manuale da Actions → Run workflow

Download dei file ICS dalle URL salvate nei secrets

Salvataggio in /ics nel branch main

Commit automatico solo se i file cambiano (log ridotti)

Struttura generata
/ics
  ├─ berta.ics
  ├─ fede.ics
  ├─ fabi.ics
  ├─ vita.ics
  └─ bertorella.ics

Verifica

Actions → Fetch Booking ICS Calendars → ultimo run

Aprire lo step Download …

Se compare Scarico ICS_URL_BERTA... e nessun errore, il download è riuscito.

Se un secret manca o è errato: ICS_URL_... non impostato, salto.

## Importazione nel sito

Lo script del sito (pagina Prenota) esegue:

Legge la camera selezionata (o quella indicata via ?camera=Berta)

Mappa la camera al file ICS RAW su GitHub

https://raw.githubusercontent.com/simonesugliano/booking-calendar/main/ics/berta.ics


Scarica il file ICS (fetch(..., { cache: "no-store" }))

Estrae gli eventi DTSTART;VALUE=DATE e DTEND;VALUE=DATE

Crea l’elenco delle date occupate (ogni giorno compreso tra start e end)

Inizializza flatpickr con:

disable: booked,
locale: "it",
minDate: "today"


Se il file ICS non è disponibile, mostra un SweetAlert2:

“Calendario non disponibile — ricarica la pagina o contatta la struttura.”

## URL RAW corretti

Usare solo URL in formato RAW GitHub:

https://raw.githubusercontent.com/simonesugliano/booking-calendar/main/ics/berta.ics
https://raw.githubusercontent.com/simonesugliano/booking-calendar/main/ics/fede.ics
https://raw.githubusercontent.com/simonesugliano/booking-calendar/main/ics/fabi.ics
https://raw.githubusercontent.com/simonesugliano/booking-calendar/main/ics/vita.ics
https://raw.githubusercontent.com/simonesugliano/booking-calendar/main/ics/bertorella.ics

## Posizione dello script nel sito

Inserire lo script ICS dopo i tag <script> di Bootstrap e prima di </body>.

Lo script è collegato all’evento shown.bs.modal della modale Camere.

Quando la modale viene aperta, scarica e mostra le date occupate.

Se si arriva da un link con ?camera=..., la modale si apre automaticamente e mostra il calendario corretto.

## Performance e limiti

Frequenza: ogni ora (1000 run/mese ≈ entro i limiti gratuiti GitHub Actions)

Peso: pochi KB per file, commit solo se cambia qualcosa

Cache: disattivata (no-store + timestamp)

Affidabilità: dipende solo dai link ICS di Booking

Errore visibile: SweetAlert2 informa subito l’utente se Booking non risponde

## Manutenzione
Controllo rapido

GitHub → Actions → ultimo run → deve essere verde ✅

Aprire/ics/berta.ics → controllare data commit recente

In pagina Prenota → aprire modale → le date occupate devono essere disabilitate

Aggiungere una nuova camera

Creare un nuovo secret ICS_URL_NUOVACAMERA

Aggiungere la riga corrispondente nel workflow

Aggiungere la riga in ICS_LINKS nello script

Aggiornare la <.select> e la pagina camere

Se Booking mostra pieno ma il sito no

Eseguire Run workflow manuale

Aprire /ics/ e controllare se le nuove date sono presenti

Se il file ICS di Booking è vuoto → Booking non aggiorna correttamente l’export

## Errori comuni
Errore	Causa	Soluzione
ICS_URL_* non impostato	Secret mancante	Aggiungere il secret corretto
fetch() scarica HTML	URL non RAW	Usare raw.githubusercontent.com/...
Date non aggiornate	Caching Booking	Attendere o ridurre intervallo a 30 min
SweetAlert “Calendario non disponibile”	Booking offline o URL errato	Verificare link ICS
## Sicurezza e legalità

Gli ICS sono dati pubblici forniti da Booking per la sincronizzazione.

Nessun dato personale dei clienti viene scaricato.

I link ICS restano protetti nei GitHub Secrets.

Nessuna API privata o accesso non autorizzato viene utilizzato.

## FAQ

Posso usare HTTPS?
Sì, tutti gli URL sono HTTPS.

Posso vedere i log dei download?
Sì, da GitHub → Actions → Workflow → Step “Download …”.

Cosa succede se Booking cambia link?
Il workflow segnala errore. Basta aggiornare il secret con il nuovo URL.

🔗 Link utili

Repo: https://github.com/simonesugliano/booking-calendar

Cartella ICS: https://github.com/simonesugliano/booking-calendar/tree/main/ics

RAW ICS (esempio): https://raw.githubusercontent.com/simonesugliano/booking-calendar/main/ics/berta.ics





