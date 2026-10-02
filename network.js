// Station order and branches checked against ATM's 2026 metro network diagram.
// Each branch starts at its junction, so every consecutive pair is a real metro link.
const METRO_LINES = {
  M1: {
    color: '#e12631',
    routes: [
      'Rho Fieramilano|Pero|Molino Dorino|San Leonardo|Bonola|Uruguay|Lampugnano|QT8|Lotto|Amendola|Buonarroti|Pagano|Conciliazione|Cadorna FN|Cairoli|Cordusio|Duomo|San Babila|Palestro|Porta Venezia|Lima|Loreto|Pasteur|Rovereto|Turro|Gorla|Precotto|Villa San Giovanni|Sesto Marelli|Sesto Rondò|Sesto 1° Maggio FS',
      'Pagano|Wagner|De Angeli|Gambara|Bande Nere|Primaticcio|Inganni|Bisceglie'
    ]
  },
  M2: {
    color: '#168e55',
    routes: [
      'Assago Milanofiori Forum|Assago Milanofiori Nord|Famagosta|Romolo|Porta Genova FS|Sant’Agostino|Sant’Ambrogio|Cadorna FN|Lanza|Moscova|Garibaldi FS|Gioia|Centrale FS|Caiazzo|Loreto|Piola|Lambrate FS|Udine|Cimiano|Crescenzago|Cascina Gobba|Vimodrone|Cascina Burrona|Cernusco sul Naviglio|Villa Fiorita|Cassina de’ Pecchi|Bussero|Villa Pompea|Gorgonzola|Cascina Antonietta|Gessate',
      'Famagosta|Piazza Abbiategrasso',
      'Cascina Gobba|Cologno Sud|Cologno Centro|Cologno Nord'
    ]
  },
  M3: {
    color: '#edc22c',
    routes: [
      'Comasina|Affori FN|Affori Centro|Dergano|Maciachini|Zara|Sondrio|Centrale FS|Repubblica|Turati|Montenapoleone|Duomo|Missori|Crocetta|Porta Romana|Lodi TIBB|Brenta|Corvetto|Porto di Mare|Rogoredo FS|San Donato'
    ]
  },
  M4: {
    color: '#2588c7',
    routes: [
      'San Cristoforo|Segneri|Gelsomini|Frattini|Tolstoj|Bolivar|California|Coni Zugna|Sant’Ambrogio|De Amicis|Vetra|Santa Sofia|Sforza Policlinico|San Babila|Tricolore|Dateo|Susa|Argonne|Stazione Forlanini|Repetti|Linate Aeroporto'
    ]
  },
  M5: {
    color: '#9d75bf',
    routes: [
      'Bignami|Ponale|Bicocca|Ca’ Granda|Istria|Marche|Zara|Isola|Garibaldi FS|Monumentale|Cenisio|Gerusalemme|Domodossola FN|Tre Torri|Portello|Lotto|Segesta|San Siro Ippodromo|San Siro Stadio'
    ]
  }
};

const METRO_ANCHORS = {
  'Rho Fieramilano':[70,485], 'Lotto':[455,500], 'Pagano':[575,565], 'Bisceglie':[280,725],
  'Cadorna FN':[670,570], 'Duomo':[830,565], 'San Babila':[920,545], 'Loreto':[1085,420],
  'Sesto 1° Maggio FS':[1450,100], 'Assago Milanofiori Forum':[390,1030],
  'Famagosta':[500,880], 'Piazza Abbiategrasso':[425,955], 'Sant’Ambrogio':[630,685],
  'Garibaldi FS':[850,350], 'Centrale FS':[990,325], 'Cascina Gobba':[1300,345],
  'Gessate':[1660,220], 'Cologno Nord':[1490,500], 'Comasina':[720,75],
  'Zara':[875,270], 'San Donato':[1110,1015], 'San Cristoforo':[320,840],
  'Sforza Policlinico':[835,690], 'Linate Aeroporto':[1510,760],
  'Bignami':[1110,85], 'San Siro Stadio':[145,650], 'Missori':[830,630]
};

const METRO_WALK_LINKS = [['Missori', 'Sforza Policlinico']];

function buildNetwork(lines = METRO_LINES, anchors = METRO_ANCHORS, walkLinks = METRO_WALK_LINKS, width = 1750, height = 1120) {
  const routes = [];
  const adjacency = new Map();
  const stationLines = new Map();
  const positions = new Map(Object.entries(anchors));
  const addEdge = (a, b, line, walk = false) => {
    if (!adjacency.has(a)) adjacency.set(a, []);
    if (!adjacency.has(b)) adjacency.set(b, []);
    adjacency.get(a).push({to:b, line, walk});
    adjacency.get(b).push({to:a, line, walk});
  };

  for (const [line, detail] of Object.entries(lines)) {
    for (const routeText of detail.routes) {
      const route = routeText.split('|');
      routes.push({line, stops:route});
      route.forEach(station => {
        if (!stationLines.has(station)) stationLines.set(station, new Set());
        stationLines.get(station).add(line);
      });
      for (let i = 1; i < route.length; i++) addEdge(route[i-1], route[i], line);
    }
  }

  // Layout is intentionally schematic. Interpolating only changes drawing,
  // never the underlying station connections used by the solver.
  for (const {stops} of routes) {
    let previous = -1;
    for (let i = 0; i < stops.length; i++) {
      if (!positions.has(stops[i])) continue;
      if (previous >= 0 && i - previous > 1) {
        const [x0,y0] = positions.get(stops[previous]);
        const [x1,y1] = positions.get(stops[i]);
        for (let j = previous + 1; j < i; j++) {
          const t = (j - previous) / (i - previous);
          positions.set(stops[j], [x0+(x1-x0)*t, y0+(y1-y0)*t]);
        }
      }
      previous = i;
    }
  }
  for (const [a,b] of walkLinks) addEdge(a,b,'WALK',true);
  return {routes, adjacency, stationLines, positions, stations:[...stationLines.keys()], lines, walkLinks, width, height};
}
