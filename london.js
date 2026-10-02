// TfL Unified API, Route/Sequence/outbound for all 11 Tube lines.
// https://api.tfl.gov.uk/
// Positions are a simplified geographic projection; links come from route sequences.
const LONDON_LINES = {
  "Bakerloo": {
    "color": "#B36305",
    "routes": [
      "Elephant & Castle|Lambeth North|Waterloo|Embankment|Charing Cross|Piccadilly Circus|Oxford Circus|Regent's Park|Baker Street|Marylebone|Edgware Road (Bakerloo)|Paddington|Warwick Avenue|Maida Vale|Kilburn Park|Queen's Park|Kensal Green|Willesden Junction|Harlesden|Stonebridge Park|Wembley Central|North Wembley|South Kenton|Kenton|Harrow & Wealdstone"
    ]
  },
  "Central": {
    "color": "#E32017",
    "routes": [
      "West Ruislip|Ruislip Gardens|South Ruislip|Northolt|Greenford|Perivale|Hanger Lane|North Acton",
      "North Acton|East Acton|White City|Shepherd's Bush (Central)|Holland Park|Notting Hill Gate|Queensway|Lancaster Gate|Marble Arch|Bond Street|Oxford Circus|Tottenham Court Road|Holborn|Chancery Lane|St. Paul's|Bank|Liverpool Street|Bethnal Green|Mile End|Stratford|Leyton|Leytonstone",
      "Leytonstone|Snaresbrook|South Woodford|Woodford",
      "Woodford|Buckhurst Hill|Loughton|Debden|Theydon Bois|Epping",
      "Leytonstone|Wanstead|Redbridge|Gants Hill|Newbury Park|Barkingside|Fairlop|Hainault",
      "Woodford|Roding Valley|Chigwell|Grange Hill|Hainault",
      "Ealing Broadway|West Acton|North Acton"
    ]
  },
  "Circle": {
    "color": "#FFD300",
    "routes": [
      "Hammersmith (H&C Line)|Goldhawk Road|Shepherd's Bush Market|Wood Lane|Latimer Road|Ladbroke Grove|Westbourne Park|Royal Oak|Paddington (H&C Line)-Underground|Edgware Road (Circle Line)",
      "Edgware Road (Circle Line)|Baker Street|Great Portland Street|Euston Square|King's Cross St. Pancras|Farringdon|Barbican|Moorgate|Liverpool Street|Aldgate|Tower Hill|Monument|Cannon Street|Mansion House|Blackfriars|Temple|Embankment|Westminster|St. James's Park|Victoria|Sloane Square|South Kensington|Gloucester Road|High Street Kensington|Notting Hill Gate|Bayswater|Paddington|Edgware Road (Circle Line)"
    ]
  },
  "District": {
    "color": "#00782A",
    "routes": [
      "Ealing Broadway|Ealing Common|Acton Town|Chiswick Park|Turnham Green",
      "Turnham Green|Stamford Brook|Ravenscourt Park|Hammersmith (Dist&Picc Line)|Barons Court|West Kensington|Earl's Court",
      "Earl's Court|Gloucester Road|South Kensington|Sloane Square|Victoria|St. James's Park|Westminster|Embankment|Temple|Blackfriars|Mansion House|Cannon Street|Monument|Tower Hill|Aldgate East|Whitechapel|Stepney Green|Mile End|Bow Road|Bromley-by-Bow|West Ham|Plaistow|Upton Park|East Ham|Barking|Upney|Becontree|Dagenham Heathway|Dagenham East|Elm Park|Hornchurch|Upminster Bridge|Upminster",
      "Richmond|Kew Gardens|Gunnersbury|Turnham Green",
      "Wimbledon|Wimbledon Park|Southfields|East Putney|Putney Bridge|Parsons Green|Fulham Broadway|West Brompton|Earl's Court",
      "Earl's Court|High Street Kensington|Notting Hill Gate|Bayswater|Paddington|Edgware Road (Circle Line)",
      "Kensington (Olympia)|Earl's Court"
    ]
  },
  "Hammersmith & City": {
    "color": "#F3A9BB",
    "routes": [
      "Hammersmith (H&C Line)|Goldhawk Road|Shepherd's Bush Market|Wood Lane|Latimer Road|Ladbroke Grove|Westbourne Park|Royal Oak|Paddington (H&C Line)-Underground|Edgware Road (Circle Line)|Baker Street|Great Portland Street|Euston Square|King's Cross St. Pancras|Farringdon|Barbican|Moorgate|Liverpool Street|Aldgate East|Whitechapel|Stepney Green|Mile End|Bow Road|Bromley-by-Bow|West Ham|Plaistow|Upton Park|East Ham|Barking"
    ]
  },
  "Jubilee": {
    "color": "#A0A5A9",
    "routes": [
      "Stanmore|Canons Park|Queensbury|Kingsbury|Wembley Park|Neasden|Dollis Hill|Willesden Green|Kilburn|West Hampstead|Finchley Road|Swiss Cottage|St. John's Wood|Baker Street|Bond Street|Green Park|Westminster|Waterloo|Southwark|London Bridge|Bermondsey|Canada Water|Canary Wharf|North Greenwich|Canning Town|West Ham|Stratford"
    ]
  },
  "Metropolitan": {
    "color": "#9B0056",
    "routes": [
      "Amersham|Chalfont & Latimer",
      "Chalfont & Latimer|Chorleywood|Rickmansworth|Moor Park",
      "Moor Park|Northwood|Northwood Hills|Pinner|North Harrow|Harrow-on-the-Hill",
      "Harrow-on-the-Hill|Northwick Park|Preston Road|Wembley Park",
      "Finchley Road|Baker Street|Great Portland Street|Euston Square|King's Cross St. Pancras|Farringdon|Barbican|Moorgate|Liverpool Street|Aldgate",
      "Wembley Park|Willesden Green|Finchley Road",
      "Wembley Park|Finchley Road",
      "Chesham|Chalfont & Latimer",
      "Uxbridge|Hillingdon|Ickenham|Ruislip|Ruislip Manor|Eastcote|Rayners Lane|West Harrow|Harrow-on-the-Hill",
      "Watford|Croxley|Moor Park"
    ]
  },
  "Northern": {
    "color": "#333333",
    "routes": [
      "Morden|South Wimbledon|Colliers Wood|Tooting Broadway|Tooting Bec|Balham|Clapham South|Clapham Common|Clapham North|Stockwell|Oval|Kennington",
      "Kennington|Waterloo|Embankment|Charing Cross|Leicester Square|Tottenham Court Road|Goodge Street|Warren Street|Euston",
      "Euston|Mornington Crescent|Camden Town",
      "Camden Town|Kentish Town|Tufnell Park|Archway|Highgate|East Finchley|Finchley Central",
      "Finchley Central|West Finchley|Woodside Park|Totteridge & Whetstone|High Barnet",
      "Kennington|Elephant & Castle|Borough|London Bridge|Bank|Moorgate|Old Street|Angel|King's Cross St. Pancras|Euston",
      "Euston|Camden Town",
      "Camden Town|Chalk Farm|Belsize Park|Hampstead|Golders Green|Brent Cross|Hendon Central|Colindale|Burnt Oak|Edgware",
      "Finchley Central|Mill Hill East",
      "Battersea Power Station|Nine Elms|Kennington"
    ]
  },
  "Piccadilly": {
    "color": "#003688",
    "routes": [
      "Uxbridge|Hillingdon|Ickenham|Ruislip|Ruislip Manor|Eastcote|Rayners Lane|South Harrow|Sudbury Hill|Sudbury Town|Alperton|Park Royal|North Ealing|Ealing Common|Acton Town",
      "Acton Town|Turnham Green|Hammersmith (Dist&Picc Line)|Barons Court|Earl's Court|Gloucester Road|South Kensington|Knightsbridge|Hyde Park Corner|Green Park|Piccadilly Circus|Leicester Square|Covent Garden|Holborn|Russell Square|King's Cross St. Pancras|Caledonian Road|Holloway Road|Arsenal|Finsbury Park|Manor House|Turnpike Lane|Wood Green|Bounds Green|Arnos Grove|Southgate|Oakwood|Cockfosters",
      "Heathrow Terminal 4|Heathrow Terminals 2 & 3",
      "Heathrow Terminals 2 & 3|Hatton Cross|Hounslow West|Hounslow Central|Hounslow East|Osterley|Boston Manor|Northfields|South Ealing|Acton Town",
      "Heathrow Terminal 5|Heathrow Terminals 2 & 3"
    ]
  },
  "Victoria": {
    "color": "#0098D4",
    "routes": [
      "Brixton|Stockwell|Vauxhall|Pimlico|Victoria|Green Park|Oxford Circus|Warren Street|Euston|King's Cross St. Pancras|Highbury & Islington|Finsbury Park|Seven Sisters|Tottenham Hale|Blackhorse Road|Walthamstow Central"
    ]
  },
  "Waterloo & City": {
    "color": "#95CDBA",
    "routes": [
      "Waterloo|Bank"
    ]
  }
};

