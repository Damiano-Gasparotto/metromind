// Île-de-France Mobilités GTFS, downloaded October 2026.
// https://prim.iledefrance-mobilites.fr/en/jeux-de-donnees/offre-horaires-tc-gtfs-idfm
// Adjacent stops are derived from metro trip stop_times, then deduplicated.
// Original geographic projection; each two-stop route is one playable link.
const PARIS_LINES = {
  "M1": {
    "color": "#FFBE00",
    "routes": [
      "Argentine|Charles de Gaulle - Étoile",
      "Argentine|Porte Maillot",
      "Bastille|Gare de Lyon",
      "Bastille|Saint-Paul (Le Marais)",
      "Bérault|Château de Vincennes",
      "Bérault|Saint-Mandé",
      "Champs-Élysées - Clemenceau|Concorde",
      "Champs-Élysées - Clemenceau|Franklin D. Roosevelt",
      "Charles de Gaulle - Étoile|George V",
      "Châtelet|Hôtel de Ville",
      "Châtelet|Louvre - Rivoli",
      "Concorde|Tuileries",
      "Esplanade de la Défense|La Défense",
      "Esplanade de la Défense|Pont de Neuilly",
      "Franklin D. Roosevelt|George V",
      "Gare de Lyon|Reuilly - Diderot",
      "Hôtel de Ville|Saint-Paul (Le Marais)",
      "Les Sablons|Pont de Neuilly",
      "Les Sablons|Porte Maillot",
      "Louvre - Rivoli|Palais Royal - Musée du Louvre",
      "Nation|Porte de Vincennes",
      "Nation|Reuilly - Diderot",
      "Palais Royal - Musée du Louvre|Tuileries",
      "Porte de Vincennes|Saint-Mandé"
    ]
  },
  "M2": {
    "color": "#0055C8",
    "routes": [
      "Alexandre Dumas|Avron",
      "Alexandre Dumas|Philippe Auguste",
      "Anvers|Barbès - Rochechouart",
      "Anvers|Pigalle",
      "Avron|Nation",
      "Barbès - Rochechouart|La Chapelle",
      "Belleville|Colonel Fabien",
      "Belleville|Couronnes",
      "Blanche|Pigalle",
      "Blanche|Place de Clichy",
      "Charles de Gaulle - Étoile|Ternes",
      "Charles de Gaulle - Étoile|Victor Hugo",
      "Colonel Fabien|Jaurès",
      "Colonel Fabien|Stalingrad",
      "Courcelles|Monceau",
      "Courcelles|Ternes",
      "Couronnes|Ménilmontant",
      "Jaurès|Stalingrad",
      "La Chapelle|Stalingrad",
      "Monceau|Villiers",
      "Ménilmontant|Père Lachaise",
      "Philippe Auguste|Père Lachaise",
      "Place de Clichy|Rome",
      "Porte Dauphine|Victor Hugo",
      "Rome|Villiers"
    ]
  },
  "M3": {
    "color": "#6E6E00",
    "routes": [
      "Anatole France|Louise Michel",
      "Anatole France|Pont de Levallois - Bécon",
      "Arts et Métiers|Réaumur - Sébastopol",
      "Arts et Métiers|Temple",
      "Bourse|Quatre Septembre",
      "Bourse|Sentier",
      "Europe|Saint-Lazare",
      "Europe|Villiers",
      "Gallieni|Porte de Bagnolet",
      "Gambetta|Porte de Bagnolet",
      "Gambetta|Père Lachaise",
      "Havre-Caumartin|Opéra",
      "Havre-Caumartin|Saint-Lazare",
      "Louise Michel|Porte de Champerret",
      "Malesherbes|Villiers",
      "Malesherbes|Wagram",
      "Opéra|Quatre Septembre",
      "Parmentier|Rue Saint-Maur",
      "Parmentier|République",
      "Pereire|Porte de Champerret",
      "Pereire|Wagram",
      "Père Lachaise|Rue Saint-Maur",
      "Réaumur - Sébastopol|Sentier",
      "République|Temple"
    ]
  },
  "M3bis": {
    "color": "#82C8E6",
    "routes": [
      "Gambetta|Pelleport",
      "Pelleport|Saint-Fargeau",
      "Porte des Lilas|Saint-Fargeau"
    ]
  },
  "M4": {
    "color": "#A0006E",
    "routes": [
      "Alésia|Mouton-Duvernet",
      "Alésia|Porte d'Orléans",
      "Bagneux - Lucie Aubrac|Barbara",
      "Barbara|Mairie de Montrouge",
      "Barbès - Rochechouart|Château Rouge",
      "Barbès - Rochechouart|Gare du Nord",
      "Château Rouge|Marcadet - Poissonniers",
      "Château d'Eau|Gare de l'Est",
      "Château d'Eau|Strasbourg - Saint-Denis",
      "Châtelet|Cité",
      "Châtelet|Les Halles",
      "Cité|Saint-Michel",
      "Denfert-Rochereau|Mouton-Duvernet",
      "Denfert-Rochereau|Raspail",
      "Gare de l'Est|Gare du Nord",
      "Les Halles|Étienne Marcel",
      "Mairie de Montrouge|Porte d'Orléans",
      "Marcadet - Poissonniers|Simplon",
      "Montparnasse Bienvenue|Saint-Placide",
      "Montparnasse Bienvenue|Vavin",
      "Odéon|Saint-Germain-des-Prés",
      "Odéon|Saint-Michel",
      "Porte de Clignancourt|Simplon",
      "Raspail|Vavin",
      "Réaumur - Sébastopol|Strasbourg - Saint-Denis",
      "Réaumur - Sébastopol|Étienne Marcel",
      "Saint-Germain-des-Prés|Saint-Sulpice",
      "Saint-Placide|Saint-Sulpice"
    ]
  },
  "M5": {
    "color": "#FF5A00",
    "routes": [
      "Bastille|Bréguet-Sabin",
      "Bastille|Quai de la Rapée",
      "Bobigny - Pablo Picasso|Bobigny-Pantin - Raymond Queneau",
      "Bobigny-Pantin - Raymond Queneau|Église de Pantin",
      "Bréguet-Sabin|Richard-Lenoir",
      "Campo-Formio|Place d'Italie",
      "Campo-Formio|Saint-Marcel",
      "Gare d'Austerlitz|Quai de la Rapée",
      "Gare d'Austerlitz|Saint-Marcel",
      "Gare de l'Est|Gare du Nord",
      "Gare de l'Est|Jacques Bonsergent",
      "Gare du Nord|Stalingrad",
      "Hoche|Porte de Pantin",
      "Hoche|Église de Pantin",
      "Jacques Bonsergent|République",
      "Jaurès|Laumière",
      "Jaurès|Stalingrad",
      "Laumière|Ourcq",
      "Oberkampf|Richard-Lenoir",
      "Oberkampf|République",
      "Ourcq|Porte de Pantin"
    ]
  },
  "M6": {
    "color": "#82DC73",
    "routes": [
      "Bel-Air|Daumesnil",
      "Bel-Air|Picpus",
      "Bercy|Dugommier",
      "Bercy|Quai de la Gare",
      "Bir-Hakeim|Dupleix",
      "Bir-Hakeim|Passy",
      "Boissière|Kléber",
      "Boissière|Trocadéro",
      "Cambronne|La Motte-Picquet - Grenelle",
      "Cambronne|Sèvres-Lecourbe",
      "Charles de Gaulle - Étoile|Kléber",
      "Chevaleret|Nationale",
      "Chevaleret|Quai de la Gare",
      "Corvisart|Glacière",
      "Corvisart|Place d'Italie",
      "Daumesnil|Dugommier",
      "Denfert-Rochereau|Raspail",
      "Denfert-Rochereau|Saint-Jacques",
      "Dupleix|La Motte-Picquet - Grenelle",
      "Edgar Quinet|Montparnasse Bienvenue",
      "Edgar Quinet|Raspail",
      "Glacière|Saint-Jacques",
      "Montparnasse Bienvenue|Pasteur",
      "Nation|Picpus",
      "Nationale|Place d'Italie",
      "Passy|Trocadéro",
      "Pasteur|Sèvres-Lecourbe"
    ]
  },
  "M7": {
    "color": "#FF82B4",
    "routes": [
      "Aubervilliers - Pantin - Quatre Chemins|Fort d'Aubervilliers",
      "Aubervilliers - Pantin - Quatre Chemins|Porte de la Villette",
      "Cadet|Le Peletier",
      "Cadet|Poissonnière",
      "Censier - Daubenton|Les Gobelins",
      "Censier - Daubenton|Place Monge",
      "Chaussée d'Antin - La Fayette|Le Peletier",
      "Chaussée d'Antin - La Fayette|Opéra",
      "Château Landon|Gare de l'Est",
      "Château Landon|Louis Blanc",
      "Châtelet|Pont Marie (Cité des Arts)",
      "Châtelet|Pont Neuf",
      "Corentin Cariou|Crimée",
      "Corentin Cariou|Porte de la Villette",
      "Crimée|Riquet",
      "Fort d'Aubervilliers|La Courneuve - 8 Mai 1945",
      "Gare de l'Est|Poissonnière",
      "Jussieu|Place Monge",
      "Jussieu|Sully - Morland",
      "Le Kremlin-Bicêtre|Maison Blanche",
      "Le Kremlin-Bicêtre|Villejuif Léo Lagrange",
      "Les Gobelins|Place d'Italie",
      "Louis Blanc|Stalingrad",
      "Mairie d'Ivry|Pierre et Marie Curie",
      "Maison Blanche|Porte d'Italie",
      "Maison Blanche|Tolbiac",
      "Opéra|Pyramides",
      "Palais Royal - Musée du Louvre|Pont Neuf",
      "Palais Royal - Musée du Louvre|Pyramides",
      "Pierre et Marie Curie|Porte d'Ivry",
      "Place d'Italie|Tolbiac",
      "Pont Marie (Cité des Arts)|Sully - Morland",
      "Porte d'Italie|Porte de Choisy",
      "Porte d'Ivry|Porte de Choisy",
      "Riquet|Stalingrad",
      "Villejuif - Louis Aragon|Villejuif Paul Vaillant-Couturier",
      "Villejuif Léo Lagrange|Villejuif Paul Vaillant-Couturier"
    ]
  },
  "M7bis": {
    "color": "#82DC73",
    "routes": [
      "Bolivar|Buttes Chaumont",
      "Bolivar|Jaurès",
      "Botzaris|Buttes Chaumont",
      "Botzaris|Danube",
      "Botzaris|Place des Fêtes",
      "Danube|Pré-Saint-Gervais",
      "Jaurès|Louis Blanc",
      "Place des Fêtes|Pré-Saint-Gervais"
    ]
  },
  "M8": {
    "color": "#D282BE",
    "routes": [
      "Balard|Lourmel",
      "Bastille|Chemin Vert",
      "Bastille|Ledru-Rollin",
      "Bonne Nouvelle|Grands Boulevards",
      "Bonne Nouvelle|Strasbourg - Saint-Denis",
      "Boucicaut|Félix Faure",
      "Boucicaut|Lourmel",
      "Charenton - Écoles|Liberté",
      "Charenton - Écoles|École Vétérinaire de Maisons-Alfort",
      "Chemin Vert|Saint-Sébastien - Froissart",
      "Commerce|Félix Faure",
      "Commerce|La Motte-Picquet - Grenelle",
      "Concorde|Invalides",
      "Concorde|Madeleine",
      "Créteil - L'Échat|Créteil - Université",
      "Créteil - L'Échat|Maisons-Alfort - Les Juilliottes",
      "Créteil - Préfecture|Créteil - Université",
      "Créteil - Préfecture|Pointe du Lac",
      "Daumesnil|Michel Bizot",
      "Daumesnil|Montgallet",
      "Faidherbe - Chaligny|Ledru-Rollin",
      "Faidherbe - Chaligny|Reuilly - Diderot",
      "Filles du Calvaire|République",
      "Filles du Calvaire|Saint-Sébastien - Froissart",
      "Grands Boulevards|Richelieu - Drouot",
      "Invalides|La Tour-Maubourg",
      "La Motte-Picquet - Grenelle|École Militaire",
      "La Tour-Maubourg|École Militaire",
      "Liberté|Porte de Charenton",
      "Madeleine|Opéra",
      "Maisons-Alfort - Les Juilliottes|Maisons-Alfort - Stade",
      "Maisons-Alfort - Stade|École Vétérinaire de Maisons-Alfort",
      "Michel Bizot|Porte Dorée",
      "Montgallet|Reuilly - Diderot",
      "Opéra|Richelieu - Drouot",
      "Porte Dorée|Porte de Charenton",
      "République|Strasbourg - Saint-Denis"
    ]
  },
  "M9": {
    "color": "#D2D200",
    "routes": [
      "Alma - Marceau|Franklin D. Roosevelt",
      "Alma - Marceau|Iéna",
      "Billancourt|Marcel Sembat",
      "Billancourt|Pont de Sèvres",
      "Bonne Nouvelle|Grands Boulevards",
      "Bonne Nouvelle|Strasbourg - Saint-Denis",
      "Buzenval|Maraîchers",
      "Buzenval|Nation",
      "Charonne|Rue des Boulets",
      "Charonne|Voltaire",
      "Chaussée d'Antin - La Fayette|Havre-Caumartin",
      "Chaussée d'Antin - La Fayette|Richelieu - Drouot",
      "Croix de Chavaux|Mairie de Montreuil",
      "Croix de Chavaux|Robespierre",
      "Exelmans|Michel-Ange - Molitor",
      "Exelmans|Porte de Saint-Cloud",
      "Franklin D. Roosevelt|Saint-Philippe-du-Roule",
      "Grands Boulevards|Richelieu - Drouot",
      "Havre-Caumartin|Saint-Augustin",
      "Iéna|Trocadéro",
      "Jasmin|Michel-Ange - Auteuil",
      "Jasmin|Ranelagh",
      "La Muette|Ranelagh",
      "La Muette|Rue de la Pompe",
      "Mairie de Montreuil|Porte de Montreuil",
      "Maraîchers|Porte de Montreuil",
      "Marcel Sembat|Porte de Saint-Cloud",
      "Michel-Ange - Auteuil|Michel-Ange - Molitor",
      "Miromesnil|Saint-Augustin",
      "Miromesnil|Saint-Philippe-du-Roule",
      "Nation|Rue des Boulets",
      "Oberkampf|République",
      "Oberkampf|Saint-Ambroise",
      "Pont de Sèvres|Porte de Saint-Cloud",
      "Porte de Montreuil|Robespierre",
      "Rue de la Pompe|Trocadéro",
      "République|Strasbourg - Saint-Denis",
      "Saint-Ambroise|Voltaire"
    ]
  },
  "M10": {
    "color": "#DC9600",
    "routes": [
      "Avenue Émile Zola|Charles Michels",
      "Avenue Émile Zola|La Motte-Picquet - Grenelle",
      "Boulogne Jean Jaurès|Boulogne Pont de Saint-Cloud",
      "Boulogne Jean Jaurès|Michel-Ange - Molitor",
      "Boulogne Jean Jaurès|Porte d'Auteuil",
      "Cardinal Lemoine|Jussieu",
      "Cardinal Lemoine|Maubert - Mutualité",
      "Chardon Lagache|Michel-Ange - Molitor",
      "Chardon Lagache|Mirabeau",
      "Charles Michels|Javel - André Citroën",
      "Cluny - La Sorbonne|Maubert - Mutualité",
      "Cluny - La Sorbonne|Odéon",
      "Duroc|Ségur",
      "Duroc|Vaneau",
      "Gare d'Austerlitz|Jussieu",
      "Javel - André Citroën|Mirabeau",
      "Javel - André Citroën|Église d'Auteuil",
      "La Motte-Picquet - Grenelle|Ségur",
      "Mabillon|Odéon",
      "Mabillon|Sèvres - Babylone",
      "Michel-Ange - Auteuil|Porte d'Auteuil",
      "Michel-Ange - Auteuil|Église d'Auteuil",
      "Michel-Ange - Molitor|Porte d'Auteuil",
      "Sèvres - Babylone|Vaneau"
    ]
  },
  "M11": {
    "color": "#6E491E",
    "routes": [
      "Arts et Métiers|Rambuteau",
      "Arts et Métiers|République",
      "Belleville|Goncourt",
      "Belleville|Pyrénées",
      "Châtelet|Hôtel de Ville",
      "Coteaux Beauclair|La Dhuys",
      "Coteaux Beauclair|Rosny-Bois-Perrier",
      "Goncourt|République",
      "Hôtel de Ville|Rambuteau",
      "Jourdain|Place des Fêtes",
      "Jourdain|Pyrénées",
      "La Dhuys|Montreuil - Hôpital",
      "Mairie des Lilas|Porte des Lilas",
      "Mairie des Lilas|Serge Gainsbourg",
      "Montreuil - Hôpital|Romainville - Carnot",
      "Place des Fêtes|Télégraphe",
      "Porte des Lilas|Télégraphe",
      "Romainville - Carnot|Serge Gainsbourg"
    ]
  },
  "M12": {
    "color": "#00643C",
    "routes": [
      "Abbesses|Lamarck - Caulaincourt",
      "Abbesses|Pigalle",
      "Aimé Césaire|Front Populaire",
      "Aimé Césaire|Mairie d'Aubervilliers",
      "Assemblée Nationale|Concorde",
      "Assemblée Nationale|Solférino",
      "Concorde|Madeleine",
      "Convention|Porte de Versailles",
      "Convention|Vaugirard",
      "Corentin Celton|Mairie d'Issy",
      "Corentin Celton|Porte de Versailles",
      "Falguière|Montparnasse Bienvenue",
      "Falguière|Pasteur",
      "Front Populaire|Porte de la Chapelle",
      "Jules Joffrin|Lamarck - Caulaincourt",
      "Jules Joffrin|Marcadet - Poissonniers",
      "Madeleine|Saint-Lazare",
      "Marcadet - Poissonniers|Marx Dormoy",
      "Marx Dormoy|Porte de la Chapelle",
      "Montparnasse Bienvenue|Notre-Dame-des-Champs",
      "Notre-Dame-de-Lorette|Saint-Georges",
      "Notre-Dame-de-Lorette|Trinité - d'Estienne d'Orves",
      "Notre-Dame-des-Champs|Rennes",
      "Pasteur|Volontaires",
      "Pigalle|Saint-Georges",
      "Rennes|Sèvres - Babylone",
      "Rue du Bac|Solférino",
      "Rue du Bac|Sèvres - Babylone",
      "Saint-Lazare|Trinité - d'Estienne d'Orves",
      "Vaugirard|Volontaires"
    ]
  },
  "M13": {
    "color": "#82C8E6",
    "routes": [
      "Asnières - Gennevilliers - Les Courtilles|Les Agnettes",
      "Basilique de Saint-Denis|Saint-Denis - Porte de Paris",
      "Basilique de Saint-Denis|Saint-Denis - Université",
      "Brochant|La Fourche",
      "Brochant|Porte de Clichy",
      "Carrefour Pleyel|Mairie de Saint-Ouen",
      "Carrefour Pleyel|Saint-Denis - Porte de Paris",
      "Champs-Élysées - Clemenceau|Invalides",
      "Champs-Élysées - Clemenceau|Miromesnil",
      "Châtillon - Montrouge|Malakoff - Rue Étienne Dolet",
      "Duroc|Montparnasse Bienvenue",
      "Duroc|Saint-François-Xavier",
      "Gabriel Péri|Les Agnettes",
      "Gabriel Péri|Mairie de Clichy",
      "Garibaldi|Mairie de Saint-Ouen",
      "Garibaldi|Porte de Saint-Ouen",
      "Gaîté|Montparnasse Bienvenue",
      "Gaîté|Pernety",
      "Guy Môquet|La Fourche",
      "Guy Môquet|Porte de Saint-Ouen",
      "Invalides|Varenne",
      "La Fourche|Place de Clichy",
      "Liège|Place de Clichy",
      "Liège|Saint-Lazare",
      "Mairie de Clichy|Porte de Clichy",
      "Malakoff - Plateau de Vanves|Malakoff - Rue Étienne Dolet",
      "Malakoff - Plateau de Vanves|Porte de Vanves",
      "Miromesnil|Saint-Lazare",
      "Pernety|Plaisance",
      "Plaisance|Porte de Vanves",
      "Saint-François-Xavier|Varenne"
    ]
  },
  "M14": {
    "color": "#640082",
    "routes": [
      "Aéroport d'Orly|Thiais - Orly (Pont de Rungis)",
      "Bercy|Cour Saint-Emilion",
      "Bercy|Gare de Lyon",
      "Bibliothèque François Mitterrand|Cour Saint-Emilion",
      "Bibliothèque François Mitterrand|Olympiades",
      "Chevilly-Larue (Marché International)|L'Haÿ-les-Roses",
      "Chevilly-Larue (Marché International)|Thiais - Orly (Pont de Rungis)",
      "Châtelet|Gare de Lyon",
      "Châtelet|Pyramides",
      "Hôpital Bicêtre|Maison Blanche",
      "Hôpital Bicêtre|Villejuif - Gustave Roussy",
      "L'Haÿ-les-Roses|Villejuif - Gustave Roussy",
      "Madeleine|Pyramides",
      "Madeleine|Saint-Lazare",
      "Mairie de Saint-Ouen|Saint-Denis - Pleyel",
      "Mairie de Saint-Ouen|Saint-Ouen",
      "Maison Blanche|Olympiades",
      "Pont Cardinet|Porte de Clichy",
      "Pont Cardinet|Saint-Lazare",
      "Porte de Clichy|Saint-Ouen"
    ]
  }
};

