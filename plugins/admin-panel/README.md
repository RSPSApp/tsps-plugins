# In-game admin panel

Author: GhostScape. Source: the matching GhostScape feature changes for RSPSApp/tsps.

In-game player editing, teleports, cheats, spawning and bot controls. Requires the matching TSPS native-interface and admin provider support.

Install the release ZIP in the server Plugins panel and restart the server. This package does not patch or rebuild the client. Use a TSPS build with the integrations listed above. The source entry ends in `.entry.js` so it is not auto-loaded alongside this package.

Open `::admin` with an authorised account. Actions retain their rank, command, target-session and world-profile checks. Bots use the shared runtime service and work without the old standalone `::bots` UI. Teleport, quest, spawn and bot providers must be present in the receiving TSPS build. Quest reset does not reverse all quest rewards or quest-specific state.

Rebuild after installing the matching TSPS checkout dependencies:

```sh
node scripts/bundle-plugin.mjs /path/to/tsps admin-panel server/plugins/tools/AdminPanel.entry.js
python3 scripts/package-plugin.py admin-panel
```

The bundled entry includes its local helpers and JSON data because Hub ZIPs contain one JavaScript entry and a manifest. Remove or disable the installed package through the normal Plugins workflow.
