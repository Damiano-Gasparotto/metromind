const requestedCity = new URLSearchParams(location.search).get('city');
const cityId = ['lisbona','vienna','barcellona','berlino','parigi','londra'].includes(requestedCity) ? requestedCity : 'milano';
const network = {
  milano: () => buildNetwork(),
  lisbona: () => buildNetwork(LISBON_LINES, LISBON_ANCHORS, [], 1400, 1000),
  vienna: () => buildNetwork(VIENNA_LINES, VIENNA_ANCHORS, [], 1750, 1200),
  barcellona: () => buildNetwork(BARCELONA_LINES, BARCELONA_ANCHORS, [], 2250, 1380),
  berlino: () => buildNetwork(BERLIN_LINES, BERLIN_ANCHORS, [], 2200, 1600),
  parigi: () => buildNetwork(PARIS_LINES, PARIS_ANCHORS, [], 2700, 2050),
  londra: () => buildNetwork(LONDON_LINES, LONDON_ANCHORS, LONDON_WALK_LINKS, 3000, 2000)
}[cityId]();
const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const random = items => items[Math.floor(Math.random() * items.length)];
const waypointCounts = {easy:1, medium:2, hard:3};
let game;
let solutionVisible = false;
let mapZoom = 1;
let mapCenter = [network.width/2,network.height/2];
let drag = null;
let suppressMapClick = false;

class MinHeap {
  constructor() { this.data = []; }
  push(item) {
    const a = this.data; a.push(item); let i = a.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (a[p].cost <= item.cost) break; a[i] = a[p]; i = p; }
    a[i] = item;
  }
  pop() {
    const a = this.data, top = a[0], last = a.pop();
    if (a.length) { let i = 0; while (true) { let c = i*2+1; if (c >= a.length) break; if (c+1<a.length && a[c+1].cost<a[c].cost) c++; if (a[c].cost>=last.cost) break; a[i]=a[c]; i=c; } a[i]=last; }
    return top;
  }
  get length() { return this.data.length; }
}

function shortestRoute(start, end, waypoints) {
  const bits = new Map(waypoints.map((s,i) => [s, 1<<i]));
  const all = (1<<waypoints.length)-1;
  const startMask = bits.get(start) || 0;
  const key = (station,line,mask) => `${station}\u0001${line || ''}\u0001${mask}`;
  const first = {station:start,line:null,mask:startMask,cost:0,stops:0,transfers:0,prev:null};
  const heap = new MinHeap(), best = new Map();
  heap.push(first); best.set(key(start,null,startMask),0);
  while (heap.length) {
    const state = heap.pop();
    if (state.cost !== best.get(key(state.station,state.line,state.mask))) continue;
    if (state.station === end && state.mask === all) {
      const steps=[]; let s=state;
      while(s){ steps.push(s); s=s.prev; }
      steps.reverse();
      return {cost:state.cost,stops:state.stops,transfers:state.transfers,steps};
    }
    for (const edge of network.adjacency.get(state.station)) {
      const transfer = edge.walk || Boolean(state.line && state.line !== edge.line);
      const cost = state.cost + (edge.walk ? 5 : 2 + (transfer ? 4 : 0));
      const nextLine = edge.walk ? null : edge.line;
      const mask = state.mask | (bits.get(edge.to) || 0);
      const k = key(edge.to,nextLine,mask);
      if (cost >= (best.get(k) ?? Infinity)) continue;
      best.set(k,cost);
      heap.push({station:edge.to,line:nextLine,mask,cost,stops:state.stops+(edge.walk?0:1),transfers:state.transfers+(transfer?1:0),prev:state,edge});
    }
  }
  return null;
}

function createChallenge() {
  const count = waypointCounts[$('difficulty').value];
  let choice;
  for (let attempt=0; attempt<24; attempt++) {
    const picked=[];
    while(picked.length<count+2) { const station=random(network.stations); if(!picked.includes(station)) picked.push(station); }
    const [start,end,...waypoints]=picked;
    const optimal=shortestRoute(start,end,waypoints);
    if (!optimal) continue;
    choice={start,end,waypoints,optimal};
    const ceiling={easy:75,medium:110,hard:150}[$('difficulty').value];
    if(optimal.cost <= ceiling && optimal.stops >= 5) break;
  }
  return choice;
}

function newGame() {
  const challenge=createChallenge();
  if(!challenge) return;
  game={...challenge,current:challenge.start,line:null,visited:new Set(),cost:0,stops:0,transfers:0,history:[],route:[challenge.start],complete:false};
  solutionVisible=false;
  $('result').hidden=true;
  document.querySelector('.app').classList.remove('finished');
  $('missionDetails').open=false;
  $('showSolution').textContent=t('showSolution');
  mapCenter=[...network.positions.get(game.start)];
  render();
}

