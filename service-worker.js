const CACHE = 'metromind-v15';
const ASSETS = ['./','./index.html','./game.html','./maps.html','./style.css','./maps.css','./maps.js','./network.js','./lisbon.js','./vienna.js','./barcelona.js','./berlin.js','./paris.js','./london.js','./translations.js','./app.js','./home.css','./home.js','./icon.svg','./manifest.webmanifest','./fonts/IBMPlexSansCondensed-Regular.ttf','./fonts/IBMPlexSansCondensed-SemiBold.ttf','./fonts/IBMPlexSansCondensed-Bold.ttf'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).catch(async()=>{
      const cached=await caches.match(event.request,{ignoreSearch:true});
      if(cached)return cached;
      const path=new URL(event.request.url).pathname;
      return caches.match(path.endsWith('/maps')?'./maps.html':path.endsWith('/game')?'./game.html':'./index.html');
    }));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).catch(()=>caches.match(event.request,{ignoreSearch:true}))));
});
