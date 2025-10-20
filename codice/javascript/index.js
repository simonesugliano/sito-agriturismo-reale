/*<!-- 
  Codice originale di sviluppo – versione non ancora ottimizzata per la pubblicazione.
  Questa versione viene resa pubblica per mostrare in modo trasparente la base tecnica 
  che sta dietro alla demo presentata all’agriturismo, e che verrà successivamente evoluta 
  nella versione definitiva destinata alla produzione.

  Alcuni commenti interni sono personali o di lavoro, inseriti durante le fasi di sviluppo.
  Il codice funziona correttamente, ma sarà ulteriormente rifinito nelle funzioni (es. prenotazioni)
  e nelle ottimizzazioni generali. 
  Lo scheletro del progetto è completo e perfettamente funzionante.
-->
*/ 
//pulsante di condivisione social nel ffooter
document.getElementById("shareBtn").addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Agriturismo La Bertorella",
        text: "Scopri l’Agriturismo La Bertorella a Torre Bormida: cucina tipica, camere e natura nelle Langhe.",
        url: window.location.href
      });
    } catch (err) {
      console.log("Condivisione annullata o non riuscita:", err);
    }
  } else {
    alert("La condivisione non è supportata dal tuo browser. Copia il link manualmente 😊");
  }
});

//checkbox privacy tutte le pagine
/* function validatePrivacy() {
  const checkbox = document.getElementById('privacyCheck');
  if (!checkbox.checked) {
    alert('Devi accettare la Privacy Policy per procedere.');
    return false;
  }
  return true;
} */