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





 .<script>
document.addEventListener("DOMContentLoaded", async () => {
  const modalCamere = document.getElementById("modalCamere");
  if (!modalCamere) return;

  // --- Mappa camere → link ICS RAW GitHub ---
  const ICS_LINKS = {
    Berta: "https://raw.githubusercontent.com/simonesugliano/booking-calendar/main/ics/berta.ics",
    Fede: "https://raw.githubusercontent.com/simonesugliano/booking-calendar/main/ics/fede.ics",
    Fabi: "https://raw.githubusercontent.com/simonesugliano/booking-calendar/main/ics/fabi.ics",
    Vita: "https://raw.githubusercontent.com/simonesugliano/booking-calendar/main/ics/vita.ics",
    Bertorella: "https://raw.githubusercontent.com/simonesugliano/booking-calendar/main/ics/bertorella.ics"
  };

  const cameraSelect = modalCamere.querySelector('select[name="camera"]');
  const checkinInput = modalCamere.querySelector('#checkin');
  const checkoutInput = modalCamere.querySelector('#checkout');

  // --- Funzione che scarica le date da Booking (.ics) ---
  async function getBookedDates(icsUrl) {
    try {
      const response = await fetch(icsUrl, { cache: "no-store" });
      if (!response.ok) {
        await Swal.fire({
          icon: "warning",
          title: "Calendario non disponibile",
          html: `
            <p>⚠️ Si è verificato un problema nel caricamento del calendario delle prenotazioni.</p>
            <p>Ti consigliamo di <b>ricaricare la pagina</b> o contattare direttamente la struttura per verificare la disponibilità.</p>
          `,
          confirmButtonText: "Ricarica pagina",
          confirmButtonColor: "#5a9a5d",
        });
        location.reload();
        return [];
      }

      const text = await response.text();
      const matches = [...text.matchAll(/DTSTART;VALUE=DATE:(\d+)[\s\S]*?DTEND;VALUE=DATE:(\d+)/g)];
      const booked = [];

      for (const [, start, end] of matches) {
        const s = new Date(start.slice(0, 4), start.slice(4, 6) - 1, start.slice(6, 8));
        const e = new Date(end.slice(0, 4), end.slice(4, 6) - 1, end.slice(6, 8));
        for (let d = new Date(s); d < e; d.setDate(d.getDate() + 1)) {
          booked.push(d.toISOString().split("T")[0]);
        }
      }
      console.log("Date non disponibili:", booked);
      return booked;
    } catch (err) {
      console.error("Errore caricamento ICS:", err);
      return [];
    }
  }

  // --- Funzione per aggiornare il calendario ---
  async function aggiornaCalendario(camera) {
    const url = ICS_LINKS[camera];
    if (!url) return;
    const booked = await getBookedDates(url);

    flatpickr(checkinInput, {
      dateFormat: "Y-m-d",
      disable: booked,
      locale: "it",
      minDate: "today",
      onDayCreate: (dObj, dStr, fp, dayElem) => {
        const date = dayElem.dateObj.toISOString().split("T")[0];
        if (booked.includes(date)) {
          dayElem.classList.add("booked-day");
          dayElem.setAttribute("title", "Prenotato");
        }
      }
    });

    flatpickr(checkoutInput, {
      dateFormat: "Y-m-d",
      disable: booked,
      locale: "it",
      minDate: "today"
    });
  }

  // --- Attiva la logica ogni volta che si apre la modale ---
  modalCamere.addEventListener("shown.bs.modal", async () => {
    const camera = cameraSelect.value;
    if (camera) await aggiornaCalendario(camera);
  });

  // --- Cambio manuale della camera ---
  cameraSelect.addEventListener("change", async (e) => {
    await aggiornaCalendario(e.target.value);
  });

  // --- Caso speciale: arrivo da “Le nostre camere” con ?camera= ---
  const params = new URLSearchParams(window.location.search);
  const cameraParam = params.get("camera");
  if (cameraParam) {
    // Mostra la modale dopo il caricamento completo
    const modal = new bootstrap.Modal(modalCamere);
    modal.show();

    // Aspetta che la modale sia visibile, poi imposta e aggiorna
    setTimeout(async () => {
      cameraSelect.value = cameraParam;
      await aggiornaCalendario(cameraParam);
    }, 600);

    // Pulisce l’URL
    const url = new URL(window.location);
    url.searchParams.delete("camera");
    window.history.replaceState({}, document.title, url);
  }
});
</script>