function isDecisionStop(station, line) {
  if(station===game.end || game.waypoints.includes(station)) return true;
  if(network.stationLines.get(station).size>1) return true;
  const edges=network.adjacency.get(station);
  if(edges.some(edge=>edge.walk)) return true;
  return edges.filter(edge=>edge.line===line).length!==2;
}

// A direction is a whole ride: ordinary intermediate stations are passed
// automatically. The player stops only where a new decision is possible.
function segmentFrom(edge) {
  const path=[game.current,edge.to];
  if(!edge.walk) {
    let previous=game.current;
    let current=edge.to;
    while(!isDecisionStop(current,edge.line)) {
      const next=network.adjacency.get(current).find(candidate=>candidate.line===edge.line && candidate.to!==previous);
      if(!next) break;
      path.push(next.to);
      previous=current;
      current=next.to;
    }
  }
  return {edge,path,destination:path.at(-1),stops:edge.walk?0:path.length-1};
}

function availableSegments() {
  return network.adjacency.get(game.current).map(segmentFrom).sort((a,b)=>
    a.edge.line.localeCompare(b.edge.line) || a.destination.localeCompare(b.destination,'it'));
}

function applySegment(segment) {
  game.history.push({current:game.current,line:game.line,visited:new Set(game.visited),cost:game.cost,stops:game.stops,transfers:game.transfers,route:[...game.route]});
  const edge=segment.edge;
  const transfer=edge.walk || Boolean(game.line && game.line!==edge.line);
  game.cost += edge.walk ? 5 : segment.stops*2+(transfer?4:0);
  game.stops += segment.stops;
  game.transfers += transfer ? 1 : 0;
  game.line=edge.walk ? null : edge.line;
  game.current=segment.destination;
  game.route.push(...segment.path.slice(1));
  for(const station of segment.path) if(game.waypoints.includes(station)) game.visited.add(station);
}

