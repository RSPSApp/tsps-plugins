/**
 * Custom Pets (Plugin Hub): a pet version of any NPC, from server/data/definitions/custom-pets.json.
 *
 *   { "version": 1, "pets": [
 *     { "npcId": 12980, "itemId": 54000, "name": "Fennec fox", "scale": 70,
 *       "lines": ["Yip!", "*The fox's ears twitch.*"], "chathead": "fennec-fox/chathead.dat" }
 *   ] }
 *
 * - npcId: the NPC whose look the pet takes (its models, recolours, idle and walk animations).
 * - itemId: the pet's item, a row of custom-items.json. Its objType.inventoryActions must be
 *   [null, null, null, null, "Drop"] (as a real pet item's): Drop summons the pet.
 * - name: the follower's name.
 * - scale: its size, in percent of the NPC's (default 100).
 * - lines: what it says when talked to, one picked at random each time.
 * - petNpcId (optional): the follower's own NPC id; the item id by default.
 * - chathead (optional): a .dat model under server/data/models (as custom items' models), shown
 *   as the pet's head when it speaks. It is sent to clients as custom model
 *   CHATHEAD_MODEL_BASE + the follower's NPC id. The talking expressions are animations for human
 *   heads, so a custom chathead is shown still. Without it the NPC's own chathead shows, if any.
 *
 * Each pet becomes a follower NPC: a custom definition (CacheDefinitions, source "custom-pets")
 * cloned from npcId, with a pet's options (Talk-to, Pick-up), no combat level, one tile, and the
 * scale applied. It joins the Pets plugin's table through its "pets:extensions" hook, so
 * summoning, following, Pick-up, the bank, relogging and ownership all work as for real pets.
 * Probita's own window can't list them (it is the cache's interface over its 72 pets), so she
 * reclaims them through an extra dialogue option.
 *
 * Needs a TSPS server with the Pets plugin's "pets:extensions" hook and per-source custom
 * definitions (CacheDefinitions.registerCustomDefinitions(rows, source)).
 */
const fs = require("fs");
const path = require("path");

const SOURCE = "custom-pets";
const FILE = "custom-pets.json";
/** A follower's options, as real followers have them (Scurry: Talk-to, then Pick-up as the fourth). */
const FOLLOWER_ACTIONS = ["Talk-to", null, null, "Pick-up", null];
/** A pet item's options: Drop summons it (Pets.onPetItemDropPolicy). */
const ITEM_ACTIONS = [null, null, null, null, "Drop"];
const MIN_SCALE = 10, MAX_SCALE = 400;
/** A chathead's custom model id: this plus the follower's NPC id (custom items' models use 1,000,000+). */
const CHATHEAD_MODEL_BASE = 2_000_000;
const MODEL_PATH = /^[a-zA-Z0-9._/-]+\.dat$/;
const MIN_MODEL_BYTES = 18, MAX_MODEL_BYTES = 1024 * 1024;
/** No chathead animation: the talking expressions only fit human heads. */
const STILL = -1;
const PROBITA_LOST_OPTION = "I've lost a pet. Have you got it?";
const RECLAIM_OPTION = "Can I reclaim my custom pets?";

let api = null;
let core = null;
let services = null;
/** The loaded pets, as rows of the Pets plugin's table (with `custom` set). */
let pets = [];
/** The chathead model ids this loader last added to the custom models. */
let loadedChatheads = new Set();

function definitionsDirectory(coreApi) {
  return coreApi?.GameConstants?.DEFINITIONS_DIRECTORY ?? path.resolve(__dirname, "../../../data/definitions");
}

/** A chathead's file, or a problem: a .dat under the models directory, 18 bytes to 1 MiB. */
function chatheadFile(chathead, modelsDirectory) {
  if (typeof chathead !== "string" || !MODEL_PATH.test(chathead)) return { problem: "chathead must be a .dat path under server/data/models, such as \"fennec-fox/chathead.dat\"" };
  const root = path.resolve(modelsDirectory);
  const file = path.resolve(root, chathead);
  if (!file.startsWith(`${root}${path.sep}`)) return { problem: `chathead ${chathead} is outside server/data/models` };
  if (!fs.existsSync(file)) return { problem: `chathead ${chathead} doesn't exist in server/data/models` };
  const size = fs.statSync(file).size;
  if (size < MIN_MODEL_BYTES || size > MAX_MODEL_BYTES) return { problem: `chathead ${chathead} must be ${MIN_MODEL_BYTES} bytes to 1 MiB` };
  return { file };
}

