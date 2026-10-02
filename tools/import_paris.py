"""Build Paris Métro links from the official Île-de-France Mobilités GTFS."""
import csv
import io
import json
import zipfile
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / ".import-data" / "paris" / "IDFM-gtfs.zip"

with zipfile.ZipFile(ARCHIVE) as archive:
    def rows(name):
        return csv.DictReader(io.TextIOWrapper(
            archive.open(name), encoding="utf-8-sig", errors="replace"))

    metro = {}
    for route in rows("routes.txt"):
        if route["route_type"] == "1":
            number = route["route_short_name"].replace("B", "bis")
            metro[route["route_id"]] = ("M" + number, "#" + route["route_color"])
    print("Metro lines:", sorted(set(line for line, _ in metro.values())))

    trips = {trip["trip_id"]: metro[trip["route_id"]][0]
             for trip in rows("trips.txt") if trip["route_id"] in metro}
    print("Metro trips:", len(trips))

    stops = {}
    for stop in rows("stops.txt"):
        try:
            coord = (float(stop["stop_lon"]), float(stop["stop_lat"]))
        except ValueError:
            continue
        name = stop["stop_name"].strip()
        if name:
            stops[stop["stop_id"]] = (name, coord)
    print("Stop records:", len(stops))

    links = defaultdict(set)
    points = defaultdict(list)
    previous = {}
    for row in rows("stop_times.txt"):
        trip_id = row["trip_id"]
        if trip_id not in trips:
            continue
        station = stops.get(row["stop_id"])
        if not station:
            continue
        name, coord = station
        line = trips[trip_id]
        points[name].append(coord)
        old = previous.get(trip_id)
        if old and old != name:
            links[line].add(tuple(sorted((old, name))))
        previous[trip_id] = name

    colors = {name: color for name, color in metro.values()}
    lines = {
        name: {"color": colors[name],
               "routes": ["|".join(pair) for pair in sorted(links[name])]}
        for name in sorted(colors, key=lambda n: (int(n[1:].replace("bis", "")), "bis" in n))
    }
    coords = {}
    for name, values in points.items():
        coords[name] = (
            sum(x for x, _ in values) / len(values),
            sum(y for _, y in values) / len(values))
    min_lon, max_lon = min(x for x, _ in coords.values()), max(x for x, _ in coords.values())
    min_lat, max_lat = min(y for _, y in coords.values()), max(y for _, y in coords.values())
    anchors = {
        name: [round(90 + (lon - min_lon) / (max_lon - min_lon) * 2500),
               round(90 + (max_lat - lat) / (max_lat - min_lat) * 1850)]
        for name, (lon, lat) in coords.items()
    }

header = ("// Île-de-France Mobilités GTFS, downloaded October 2026.\n"
          "// https://prim.iledefrance-mobilites.fr/en/jeux-de-donnees/offre-horaires-tc-gtfs-idfm\n"
          "// Adjacent stops are derived from metro trip stop_times, then deduplicated.\n"
          "// Original geographic projection; each two-stop route is one playable link.\n")
output = (header + "const PARIS_LINES = " +
          json.dumps(lines, ensure_ascii=False, indent=2) +
          ";\n\nconst PARIS_ANCHORS = " +
          json.dumps(anchors, ensure_ascii=False, indent=2) + ";\n")
(ROOT / "paris.js").write_text(output, encoding="utf-8")
print("Paris:", len(coords), "station names,", sum(map(len, links.values())), "links")
for line in lines:
    print(line, len(links[line]), "links")
