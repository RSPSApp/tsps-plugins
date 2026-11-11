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

For a local ZIP, run `python3 scripts/package-plugin.py <id>`. To check the whole
catalogue locally, run `python3 scripts/package-plugin.py --catalogue`.
