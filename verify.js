const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const networkCode = fs.readFileSync('network.js','utf8');
const lisbonCode = fs.readFileSync('lisbon.js','utf8');
const viennaCode = fs.readFileSync('vienna.js','utf8');
const barcelonaCode = fs.readFileSync('barcelona.js','utf8');
const berlinCode = fs.readFileSync('berlin.js','utf8');
const parisCode = fs.readFileSync('paris.js','utf8');
const londonCode = fs.readFileSync('london.js','utf8');
const appCode = fs.readFileSync('app.js','utf8').split("$('newGame').addEventListener")[0];
function testContext(search='') {
  const context = vm.createContext({console,Math,Map,Set,Infinity,URLSearchParams,location:{search},document:{getElementById(){return {value:'hard'};}}});
  vm.runInContext(networkCode+'\n'+lisbonCode+'\n'+viennaCode+'\n'+barcelonaCode+'\n'+berlinCode+'\n'+parisCode+'\n'+londonCode+'\n'+appCode+'\nthis.testApi={network,shortestRoute,createChallenge,segmentFrom,availableSegments,applySegment,setGame:value=>game=value};',context);
  return context;
}
const context = testContext();
const {network,shortestRoute,createChallenge,segmentFrom,applySegment,setGame}=context.testApi;

assert(network.stations.length >= 125, 'Expected the complete five-line network');
for(const station of network.stations) {
  const position=network.positions.get(station);
  assert(position && position.every(Number.isFinite),`Missing map position: ${station}`);
  assert(network.adjacency.get(station)?.length,`Isolated station: ${station}`);
  for(const edge of network.adjacency.get(station)) {
    assert(network.adjacency.get(edge.to).some(back=>back.to===station && back.line===edge.line),`Broken link: ${station} / ${edge.to}`);
  }
}
const seen=new Set(), stack=[network.stations[0]];
while(stack.length) {
  const current=stack.pop(); if(seen.has(current))continue;
  seen.add(current);
  for(const edge of network.adjacency.get(current)) stack.push(edge.to);
}
assert.strictEqual(seen.size,network.stations.length,'Disconnected metro network');
assert.strictEqual(shortestRoute('Cordusio','Cairoli',[]).cost,2,'Adjacent stops should cost 2 minutes');
assert.strictEqual(shortestRoute('Cordusio','Missori',[]).cost,8,'A line change should add 4 minutes');
assert.strictEqual(shortestRoute('Missori','Sforza Policlinico',[]).cost,5,'Walking link should cost 5 minutes');

function checkRide(start,first,line,end,waypoints=[]) {
  setGame({current:start,end:'Linate Aeroporto',waypoints});
  const edge=network.adjacency.get(start).find(candidate=>candidate.to===first && candidate.line===line);
  assert(edge,`Missing starting direction: ${start} / ${first}`);
  const ride=segmentFrom(edge);
  assert.strictEqual(ride.destination,end,`Wrong automatic stop from ${start} via ${first}`);
  return ride;
}
assert.deepStrictEqual([...checkRide('Cordusio','Cairoli','M1','Cadorna FN').path],['Cordusio','Cairoli','Cadorna FN']);
checkRide('Bisceglie','Inganni','M1','Pagano');
checkRide('Bisceglie','Inganni','M1','Gambara',['Gambara']);
checkRide('Famagosta','Assago Milanofiori Nord','M2','Assago Milanofiori Forum');
checkRide('Missori','Sforza Policlinico','WALK','Sforza Policlinico');
const rideGame={current:'Bisceglie',line:null,end:'Cadorna FN',waypoints:['Gambara'],visited:new Set(),cost:0,stops:0,transfers:0,history:[],route:['Bisceglie']};
setGame(rideGame);
const firstRide=segmentFrom(network.adjacency.get('Bisceglie').find(edge=>edge.to==='Inganni'));
applySegment(firstRide);
assert.strictEqual(rideGame.current,'Gambara');
assert.strictEqual(rideGame.stops,4);
assert.strictEqual(rideGame.cost,8);
assert(rideGame.visited.has('Gambara'));
assert.strictEqual(rideGame.history.length,1,'One ride must be one undoable action');
assert.strictEqual(rideGame.history[0].current,'Bisceglie');
const transferGame={current:'Cadorna FN',line:'M1',end:'Gessate',waypoints:[],visited:new Set(),cost:0,stops:0,transfers:0,history:[],route:['Cadorna FN']};
setGame(transferGame);
const transferRide=segmentFrom(network.adjacency.get('Cadorna FN').find(edge=>edge.to==='Lanza' && edge.line==='M2'));
applySegment(transferRide);
assert.strictEqual(transferGame.current,'Garibaldi FS');
assert.strictEqual(transferGame.cost,10);
assert.strictEqual(transferGame.transfers,1);

