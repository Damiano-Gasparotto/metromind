// Stations and line order: BVG line overview, accessed October 2026.
// https://www.bvg.de/de/verbindungen/netzplaene-und-linien/u-bahn
// The U6 northern stations are included in the complete map despite their temporary closure.
// Original schematic coordinates; routes define playable connections.
const BERLIN_LINES = {
  U1: {color:'#7cad74', routes:["Warschauer Str.|Schlesisches Tor|Görlitzer Bahnhof|Kottbusser Tor|Prinzenstr.|Hallesches Tor|Möckernbrücke|Gleisdreieck|Kurfürstenstr.|Nollendorfplatz|Wittenbergplatz|Kurfürstendamm|Uhlandstr."]},
  U2: {color:'#db554e', routes:["Pankow|Vinetastr.|Schönhauser Allee|Eberswalder Str.|Senefelderplatz|Rosa-Luxemburg-Platz|Alexanderplatz|Klosterstr.|Märkisches Museum|Spittelmarkt|Hausvogteiplatz|Stadtmitte|Anton-Wilhelm-Amo-Str.|Potsdamer Platz|Mendelssohn-Bartholdy-Park|Gleisdreieck|Bülowstr.|Nollendorfplatz|Wittenbergplatz|Zoologischer Garten|Ernst-Reuter-Platz|Deutsche Oper|Bismarckstr.|Sophie-Charlotte-Platz|Kaiserdamm|Theodor-Heuss-Platz|Neu-Westend|Olympia-Stadion|Ruhleben"]},
  U3: {color:'#69a875', routes:["Warschauer Str.|Schlesisches Tor|Görlitzer Bahnhof|Kottbusser Tor|Prinzenstr.|Hallesches Tor|Möckernbrücke|Gleisdreieck|Kurfürstenstr.|Nollendorfplatz|Wittenbergplatz|Augsburger Str.|Spichernstr.|Hohenzollernplatz|Fehrbelliner Platz|Heidelberger Platz|Rüdesheimer Platz|Breitenbachplatz|Podbielskiallee|Dahlem-Dorf|Freie Universität (Thielplatz)|Oskar-Helene-Heim|Onkel Toms Hütte|Krumme Lanke"]},
  U4: {color:'#e4b632', routes:["Nollendorfplatz|Viktoria-Luise-Platz|Bayerischer Platz|Rathaus Schöneberg|Innsbrucker Platz"]},
  U5: {color:'#8e6ca9', routes:["Hönow|Louis-Lewin-Str.|Hellersdorf|Cottbusser Platz|Kienberg (Gärten der Welt)|Kaulsdorf-Nord|Wuhletal|Elsterwerdaer Platz|Biesdorf-Süd|Tierpark|Friedrichsfelde|Lichtenberg|Magdalenenstr. (Campus für Demokratie)|Frankfurter Allee|Samariterstr.|Frankfurter Tor|Weberwiese|Strausberger Platz|Schillingstr.|Alexanderplatz|Rotes Rathaus|Museumsinsel|Unter den Linden|Brandenburger Tor|Bundestag|Hauptbahnhof"]},
  U6: {color:'#a07550', routes:["Alt-Tegel|Borsigwerke|Holzhauser Str.|Otisstr.|Scharnweberstr.|Kurt-Schumacher-Platz|Afrikanische Str.|Rehberge|Seestr.|Leopoldplatz|Wedding|Reinickendorfer Str.|Schwartzkopffstr.|Naturkundemuseum|Oranienburger Tor|Friedrichstr.|Unter den Linden|Stadtmitte|Kochstr./​Checkpoint Charlie|Hallesches Tor|Mehringdamm|Platz der Luftbrücke|Paradestr.|Tempelhof|Alt-Tempelhof|Kaiserin-Augusta-Str.|Ullsteinstr.|Westphalweg|Alt-Mariendorf"]},
  U7: {color:'#5d9dbb', routes:["Rathaus Spandau|Altstadt Spandau|Zitadelle|Haselhorst|Paulsternstr.|Rohrdamm|Siemensdamm|Halemweg|Jakob-Kaiser-Platz|Jungfernheide|Mierendorffplatz|Richard-Wagner-Platz|Bismarckstr.|Wilmersdorfer Str.|Adenauerplatz|Konstanzer Str.|Fehrbelliner Platz|Blissestr.|Berliner Str.|Bayerischer Platz|Eisenacher Str.|Kleistpark|Yorckstr.|Möckernbrücke|Mehringdamm|Gneisenaustr.|Südstern|Hermannplatz|Rathaus Neukölln|Karl-Marx-Str.|Neukölln|Grenzallee|Blaschkoallee|Parchimer Allee|Britz-Süd|Johannisthaler Chaussee|Lipschitzallee|Wutzkyallee|Zwickauer Damm|Rudow"]},
  U8: {color:'#52618f', routes:["Wittenau|Rathaus Reinickendorf|Karl-Bonhoeffer-Nervenklinik|Lindauer Allee|Paracelsus-Bad|Residenzstr.|Franz-Neumann-Platz|Osloer Str.|Pankstr.|Gesundbrunnen|Voltastr.|Bernauer Str.|Rosenthaler Platz|Weinmeisterstr.|Alexanderplatz|Jannowitzbrücke|Heinrich-Heine-Str.|Moritzplatz|Kottbusser Tor|Schönleinstr.|Hermannplatz|Boddinstr.|Leinestr.|Hermannstr."]},
  U9: {color:'#e49b46', routes:["Osloer Str.|Nauener Platz|Leopoldplatz|Amrumer Str.|Westhafen|Birkenstr.|Turmstr.|Hansaplatz|Zoologischer Garten|Kurfürstendamm|Spichernstr.|Güntzelstr.|Berliner Str.|Bundesplatz|Friedrich-Wilhelm-Platz|Walther-Schreiber-Platz|Schloßstr.|Rathaus Steglitz"]},
};

