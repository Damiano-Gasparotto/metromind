// UTC gives every player the same challenge, wherever they are playing.
const MetroDaily = (() => {
  const cities=['milano','lisbona','vienna','barcellona','berlino','parigi','londra'];
  const today=(now=new Date())=>now.toISOString().slice(0,10);
  function validDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value||'') && Number.isFinite(Date.parse(value+'T00:00:00Z')) && today(new Date(value+'T00:00:00Z'))===value;
  }
  function descriptor(date=today()) {
    if(!validDate(date)) date=today();
    const day=Math.floor(Date.parse(date+'T00:00:00Z')/86400000);
    const city=cities[((day%7)+7)%7];
    return {date,city,difficulty:'medium',seed:`metromind-daily-v1:${date}:${city}`,url:`game.html?mode=daily&date=${date}`};
  }
  function seeded(seed) {
    let state=2166136261;
    for(const char of seed) state=Math.imul(state^char.charCodeAt(0),16777619);
    return ()=>{
      state=(state+0x6D2B79F5)|0;
      let n=Math.imul(state^(state>>>15),1|state);
      n^=n+Math.imul(n^(n>>>7),61|n);
      return ((n^(n>>>14))>>>0)/4294967296;
    };
  }
  return {today,validDate,descriptor,seeded};
})();
