"""Build the playable London Tube graph from TfL's public route API."""
import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LINES = {
    "Bakerloo": ("bakerloo", "#B36305"),
    "Central": ("central", "#E32017"),
    "Circle": ("circle", "#FFD300"),
    "District": ("district", "#00782A"),
    "Hammersmith & City": ("hammersmith-city", "#F3A9BB"),
    "Jubilee": ("jubilee", "#A0A5A9"),
    "Metropolitan": ("metropolitan", "#9B0056"),
    "Northern": ("northern", "#333333"),
    "Piccadilly": ("piccadilly", "#003688"),
    "Victoria": ("victoria", "#0098D4"),
    "Waterloo & City": ("waterloo-city", "#95CDBA"),
}

routes = {}
points = {}
for name, (slug, color) in LINES.items():
    url = f"https://api.tfl.gov.uk/Line/{slug}/Route/Sequence/outbound"
    snapshot = ROOT / '.import-data' / 'tfl' / f'{slug}.json'
    if snapshot.exists():
        data = json.loads(snapshot.read_text(encoding='utf-8-sig'))
    else:
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(request, timeout=30) as response:
            data = json.load(response)
    segments = []
    for sequence in data["stopPointSequences"]:
        stops = []
        for point in sequence["stopPoint"]:
            station = point["name"].removesuffix(" Underground Station")
            stops.append(station)
            points[station] = (float(point["lon"]), float(point["lat"]))
        if len(stops) > 1:
            segments.append("|".join(stops))
    routes[name] = {"color": color, "routes": segments}
    print(f"{name}: {len(segments)} segments, {len(set('|'.join(segments).split('|')))} stations")

# A geographic base gives every stop a position, including every branch end.
# Longitude is widened slightly to leave room for the long western branches.
min_lon, max_lon = min(p[0] for p in points.values()), max(p[0] for p in points.values())
min_lat, max_lat = min(p[1] for p in points.values()), max(p[1] for p in points.values())
anchors = {
    name: [round(90 + (lon-min_lon)/(max_lon-min_lon)*2800),
           round(90 + (max_lat-lat)/(max_lat-min_lat)*1800)]
    for name, (lon, lat) in points.items()
}
header = ("// TfL Unified API, Route/Sequence/outbound for all 11 Tube lines.\n"
          "// https://api.tfl.gov.uk/\n"
          "// Positions are a simplified geographic projection; links come from route sequences.\n")
output = (header + "const LONDON_LINES = " +
          json.dumps(routes, ensure_ascii=False, indent=2) +
          ";\n\nconst LONDON_ANCHORS = " +
          json.dumps(anchors, ensure_ascii=False, indent=2) +
          ";\n\nconst LONDON_WALK_LINKS = " +
          json.dumps([
              ["Bank", "Monument"],
              ["Hammersmith (Dist&Picc Line)", "Hammersmith (H&C Line)"],
              ["Paddington", "Paddington (H&C Line)-Underground"],
              ["Edgware Road (Bakerloo)", "Edgware Road (Circle Line)"],
          ], ensure_ascii=False) + ";\n")
(ROOT / "london.js").write_text(output, encoding="utf-8")
print(f"London: {len(points)} distinct station names")
