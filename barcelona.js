// Station order follows TMB's 2026 Barcelona metro network. L9 and L10 have
// separate northern and southern sections; the two routes on each line do not
// connect until the operator opens the central section.
// Source: https://www.tmb.cat/ca/barcelona-transport/map/metro
// The map is an original schematic. Station order defines playable links.
const BARCELONA_LINES = {
  L1: {color:'#d7333f', routes:[
    'Hospital de Bellvitge|Bellvitge|Av. Carrilet|Rambla Just Oliveras|Can Serra|Florida|Torrassa|Santa Eulàlia|Mercat Nou|Plaça de Sants|Hostafrancs|Espanya|Rocafort|Urgell|Universitat|Catalunya|Urquinaona|Arc de Triomf|Marina|Glòries|Clot|Navas|La Sagrera|Fabra i Puig|Sant Andreu|Torras i Bages|Trinitat Vella|Baró de Viver|Santa Coloma|Fondo'
  ]},
  L2: {color:'#9a5baf', routes:[
    'Paral·lel|Sant Antoni|Universitat|Passeig de Gràcia|Tetuan|Monumental|Sagrada Família|Encants|Clot|Bac de Roda|Sant Martí|La Pau|Verneda|Artigues / Sant Adrià|Sant Roc|Gorg|Pep Ventura|Badalona Pompeu Fabra'
  ]},
  L3: {color:'#30955f', routes:[
    "Zona Universitària|Palau Reial|Maria Cristina|Les Corts|Plaça del Centre|Sants Estació|Tarragona|Espanya|Poble Sec|Paral·lel|Drassanes|Liceu|Catalunya|Passeig de Gràcia|Diagonal|Fontana|Lesseps|Vallcarca|Penitents|Vall d'Hebron|Montbau|Mundet|Valldaura|Canyelles|Roquetes|Trinitat Nova"
  ]},
  L4: {color:'#e5b62d', routes:[
    'La Pau|Besòs|Besòs Mar|El Maresme / Fòrum|Selva de Mar|Poblenou|Llacuna|Bogatell|Ciutadella / Vila Olímpica|Barceloneta|Jaume I|Urquinaona|Passeig de Gràcia|Girona|Verdaguer|Joanic|Alfons X|Guinardó / Hospital de Sant Pau|Maragall|Llucmajor|Via Júlia|Trinitat Nova'
  ]},
  L5: {color:'#377cb9', routes:[
    "Cornellà Centre|Gavarra|Sant Ildefons|Can Boixeres|Can Vidalet|Pubilla Cases|Ernest Lluch|Collblanc|Badal|Plaça de Sants|Sants Estació|Entença|Hospital Clínic|Diagonal|Verdaguer|Sagrada Família|Sant Pau / Dos de Maig|Camp de l'Arpa|La Sagrera|Congrés|Maragall|Virrei Amat|Vilapicina|Horta|El Carmel|El Coll / La Teixonera|Vall d'Hebron"
  ]},
  L9: {color:'#e48731', routes:[
    'La Sagrera|Onze de Setembre|Bon Pastor|Can Peixauet|Santa Rosa|Fondo|Església Major|Singuerlín|Can Zam',
    'Aeroport T1|Aeroport T2|Mas Blau|Parc Nou|Cèntric|El Prat Estació|Les Moreres|Mercabarna|Parc Logístic|Fira|Europa / Fira|Can Tries / Gornal|Torrassa|Collblanc|Zona Universitària'
  ]},
  L10: {color:'#5aabd0', routes:[
    'La Sagrera|Onze de Setembre|Bon Pastor|Llefià|La Salut|Gorg',
    'ZAL / Riu Vell|Ecoparc|Port Comercial / La Factoria|Zona Franca|Foc|Foneria|Ciutat de la Justícia|Provençana|Can Tries / Gornal|Torrassa|Collblanc'
  ]},
  L11: {color:'#a9bb48', routes:[
    "Trinitat Nova|Casa de l'Aigua|Torre Baró / Vallbona|Ciutat Meridiana|Can Cuiàs"
  ]}
};

const BARCELONA_ANCHORS = {
  'Hospital de Bellvitge':[110,635], 'Torrassa':[515,660],
  'Plaça de Sants':[690,645], 'Espanya':[820,660],
  'Universitat':[1050,625], 'Catalunya':[1130,610],
  'Urquinaona':[1230,590], 'Clot':[1480,570],
  'La Sagrera':[1610,490], 'Fondo':[1910,360],
  'Paral·lel':[970,800], 'Passeig de Gràcia':[1200,650],
  'Sagrada Família':[1420,580], 'La Pau':[1720,730],
  'Gorg':[1970,785], 'Badalona Pompeu Fabra':[2130,860],
  'Zona Universitària':[650,945], 'Sants Estació':[760,700],
  'Diagonal':[1250,445], "Vall d'Hebron":[1200,185],
  'Trinitat Nova':[1590,125],
  'Barceloneta':[1280,965], 'Verdaguer':[1360,435],
  'Maragall':[1640,285],
  'Cornellà Centre':[135,845], 'Collblanc':[565,775],
  'Bon Pastor':[1800,445], 'Can Zam':[2080,140],
  'Aeroport T1':[80,1260], 'Parc Logístic':[400,1160],
  'Fira':[500,1020], 'Europa / Fira':[585,970],
  'Can Tries / Gornal':[570,850],
  'ZAL / Riu Vell':[165,1050], 'Zona Franca':[345,920],
  'Ciutat de la Justícia':[505,875],
  'Can Cuiàs':[1880,70]
};