const PARIS_ANCHORS = {
  "Gambetta": [
    1771,
    777
  ],
  "Pelleport": [
    1805,
    750
  ],
  "Saint-Fargeau": [
    1834,
    720
  ],
  "Porte des Lilas": [
    1858,
    676
  ],
  "Château de Vincennes": [
    2175,
    951
  ],
  "Bérault": [
    2078,
    943
  ],
  "Saint-Mandé": [
    1979,
    936
  ],
  "Porte de Vincennes": [
    1870,
    928
  ],
  "Nation": [
    1751,
    921
  ],
  "Reuilly - Diderot": [
    1649,
    929
  ],
  "Gare de Lyon": [
    1529,
    948
  ],
  "Bastille": [
    1482,
    882
  ],
  "Saint-Paul (Le Marais)": [
    1403,
    860
  ],
  "Hôtel de Ville": [
    1320,
    843
  ],
  "Châtelet": [
    1268,
    831
  ],
  "Louvre - Rivoli": [
    1197,
    810
  ],
  "Palais Royal - Musée du Louvre": [
    1154,
    796
  ],
  "Tuileries": [
    1087,
    780
  ],
  "Concorde": [
    1033,
    767
  ],
  "Champs-Élysées - Clemenceau": [
    939,
    756
  ],
  "Franklin D. Roosevelt": [
    895,
    744
  ],
  "George V": [
    802,
    717
  ],
  "Charles de Gaulle - Étoile": [
    755,
    695
  ],
  "Argentine": [
    701,
    689
  ],
  "Porte Maillot": [
    624,
    669
  ],
  "Les Sablons": [
    524,
    641
  ],
  "Pont de Neuilly": [
    409,
    610
  ],
  "Esplanade de la Défense": [
    303,
    581
  ],
  "La Défense": [
    174,
    546
  ],
  "Gallieni": [
    1949,
    775
  ],
  "Porte de Bagnolet": [
    1878,
    782
  ],
  "Père Lachaise": [
    1666,
    799
  ],
  "Rue Saint-Maur": [
    1597,
    785
  ],
  "Parmentier": [
    1540,
    776
  ],
  "République": [
    1432,
    756
  ],
  "Temple": [
    1409,
    763
  ],
  "Arts et Métiers": [
    1360,
    773
  ],
  "Réaumur - Sébastopol": [
    1317,
    767
  ],
  "Sentier": [
    1270,
    758
  ],
  "Bourse": [
    1202,
    745
  ],
  "Quatre Septembre": [
    1160,
    738
  ],
  "Opéra": [
    1116,
    729
  ],
  "Havre-Caumartin": [
    1072,
    704
  ],
  "Saint-Lazare": [
    1049,
    688
  ],
  "Europe": [
    1019,
    660
  ],
  "Villiers": [
    955,
    639
  ],
  "Malesherbes": [
    892,
    626
  ],
  "Wagram": [
    845,
    617
  ],
  "Pereire": [
    776,
    608
  ],
  "Porte de Champerret": [
    719,
    601
  ],
  "Louise Michel": [
    682,
    578
  ],
  "Anatole France": [
    649,
    546
  ],
  "Pont de Levallois - Bécon": [
    605,
    504
  ],
  "Porte de Clignancourt": [
    1242,
    501
  ],
  "Simplon": [
    1273,
    532
  ],
  "Marcadet - Poissonniers": [
    1293,
    553
  ],
  "Château Rouge": [
    1290,
    589
  ],
  "Barbès - Rochechouart": [
    1297,
    619
  ],
  "Gare du Nord": [
    1365,
    653
  ],
  "Gare de l'Est": [
    1374,
    682
  ],
  "Château d'Eau": [
    1356,
    712
  ],
  "Strasbourg - Saint-Denis": [
    1333,
    739
  ],
  "Étienne Marcel": [
    1284,
    788
  ],
  "Les Halles": [
    1254,
    797
  ],
  "Cité": [
    1268,
    863
  ],
  "Saint-Michel": [
    1233,
    876
  ],
  "Odéon": [
    1197,
    886
  ],
  "Saint-Germain-des-Prés": [
    1136,
    874
  ],
  "Saint-Sulpice": [
    1105,
    894
  ],
  "Saint-Placide": [
    1067,
    930
  ],
  "Montparnasse Bienvenue": [
    1022,
    965
  ],
  "Vavin": [
    1087,
    972
  ],
  "Raspail": [
    1103,
    998
  ],
  "Denfert-Rochereau": [
    1121,
    1040
  ],
  "Mouton-Duvernet": [
    1095,
    1063
  ],
  "Alésia": [
    1068,
    1090
  ],
  "Porte d'Orléans": [
    1052,
    1131
  ],
  "Mairie de Montrouge": [
    993,
    1173
  ],
  "Barbara": [
    972,
    1247
  ],
  "Bagneux - Lucie Aubrac": [
    974,
    1300
  ],
  "La Courneuve - 8 Mai 1945": [
    1891,
    307
  ],
  "Fort d'Aubervilliers": [
    1832,
    354
  ],
  "Aubervilliers - Pantin - Quatre Chemins": [
    1713,
    448
  ],
  "Porte de la Villette": [
    1650,
    498
  ],
  "Corentin Cariou": [
    1615,
    525
  ],
  "Crimée": [
    1563,
    558
  ],
  "Riquet": [
    1527,
    582
  ],
  "Stalingrad": [
    1466,
    614
  ],
  "Louis Blanc": [
    1439,
    641
  ],
  "Château Landon": [
    1414,
    662
  ],
  "Poissonnière": [
    1281,
    675
  ],
  "Cadet": [
    1241,
    684
  ],
  "Le Peletier": [
    1197,
    693
  ],
  "Chaussée d'Antin - La Fayette": [
    1134,
    709
  ],
  "Pyramides": [
    1140,
    771
  ],
  "Pont Neuf": [
    1213,
    833
  ],
  "Pont Marie (Cité des Arts)": [
    1367,
    875
  ],
  "Sully - Morland": [
    1412,
    893
  ],
  "Jussieu": [
    1343,
    939
  ],
  "Place Monge": [
    1315,
    967
  ],
  "Censier - Daubenton": [
    1310,
    988
  ],
  "Les Gobelins": [
    1321,
    1025
  ],
  "Place d'Italie": [
    1352,
    1065
  ],
  "Tolbiac": [
    1366,
    1108
  ],
  "Maison Blanche": [
    1383,
    1145
  ],
  "Porte d'Italie": [
    1389,
    1168
  ],
  "Porte de Choisy": [
    1440,
    1159
  ],
  "Porte d'Ivry": [
    1487,
    1148
  ],
  "Pierre et Marie Curie": [
    1566,
    1195
  ],
  "Mairie d'Ivry": [
    1627,
    1235
  ],
  "Le Kremlin-Bicêtre": [
    1416,
    1242
  ],
  "Villejuif Léo Lagrange": [
    1434,
    1293
  ],
  "Villejuif Paul Vaillant-Couturier": [
    1476,
    1361
  ],
  "Villejuif - Louis Aragon": [
    1471,
    1436
  ],
  "La Motte-Picquet - Grenelle": [
    786,
    912
  ],
  "École Militaire": [
    863,
    863
  ],
  "La Tour-Maubourg": [
    902,
    840
  ],
  "Invalides": [
    942,
    817
  ],
  "Madeleine": [
    1057,
    733
  ],
  "Richelieu - Drouot": [
    1183,
    718
  ],
  "Grands Boulevards": [
    1226,
    722
  ],
  "Bonne Nouvelle": [
    1282,
    730
  ],
  "Filles du Calvaire": [
    1460,
    794
  ],
  "Saint-Sébastien - Froissart": [
    1466,
    812
  ],
  "Chemin Vert": [
    1475,
    845
  ],
  "Ledru-Rollin": [
    1553,
    894
  ],
  "Faidherbe - Chaligny": [
    1632,
    904
  ],
  "Montgallet": [
    1696,
    956
  ],
  "Daumesnil": [
    1750,
    994
  ],
  "Michel Bizot": [
    1814,
    1015
  ],
  "Porte Dorée": [
    1848,
    1032
  ],
  "Porte de Charenton": [
    1815,
    1045
  ],
  "Liberté": [
    1855,
    1108
  ],
  "Charenton - Écoles": [
    1928,
    1148
  ],
  "École Vétérinaire de Maisons-Alfort": [
    2012,
    1204
  ],
  "Maisons-Alfort - Stade": [
    2137,
    1254
  ],
  "Maisons-Alfort - Les Juilliottes": [
    2246,
    1303
  ],
  "Créteil - L'Échat": [
    2281,
    1359
  ],
  "Créteil - Université": [
    2292,
    1416
  ],
  "Créteil - Préfecture": [
    2380,
    1501
  ],
  "Pointe du Lac": [
    2429,
    1596
  ],
  "Balard": [
    585,
    1019
  ],
  "Lourmel": [
    619,
    1002
  ],
  "Boucicaut": [
    678,
    981
  ],
  "Félix Faure": [
    717,
    967
  ],
  "Commerce": [
    736,
    952
  ],
  "Pont de Sèvres": [
    109,
    1078
  ],
  "Billancourt": [
    183,
    1059
  ],
  "Marcel Sembat": [
    238,
    1043
  ],
  "Porte de Saint-Cloud": [
    373,
    1008
  ],
  "Exelmans": [
    398,
    969
  ],
  "Michel-Ange - Molitor": [
    417,
    949
  ],
  "Michel-Ange - Auteuil": [
    440,
    924
  ],
  "Jasmin": [
    482,
    884
  ],
  "Ranelagh": [
    501,
    859
  ],
  "La Muette": [
    542,
    836
  ],
  "Rue de la Pompe": [
    579,
    786
  ],
  "Trocadéro": [
    671,
    792
  ],
  "Iéna": [
    738,
    780
  ],
  "Alma - Marceau": [
    810,
    780
  ],
  "Saint-Philippe-du-Roule": [
    898,
    718
  ],
  "Miromesnil": [
    945,
    705
  ],
  "Saint-Augustin": [
    1007,
    696
  ],
  "Oberkampf": [
    1477,
    780
  ],
  "Saint-Ambroise": [
    1532,
    808
  ],
  "Voltaire": [
    1593,
    838
  ],
  "Charonne": [
    1641,
    862
  ],
  "Rue des Boulets": [
    1684,
    885
  ],
  "Buzenval": [
    1802,
    890
  ],
  "Maraîchers": [
    1851,
    882
  ],
  "Porte de Montreuil": [
    1897,
    875
  ],
  "Robespierre": [
    2018,
    856
  ],
  "Croix de Chavaux": [
    2146,
    837
  ],
  "Mairie de Montreuil": [
    2203,
    800
  ],
  "Porte d'Auteuil": [
    386,
    922
  ],
  "Boulogne Jean Jaurès": [
    196,
    972
  ],
  "Boulogne Pont de Saint-Cloud": [
    90,
    984
  ],
  "Chardon Lagache": [
    470,
    947
  ],
  "Mirabeau": [
    531,
    930
  ],
  "Javel - André Citroën": [
    578,
    938
  ],
  "Charles Michels": [
    656,
    935
  ],
  "Avenue Émile Zola": [
    746,
    931
  ],
  "Ségur": [
    868,
    928
  ],
  "Duroc": [
    958,
    927
  ],
  "Vaneau": [
    1011,
    915
  ],
  "Sèvres - Babylone": [
    1062,
    892
  ],
  "Mabillon": [
    1146,
    880
  ],
  "Cluny - La Sorbonne": [
    1244,
    897
  ],
  "Maubert - Mutualité": [
    1275,
    904
  ],
  "Cardinal Lemoine": [
    1308,
    933
  ],
  "Gare d'Austerlitz": [
    1445,
    970
  ],
  "Église d'Auteuil": [
    493,
    929
  ],
  "Romainville - Carnot": [
    2194,
    619
  ],
  "Serge Gainsbourg": [
    2061,
    638
  ],
  "Mairie des Lilas": [
    1953,
    652
  ],
  "Télégraphe": [
    1776,
    688
  ],
  "Place des Fêtes": [
    1724,
    676
  ],
  "Jourdain": [
    1687,
    691
  ],
  "Pyrénées": [
    1643,
    702
  ],
  "Belleville": [
    1559,
    717
  ],
  "Goncourt": [
    1502,
    736
  ],
  "Rambuteau": [
    1327,
    810
  ],
  "Rosny-Bois-Perrier": [
    2590,
    625
  ],
  "Coteaux Beauclair": [
    2460,
    630
  ],
  "La Dhuys": [
    2440,
    667
  ],
  "Montreuil - Hôpital": [
    2332,
    664
  ],
  "Porte de Versailles": [
    680,
    1054
  ],
  "Convention": [
    763,
    1014
  ],
  "Vaugirard": [
    809,
    994
  ],
  "Volontaires": [
    875,
    977
  ],
  "Pasteur": [
    925,
    967
  ],
  "Falguière": [
    972,
    953
  ],
  "Notre-Dame-des-Champs": [
    1083,
    947
  ],
  "Rennes": [
    1075,
    920
  ],
  "Rue du Bac": [
    1053,
    855
  ],
  "Solférino": [
    1028,
    832
  ],
  "Assemblée Nationale": [
    1003,
    811
  ],
  "Trinité - d'Estienne d'Orves": [
    1129,
    681
  ],
  "Notre-Dame-de-Lorette": [
    1173,
    683
  ],
  "Saint-Georges": [
    1171,
    663
  ],
  "Pigalle": [
    1174,
    631
  ],
  "Abbesses": [
    1179,
    612
  ],
  "Lamarck - Caulaincourt": [
    1181,
    567
  ],
  "Jules Joffrin": [
    1241,
    544
  ],
  "Marx Dormoy": [
    1393,
    560
  ],
  "Porte de la Chapelle": [
    1387,
    503
  ],
  "Front Populaire": [
    1452,
    424
  ],
  "Aimé Césaire": [
    1572,
    409
  ],
  "Mairie d'Aubervilliers": [
    1599,
    364
  ],
  "Mairie d'Issy": [
    537,
    1123
  ],
  "Corentin Celton": [
    590,
    1102
  ],
  "Pré-Saint-Gervais": [
    1777,
    648
  ],
  "Danube": [
    1724,
    633
  ],
  "Botzaris": [
    1678,
    654
  ],
  "Buttes Chaumont": [
    1606,
    663
  ],
  "Bolivar": [
    1534,
    643
  ],
  "Jaurès": [
    1501,
    630
  ],
  "Saint-Denis - Pleyel": [
    1253,
    331
  ],
  "Mairie de Saint-Ouen": [
    1137,
    373
  ],
  "Saint-Ouen": [
    1017,
    440
  ],
  "Porte de Clichy": [
    927,
    523
  ],
  "Pont Cardinet": [
    952,
    572
  ],
  "Bercy": [
    1592,
    992
  ],
  "Cour Saint-Emilion": [
    1657,
    1047
  ],
  "Bibliothèque François Mitterrand": [
    1555,
    1073
  ],
  "Olympiades": [
    1464,
    1099
  ],
  "Hôpital Bicêtre": [
    1294,
    1245
  ],
  "Villejuif - Gustave Roussy": [
    1288,
    1387
  ],
  "L'Haÿ-les-Roses": [
    1336,
    1538
  ],
  "Chevilly-Larue (Marché International)": [
    1459,
    1681
  ],
  "Thiais - Orly (Pont de Rungis)": [
    1521,
    1779
  ],
  "Aéroport d'Orly": [
    1419,
    1940
  ],
  "Asnières - Gennevilliers - Les Courtilles": [
    641,
    218
  ],
  "Les Agnettes": [
    663,
    284
  ],
  "Gabriel Péri": [
    743,
    339
  ],
  "Mairie de Clichy": [
    851,
    446
  ],
  "Brochant": [
    998,
    560
  ],
  "La Fourche": [
    1055,
    591
  ],
  "Place de Clichy": [
    1073,
    620
  ],
  "Liège": [
    1067,
    653
  ],
  "Varenne": [
    947,
    850
  ],
  "Saint-François-Xavier": [
    942,
    888
  ],
  "Gaîté": [
    1021,
    1000
  ],
  "Pernety": [
    977,
    1042
  ],
  "Plaisance": [
    937,
    1060
  ],
  "Porte de Vanves": [
    846,
    1097
  ],
  "Malakoff - Plateau de Vanves": [
    781,
    1141
  ],
  "Malakoff - Rue Étienne Dolet": [
    770,
    1200
  ],
  "Châtillon - Montrouge": [
    815,
    1239
  ],
  "Saint-Denis - Université": [
    1439,
    90
  ],
  "Basilique de Saint-Denis": [
    1387,
    169
  ],
  "Saint-Denis - Porte de Paris": [
    1356,
    225
  ],
  "Carrefour Pleyel": [
    1221,
    318
  ],
  "Garibaldi": [
    1111,
    435
  ],
  "Porte de Saint-Ouen": [
    1086,
    501
  ],
  "Guy Môquet": [
    1072,
    539
  ],
  "Kléber": [
    732,
    724
  ],
  "Boissière": [
    700,
    762
  ],
  "Passy": [
    658,
    841
  ],
  "Bir-Hakeim": [
    693,
    872
  ],
  "Dupleix": [
    735,
    901
  ],
  "Cambronne": [
    828,
    926
  ],
  "Sèvres-Lecourbe": [
    893,
    942
  ],
  "Edgar Quinet": [
    1052,
    982
  ],
  "Saint-Jacques": [
    1167,
    1050
  ],
  "Glacière": [
    1230,
    1065
  ],
  "Corvisart": [
    1299,
    1077
  ],
  "Nationale": [
    1422,
    1048
  ],
  "Chevaleret": [
    1474,
    1033
  ],
  "Quai de la Gare": [
    1521,
    1015
  ],
  "Dugommier": [
    1690,
    998
  ],
  "Bel-Air": [
    1800,
    978
  ],
  "Picpus": [
    1803,
    947
  ],
  "Campo-Formio": [
    1380,
    1028
  ],
  "Saint-Marcel": [
    1401,
    1003
  ],
  "Quai de la Rapée": [
    1453,
    935
  ],
  "Bréguet-Sabin": [
    1495,
    852
  ],
  "Richard-Lenoir": [
    1512,
    821
  ],
  "Jacques Bonsergent": [
    1405,
    729
  ],
  "Laumière": [
    1586,
    606
  ],
  "Ourcq": [
    1658,
    590
  ],
  "Porte de Pantin": [
    1711,
    578
  ],
  "Hoche": [
    1822,
    553
  ],
  "Église de Pantin": [
    1921,
    538
  ],
  "Bobigny-Pantin - Raymond Queneau": [
    2052,
    517
  ],
  "Bobigny - Pablo Picasso": [
    2279,
    426
  ],
  "Colonel Fabien": [
    1498,
    670
  ],
  "La Chapelle": [
    1398,
    612
  ],
  "Anvers": [
    1237,
    625
  ],
  "Blanche": [
    1121,
    618
  ],
  "Rome": [
    1011,
    630
  ],
  "Monceau": [
    892,
    645
  ],
  "Courcelles": [
    831,
    656
  ],
  "Ternes": [
    780,
    665
  ],
  "Victor Hugo": [
    660,
    735
  ],
  "Porte Dauphine": [
    577,
    722
  ],
  "Avron": [
    1771,
    889
  ],
  "Alexandre Dumas": [
    1740,
    854
  ],
  "Philippe Auguste": [
    1697,
    836
  ],
  "Ménilmontant": [
    1629,
    766
  ],
  "Couronnes": [
    1596,
    741
  ]
};
