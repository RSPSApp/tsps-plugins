# Bestiary

Author: GhostScape. Source: the matching GhostScape feature changes for RSPSApp/tsps.

Search playable monsters and show their known public spawn locations. Requires the matching TSPS Bestiary client and encounter providers.

Install the release ZIP in the server Plugins panel and restart the server. This package does not patch or rebuild the client. Use a TSPS build with the integrations listed above. The source entry ends in `.entry.js` so it is not auto-loaded alongside this package.

Open `::bestiary`, or use the client Commands list. Find places temporary pins for known public spawn homes. Browsing does not spawn NPCs or start encounters. Install Monster Examine for detailed monster pages; the catalogue itself can remain available without it. Keep the matching client Monster Examine/Bestiary integration enabled for map pins.

Rebuild after installing the matching TSPS checkout dependencies:

```sh
node scripts/bundle-plugin.mjs /path/to/tsps bestiary server/plugins/interface/Bestiary.entry.js
python3 scripts/package-plugin.py bestiary
```

The bundled entry includes its local helpers and JSON data because Hub ZIPs contain one JavaScript entry and a manifest. Remove or disable the installed package through the normal Plugins workflow.
