# Monster Examine

Requires a TSPS build with [native interface controls (TSPS #6742)](https://github.com/RSPSApp/tsps/pull/6742)
and [Monster Examine client and server support (TSPS #6743)](https://github.com/RSPSApp/tsps/pull/6743).

Author: GhostScape.

Shows native monster stats, accuracy estimates and grouped drops.

Install the release ZIP in the server Plugins panel and restart the server. The source entry ends in `.entry.js` so it is not auto-loaded alongside this package.

Enable Monster Examine in the client plugin list and examine a visible attackable NPC. Native examine chat remains available when the server plugin is disabled. Drop descriptions are read-only and do not roll or grant rewards. Bestiary is an optional separate package.

From the matching TSPS checkout root, with the client dependencies installed, build the bundled entry and package it:

```sh
hub=/path/to/tsps-plugins
license=$(printf '/*\n%s\n\n*/' "$(cat LICENSE)")
./client/node_modules/.bin/esbuild server/plugins/interface/MonsterExamine.entry.js \
  --bundle --platform=node --format=cjs --target=node22 \
  --banner:js="$license" --outfile="$hub/plugins/monster-examine/MonsterExamine.plugin.js"
cd "$hub"
npm ci
python3 scripts/package-plugin.py monster-examine
```

The bundle includes the local helpers and the TSPS license notice. The Hub ZIP contains the bundled entry and manifest. Remove or disable the installed package through the normal Plugins workflow.
