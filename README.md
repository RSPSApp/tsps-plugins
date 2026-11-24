# TSPS plugins

This repository publishes plugins for the [RSPS.app Plugin Hub](https://rsps.app/plugins/). Download a release ZIP and upload it from your server's **Plugins** panel. The server loads the plugin on its next start.

## Package layout

Each plugin lives in `plugins/<id>/`. Its format-1 ZIP contains `plugin.json` and one CommonJS entry named `<name>.plugin.js` at the ZIP root. The manifest includes the package ID, TSPS plugin name, version and description. The entry exports the same plugin name and a `register(api)` function. ZIPs and their individual files are limited to 1 MiB.

## Publish a release

Set the same new version in the plugin manifest and `catalogue.json`, then open a
PR. The **Publish plugin releases** workflow checks that the catalogue entries can
be packaged. After the PR merges into `main`, it publishes each new version as
a GitHub Release tagged `<id>-v<version>` with the asset `<id>-<version>.zip`.
The Hub can install the plugin as soon as the release asset is available.

Use a new version for changes to a published package. The workflow skips releases
that already have their ZIP. Run the workflow manually on `main` to retry a failed
publish.

ZIPs include the plugin's static `config` declarations in `plugin.json` so the panel
can show settings before the plugin loads. Use an object in `module.exports.config`
or a reference to a top-level `const`. Values can be JSON literals or top-level
constants. Computed declarations that need to run JavaScript remain available
after startup.

For a local ZIP, run `npm ci` with Node.js 22, then `python3 scripts/package-plugin.py <id>`. To check the whole
catalogue locally, run `python3 scripts/package-plugin.py --catalogue`.

## Bundle a modular plugin

A plugin with local helper modules or JSON data must bundle them into its single Hub entry. Use an installed TSPS source checkout to supply its build dependencies:

```sh
node scripts/bundle-plugin.mjs /path/to/tsps <plugin-id> <entry-relative-to-tsps>
python3 scripts/package-plugin.py <plugin-id>
```

The bundler retains the TSPS license notice, checks the entry size and rejects dependencies on private TSPS engine source. Client changes still require a compatible client build.