function move(segment) {
  if(game.complete) return;
  applySegment(segment);
  mapCenter=[...network.positions.get(game.current)];
  if(game.current===game.end && game.visited.size===game.waypoints.length) {
    game.complete=true;
    document.querySelector('.app').classList.add('finished');
    const extra=game.cost-game.optimal.cost;
    const stars=extra===0?'★★★':extra<=8?'★★☆':'★☆☆';
    const result=$('result');
    result.hidden=false;
    result.innerHTML=`<div class="result-stars">${stars}</div><h2>${t('missionDone')}</h2><p>${t('yourTime')}: <strong>${game.cost}′</strong>. ${t('bestTime')}: <strong>${game.optimal.cost}′</strong>.</p><button id="nextGame" type="button">${t('newChallenge')}</button>`;
    $('nextGame').addEventListener('click',newGame);
    result.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  render();
}

function undo() {
  const previous=game.history.pop(); if(!previous) return;
  Object.assign(game,previous);
  game.complete=false;
  $('result').hidden=true;
  document.querySelector('.app').classList.remove('finished');
  mapCenter=[...network.positions.get(game.current)];
  render();
}

function lineBadge(line) {
  if(line==='WALK') return `<span class="line-badge walk">${t('walk')}</span>`;
  const detail=network.lines[line];
  const [r,g,b]=[1,3,5].map(index=>parseInt(detail.color.slice(index,index+2),16));
  const ink=(.299*r+.587*g+.114*b)/255>.62?'#172126':'#fff';
  return `<span class="line-badge" style="background:${detail.color};color:${ink}">${detail.badge||line}</span>`;
}

function renderCityChrome() {
  $('studyMap').href=`maps.html?city=${cityId}`;
  if(cityId==='milano') return;
  const prefix={vienna:'vienna',lisbona:'lisbon',barcellona:'barcelona',berlino:'berlin',parigi:'paris',londra:'london'}[cityId];
  document.querySelector('.brand small').textContent=t(`${prefix}Network`);
  document.querySelector('.map-card').setAttribute('aria-label',t(`${prefix}MapSection`));
  $('metroMap').setAttribute('aria-label',t(`${prefix}MapLabel`));
  const source=$('sourceLink');
  source.href={vienna:'https://www.wienerlinien.at/web/guest/fahrplaene',lisbona:'https://www.metrolisboa.pt/viajar/mapas-e-diagramas/',barcellona:'https://www.tmb.cat/ca/barcelona-transport/map/metro',berlino:'https://www.bvg.de/de/verbindungen/netzplaene-und-linien/u-bahn',parigi:'https://prim.iledefrance-mobilites.fr/en/jeux-de-donnees/offre-horaires-tc-gtfs-idfm',londra:'https://tfl.gov.uk/maps/track/tube'}[cityId];
  source.textContent=t(`${prefix}Source`);
  document.title=`MetroMind · ${t(`${prefix}Name`)}`;
}

function renderLegend() {
  document.querySelector('.legend').innerHTML=Object.entries(network.lines)
    .map(([line,detail])=>`<i style="background:${detail.color}"></i>${detail.badge||line}`).join(' ');
}

function render() {
  renderCityChrome();
  $('levelPill').textContent=t($('difficulty').value);
  $('startName').textContent=game.start;
  $('endName').textContent=game.end;
  $('currentName').textContent=game.current;
  $('timeValue').textContent=`${game.cost}′`;
  $('timeInline').textContent=`${game.cost}′`;
  $('stopValue').textContent=game.stops;
  $('transferValue').textContent=game.transfers;
  $('checkpointSummary').textContent=`${game.visited.size}/${game.waypoints.length}`;
  $('undoButton').disabled=!game.history.length || game.complete;
  $('checkpoints').innerHTML=game.waypoints.map(s=>`<span class="checkpoint ${game.visited.has(s)?'done':''}"><b aria-hidden="true">${game.visited.has(s)?'✓':'!'}</b>${s}</span>`).join('');
  $('objectiveHint').textContent=t(game.complete?'doneHint':game.visited.size===game.waypoints.length?'allStopsHint':game.current===game.end?'moreStopsHint':'objectiveHint');
  const moves=$('moves'); moves.innerHTML='';
  const options=availableSegments();
  for(const segment of options) {
    const button=document.createElement('button');
    button.type='button'; button.className='move'; button.disabled=game.complete;
    button.style.setProperty('--route-color',network.lines[segment.edge.line]?.color || '#70777b');
    const detail=segment.edge.walk?t('onFoot'):`${segment.stops} ${t(segment.stops===1?'stop':'stopsPlural')}`;
    button.innerHTML=`${lineBadge(segment.edge.line)}<span><strong>${segment.destination}</strong><small>${detail}</small></span><b>→</b>`;
    button.addEventListener('click',()=>move(segment));
    moves.append(button);
  }
  if(game.complete) $('hintText').textContent=t('doneHint');
  else if(game.current===game.end) $('hintText').textContent=t('moreStopsHint');
  else if(game.visited.size===game.waypoints.length) $('hintText').textContent=t('allStopsHint');
  else if(solutionVisible) $('hintText').textContent=`${t('solutionHint')}: ${game.optimal.cost}′ · ${game.optimal.stops} ${t('stops')} · ${game.optimal.transfers} ${t('transfers')}.`;
  else $('hintText').textContent=t('moveHint');
  drawMap();
}

function el(tag,attrs={}) {
  const e=document.createElementNS(svgNS,tag);
  for(const [k,v] of Object.entries(attrs)) e.setAttribute(k,v);
  return e;
}

function drawMap() {
  const svg=$('metroMap'); svg.innerHTML='';
  const viewport=$('mapViewport');
  const ratio=viewport.clientWidth/viewport.clientHeight;
  const width=(window.innerWidth<700?650:1300)/mapZoom;
  const height=width/ratio;
  const x=Math.max(-90,Math.min(network.width-width+90,mapCenter[0]-width/2));
  const y=Math.max(-90,Math.min(network.height-height+90,mapCenter[1]-height/2));
  svg.setAttribute('viewBox',`${x} ${y} ${width} ${height}`);

  const grid=el('g',{class:'map-grid'});
  for(let gx=0;gx<=network.width;gx+=100) grid.append(el('line',{x1:gx,y1:0,x2:gx,y2:network.height}));
  for(let gy=0;gy<=network.height;gy+=100) grid.append(el('line',{x1:0,y1:gy,x2:network.width,y2:gy}));
  svg.append(grid);

  for(const {line,stops} of network.routes) {
    const points=stops.map(s=>network.positions.get(s).join(',')).join(' ');
    svg.append(el('polyline',{points,class:'line-under'}));
    svg.append(el('polyline',{points,fill:'none',stroke:network.lines[line].color,'stroke-width':9,'stroke-linecap':'round','stroke-linejoin':'round'}));
  }
  for(const [walkA,walkB] of network.walkLinks){
    const [ax,ay]=network.positions.get(walkA), [bx,by]=network.positions.get(walkB);
    svg.append(el('line',{x1:ax,y1:ay,x2:bx,y2:by,class:'walk-link'}));
  }

  if(game.route.length>1) {
    const points=game.route.map(s=>network.positions.get(s).join(',')).join(' ');
    svg.append(el('polyline',{points,class:'played-route'}));
  }
  if(solutionVisible) {
    const points=game.optimal.steps.map(s=>network.positions.get(s.station).join(',')).join(' ');
    svg.append(el('polyline',{points,class:'solution-route'}));
  }

  const segments=availableSegments();
  const destinations=new Map();
  for(const segment of segments) {
    if(!destinations.has(segment.destination)) destinations.set(segment.destination,[]);
    destinations.get(segment.destination).push(segment);
  }
  for(const station of network.stations) {
    const [sx,sy]=network.positions.get(station);
    const lines=network.stationLines.get(station);
    const important=station===game.current||station===game.start||station===game.end||game.waypoints.includes(station);
    const interchange=lines.size>1;
    const clickable=destinations.get(station)?.length===1;
    const g=el('g',{class:`station ${clickable?'reachable':''} ${important?'important':''}`});
    g.append(el('circle',{cx:sx,cy:sy,r:important?12:interchange?9:6,fill:'#f9fbff',stroke:important?'#101b29':network.lines[[...lines][0]].color,'stroke-width':important?4:3}));
    if(station===game.current) g.append(el('circle',{cx:sx,cy:sy,r:21,class:'current-ring'}));
    if(station===game.end) g.append(el('circle',{cx:sx,cy:sy,r:18,class:'target-ring'}));
    if(game.waypoints.includes(station) && !game.visited.has(station)) g.append(el('circle',{cx:sx,cy:sy,r:16,class:'waypoint-ring'}));
    if(clickable) g.append(el('circle',{cx:sx,cy:sy,r:26,class:'station-hit'}));
    const label=el('text',{x:sx+12,y:sy-12,class:`station-label ${important?'priority':''}`});
    label.textContent=station;
    if(important||interchange) g.append(label);
    const title=el('title'); title.textContent=`${station} · ${[...lines].join(', ')}`; g.append(title);
    // A destination can theoretically be reached by more than one line;
    // in that case the direction cards keep the line choice unambiguous.
    if(clickable) g.addEventListener('click',()=>{if(!suppressMapClick) move(destinations.get(station)[0]);});
    svg.append(g);
  }
}

function toggleSolution() {
  solutionVisible=!solutionVisible;
  $('showSolution').textContent=t(solutionVisible?'hideSolution':'showSolution');
  drawMap();
  if(solutionVisible) {
    $('hintText').textContent=`${t('solutionHint')}: ${game.optimal.cost}′ · ${game.optimal.stops} ${t('stops')} · ${game.optimal.transfers} ${t('transfers')}.`;
  } else render();
}

$('newGame').addEventListener('click',newGame);
$('helpButton').addEventListener('click',()=>$('helpDialog').showModal());
$('closeHelp').addEventListener('click',()=>$('helpDialog').close());
$('helpDialog').addEventListener('click',event=>{if(event.target===$('helpDialog')) $('helpDialog').close();});
window.addEventListener('metromind-language-change',()=>{
  $('showSolution').textContent=t(solutionVisible?'hideSolution':'showSolution');
  if(game?.complete){
    const result=$('result');
    result.querySelector('h2').textContent=t('missionDone');
    result.querySelector('p').innerHTML=`${t('yourTime')}: <strong>${game.cost}′</strong>. ${t('bestTime')}: <strong>${game.optimal.cost}′</strong>.`;
    result.querySelector('button').textContent=t('newChallenge');
  }
  if(game) render();
});
$('difficulty').addEventListener('change',newGame);
$('missionDetails').addEventListener('toggle',()=>{if(game)requestAnimationFrame(drawMap);});
$('undoButton').addEventListener('click',undo);
$('showSolution').addEventListener('click',toggleSolution);
$('zoomIn').addEventListener('click',()=>{mapZoom=Math.min(2.8,mapZoom*1.35);drawMap();});
$('zoomOut').addEventListener('click',()=>{mapZoom=Math.max(.6,mapZoom/1.35);drawMap();});
$('mapViewport').addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,center:[...mapCenter],moved:false};e.currentTarget.setPointerCapture(e.pointerId);});
$('mapViewport').addEventListener('pointermove',e=>{
  if(!drag)return;
  if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<8 && !drag.moved)return;
  drag.moved=true;
  const worldWidth=(window.innerWidth<700?650:1300)/mapZoom;
  const scale=worldWidth/$('mapViewport').clientWidth;
  mapCenter=[drag.center[0]-(e.clientX-drag.x)*scale,drag.center[1]-(e.clientY-drag.y)*scale];
  drawMap();
});
$('mapViewport').addEventListener('pointerup',()=>{suppressMapClick=Boolean(drag?.moved);drag=null;setTimeout(()=>suppressMapClick=false,0);});
$('mapViewport').addEventListener('pointercancel',()=>drag=null);
window.addEventListener('resize',()=>{if(game)drawMap();});
renderLegend();
newGame();
