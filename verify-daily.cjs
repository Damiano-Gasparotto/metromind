const fs=require('fs'),vm=require('vm'),assert=require('assert');
const files=['daily.js','network.js','lisbon.js','vienna.js','barcelona.js','berlin.js','paris.js','london.js'];
const source=files.map(file=>fs.readFileSync(file,'utf8')).join('\n')+'\n'+fs.readFileSync('app.js','utf8').split("$('newGame').addEventListener")[0];
function load(date,level='easy') {
 const ctx=vm.createContext({URLSearchParams,location:{search:`?mode=daily&date=${date}&city=milano`},document:{getElementById:()=>({value:level})}});
 vm.runInContext(source+'\nthis.api={dailyChallenge,cityId,createChallenge,shortestRoute,segmentFrom,applySegment,setGame:g=>game=g};',ctx);
 return ctx.api;
}
const cities=new Set();
for(let day=11;day<18;day++) {
 const date=`2026-10-${day}`,a=load(date),b=load(date,'hard');
 cities.add(a.cityId);
 const first=a.createChallenge(),second=b.createChallenge();
 assert.deepStrictEqual(JSON.parse(JSON.stringify(first)),JSON.parse(JSON.stringify(second)),'Daily must ignore local difficulty and repeat identically');
 assert.strictEqual(first.waypoints.length,2);
 const game={...first,current:first.start,line:null,visited:new Set(),cost:0,stops:0,transfers:0,history:[],route:[first.start]};
 a.setGame(game);
 let step=0;
 while(step<first.optimal.steps.length-1) {
   const next=first.optimal.steps[step+1],segment=a.segmentFrom(next.edge);
   for(let i=1;i<segment.path.length;i++) assert.strictEqual(segment.path[i],first.optimal.steps[step+i].station,'Optimal path must be playable using automatic rides');
   a.applySegment(segment);step+=segment.path.length-1;
 }
 assert.strictEqual(game.current,first.end);assert.strictEqual(game.visited.size,2);assert.strictEqual(game.cost,first.optimal.cost);
}
assert.strictEqual(cities.size,7,'Daily rotation must cover all cities');
console.log('Verified repeatable daily missions, fixed difficulty, seven-city rotation and playable optimal routes.');