for(const [start,end,waypoints] of [
  ['Rho Fieramilano','Linate Aeroporto',['Duomo']],
  ['Bisceglie','Gessate',['Zara','Sant’Ambrogio']],
  ['Cologno Nord','San Siro Stadio',['San Donato','Missori','Sforza Policlinico']]
]) {
  const result=shortestRoute(start,end,waypoints);
  assert(result,`No route: ${start} to ${end}`);
  assert.strictEqual(result.steps[0].station,start);
  assert.strictEqual(result.steps.at(-1).station,end);
  for(const waypoint of waypoints) assert(result.steps.some(step=>step.station===waypoint));
  for(let i=1;i<result.steps.length;i++) {
    assert(network.adjacency.get(result.steps[i-1].station).some(edge=>edge.to===result.steps[i].station));
  }
}
for(let i=0;i<10;i++) {
  const challenge=createChallenge();
  assert(challenge && challenge.waypoints.length===3 && challenge.optimal,'Invalid generated challenge');
}

const lisbon=testContext('?city=lisbona').testApi;
assert.strictEqual(lisbon.network.stations.length,50,'Expected 50 distinct Lisbon station names');
assert.strictEqual(lisbon.network.routes.reduce((sum,route)=>sum+route.stops.length,0),56,'Expected 56 line stops');
assert.strictEqual(Object.keys(lisbon.network.lines).length,4,'Expected four Lisbon lines');
assert.strictEqual([...lisbon.network.stationLines.values()].filter(lines=>lines.size>1).length,6,'Expected six interchanges');
for(const station of lisbon.network.stations) {
  assert(lisbon.network.positions.get(station)?.every(Number.isFinite),`Missing Lisbon map position: ${station}`);
  for(const edge of lisbon.network.adjacency.get(station))
    assert(lisbon.network.adjacency.get(edge.to).some(back=>back.to===station&&back.line===edge.line),`Broken Lisbon link: ${station} / ${edge.to}`);
}
const lisbonSeen=new Set(), lisbonStack=[lisbon.network.stations[0]];
while(lisbonStack.length){const station=lisbonStack.pop();if(lisbonSeen.has(station))continue;lisbonSeen.add(station);for(const edge of lisbon.network.adjacency.get(station))lisbonStack.push(edge.to);}
assert.strictEqual(lisbonSeen.size,50,'Lisbon network must be connected');
assert.strictEqual(lisbon.shortestRoute('Campo Grande','Alvalade',[]).cost,2);
assert.strictEqual(lisbon.shortestRoute('Campo Grande','Cidade Universitária',[]).cost,2);
assert.strictEqual(lisbon.shortestRoute('Campo Grande','Alameda',[]).cost,8);
for(const [start,end,waypoints] of [
  ['Aeroporto','Cais do Sodré',['Alameda']],
  ['Reboleira','Odivelas',['Baixa-Chiado','Saldanha']],
  ['Santa Apolónia','Telheiras',['São Sebastião','Campo Grande','Marquês de Pombal']]
]){
  const result=lisbon.shortestRoute(start,end,waypoints);
  assert(result,`No Lisbon route: ${start} to ${end}`);
  for(const waypoint of waypoints)assert(result.steps.some(step=>step.station===waypoint));
}
lisbon.setGame({current:'Aeroporto',end:'Cais do Sodré',waypoints:[]});
const redStart=lisbon.network.adjacency.get('Aeroporto')[0];
assert.strictEqual(lisbon.segmentFrom(redStart).destination,'Alameda','Ride should stop at red/green interchange');
for(let i=0;i<10;i++)assert(lisbon.createChallenge()?.optimal,'Invalid Lisbon challenge');
const lisbonWaypoints=['Campo Grande','Baixa-Chiado'];
const lisbonOptimal=lisbon.shortestRoute('Aeroporto','Reboleira',lisbonWaypoints);
const lisbonGame={current:'Aeroporto',line:null,end:'Reboleira',waypoints:lisbonWaypoints,visited:new Set(),cost:0,stops:0,transfers:0,history:[],route:['Aeroporto']};
lisbon.setGame(lisbonGame);
let stepIndex=0;
while(stepIndex<lisbonOptimal.steps.length-1){
  const next=lisbonOptimal.steps[stepIndex+1];
  const ride=lisbon.availableSegments().find(segment=>segment.edge.to===next.station&&segment.edge.line===next.edge.line);
  assert(ride,`No playable direction from ${lisbonGame.current} to ${next.station}`);
  assert.deepStrictEqual(ride.path,lisbonOptimal.steps.slice(stepIndex,stepIndex+ride.path.length).map(step=>step.station),'Automatic ride diverged from optimal route');
  lisbon.applySegment(ride);
  stepIndex+=ride.path.length-1;
}
assert.strictEqual(lisbonGame.current,'Reboleira');
assert.strictEqual(lisbonGame.visited.size,2);
assert.strictEqual(lisbonGame.cost,lisbonOptimal.cost);
const vienna=testContext('?city=vienna').testApi;
assert.strictEqual(vienna.network.stations.length,99,'Expected 99 distinct Vienna station names');
assert.strictEqual(vienna.network.routes.reduce((sum,route)=>sum+route.stops.length,0),110,'Expected 110 Vienna line stops');
assert.strictEqual(Object.keys(vienna.network.lines).length,5,'Expected five Vienna lines');
for(const station of vienna.network.stations) {
  assert(vienna.network.positions.get(station)?.every(Number.isFinite),`Missing Vienna map position: ${station}`);
  for(const edge of vienna.network.adjacency.get(station))
    assert(vienna.network.adjacency.get(edge.to).some(back=>back.to===station&&back.line===edge.line),`Broken Vienna link: ${station} / ${edge.to}`);
}
const viennaSeen=new Set(), viennaStack=[vienna.network.stations[0]];
while(viennaStack.length){const station=viennaStack.pop();if(viennaSeen.has(station))continue;viennaSeen.add(station);for(const edge of vienna.network.adjacency.get(station))viennaStack.push(edge.to);}
assert.strictEqual(viennaSeen.size,99,'Vienna network must be connected');
assert.strictEqual(vienna.shortestRoute('Lina-Loos-Platz','Aspernstraße',[]).cost,2);
assert.strictEqual(vienna.shortestRoute('Schottenring','Schwedenplatz',[]).cost,2);
assert.strictEqual(vienna.shortestRoute('Stephansplatz','Herrengasse',[]).cost,2);
for(const [start,end,waypoints] of [
  ['Seestadt','Oberlaa',['Lina-Loos-Platz']],
  ['Hütteldorf','Simmering',['Karlsplatz','Westbahnhof']],
  ['Floridsdorf','Leopoldau',['Spittelau','Schottenring','Praterstern']]
]){
  const result=vienna.shortestRoute(start,end,waypoints);
  assert(result,`No Vienna route: ${start} to ${end}`);
  for(const waypoint of waypoints)assert(result.steps.some(step=>step.station===waypoint));
}
vienna.setGame({current:'Seestadt',end:'Oberlaa',waypoints:[]});
const viennaStart=vienna.network.adjacency.get('Seestadt')[0];
assert.strictEqual(vienna.segmentFrom(viennaStart).destination,'Praterstern','Ride should stop at the U1/U2 interchange');
for(let i=0;i<10;i++)assert(vienna.createChallenge()?.optimal,'Invalid Vienna challenge');
const viennaWaypoints=['Lina-Loos-Platz','Schottenring'];
const viennaOptimal=vienna.shortestRoute('Seestadt','Oberlaa',viennaWaypoints);
const viennaGame={current:'Seestadt',line:null,end:'Oberlaa',waypoints:viennaWaypoints,visited:new Set(),cost:0,stops:0,transfers:0,history:[],route:['Seestadt']};
vienna.setGame(viennaGame);
let viennaStepIndex=0;
while(viennaStepIndex<viennaOptimal.steps.length-1){
  const next=viennaOptimal.steps[viennaStepIndex+1];
  const ride=vienna.availableSegments().find(segment=>segment.edge.to===next.station&&segment.edge.line===next.edge.line);
  assert(ride,`No playable Vienna direction from ${viennaGame.current} to ${next.station}`);
  assert.deepStrictEqual(ride.path,viennaOptimal.steps.slice(viennaStepIndex,viennaStepIndex+ride.path.length).map(step=>step.station),'Vienna automatic ride diverged from optimal route');
  vienna.applySegment(ride);
  viennaStepIndex+=ride.path.length-1;
}
assert.strictEqual(viennaGame.current,'Oberlaa');
assert.strictEqual(viennaGame.visited.size,2);
assert.strictEqual(viennaGame.cost,viennaOptimal.cost);
const barcelona=testContext('?city=barcellona').testApi;
assert.strictEqual(barcelona.network.stations.length,138,'Expected 138 distinct Barcelona station names');
assert.strictEqual(barcelona.network.routes.reduce((sum,route)=>sum+route.stops.length,0),169,'Expected 169 Barcelona line stops');
assert.strictEqual(Object.keys(barcelona.network.lines).length,8,'Expected eight Barcelona lines');
for(const station of barcelona.network.stations){
  assert(barcelona.network.positions.get(station)?.every(Number.isFinite),`Missing Barcelona map position: ${station}`);
  for(const edge of barcelona.network.adjacency.get(station))
    assert(barcelona.network.adjacency.get(edge.to).some(back=>back.to===station&&back.line===edge.line),`Broken Barcelona link: ${station} / ${edge.to}`);
}
const barcelonaSeen=new Set(),barcelonaStack=[barcelona.network.stations[0]];
while(barcelonaStack.length){const station=barcelonaStack.pop();if(barcelonaSeen.has(station))continue;barcelonaSeen.add(station);for(const edge of barcelona.network.adjacency.get(station))barcelonaStack.push(edge.to);}
assert.strictEqual(barcelonaSeen.size,138,'Barcelona network must be connected');
assert.strictEqual(barcelona.shortestRoute('Onze de Setembre','Bon Pastor',[]).cost,2);
assert.strictEqual(barcelona.shortestRoute('Can Tries / Gornal','Torrassa',[]).cost,2);
for(const [start,end,waypoints] of [
  ['Aeroport T1','Can Zam',['Collblanc']],
  ['Hospital de Bellvitge','Badalona Pompeu Fabra',['Catalunya','Sagrada Família']],
  ['Can Cuiàs','ZAL / Riu Vell',['Trinitat Nova','La Sagrera','Fondo']]
]){
  const result=barcelona.shortestRoute(start,end,waypoints);
  assert(result,`No Barcelona route: ${start} to ${end}`);
  for(const waypoint of waypoints)assert(result.steps.some(step=>step.station===waypoint));
}
barcelona.setGame({current:'Aeroport T1',end:'Can Zam',waypoints:[]});
assert.strictEqual(barcelona.segmentFrom(barcelona.network.adjacency.get('Aeroport T1')[0]).destination,'Can Tries / Gornal','Ride should stop at L9/L10 interchange');
for(let i=0;i<10;i++)assert(barcelona.createChallenge()?.optimal,'Invalid Barcelona challenge');
const barcelonaWaypoints=['Collblanc','Fondo'];
const barcelonaOptimal=barcelona.shortestRoute('Aeroport T1','Can Cuiàs',barcelonaWaypoints);
const barcelonaGame={current:'Aeroport T1',line:null,end:'Can Cuiàs',waypoints:barcelonaWaypoints,visited:new Set(),cost:0,stops:0,transfers:0,history:[],route:['Aeroport T1']};
barcelona.setGame(barcelonaGame);
let barcelonaStepIndex=0;
while(barcelonaStepIndex<barcelonaOptimal.steps.length-1){
  const next=barcelonaOptimal.steps[barcelonaStepIndex+1];
  const ride=barcelona.availableSegments().find(segment=>segment.edge.to===next.station&&segment.edge.line===next.edge.line);
  assert(ride,`No playable Barcelona direction from ${barcelonaGame.current} to ${next.station}`);
  assert.deepStrictEqual(ride.path,barcelonaOptimal.steps.slice(barcelonaStepIndex,barcelonaStepIndex+ride.path.length).map(step=>step.station),'Barcelona automatic ride diverged from optimal route');
  barcelona.applySegment(ride);
  barcelonaStepIndex+=ride.path.length-1;
}
assert.strictEqual(barcelonaGame.current,'Can Cuiàs');
assert.strictEqual(barcelonaGame.visited.size,2);
assert.strictEqual(barcelonaGame.cost,barcelonaOptimal.cost);
for(const [city,expected,lines,start,end,via] of [
  ['berlino',175,9,'Alt-Tegel','Rudow','Alexanderplatz'],
  ['parigi',321,16,'La Défense',"Aéroport d'Orly",'Châtelet'],
  ['londra',272,11,'Brixton','Epping','Bank']
]){
  const api=testContext(`?city=${city}`).testApi;
  const net=api.network;
  assert.strictEqual(Object.keys(net.lines).length,lines,`${city}: line count`);
  assert.strictEqual(net.stations.length,expected,`${city}: station count`);
  const visited=new Set(),queue=[net.stations[0]];
  while(queue.length){
    const station=queue.pop();
    if(visited.has(station))continue;
    visited.add(station);
    assert(net.positions.get(station)?.every(Number.isFinite),`${city}: no map position for ${station}`);
    for(const edge of net.adjacency.get(station)){
      assert(net.adjacency.get(edge.to).some(back=>back.to===station&&back.line===edge.line),`${city}: broken link ${station} — ${edge.to}`);
      queue.push(edge.to);
    }
  }
  assert.strictEqual(visited.size,expected,`${city}: network disconnected`);
  const route=api.shortestRoute(start,end,[via]);
  assert(route?.steps.some(step=>step.station===via),`${city}: required stop unreachable`);
  const gameState={current:start,line:null,end,waypoints:[via],visited:new Set(),cost:0,stops:0,transfers:0,history:[],route:[start]};
  api.setGame(gameState);
  let stepIndex=0;
  while(stepIndex<route.steps.length-1){
    const next=route.steps[stepIndex+1];
    const ride=api.availableSegments().find(segment=>segment.edge.to===next.station&&segment.edge.line===next.edge.line);
    assert(ride,`${city}: no playable direction from ${gameState.current} to ${next.station}`);
    assert.deepStrictEqual(ride.path,route.steps.slice(stepIndex,stepIndex+ride.path.length).map(step=>step.station),`${city}: automatic ride diverged`);
    api.applySegment(ride);
    stepIndex+=ride.path.length-1;
  }
  assert.strictEqual(gameState.current,end,`${city}: ride did not reach destination`);
  assert(gameState.visited.has(via),`${city}: required stop not marked visited`);
  assert(api.createChallenge()?.optimal,`${city}: challenge generation failed`);
}
console.log('Verified all seven city networks, route connectivity, required stops and automatic rides.');
