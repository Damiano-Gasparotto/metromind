const mapCities = {
  milano: {network:buildNetwork(), name:'milanName', source:'https://www.atm.it/it/AltriServizi/Trasporto/Documents/schema_rete_metro.pdf', sourceLabel:'networkLink', mapLabel:'mapLabel'},
  lisbona: {network:buildNetwork(LISBON_LINES,LISBON_ANCHORS,[],1400,1000), name:'lisbonNameUpper', source:'https://www.metrolisboa.pt/viajar/mapas-e-diagramas/', sourceLabel:'lisbonSource', mapLabel:'lisbonMapLabel'},
  vienna: {network:buildNetwork(VIENNA_LINES,VIENNA_ANCHORS,[],1750,1200), name:'viennaNameUpper', source:'https://www.wienerlinien.at/web/guest/fahrplaene', sourceLabel:'viennaSource', mapLabel:'viennaMapLabel'},
  barcellona: {network:buildNetwork(BARCELONA_LINES,BARCELONA_ANCHORS,[],2250,1380), name:'barcelonaNameUpper', source:'https://www.tmb.cat/ca/barcelona-transport/map/metro', sourceLabel:'barcelonaSource', mapLabel:'barcelonaMapLabel'},
  berlino: {network:buildNetwork(BERLIN_LINES,BERLIN_ANCHORS,[],2200,1600), name:'berlinNameUpper', source:'https://www.bvg.de/de/verbindungen/netzplaene-und-linien/u-bahn', sourceLabel:'berlinSource', mapLabel:'berlinMapLabel'},
  parigi: {network:buildNetwork(PARIS_LINES,PARIS_ANCHORS,[],2700,2050), name:'parisNameUpper', source:'https://prim.iledefrance-mobilites.fr/en/jeux-de-donnees/offre-horaires-tc-gtfs-idfm', sourceLabel:'parisSource', mapLabel:'parisMapLabel'},
  londra: {network:buildNetwork(LONDON_LINES,LONDON_ANCHORS,LONDON_WALK_LINKS,3000,2000), name:'londonNameUpper', source:'https://tfl.gov.uk/maps/track/tube', sourceLabel:'londonSource', mapLabel:'londonMapLabel'}
};
const mapCity = mapCities[new URLSearchParams(location.search).get('city')] ? new URLSearchParams(location.search).get('city') : 'milano';
const mapConfig = mapCities[mapCity];
const mapNetwork = mapConfig.network;
const mapSvgNS = 'http://www.w3.org/2000/svg';
const mapElement = id => document.getElementById(id);
const mapState = {zoom:1,center:[mapNetwork.width/2,mapNetwork.height/2],line:null,selected:null,search:'',pointers:new Map(),gesture:null,suppressClick:false};
const sortedStations = [...mapNetwork.stations].sort((a,b)=>a.localeCompare(b,'de'));