function read(directory) {
  const file = path.join(directory, FILE);
  if (!fs.existsSync(file)) return [];
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!document || !Array.isArray(document.pets)) throw new Error(`${FILE}: expected { "version": 1, "pets": [...] }`);
  return document.pets;
}

/** Every problem with one row, against the cache and custom-items.json. */
function problemsOf(row, index, { npcCount, customItems, seenItems, seenNpcs, modelsDirectory }) {
  const where = `${FILE} pets[${index}]`;
  const problems = [];
  if (!row || typeof row !== "object") return [`${where}: not an object`];
  if (!Number.isInteger(row.npcId) || row.npcId < 0 || row.npcId >= npcCount) problems.push(`${where}: npcId must be an NPC id in the cache (0-${npcCount - 1})`);
  const item = customItems.get(row.itemId);
  if (!Number.isInteger(row.itemId)) problems.push(`${where}: itemId must be a custom item id`);
  else if (!item) problems.push(`${where}: item ${row.itemId} is not in custom-items.json`);
  else {
    const actions = item.objType?.inventoryActions ?? [];
    if (actions[4] !== "Drop") problems.push(`${where}: item ${row.itemId}'s inventoryActions must be ${JSON.stringify(ITEM_ACTIONS)} (Drop summons the pet)`);
  }
  if (seenItems.has(row.itemId)) problems.push(`${where}: item ${row.itemId} is already another custom pet's`);
  if (typeof row.name !== "string" || !row.name.trim()) problems.push(`${where}: name must be a non-empty string`);
  if (row.scale !== undefined && (!Number.isInteger(row.scale) || row.scale < MIN_SCALE || row.scale > MAX_SCALE)) {
    problems.push(`${where}: scale must be a whole percent from ${MIN_SCALE} to ${MAX_SCALE}`);
  }
  if (!Array.isArray(row.lines) || row.lines.length === 0 || !row.lines.every((line) => typeof line === "string" && line.trim())) {
    problems.push(`${where}: lines must be a non-empty list of strings`);
  }
  const petNpcId = row.petNpcId ?? row.itemId;
  if (!Number.isInteger(petNpcId) || petNpcId < Math.max(50000, npcCount) || petNpcId >= 65535) {
    problems.push(`${where}: the follower's NPC id ${petNpcId} must be from ${Math.max(50000, npcCount)} to 65534 (set petNpcId)`);
  } else if (seenNpcs.has(petNpcId)) problems.push(`${where}: NPC id ${petNpcId} is already another custom pet's`);
  if (row.chathead !== undefined) {
    const { problem } = chatheadFile(row.chathead, modelsDirectory);
    if (problem) problems.push(`${where}: ${problem}`);
  }
  return problems;
}

/** The follower's custom NPC definition: the NPC's look with a pet's options, size and scale. */
function followerDefinition(row, base, chatheadModelId) {
  const scale = (row.scale ?? 100) / 100;
  const scaled = (value) => Math.max(1, Math.round((Number.isFinite(value) && value > 0 ? value : 128) * scale));
  return {
    kind: "npc",
    id: row.petNpcId ?? row.itemId,
    baseId: row.npcId,
    fields: {
      name: row.name.trim(),
      actions: FOLLOWER_ACTIONS.slice(),
      combatLevel: 0,
      size: 1,
      isFollower: true,
      drawMapDot: false,
      isClickable: true,
      widthScale: scaled(base?.widthScale),
      heightScale: scaled(base?.heightScale),
      ...(chatheadModelId !== undefined ? { chatheadModelIds: [chatheadModelId] } : {}),
    },
  };
}

/**
 * Reads custom-pets.json, registers each follower's NPC definition and returns the pets as
 * rows of the Pets plugin's table. A bad file loads no custom pets, with every problem logged.
 */
