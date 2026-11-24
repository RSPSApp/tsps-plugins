# Monster Examine

Author: GhostScape. Source: the matching GhostScape feature changes for RSPSApp/tsps.

Native monster stats, accuracy estimates and grouped drops. Requires the matching TSPS client and read-only examine APIs.

Install the release ZIP in the server Plugins panel and restart the server. This package does not patch or rebuild the client. Use a TSPS build with the integrations listed above. The source entry ends in `.entry.js` so it is not auto-loaded alongside this package.

Enable Monster Examine in the client plugin list and examine a visible attackable NPC. Native examine chat remains available when the server plugin is disabled. Drop descriptions are read-only and do not roll or grant rewards. Bestiary is an optional separate package.

Rebuild after installing the matching TSPS checkout dependencies:

```sh
node scripts/bundle-plugin.mjs /path/to/tsps monster-examine server/plugins/interface/MonsterExamine.entry.js
python3 scripts/package-plugin.py monster-examine
```

The bundled entry includes its local helpers and JSON data because Hub ZIPs contain one JavaScript entry and a manifest. Remove or disable the installed package through the normal Plugins workflow.
