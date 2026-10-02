const cities = [
  {id:'lisbona',code:'LX',lines:4,accent:'#52b4cf',colors:['#267ac4','#e9bb32','#429462','#d9524f']},
  {id:'vienna',code:'W',lines:5,accent:'#c8525b',colors:['#dc322f','#a747a9','#e0a522','#429a70','#ad8055']},
  {id:'barcellona',code:'BCN',lines:8,accent:'#e87652',colors:['#d7333f','#9a5baf','#30955f','#e5b62d','#377cb9','#e48731','#5aabd0','#a9bb48']},
  {id:'berlino',code:'B',lines:9,accent:'#e5bb46',colors:['#69ab76','#d85459','#5983bb','#f0bf3f','#9b73b5','#e17b52','#5e9da5','#b6ab58','#aa5c73']},
  {id:'parigi',code:'P',lines:16,accent:'#8ea2cf',colors:Array.from({length:16},(_,i)=>['#c65b61','#d7af4c','#7ba899','#7d91ba'][i%4])},
  {id:'londra',code:'LDN',lines:11,accent:'#84a8b5',colors:['#b86365','#5792bf','#e1ad48','#6ab39d','#7969a7','#ca8970','#8e9c60','#b57299','#7eafd1','#b9a05b','#a7a7a0']}
];
const names = {
  it:{milano:'MILANO',lisbona:'LISBONA',vienna:'VIENNA',berlino:'BERLINO',barcellona:'BARCELLONA',parigi:'PARIGI',londra:'LONDRA'},
  en:{milano:'MILAN',lisbona:'LISBON',vienna:'VIENNA',berlino:'BERLIN',barcellona:'BARCELONA',parigi:'PARIS',londra:'LONDON'}
};
const grid = document.getElementById('upcomingGrid');
const dialog = document.getElementById('cityDialog');
let activeCity = null;
function renderCities() {
  document.title = `MetroMind · ${language === 'it' ? 'Città' : 'Cities'}`;
  document.querySelector('[data-city-name="milano"]').textContent = names[language].milano;
  document.querySelector('[data-city-lines="5"]').textContent = `5 ${language === 'it' ? 'LINEE' : 'LINES'}`;
  grid.replaceChildren(...cities.map((city,index) => {
    const live = ['lisbona','vienna','barcellona','berlino','parigi','londra'].includes(city.id);
    const button = document.createElement(live ? 'a' : 'button');
    button.className = `city-card city-card-upcoming${live ? ' city-card-ready' : ''}`;
    if(live) button.href = `game.html?city=${city.id}`; else button.type = 'button';
    button.style.setProperty('--accent',city.accent);
    button.innerHTML = `<span class="city-meta"><span>${String(index+2).padStart(2,'0')} / 07</span><span>${t(live?'available':'coming')}</span></span><span class="city-main"><span class="city-number">${city.code}</span><span class="city-title"><strong>${names[language][city.id]}</strong><small>${city.lines} ${language === 'it' ? 'LINEE' : 'LINES'}</small></span><span class="city-arrow" aria-hidden="true">↗</span></span><span class="route-bars">${city.colors.map(color=>`<i style="background:${color}"></i>`).join('')}</span><span class="city-action"><span>${t(live?'play':'preview')}</span><b aria-hidden="true">→</b></span>`;
    if(!live) button.addEventListener('click',() => { activeCity = city; renderDialog(); dialog.showModal(); });
    return button;
  }));
  if(activeCity) renderDialog();
}
function renderDialog() {
  document.getElementById('dialogCode').textContent = activeCity.code;
  document.getElementById('dialogTitle').textContent = names[language][activeCity.id];
  document.getElementById('dialogLines').textContent = `${activeCity.lines} ${language === 'it' ? 'LINEE' : 'LINES'}`;
}
document.getElementById('closeDialog').addEventListener('click',() => dialog.close());
document.getElementById('dialogBack').addEventListener('click',() => dialog.close());
dialog.addEventListener('click',event => { if(event.target === dialog) dialog.close(); });
window.addEventListener('metromind-language-change',renderCities);
renderCities();
