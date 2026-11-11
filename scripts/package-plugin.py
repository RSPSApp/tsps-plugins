import argparse
import json
import re
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parents[1]


def package_plugin(plugin_id, expected_version=None):
    if not re.fullmatch(r"[a-z][a-z0-9-]{0,63}", plugin_id):
        raise ValueError("Invalid plugin ID")
    directory = ROOT / "plugins" / plugin_id
    manifest_path = directory / "plugin.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if (
        manifest["format"] != 1
        or manifest["id"] != plugin_id
        or not re.fullmatch(r"[A-Za-z][A-Za-z0-9]{0,63}", manifest["name"])
        or not re.fullmatch(r"[0-9]{1,6}\.[0-9]{1,6}\.[0-9]{1,6}", manifest["version"])
        or not isinstance(manifest["description"], str)
        or len(manifest["description"]) > 500
    ):
        raise ValueError("Invalid plugin manifest")

    if expected_version is not None and manifest["version"] != expected_version:
        raise ValueError(f"{plugin_id}: manifest version does not match catalogue.json")

    output = ROOT / "dist" / f'{plugin_id}-{manifest["version"]}.zip'
    source_path = directory / f'{manifest["name"]}.plugin.js'
    files = {file.name: file.read_bytes() for file in (manifest_path, source_path)}
    if any(not data or len(data) > 1024 * 1024 for data in files.values()):
        raise ValueError("Each plugin file must be between 1 byte and 1 MiB")
    output.parent.mkdir(exist_ok=True)
    with ZipFile(output, "w") as archive:
        for name, data in files.items():
            archive.writestr(ZipInfo(name), data, ZIP_DEFLATED)
    if output.stat().st_size > 1024 * 1024:
        output.unlink()
        raise ValueError("Plugin ZIP must be at most 1 MiB")
    return output


def package_catalogue():
    catalogue = json.loads((ROOT / "catalogue.json").read_text(encoding="utf-8"))
    if catalogue.get("format") != 1 or not isinstance(catalogue.get("plugins"), list):
        raise ValueError("Invalid plugin catalogue")

    seen = set()
    for entry in catalogue["plugins"]:
        if not isinstance(entry, dict) or not all(
            isinstance(entry.get(field), str) and entry[field].strip()
            for field in ("id", "name", "author", "category", "version", "description")
        ):
            raise ValueError("Invalid plugin catalogue entry")
        plugin_id = entry["id"]
        if plugin_id in seen:
            raise ValueError(f"Duplicate plugin ID in catalogue.json: {plugin_id}")
        seen.add(plugin_id)
        yield package_plugin(plugin_id, expected_version=entry["version"])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build importable TSPS plugin ZIPs.")
    target = parser.add_mutually_exclusive_group(required=True)
    target.add_argument("plugin_id", nargs="?")
    target.add_argument("--catalogue", action="store_true", help="Build all packages listed in catalogue.json")
    args = parser.parse_args()
    packages = package_catalogue() if args.catalogue else [package_plugin(args.plugin_id)]
    for package in packages:
        print(package.relative_to(ROOT))