function svgElement(tag,attrs={}) {
  const node=document.createElementNS(mapSvgNS,tag);
  for(const [key,value] of Object.entries(attrs)) node.setAttribute(key,value);
  return node;
}
function searchKey(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').toLocaleLowerCase();
}
function visibleStations() {
  const query=searchKey(mapState.search.trim());
  return sortedStations.filter(station=>(!mapState.line||mapNetwork.stationLines.get(station).has(mapState.line))&&searchKey(station).includes(query));
}
function setCityText() {
  document.title=`MetroMind · ${t('mapTitle')} · ${t(mapConfig.name)}`;
  mapElement('cityName').textContent=t(mapConfig.name);
  mapElement('mapStats').textContent=`${mapNetwork.stations.length} ${t('stationCount').toLowerCase()} · ${Object.keys(mapNetwork.lines).length} ${language==='it'?'linee':'lines'}`;
  mapElement('networkMap').setAttribute('aria-label',t(mapConfig.mapLabel));
  mapElement('stationSearch').placeholder=t('searchPlaceholder');
  mapElement('mapSource').href=mapConfig.source;
  mapElement('mapSource').textContent=t(mapConfig.sourceLabel);
  mapElement('playLink').href=`game.html?city=${mapCity}`;
  mapElement('playCity').href=`game.html?city=${mapCity}`;
  document.querySelectorAll('.city-tabs a').forEach(link=>{
    if(link.dataset.city===mapCity) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
}
function renderFilters() {
  const box=mapElement('lineFilters');
  box.replaceChildren();
  for(const line of [null,...Object.keys(mapNetwork.lines)]) {
    const button=document.createElement('button');
    button.type='button';
    button.textContent=line||t('allLines');
    button.setAttribute('aria-pressed',String(mapState.line===line));
    if(line) button.style.borderBottom=`4px solid ${mapNetwork.lines[line].color}`;
    button.addEventListener('click',()=>{mapState.line=line;renderFilters();renderStationList();drawMap();});
    box.append(button);
  }
}
function renderStationList() {
  const stations=visibleStations();
  mapElement('resultsCount').textContent=stations.length;
  const list=mapElement('stationList');
  list.replaceChildren();
  if(!stations.length){const empty=document.createElement('p');empty.textContent=t('noStations');list.append(empty);return;}
  for(const station of stations){
    const button=document.createElement('button');
    button.type='button';
    button.setAttribute('aria-current',String(mapState.selected===station));
    const stripe=document.createElement('i');
    stripe.style.background=mapNetwork.lines[[...mapNetwork.stationLines.get(station)][0]].color;
    button.append(stripe,document.createTextNode(station));
    button.addEventListener('click',()=>selectStation(station,true));
    list.append(button);
  }
}
function renderSelection() {
  const panel=mapElement('selectedStation');
  panel.replaceChildren();
  if(!mapState.selected){panel.textContent=t('selectStation');return;}
  const name=document.createElement('strong');name.textContent=mapState.selected;
  const badges=document.createElement('span');badges.className='station-lines';
  for(const line of mapNetwork.stationLines.get(mapState.selected)){
    const badge=document.createElement('i');
    const color=mapNetwork.lines[line].color;
    const [r,g,b]=[1,3,5].map(index=>parseInt(color.slice(index,index+2),16));
    badge.textContent=line;
    badge.style.background=color;
    badge.style.color=(.299*r+.587*g+.114*b)/255>.62?'#172126':'#fff';
    badges.append(badge);
  }
  panel.append(name,badges);
}
function selectStation(station,focus) {
  mapState.selected=station;
  if(focus){mapState.center=[...mapNetwork.positions.get(station)];mapState.zoom=Math.max(mapState.zoom,3.2);}
  renderSelection();renderStationList();drawMap();
}
function currentView() {
  const viewport=mapElement('mapViewport');
  const ratio=Math.max(.4,viewport.clientWidth/Math.max(1,viewport.clientHeight));
  const width=Math.max(mapNetwork.width+160,(mapNetwork.height+160)*ratio)/mapState.zoom;
  const height=width/ratio;
  return {width,height,x:mapState.center[0]-width/2,y:mapState.center[1]-height/2};
}
function drawMap() {
  const svg=mapElement('networkMap');svg.replaceChildren();
  const view=currentView();
  svg.setAttribute('viewBox',`${view.x} ${view.y} ${view.width} ${view.height}`);
  const grid=svgElement('g',{class:'map-grid'});
  for(let x=0;x<=mapNetwork.width;x+=100) grid.append(svgElement('line',{x1:x,y1:0,x2:x,y2:mapNetwork.height}));
  for(let y=0;y<=mapNetwork.height;y+=100) grid.append(svgElement('line',{x1:0,y1:y,x2:mapNetwork.width,y2:y}));
  svg.append(grid);
  for(const {line,stops} of mapNetwork.routes){
    const points=stops.map(station=>mapNetwork.positions.get(station).join(',')).join(' ');
    svg.append(svgElement('polyline',{points,class:'map-line-under'}));
    svg.append(svgElement('polyline',{points,class:`map-line ${mapState.line&&line!==mapState.line?'dimmed':''}`,stroke:mapNetwork.lines[line].color}));
  }
  for(const [first,second] of mapNetwork.walkLinks){
    const a=mapNetwork.positions.get(first),b=mapNetwork.positions.get(second);
    svg.append(svgElement('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:'#596b70','stroke-width':3,'stroke-dasharray':'5 5'}));
  }
  const labelCandidates=[];
  for(const station of mapNetwork.stations){
    const [x,y]=mapNetwork.positions.get(station);
    const lines=mapNetwork.stationLines.get(station);
    const highlighted=station===mapState.selected;
    const terminal=mapNetwork.adjacency.get(station).length===1;
    const showLabel=highlighted||lines.size>1||terminal||mapState.zoom>=2.2||(mapState.line&&lines.has(mapState.line)&&mapState.zoom>=1.45);
    const group=svgElement('g',{class:`station-dot ${highlighted?'selected':''} ${mapState.line&&!lines.has(mapState.line)?'dimmed':''}`});
    group.append(svgElement('circle',{cx:x,cy:y,r:highlighted?10:lines.size>1?8:5,stroke:mapNetwork.lines[[...lines][0]].color}));
    group.append(svgElement('circle',{cx:x,cy:y,r:18,class:'hit'}));
    if(showLabel)labelCandidates.push({station,x,y,priority:highlighted?3:lines.size>1?2:terminal?1:0});
    const title=svgElement('title');title.textContent=`${station} · ${[...lines].join(', ')}`;group.append(title);
    group.addEventListener('click',()=>{if(!mapState.suppressClick) selectStation(station,false);});
    svg.append(group);
  }
  const labels=svgElement('g',{class:'map-labels'}),occupied=[];
  labelCandidates.sort((a,b)=>b.priority-a.priority);
  for(const {station,x,y,priority} of labelCandidates){
    const box={left:x+12,right:x+16+station.length*8.5,top:y-28,bottom:y-7};
    if(priority<3&&occupied.some(other=>box.left<other.right&&box.right>other.left&&box.top<other.bottom&&box.bottom>other.top))continue;
    occupied.push(box);
    const label=svgElement('text',{x:x+12,y:y-11});label.textContent=station;labels.append(label);
  }
  svg.append(labels);
}
function changeZoom(factor) {
  mapState.zoom=Math.max(1,Math.min(6,mapState.zoom*factor));
  drawMap();
}
function resetView(){mapState.zoom=1;mapState.center=[mapNetwork.width/2,mapNetwork.height/2];drawMap();}

const viewport=mapElement('mapViewport');
viewport.addEventListener('pointerdown',event=>{
  mapState.pointers.set(event.pointerId,[event.clientX,event.clientY]);
  viewport.setPointerCapture(event.pointerId);
  if(mapState.pointers.size===1)mapState.gesture={type:'pan',start:[event.clientX,event.clientY],center:[...mapState.center],moved:false};
  if(mapState.pointers.size===2){
    const [a,b]=[...mapState.pointers.values()];
    mapState.gesture={type:'pinch',distance:Math.hypot(a[0]-b[0],a[1]-b[1]),zoom:mapState.zoom};
  }
});
viewport.addEventListener('pointermove',event=>{
  if(!mapState.pointers.has(event.pointerId))return;
  mapState.pointers.set(event.pointerId,[event.clientX,event.clientY]);
  const gesture=mapState.gesture;if(!gesture)return;
  if(mapState.pointers.size===2&&gesture.type==='pinch'){
    const [a,b]=[...mapState.pointers.values()];
    const distance=Math.hypot(a[0]-b[0],a[1]-b[1]);
    mapState.zoom=Math.max(1,Math.min(6,gesture.zoom*distance/Math.max(1,gesture.distance)));
    mapState.suppressClick=true;drawMap();return;
  }
  if(mapState.pointers.size!==1||gesture.type!=='pan')return;
  const dx=event.clientX-gesture.start[0],dy=event.clientY-gesture.start[1];
  if(!gesture.moved&&Math.hypot(dx,dy)<5)return;
  gesture.moved=true;mapState.suppressClick=true;
  const view=currentView();
  mapState.center=[gesture.center[0]-dx*view.width/viewport.clientWidth,gesture.center[1]-dy*view.height/viewport.clientHeight];
  drawMap();
});
function releasePointer(event){
  mapState.pointers.delete(event.pointerId);
  if(mapState.pointers.size===1){const [point]=mapState.pointers.values();mapState.gesture={type:'pan',start:point,center:[...mapState.center],moved:false};}
  else mapState.gesture=null;
  setTimeout(()=>mapState.suppressClick=false,0);
}
viewport.addEventListener('pointerup',releasePointer);
viewport.addEventListener('pointercancel',releasePointer);
viewport.addEventListener('wheel',event=>{event.preventDefault();changeZoom(event.deltaY<0?1.2:1/1.2);},{passive:false});
mapElement('zoomIn').addEventListener('click',()=>changeZoom(1.45));
mapElement('zoomOut').addEventListener('click',()=>changeZoom(1/1.45));
mapElement('resetView').addEventListener('click',resetView);
mapElement('stationSearch').addEventListener('input',event=>{mapState.search=event.target.value;renderStationList();});
window.addEventListener('resize',drawMap);
window.addEventListener('metromind-language-change',()=>{setCityText();renderFilters();renderStationList();renderSelection();drawMap();});
setCityText();renderFilters();renderStationList();renderSelection();drawMap();