const LONDON_ANCHORS = {
  "Elephant & Castle": [
    1748,
    1341
  ],
  "Lambeth North": [
    1710,
    1316
  ],
  "Waterloo": [
    1702,
    1289
  ],
  "Embankment": [
    1677,
    1267
  ],
  "Charing Cross": [
    1662,
    1265
  ],
  "Piccadilly Circus": [
    1641,
    1249
  ],
  "Oxford Circus": [
    1614,
    1218
  ],
  "Regent's Park": [
    1600,
    1170
  ],
  "Baker Street": [
    1565,
    1173
  ],
  "Marylebone": [
    1545,
    1176
  ],
  "Edgware Road (Bakerloo)": [
    1523,
    1188
  ],
  "Paddington": [
    1505,
    1210
  ],
  "Warwick Avenue": [
    1478,
    1171
  ],
  "Maida Vale": [
    1472,
    1132
  ],
  "Kilburn Park": [
    1444,
    1101
  ],
  "Queen's Park": [
    1411,
    1106
  ],
  "Kensal Green": [
    1344,
    1127
  ],
  "Willesden Junction": [
    1282,
    1117
  ],
  "Harlesden": [
    1238,
    1093
  ],
  "Stonebridge Park": [
    1179,
    1048
  ],
  "Wembley Central": [
    1111,
    998
  ],
  "North Wembley": [
    1088,
    937
  ],
  "South Kenton": [
    1073,
    892
  ],
  "Kenton": [
    1046,
    823
  ],
  "Harrow & Wealdstone": [
    986,
    761
  ],
  "West Ruislip": [
    653,
    895
  ],
  "Ruislip Gardens": [
    741,
    948
  ],
  "South Ruislip": [
    780,
    971
  ],
  "Northolt": [
    878,
    1022
  ],
  "Greenford": [
    951,
    1057
  ],
  "Perivale": [
    1025,
    1091
  ],
  "Hanger Lane": [
    1125,
    1130
  ],
  "North Acton": [
    1232,
    1169
  ],
  "East Acton": [
    1272,
    1210
  ],
  "White City": [
    1347,
    1238
  ],
  "Shepherd's Bush (Central)": [
    1365,
    1283
  ],
  "Holland Park": [
    1407,
    1266
  ],
  "Notting Hill Gate": [
    1438,
    1255
  ],
  "Queensway": [
    1467,
    1248
  ],
  "Lancaster Gate": [
    1505,
    1239
  ],
  "Marble Arch": [
    1559,
    1229
  ],
  "Bond Street": [
    1589,
    1224
  ],
  "Tottenham Court Road": [
    1652,
    1211
  ],
  "Holborn": [
    1684,
    1204
  ],
  "Chancery Lane": [
    1713,
    1200
  ],
  "St. Paul's": [
    1758,
    1220
  ],
  "Bank": [
    1783,
    1231
  ],
  "Liverpool Street": [
    1805,
    1206
  ],
  "Bethnal Green": [
    1895,
    1147
  ],
  "Mile End": [
    1966,
    1160
  ],
  "Stratford": [
    2064,
    1060
  ],
  "Leyton": [
    2057,
    973
  ],
  "Leytonstone": [
    2102,
    903
  ],
  "Snaresbrook": [
    2145,
    830
  ],
  "South Woodford": [
    2164,
    763
  ],
  "Woodford": [
    2186,
    674
  ],
  "Buckhurst Hill": [
    2227,
    557
  ],
  "Loughton": [
    2255,
    469
  ],
  "Debden": [
    2347,
    445
  ],
  "Theydon Bois": [
    2410,
    289
  ],
  "Epping": [
    2445,
    158
  ],
  "Wanstead": [
    2168,
    860
  ],
  "Redbridge": [
    2223,
    856
  ],
  "Gants Hill": [
    2290,
    854
  ],
  "Newbury Park": [
    2368,
    859
  ],
  "Barkingside": [
    2363,
    800
  ],
  "Fairlop": [
    2371,
    741
  ],
  "Hainault": [
    2379,
    693
  ],
  "Roding Valley": [
    2217,
    613
  ],
  "Chigwell": [
    2319,
    608
  ],
  "Grange Hill": [
    2374,
    635
  ],
  "Ealing Broadway": [
    1096,
    1220
  ],
  "West Acton": [
    1163,
    1202
  ],
  "Hammersmith (H&C Line)": [
    1344,
    1348
  ],
  "Goldhawk Road": [
    1339,
    1297
  ],
  "Shepherd's Bush Market": [
    1340,
    1276
  ],
  "Wood Lane": [
    1346,
    1251
  ],
  "Latimer Road": [
    1368,
    1229
  ],
  "Ladbroke Grove": [
    1392,
    1205
  ],
  "Westbourne Park": [
    1422,
    1183
  ],
  "Royal Oak": [
    1462,
    1195
  ],
  "Paddington (H&C Line)-Underground": [
    1496,
    1201
  ],
  "Edgware Road (Circle Line)": [
    1530,
    1191
  ],
  "Great Portland Street": [
    1607,
    1167
  ],
  "Euston Square": [
    1634,
    1157
  ],
  "King's Cross St. Pancras": [
    1675,
    1127
  ],
  "Farringdon": [
    1734,
    1189
  ],
  "Barbican": [
    1757,
    1188
  ],
  "Moorgate": [
    1788,
    1201
  ],
  "Aldgate": [
    1829,
    1224
  ],
  "Tower Hill": [
    1827,
    1250
  ],
  "Monument": [
    1796,
    1245
  ],
  "Cannon Street": [
    1781,
    1240
  ],
  "Mansion House": [
    1770,
    1237
  ],
  "Blackfriars": [
    1739,
    1240
  ],
  "Temple": [
    1704,
    1243
  ],
  "Westminster": [
    1670,
    1301
  ],
  "St. James's Park": [
    1641,
    1312
  ],
  "Victoria": [
    1610,
    1330
  ],
  "Sloane Square": [
    1567,
    1355
  ],
  "South Kensington": [
    1510,
    1344
  ],
  "Gloucester Road": [
    1482,
    1343
  ],
  "High Street Kensington": [
    1449,
    1303
  ],
  "Bayswater": [
    1465,
    1236
  ],
  "Ealing Common": [
    1139,
    1249
  ],
  "Acton Town": [
    1164,
    1291
  ],
  "Chiswick Park": [
    1205,
    1341
  ],
  "Turnham Green": [
    1248,
    1338
  ],
  "Stamford Brook": [
    1277,
    1339
  ],
  "Ravenscourt Park": [
    1309,
    1344
  ],
  "Hammersmith (Dist&Picc Line)": [
    1349,
    1355
  ],
  "Barons Court": [
    1382,
    1366
  ],
  "West Kensington": [
    1404,
    1365
  ],
  "Earl's Court": [
    1447,
    1356
  ],
  "Aldgate East": [
    1840,
    1219
  ],
  "Whitechapel": [
    1880,
    1193
  ],
  "Stepney Green": [
    1924,
    1179
  ],
  "Bow Road": [
    1994,
    1149
  ],
  "Bromley-by-Bow": [
    2038,
    1161
  ],
  "West Ham": [
    2092,
    1142
  ],
  "Plaistow": [
    2132,
    1123
  ],
  "Upton Park": [
    2190,
    1099
  ],
  "East Ham": [
    2241,
    1077
  ],
  "Barking": [
    2338,
    1075
  ],
  "Upney": [
    2405,
    1081
  ],
  "Becontree": [
    2488,
    1069
  ],
  "Dagenham Heathway": [
    2554,
    1061
  ],
  "Dagenham East": [
    2614,
    1047
  ],
  "Elm Park": [
    2720,
    1013
  ],
  "Hornchurch": [
    2787,
    988
  ],
  "Upminster Bridge": [
    2841,
    961
  ],
  "Upminster": [
    2890,
    958
  ],
  "Richmond": [
    1097,
    1527
  ],
  "Kew Gardens": [
    1149,
    1445
  ],
  "Gunnersbury": [
    1181,
    1357
  ],
  "Wimbledon": [
    1404,
    1777
  ],
  "Wimbledon Park": [
    1427,
    1697
  ],
  "Southfields": [
    1404,
    1635
  ],
  "East Putney": [
    1390,
    1551
  ],
  "Putney Bridge": [
    1397,
    1497
  ],
  "Parsons Green": [
    1422,
    1456
  ],
  "Fulham Broadway": [
    1441,
    1427
  ],
  "West Brompton": [
    1440,
    1384
  ],
  "Kensington (Olympia)": [
    1393,
    1323
  ],
  "Stanmore": [
    1090,
    597
  ],
  "Canons Park": [
    1118,
    669
  ],
  "Queensbury": [
    1146,
    749
  ],
  "Kingsbury": [
    1170,
    805
  ],
  "Wembley Park": [
    1168,
    933
  ],
  "Neasden": [
    1264,
    988
  ],
  "Dollis Hill": [
    1299,
    1000
  ],
  "Willesden Green": [
    1356,
    1017
  ],
  "Kilburn": [
    1412,
    1029
  ],
  "West Hampstead": [
    1455,
    1032
  ],
  "Finchley Road": [
    1491,
    1031
  ],
  "Swiss Cottage": [
    1507,
    1049
  ],
  "St. John's Wood": [
    1510,
    1104
  ],
  "Green Park": [
    1611,
    1268
  ],
  "Southwark": [
    1733,
    1283
  ],
  "London Bridge": [
    1787,
    1275
  ],
  "Bermondsey": [
    1867,
    1322
  ],
  "Canada Water": [
    1915,
    1321
  ],
  "Canary Wharf": [
    2016,
    1288
  ],
  "North Greenwich": [
    2089,
    1306
  ],
  "Canning Town": [
    2102,
    1228
  ],
  "Amersham": [
    101,
    275
  ],
  "Chalfont & Latimer": [
    254,
    311
  ],
  "Chorleywood": [
    391,
    392
  ],
  "Rickmansworth": [
    537,
    476
  ],
  "Moor Park": [
    671,
    538
  ],
  "Northwood": [
    699,
    649
  ],
  "Northwood Hills": [
    745,
    711
  ],
  "Pinner": [
    837,
    757
  ],
  "North Harrow": [
    898,
    805
  ],
  "Harrow-on-the-Hill": [
    980,
    838
  ],
  "Northwick Park": [
    1042,
    843
  ],
  "Preston Road": [
    1117,
    881
  ],
  "Chesham": [
    90,
    90
  ],
  "Uxbridge": [
    523,
    1032
  ],
  "Hillingdon": [
    614,
    990
  ],
  "Ickenham": [
    639,
    942
  ],
  "Ruislip": [
    705,
    885
  ],
  "Ruislip Manor": [
    734,
    874
  ],
  "Eastcote": [
    785,
    854
  ],
  "Rayners Lane": [
    870,
    862
  ],
  "West Harrow": [
    927,
    835
  ],
  "Watford": [
    720,
    374
  ],
  "Croxley": [
    641,
    435
  ],
  "Morden": [
    1442,
    1890
  ],
  "South Wimbledon": [
    1452,
    1812
  ],
  "Colliers Wood": [
    1497,
    1795
  ],
  "Tooting Broadway": [
    1528,
    1739
  ],
  "Tooting Bec": [
    1556,
    1691
  ],
  "Balham": [
    1578,
    1646
  ],
  "Clapham South": [
    1596,
    1590
  ],
  "Clapham Common": [
    1626,
    1536
  ],
  "Clapham North": [
    1653,
    1516
  ],
  "Stockwell": [
    1677,
    1474
  ],
  "Oval": [
    1710,
    1417
  ],
  "Kennington": [
    1731,
    1378
  ],
  "Leicester Square": [
    1658,
    1241
  ],
  "Goodge Street": [
    1639,
    1186
  ],
  "Warren Street": [
    1626,
    1161
  ],
  "Euston": [
    1641,
    1142
  ],
  "Mornington Crescent": [
    1624,
    1103
  ],
  "Camden Town": [
    1612,
    1075
  ],
  "Kentish Town": [
    1618,
    1010
  ],
  "Tufnell Park": [
    1626,
    971
  ],
  "Archway": [
    1637,
    920
  ],
  "Highgate": [
    1601,
    848
  ],
  "East Finchley": [
    1539,
    791
  ],
  "Finchley Central": [
    1450,
    709
  ],
  "West Finchley": [
    1463,
    659
  ],
  "Woodside Park": [
    1473,
    608
  ],
  "Totteridge & Whetstone": [
    1493,
    533
  ],
  "High Barnet": [
    1444,
    415
  ],
  "Borough": [
    1772,
    1302
  ],
  "Old Street": [
    1790,
    1155
  ],
  "Angel": [
    1730,
    1120
  ],
  "Chalk Farm": [
    1577,
    1047
  ],
  "Belsize Park": [
    1540,
    1010
  ],
  "Hampstead": [
    1499,
    975
  ],
  "Golders Green": [
    1445,
    880
  ],
  "Brent Cross": [
    1381,
    854
  ],
  "Hendon Central": [
    1340,
    814
  ],
  "Colindale": [
    1264,
    742
  ],
  "Burnt Oak": [
    1218,
    698
  ],
  "Edgware": [
    1182,
    634
  ],
  "Mill Hill East": [
    1393,
    666
  ],
  "Battersea Power Station": [
    1614,
    1428
  ],
  "Nine Elms": [
    1658,
    1428
  ],
  "South Harrow": [
    930,
    923
  ],
  "Sudbury Hill": [
    983,
    971
  ],
  "Sudbury Town": [
    1050,
    1007
  ],
  "Alperton": [
    1102,
    1067
  ],
  "Park Royal": [
    1152,
    1148
  ],
  "North Ealing": [
    1137,
    1205
  ],
  "Knightsbridge": [
    1554,
    1299
  ],
  "Hyde Park Corner": [
    1580,
    1291
  ],
  "Covent Garden": [
    1671,
    1231
  ],
  "Russell Square": [
    1672,
    1172
  ],
  "Caledonian Road": [
    1690,
    1021
  ],
  "Holloway Road": [
    1707,
    996
  ],
  "Arsenal": [
    1726,
    960
  ],
  "Finsbury Park": [
    1728,
    928
  ],
  "Manor House": [
    1763,
    889
  ],
  "Turnpike Lane": [
    1741,
    773
  ],
  "Wood Green": [
    1718,
    730
  ],
  "Bounds Green": [
    1672,
    673
  ],
  "Arnos Grove": [
    1643,
    617
  ],
  "Southgate": [
    1660,
    523
  ],
  "Oakwood": [
    1646,
    431
  ],
  "Cockfosters": [
    1591,
    409
  ],
  "Heathrow Terminal 4": [
    627,
    1555
  ],
  "Heathrow Terminals 2 & 3": [
    606,
    1480
  ],
  "Hatton Cross": [
    701,
    1506
  ],
  "Hounslow West": [
    820,
    1466
  ],
  "Hounslow Central": [
    885,
    1479
  ],
  "Hounslow East": [
    917,
    1468
  ],
  "Osterley": [
    931,
    1420
  ],
  "Boston Manor": [
    1020,
    1335
  ],
  "Northfields": [
    1053,
    1313
  ],
  "South Ealing": [
    1077,
    1303
  ],
  "Heathrow Terminal 5": [
    482,
    1487
  ],
  "Brixton": [
    1702,
    1531
  ],
  "Vauxhall": [
    1672,
    1393
  ],
  "Pimlico": [
    1641,
    1374
  ],
  "Highbury & Islington": [
    1740,
    1034
  ],
  "Seven Sisters": [
    1839,
    814
  ],
  "Tottenham Hale": [
    1880,
    785
  ],
  "Blackhorse Road": [
    1942,
    793
  ],
  "Walthamstow Central": [
    2011,
    816
  ]
};

const LONDON_WALK_LINKS = [["Bank", "Monument"], ["Hammersmith (Dist&Picc Line)", "Hammersmith (H&C Line)"], ["Paddington", "Paddington (H&C Line)-Underground"], ["Edgware Road (Bakerloo)", "Edgware Road (Circle Line)"]];
