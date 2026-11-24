import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// Bundle modular TSPS sources into the Hub's existing two-file ZIP format.
const [checkout, id, entry] = process.argv.slice(2);
if (!checkout || !/^[a-z][a-z0-9-]{0,63}$/.test(id ?? '') || !entry) {
    throw new Error('Usage: node scripts/bundle-plugin.mjs <tsps-checkout> <plugin-id> <entry-path>');
}
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const directory = path.join(root, 'plugins', id);
const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'plugin.json'), 'utf8'));
if (manifest.id !== id || !/^[A-Za-z][A-Za-z0-9]{0,63}$/.test(manifest.name)) {
    throw new Error('The package directory and manifest must agree.');
}
const sourceRoot = fs.realpathSync(checkout);
const source = fs.realpathSync(path.resolve(sourceRoot, entry));
if (!source.startsWith(sourceRoot + path.sep)) throw new Error('Entry must be inside the TSPS checkout.');
// Reuse the source checkout's build dependency; Hub releases only need the bundled entry.
const require = createRequire(path.join(sourceRoot, 'client', 'package.json'));
const { buildSync } = require('esbuild');
const result = buildSync({
    absWorkingDir: sourceRoot,
    entryPoints: [source],
    bundle: true,
    write: false,
    platform: 'node',
    format: 'cjs',
    target: 'node22',
    legalComments: 'inline',
    logLevel: 'silent',
    metafile: true,
    banner: { js: `/*\n${fs.readFileSync(path.join(sourceRoot, 'LICENSE'), 'utf8')}\n*/` },
});
if (Object.keys(result.metafile.inputs).some(file => file.startsWith('server/src/'))) {
    throw new Error('Plugins must use api.core; private TSPS engine code must not be bundled.');
}
const code = result.outputFiles[0].contents;
if (code.byteLength > 1024 * 1024) throw new Error('Plugin entry exceeds the Hub limit of 1 MiB.');
const destination = path.join(directory, `${manifest.name}.plugin.js`);
fs.writeFileSync(destination, code);
console.log(`${path.relative(root, destination)} (${code.byteLength} bytes)`);
