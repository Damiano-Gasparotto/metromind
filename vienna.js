// Vienna U-Bahn network, including U2 Lina-Loos-Platz, open since January 2026.
// Sources: https://www.wienerlinien.at/web/guest/fahrplaene
//          https://www.wienerlinien.at/documents/3541220/4248551/2026_SVP_Website%2BPassepartout.pdf/1dedbf2b-7e74-b6fb-24d5-8ced570ceee9
// The drawing is original and schematic; consecutive names define playable links.
const VIENNA_LINES = {
  U1: {color:'#e63436', routes:[
    'Leopoldau|Großfeldsiedlung|Aderklaaer Straße|Rennbahnweg|Kagraner Platz|Kagran|Alte Donau|Kaisermühlen-VIC|Donauinsel|Vorgartenstraße|Praterstern|Nestroyplatz|Schwedenplatz|Stephansplatz|Karlsplatz|Taubstummengasse|Südtiroler Platz-Hauptbahnhof|Keplerplatz|Reumannplatz|Troststraße|Altes Landgut|Alaudagasse|Neulaa|Oberlaa'
  ]},
  U2: {color:'#a266a8', routes:[
    'Seestadt|Aspern Nord|Hausfeldstraße|Lina-Loos-Platz|Aspernstraße|Donauspital|Hardeggasse|Stadlau|Donaustadtbrücke|Donaumarina|Stadion|Krieau|Messe-Prater|Praterstern|Taborstraße|Schottenring|Schottentor|Rathaus|Volkstheater|Museumsquartier|Karlsplatz'
  ]},
  U3: {color:'#e99032', routes:[
    'Ottakring|Kendlerstraße|Hütteldorfer Straße|Johnstraße|Schweglerstraße|Westbahnhof|Zieglergasse|Neubaugasse|Volkstheater|Herrengasse|Stephansplatz|Stubentor|Landstraße|Rochusgasse|Kardinal-Nagl-Platz|Schlachthausgasse|Erdberg|Gasometer|Zippererstraße|Enkplatz|Simmering'
  ]},
  U4: {color:'#329568', routes:[
    'Hütteldorf|Ober St. Veit|Unter St. Veit|Braunschweiggasse|Hietzing|Schönbrunn|Meidling Hauptstraße|Längenfeldgasse|Margaretengürtel|Pilgramgasse|Kettenbrückengasse|Karlsplatz|Stadtpark|Landstraße|Schwedenplatz|Schottenring|Roßauer Lände|Friedensbrücke|Spittelau|Heiligenstadt'
  ]},
  U6: {color:'#9b754d', routes:[
    'Floridsdorf|Neue Donau|Handelskai|Dresdner Straße|Jägerstraße|Spittelau|Nußdorfer Straße|Währinger Straße-Volksoper|Michelbeuern-AKH|Alser Straße|Josefstädter Straße|Thaliastraße|Burggasse-Stadthalle|Westbahnhof|Gumpendorfer Straße|Längenfeldgasse|Niederhofstraße|Bahnhof Meidling|Tscherttegasse|Am Schöpfwerk|Alterlaa|Erlaaer Straße|Perfektastraße|Siebenhirten'
  ]}
};

const VIENNA_ANCHORS = {
  'Leopoldau':[1190,70], 'Kagran':[1200,260], 'Praterstern':[1050,400],
  'Schwedenplatz':[930,515], 'Stephansplatz':[855,590], 'Karlsplatz':[820,700],
  'Südtiroler Platz-Hauptbahnhof':[915,830], 'Oberlaa':[1250,1080],
  'Seestadt':[1640,130], 'Aspern Nord':[1550,200], 'Lina-Loos-Platz':[1430,275],
  'Stadlau':[1340,360], 'Stadion':[1180,460], 'Schottenring':[815,445],
  'Volkstheater':[655,635], 'Ottakring':[240,310], 'Westbahnhof':[485,680],
  'Landstraße':[1015,665], 'Simmering':[1410,875], 'Hütteldorf':[80,780],
  'Längenfeldgasse':[465,860], 'Schönbrunn':[310,815], 'Spittelau':[665,300],
  'Heiligenstadt':[615,120], 'Floridsdorf':[870,70], 'Handelskai':[790,220],
  'Michelbeuern-AKH':[495,445], 'Bahnhof Meidling':[485,950],
  'Siebenhirten':[460,1110]
};