const BERLIN_ANCHORS = {
  "Warschauer Str.": [
    1770,
    780
  ],
  "Uhlandstr.": [
    710,
    740
  ],
  "Pankow": [
    1410,
    100
  ],
  "Alexanderplatz": [
    1450,
    490
  ],
  "Potsdamer Platz": [
    1150,
    720
  ],
  "Gleisdreieck": [
    1030,
    820
  ],
  "Wittenbergplatz": [
    850,
    780
  ],
  "Ruhleben": [
    210,
    820
  ],
  "Krumme Lanke": [
    190,
    1050
  ],
  "Nollendorfplatz": [
    890,
    830
  ],
  "Innsbrucker Platz": [
    790,
    1080
  ],
  "Hönow": [
    2070,
    300
  ],
  "Hauptbahnhof": [
    1120,
    450
  ],
  "Alt-Tegel": [340, 85],
  "Kurt-Schumacher-Platz": [
    870,
    140
  ],
  "Leopoldplatz": [
    1050,
    300
  ],
  "Friedrichstr.": [
    1190,
    540
  ],
  "Unter den Linden": [
    1240,
    600
  ],
  "Stadtmitte": [
    1250,
    720
  ],
  "Hallesches Tor": [
    1240,
    920
  ],
  "Mehringdamm": [
    1190,
    1030
  ],
  "Alt-Mariendorf": [
    1050,
    1420
  ],
  "Rathaus Spandau": [
    90,
    560
  ],
  "Bismarckstr.": [
    630,
    720
  ],
  "Fehrbelliner Platz": [
    580,
    880
  ],
  "Bayerischer Platz": [
    760,
    970
  ],
  "Möckernbrücke": [
    1100,
    910
  ],
  "Hermannplatz": [
    1480,
    1110
  ],
  "Rudow": [
    1780,
    1500
  ],
  "Wittenau": [
    960,
    90
  ],
  "Osloer Str.": [
    1180,
    230
  ],
  "Kottbusser Tor": [
    1460,
    970
  ],
  "Hermannstr.": [
    1490,
    1430
  ],
  "Zoologischer Garten": [
    740,
    690
  ],
  "Kurfürstendamm": [
    750,
    760
  ],
  "Spichernstr.": [
    690,
    840
  ],
  "Berliner Str.": [
    690,
    1030
  ],
  "Rathaus Steglitz": [
    470,
    1430
  ],
  "Frankfurter Allee": [
    1780,
    570
  ],
  "Frankfurter Tor": [
    1680,
    640
  ]
};