function load(coreApi, {
  directory = definitionsDirectory(coreApi),
  modelsDirectory = path.resolve(directory, "../models"),
  log = console,
} = {}) {
  core = coreApi;
  pets = [];
  let rows;
  try {
    rows = read(directory);
  } catch (error) {
    log.error?.(`[custom-pets] ${error.message}; no custom pets loaded`);
    return [];
  }
  if (rows.length === 0) return [];
  const CacheDefinitions = coreApi?.CacheDefinitions;
  if (!CacheDefinitions) {
    log.error?.("[custom-pets] the cache definitions aren't loaded; no custom pets loaded");
    return [];
  }
  const npcCount = CacheDefinitions.getBaseCounts().npcs;
  const customItems = new Map(CacheDefinitions.getCustomItems().map((item) => [item.id, item]));
  const seenItems = new Set(), seenNpcs = new Set();
  const problems = [];
  rows.forEach((row, index) => {
    problems.push(...problemsOf(row, index, { npcCount, customItems, seenItems, seenNpcs, modelsDirectory }));
    if (row && typeof row === "object") {
      seenItems.add(row.itemId);
      seenNpcs.add(row.petNpcId ?? row.itemId);
    }
  });
  if (problems.length) {
    for (const problem of problems) log.error?.(`[custom-pets] ${problem}`);
    log.error?.("[custom-pets] no custom pets loaded");
    return [];
  }
  // Chathead models join the custom models (custom items' first), replacing any this loader added before.
  const chatheads = [];
  for (const row of rows) {
    if (row.chathead === undefined) continue;
    const id = CHATHEAD_MODEL_BASE + (row.petNpcId ?? row.itemId);
    chatheads.push({ id, data: fs.readFileSync(chatheadFile(row.chathead, modelsDirectory).file).toString("base64") });
  }
  const others = CacheDefinitions.getCustomModels().filter((model) => !loadedChatheads.has(model.id));
  const taken = chatheads.find((model) => others.some((other) => other.id === model.id));
  const tooBig = chatheads.find((model) => coreApi.encodeContentData
    && coreApi.encodeContentData("server", [{ key: "customModels", rows: [model] }]).length > 0xffff);
  if (taken || tooBig) {
    log.error?.(taken ? `[custom-pets] chathead model id ${taken.id} is already a custom model's; no custom pets loaded`
      : `[custom-pets] chathead model ${tooBig.id} is too big to send to clients; no custom pets loaded`);
    return [];
  }
  const definitions = rows.map((row) => followerDefinition(row, CacheDefinitions.getNpc(row.npcId),
    row.chathead !== undefined ? CHATHEAD_MODEL_BASE + (row.petNpcId ?? row.itemId) : undefined));
  try {
    CacheDefinitions.registerCustomDefinitions(definitions, SOURCE);
  } catch (error) {
    log.error?.(`[custom-pets] ${error.message}; no custom pets loaded`);
    return [];
  }
  CacheDefinitions.setCustomModels([...others, ...chatheads]);
  loadedChatheads = new Set(chatheads.map((model) => model.id));
  pets = rows.map((row, index) => ({
    enumName: `CUSTOM_${definitions[index].id}`,
    petId: definitions[index].id,
    morphId: 0,
    itemId: row.itemId,
    dialogue: -1,
    custom: { name: row.name.trim(), lines: row.lines.slice(), chathead: row.chathead !== undefined },
  }));
  if (pets.length) log.log?.(`[custom-pets] loaded ${pets.length} custom pet(s)`);
  return pets;
}

/** Talk-to: one of the pet's lines, at random. */
function talk(request) {
  const { player, npc, pet, action } = request;
  if (request.handled || !pet?.custom || String(action).toLowerCase() !== "talk-to") return;
  if (!player?.isRegistered?.() || player.busy?.() || !npc?.isRegistered?.()) return;
  const lines = pet.custom.lines;
  const line = lines[Math.floor(Math.random() * lines.length)];
  const { DialogueChainBuilder, NpcDialogue, EndDialogue } = core;
  // A custom chathead stays still; the NPC's own keeps the usual expression.
  const expression = pet.custom.chathead ? STILL : undefined;
  player.getDialogueManager().startDialogues(new DialogueChainBuilder().add(
    new NpcDialogue(0, npc.getId(), line, undefined, expression),
    new EndDialogue(1),
  ));
  request.handled = true;
}

