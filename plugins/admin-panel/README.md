# In-game admin panel

Requires the native interface controls and shared admin services in [TSPS #6742](https://github.com/RSPSApp/tsps/pull/6742) and [TSPS #6746](https://github.com/RSPSApp/tsps/pull/6746).

Author: GhostScape. This bundle uses [TSPS commit c3bb25010](https://github.com/RSPSApp/tsps/commit/c3bb25010758fdbcceb3348a4b23a25b5c0cf3b1).

In-game player editing, teleports, cheats, spawning and bot controls.

Install the release ZIP in the server Plugins panel and restart the server. This package does not patch or rebuild the client. Use a TSPS build with the integrations listed above. The source entry ends in `.entry.js` so it is not auto-loaded alongside this package.

Open `::admin` with an authorised account. Actions retain their rank, command, target-session and world-profile checks. Bots use the shared runtime service and work without the old standalone `::bots` UI. Teleport, quest, spawn and bot providers must be present in the receiving TSPS build. Quest reset does not reverse all quest rewards or quest-specific state.

## Rebuild the package

Run `npm ci` in the Hub repository with Node.js 22 and install the TSPS client dependencies from the source revision's lockfile. Run these commands from the Hub repository root.

The rebuild script requires [Hub #6](https://github.com/RSPSApp/tsps-plugins/pull/6).

```sh
tsps="$PWD"
hub=/path/to/tsps-plugins
cd "$hub"
npm ci
node scripts/bundle-plugin.mjs "$tsps" admin-panel server/plugins/tools/AdminPanel.entry.js
python3 scripts/package-plugin.py admin-panel
```

The JavaScript entry includes its local helpers, JSON data and the TSPS BSD 2-Clause license. The ZIP contains that entry and `plugin.json`. Remove or disable the installed package through the normal Plugins workflow.
