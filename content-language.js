// These pages remain fully readable without JavaScript.
const contentScript = document.currentScript;
try { localStorage.setItem('metromind-language', contentScript.dataset.language); } catch {}
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register(new URL('./service-worker.js', contentScript.src));
}