/** The custom pets the player owns but has nowhere: not following, carried, banked, housed or in a grave. */
function lostPets(player) {
  const owned = new Set(services.getOwnedPetItems(player));
  const storage = { player, grave: null, office: [] };
  api.emitCustomEvent("gravestones:state", storage);
  const stored = [...(storage.grave?.items ?? []), ...(storage.office ?? [])];
  return pets.filter((pet) => owned.has(pet.itemId) && !services.holdsPetItem(player, pet.itemId)
    && !stored.some((entry) => entry && entry.id === pet.itemId && entry.amount > 0));
}

/** Probita's extra option, before "More options...": shown when any custom pets exist. */
function probitaMenu(notice) {
  if (pets.length === 0 || notice.npcId !== core.NpcIdentifiers.PROBITA || !Array.isArray(notice.options)) return;
  if (!notice.options.some((option) => option?.text === PROBITA_LOST_OPTION)) return;
  if (notice.options.some((option) => option?.text === RECLAIM_OPTION)) return;
  const more = notice.options.findIndex((option) => /^More options/i.test(String(option?.text ?? "")));
  const option = { text: RECLAIM_OPTION, steps: [] };
  notice.options = more < 0 ? [...notice.options, option] : [...notice.options.slice(0, more), option, ...notice.options.slice(more)];
}

/** Gives back every lost custom pet there is room for. */
function reclaimAll(player) {
  const lost = lostPets(player);
  const inventory = player.getInventory();
  const given = [];
  for (const pet of lost) {
    if (inventory.isFull()) break;
    inventory.adds(pet.itemId, 1);
    given.push(pet);
  }
  if (given.length) inventory.refreshItems?.();
  for (const pet of given) player.sendMessage(`You reclaim your ${pet.custom.name}.`);
  const left = lost.length - given.length;
  let reply;
  if (lost.length === 0) reply = "You haven't lost any of your custom pets. They're all safe with you!";
  else if (left === 0) reply = given.length === 1 ? "Here you go, your pet is back with you." : "Here you go, all your pets are back with you.";
  else reply = `I've given you what you have room for. Come back with ${left === 1 ? "a free inventory space" : `${left} free inventory spaces`} for the rest.`;
  return { given, left, reply };
}

function probitaChoice(choice) {
  if (choice.npcId !== core.NpcIdentifiers.PROBITA || choice.option !== RECLAIM_OPTION) return;
  choice.end = true;
  const { player } = choice;
  const { reply } = reclaimAll(player);
  const { DialogueChainBuilder, NpcDialogue, PlayerDialogue, EndDialogue } = core;
  player.getDialogueManager().startDialogues(new DialogueChainBuilder().add(
    new PlayerDialogue(0, RECLAIM_OPTION),
    new NpcDialogue(1, core.NpcIdentifiers.PROBITA, reply),
    new EndDialogue(2),
  ));
}

/**
 * The Pets plugin asks for extension pets as it registers ("pets:extensions"), after custom
 * items are loaded: the pets are read, checked and defined then, and join its table.
 */
function addPets(request) {
  services = request.services;
  request.pets.push(...load(core));
}

module.exports = {
  name: "CustomPets",
  description: "A pet version of any NPC from custom-pets.json: follower, Talk-to lines, chathead and Probita reclaim.",
  register(pluginApi) {
    api = pluginApi;
    core = pluginApi.core;
    api.onCustomEvent("pets:extensions", addPets);
    api.onCustomEvent("pets:interact", talk);
    api.onCustomEvent("npc-dialogue:menu", probitaMenu);
    api.onCustomEvent("npc-dialogue:choice", probitaChoice);
  },
  _test: { load, problemsOf, followerDefinition, lostPets, reclaimAll, probitaMenu, probitaChoice, talk, pets: () => pets,
    SOURCE, FOLLOWER_ACTIONS, ITEM_ACTIONS, RECLAIM_OPTION, CHATHEAD_MODEL_BASE, chatheadFile },
};
