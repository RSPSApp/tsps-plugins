"use strict";

/**
 * LeaguesItems (TSPS Plugin Hub package `leagues-items`, format 1).
 *
 * Enables League relic items on main (non-league) worlds, with per-item toggles in plugin config:
 * - Clue compass (30363): alphabetical STASH & Falo teleports, Current-step, Last-destination, Falo waiver
 * - Fairy mushroom (25102): Fairy rings, Spirit trees (Wilderness 20 cap), Tool leprechauns, Last-destination
 * - Forager's pouch (30357): 100-cap herb pouch (Check/Fill/Withdraw/bank Empty), gathering finds, batch Herblore, 90% secondary save, 4-dose potions
 * - Map of alacrity (33233): region-grouped Agility shortcut teleports (including sub-options) & Last-destination
 * - Crystal of Echoes (25104): Save-memory (coords + HP<=127 + Prayer + Special), Teleport-back, Check-memories
 * - Leprechaun's vault (30359): Open Seed Vault anywhere
 * - Banker's briefcase (30361): region-grouped Bank Heist teleports (including sub-options) & Last-destination
 * - Evil eye (33227): region-grouped boss & raid teleports (including sub-options) & Last-destination
 * - Arcane grimoire (26551): Change Spellbook, Previous Spellbook, Check Previous (carried & worn)
 * - Flask of fervour (33239): full restore, 4-tick invulnerability, 3 explosions, damage cooldown reduction
 * - Butler's bell (33237): Demon butler offline gather/process jobs and bank collection
 * - Minion whistle (28769): demonic minion summon, Zamorak item upgrades, Rules/Banish/Check
 * - Sage's axe (28773): 6/8-tile thrown weapon executing NPCs <20% HP
 * - Searing boots (28771): running Agility XP, auto-cook caught fish, auto-smelt mined ore
 * - Knapsack (33218/33220): 140-cap / 3-kind gathered item container (toggleable on main worlds)
 *
 * Note: Shadowflame quadrant (33253) already works natively on main worlds.
 * On league worlds, every handler defers to the server's built-in league relic handlers.
 */

const CONFIG = {
  "leagues-items:clue-compass": { type: "boolean", default: true, label: "Clue compass", help: "Enable Clue compass (30363) teleports and Falo waiver on main worlds." },
  "leagues-items:fairy-mushroom": { type: "boolean", default: true, label: "Fairy mushroom", help: "Enable Fairy mushroom (25102) teleports on main worlds." },
  "leagues-items:foragers-pouch": { type: "boolean", default: true, label: "Forager's pouch", help: "Enable Forager's pouch (30357) storage (cap 100), gathering finds, and Herblore perks on main worlds." },
  "leagues-items:map-of-alacrity": { type: "boolean", default: true, label: "Map of alacrity", help: "Enable Map of alacrity (33233) Agility shortcut teleports on main worlds." },
  "leagues-items:crystal-of-echoes": { type: "boolean", default: true, label: "Crystal of Echoes", help: "Enable Crystal of Echoes (25104) memory save and recall on main worlds." },
  "leagues-items:leprechauns-vault": { type: "boolean", default: true, label: "Leprechaun's vault", help: "Enable Leprechaun's vault (30359) Seed Vault access anywhere on main worlds." },
  "leagues-items:bankers-briefcase": { type: "boolean", default: true, label: "Banker's briefcase", help: "Enable Banker's briefcase (30361) Bank Heist teleports on main worlds." },
  "leagues-items:evil-eye": { type: "boolean", default: true, label: "Evil eye", help: "Enable Evil eye (33227) boss & raid teleports on main worlds." },
  "leagues-items:arcane-grimoire": { type: "boolean", default: true, label: "Arcane grimoire", help: "Enable Arcane grimoire (26551) spellbook switching on main worlds." },
  "leagues-items:flask-of-fervour": { type: "boolean", default: true, label: "Flask of fervour", help: "Enable Flask of fervour (33239) heal, invulnerability, explosions, and cooldown reduction on main worlds." },
  "leagues-items:butlers-bell": { type: "boolean", default: true, label: "Butler's bell", help: "Enable Butler's bell (33237) Demon butler offline gathering/processing on main worlds." },
  "leagues-items:minion-whistle": { type: "boolean", default: true, label: "Minion whistle", help: "Enable Minion whistle (28769) demonic minion summon and Zamorak item upgrades on main worlds." },
  "leagues-items:sages-axe": { type: "boolean", default: true, label: "Sage's axe", help: "Enable Sage's axe (28773) 6/8-tile thrown execute (<20% HP) on main worlds." },
  "leagues-items:searing-boots": { type: "boolean", default: true, label: "Searing boots", help: "Enable Searing boots (28771) running Agility XP and auto-cook/auto-smelt on main worlds." },
  "leagues-items:knapsack": { type: "boolean", default: true, label: "Knapsack", help: "Enable Knapsack (33218/33220) actions and item storage on main worlds." },
};

const ANY_WILDERNESS_LEVEL = 60;
const SPIRIT_TREE_WILDERNESS_LEVEL = 20;
const ENTRANA = { minX: 2800, maxX: 2879, minY: 3320, maxY: 3391, z: 0 };
const UNDERWATER = { minX: 3712, maxX: 3839, minY: 10240, maxY: 10367, z: 1 };
const HITPOINTS_CAP = 127;

// Cache generic option menu (interface 187, script 217).
const MENU_INTERFACE = "menu";
const MENU_CHOICES = "menu:lj_layer1";
const SCRIPT_MAINMODAL_OPEN = 2524;
const SCRIPT_MENU = 217;
const SCRIPT_RESTORE_INPUT = 2158;
const MAINMODAL_OPEN_ARGS = [-1, -1];
const MENU_NUMBERED = 1;
const PAUSE_BUTTON = 1;
const MENU_SLOTS = 512;

// Worn sub-option cache params.
const WORN_OPTION_CLICK = 2;
const WORN_SUBOP_FIRST = 661;
const WORN_SUBOP_BASE = 2066;
const WORN_SUBOP_STEP = 8;

// Safe landing search when a destination tile is blocked.
const LANDING_REACH = 30;
const LANDING_RADIUS = 4;
const STEPS = [[1, 0, 1], [3, -1, 0], [4, 1, 0], [6, 0, -1]];

// Persisted attribute keys.
const ATTR_CLUE_LAST = "leagues-items:clue-compass-last";
const ATTR_FAIRY_LAST = "leagues-items:fairy-mushroom-last";
const ATTR_ALACRITY_LAST = "leagues-items:map-of-alacrity-last";
const ATTR_CRYSTAL_MEMORY = "leagues-items:crystal-of-echoes-memory";
const ATTR_BRIEFCASE_LAST = "leagues-items:bankers-briefcase-last";
const ATTR_EVIL_EYE_LAST = "leagues-items:evil-eye-last";
const ATTR_GRIMOIRE_PREV = "leagues-items:arcane-grimoire-prev";
const ATTR_FLASK_READY_AT = "leagues-items:flask-of-fervour-ready-at";
const ATTR_BUTLER_JOB = "leagues-items:butler-job";
const ATTR_BUTLER_STORE = "leagues-items:butler-store";
const ATTR_MINION_ITEMS = "leagues-items:minion-items";
const ATTR_MINION_AOE_OFF = "leagues-items:minion-aoe-disabled";
const ATTR_MINION_FOLLOW_OFF = "leagues-items:minion-follow-disabled";
const ATTR_MINION_ITEMS_OFF = "leagues-items:minion-pickup-items-disabled";
const ATTR_MINION_NOTED_OFF = "leagues-items:minion-pickup-noted-disabled";
const ATTR_MINION_VALUE = "leagues-items:minion-pickup-value";
const POUCH_STORE_META = "league:forager-pouch";

// Forager's pouch constants.
const FORAGER_HERB_CAP = 100;
const FORAGER_COOLDOWN_TICKS = 9;
const FORAGER_LEVEL_RANGE = 25;
const FORAGER_SAVE_CHANCE = 0.9;
const FORAGER_MAX_BATCH = 28;
const FORAGER_BANK_EMPTY_OP = 9;
const FORAGER_TRIGGERS = ["mining:success", "woodcutting:success", "fishing:success", "hunter:success"];
const FORAGER_ALSO_SAVED = ["torstolvial"];
const FORAGER_NEVER_SAVED = ["prif_crystal_shard_crushed"];
const FORAGER_HERBS = [
  ["unidentified_guam", "Guam"],
  ["unidentified_marentill", "Marentill"],
  ["unidentified_tarromin", "Tarromin"],
  ["unidentified_harralander", "Harralander"],
  ["unidentified_ranarr", "Ranarr"],
  ["unidentified_toadflax", "Toadflax"],
  ["unidentified_irit", "Irit"],
  ["unidentified_avantoe", "Avantoe"],
  ["unidentified_kwuarm", "Kwuarm"],
  ["unidentified_snapdragon", "Snapdragon"],
  ["unidentified_cadantine", "Cadantine"],
  ["unidentified_lantadyme", "Lantadyme"],
  ["unidentified_dwarf_weed", "Dwarf Weed"],
  ["unidentified_torstol", "Torstol"],
  ["unidentified_huasca", "Huasca"],
];

const SPELLBOOKS = [
  { key: "NORMAL", name: "Standard" },
  { key: "ANCIENT", name: "Ancient" },
  { key: "LUNAR", name: "Lunar" },
  { key: "ARCEUUS", name: "Arceuus" },
];

const NO_LAST_DESTINATION = "You haven't teleported anywhere with that yet.";
const ENTRANA_PROHIBITED = "You are holding some items that are prohibited on Entrana.";

const DATA = {"clueTeleports":[{"name":"Agility Pyramid","x":3357,"y":2829,"z":0},{"name":"Al Kharid Mine","x":3302,"y":3289,"z":0},{"name":"Ancient Cavern","x":1764,"y":5366,"z":1},{"name":"Arceuus Library","x":1641,"y":3809,"z":0},{"name":"Ardougne (Market)","x":2671,"y":3302,"z":0},{"name":"Ardougne (Training Camp)","x":2532,"y":3377,"z":0,"quest":"Biohazard"},{"name":"Ardougne (West Chapel)","x":2528,"y":3294,"z":0,"quest":"Plague City"},{"name":"Ardougne (Windmill)","x":2634,"y":3386,"z":2},{"name":"Ardougne (Zoo)","x":2607,"y":3284,"z":0},{"name":"Barbarian Outpost Agility course","x":2542,"y":3550,"z":0,"quest":"Alfred Grimhand's Barcrawl"},{"name":"Barbarian Village","x":3110,"y":3421,"z":0},{"name":"Barrows Chest","x":3548,"y":9690,"z":0},{"name":"Cam Torum Entrance","x":1428,"y":3119,"z":0},{"name":"Canifis","x":3491,"y":3488,"z":0},{"name":"Castle Drakan","x":3562,"y":3379,"z":0},{"name":"Castle Wars","x":2444,"y":3092,"z":0},{"name":"Catacombs of Kourend","x":1662,"y":10045,"z":0},{"name":"Catherby (Archery shop)","x":2824,"y":3441,"z":0},{"name":"Catherby (Bank)","x":2808,"y":3437,"z":0},{"name":"Catherby (Beehive)","x":2764,"y":3439,"z":0},{"name":"Catherby (Fishing shop)","x":2837,"y":3435,"z":0},{"name":"Chaos Temple","x":3242,"y":3662,"z":0},{"name":"Civitas illa Fortis (Grand Museum)","x":1722,"y":3153,"z":0},{"name":"Civitas illa Fortis (Temple)","x":1702,"y":3080,"z":0},{"name":"Death Altar","x":2210,"y":4841,"z":0},{"name":"Digsite","x":3374,"y":3420,"z":0},{"name":"Digsite Exam centre","x":3355,"y":3348,"z":0},{"name":"Draynor Manor","x":3089,"y":3332,"z":0},{"name":"Draynor Village (Crossroads)","x":3110,"y":3289,"z":0},{"name":"Draynor Village (Jail)","x":3130,"y":3249,"z":0},{"name":"Draynor Village (Market)","x":3083,"y":3253,"z":0},{"name":"Draynor Village (Miss Schism)","x":3095,"y":3253,"z":0},{"name":"Edgeville","x":3078,"y":3503,"z":0},{"name":"Edgeville Monastery","x":3056,"y":3483,"z":0},{"name":"Emir's Arena","x":3315,"y":3242,"z":0},{"name":"Enchanted Valley","x":3023,"y":4517,"z":0},{"name":"Entrana","x":2851,"y":3354,"z":0},{"name":"Falador (Gem shop)","x":2942,"y":3339,"z":0},{"name":"Falador (Party room)","x":3044,"y":3371,"z":0},{"name":"Falo the Bard","x":2689,"y":3549,"z":0},{"name":"Fight Arena","x":2571,"y":3151,"z":0},{"name":"Fishing Guild (Inside)","x":2592,"y":3409,"z":0},{"name":"Fishing Guild (Outside)","x":2609,"y":3393,"z":0},{"name":"Fishing Platform","x":2786,"y":3277,"z":0},{"name":"Fremennik Isles Mine","x":2374,"y":3848,"z":0,"quest":"The Fremennik Isles"},{"name":"Gnome Agility course","x":2473,"y":3419,"z":2},{"name":"Goblin Village","x":2958,"y":3502,"z":0},{"name":"God Wars Dungeon (K'ril's room)","x":2931,"y":5338,"z":2},{"name":"Gwenith","x":2212,"y":3427,"z":0},{"name":"Heroes' Guild","x":2916,"y":9892,"z":0,"quest":"Heroes' Quest"},{"name":"Hosidius (Charcoal Burners)","x":1712,"y":3469,"z":0},{"name":"Hosidius Mess","x":1646,"y":3631,"z":0},{"name":"Jiggig","x":2478,"y":3047,"z":0},{"name":"Keep Le Faye","x":2755,"y":3399,"z":0},{"name":"Kharazi Jungle","x":2951,"y":2932,"z":0,"quest":"Legends' Quest"},{"name":"King Black Dragon","x":3067,"y":10253,"z":0},{"name":"Lava Dragon Isle","x":3229,"y":3831,"z":0},{"name":"Lava Maze","x":3069,"y":3861,"z":0},{"name":"Legends Guild (Inside)","x":2728,"y":3371,"z":0},{"name":"Legends guild (outside)","x":2736,"y":3350,"z":0},{"name":"Lighthouse","x":2511,"y":3640,"z":2},{"name":"Limestone Mine","x":3372,"y":3498,"z":0},{"name":"Lord Iorwerth's Encampment","x":2198,"y":3256,"z":0},{"name":"Lumber Yard Sawmill","x":3299,"y":3490,"z":0},{"name":"Lumbridge (Bob's axes)","x":3234,"y":3200,"z":0},{"name":"Lumbridge (Swamp caves)","x":3167,"y":9571,"z":0},{"name":"Lumbridge (Swamp)","x":3201,"y":3170,"z":0},{"name":"Lumbridge (Windmill)","x":3162,"y":3297,"z":0},{"name":"Morytania Mausoleum","x":3500,"y":3574,"z":0},{"name":"Mount Karuulm","x":1318,"y":3839,"z":0},{"name":"Mountain Camp","x":2810,"y":3678,"z":0},{"name":"Mudskipper Point","x":2989,"y":3111,"z":0},{"name":"Musa Point","x":2910,"y":3169,"z":0},{"name":"Observatory","x":2439,"y":3165,"z":0},{"name":"Port Sarim","x":3049,"y":3237,"z":0},{"name":"Pyramid Plunder","x":1934,"y":4426,"z":0},{"name":"Rimmington (Crossroads)","x":2981,"y":3277,"z":0},{"name":"Rimmington (Mine)","x":2976,"y":3238,"z":0},{"name":"Salvager Overlook","x":1615,"y":3296,"z":0},{"name":"Seers' Village","x":2731,"y":3476,"z":0},{"name":"Shadow Dungeon","x":2630,"y":5070,"z":0},{"name":"Shantay Pass","x":3308,"y":3124,"z":0},{"name":"Shayzien Combat Ring","x":1541,"y":3630,"z":0},{"name":"Shayzien War Tent","x":1488,"y":3636,"z":0},{"name":"Shilo Village","x":2853,"y":2953,"z":0},{"name":"Sinclair Mansion","x":2736,"y":3534,"z":0},{"name":"Slayer Tower","x":3423,"y":3535,"z":2},{"name":"Sophanem","x":3291,"y":2781,"z":0},{"name":"Soul Altar","x":1811,"y":3855,"z":0},{"name":"Tai Bwo Wannai Village","x":2802,"y":3080,"z":0},{"name":"Taverley (Stone Circle)","x":2924,"y":3478,"z":0},{"name":"Trollheim","x":2888,"y":3676,"z":0},{"name":"Trollweiss Mountain","x":2782,"y":3786,"z":0,"quest":"Troll Romance"},{"name":"Tzhaar Gem stall","x":2465,"y":5149,"z":0},{"name":"Tzhaar Weapon Shop","x":2478,"y":5145,"z":0},{"name":"Underground Pass","x":2007,"y":4709,"z":1},{"name":"Varrock (Aris' Tent)","x":3207,"y":3422,"z":0},{"name":"Varrock (Clothes shop)","x":3209,"y":3415,"z":0},{"name":"Varrock (Grand Exchange)","x":3160,"y":3464,"z":0},{"name":"Varrock (Palace Gardens)","x":3231,"y":3494,"z":0},{"name":"Varrock (Palace library)","x":3213,"y":3490,"z":0},{"name":"Varrock (Rune shop)","x":3252,"y":3403,"z":0},{"name":"Warriors' Guild","x":2845,"y":3541,"z":0},{"name":"Watchtower","x":2931,"y":4718,"z":2},{"name":"White Wolf Mountain","x":2850,"y":3496,"z":0},{"name":"Wilderness Axe hut","x":3186,"y":3957,"z":0},{"name":"Wilderness Bandit Camp","x":3026,"y":3699,"z":0},{"name":"Wilderness Volcano","x":3368,"y":3929,"z":0},{"name":"Wizards' Tower","x":3114,"y":3194,"z":0},{"name":"Yanille","x":2604,"y":3091,"z":0},{"name":"Zul-Andra","x":2203,"y":3058,"z":0}],"leprechauns":[{"name":"Al Kharid","x":3319,"y":3204,"z":0},{"name":"Aldarin","x":1364,"y":2943,"z":0},{"name":"Ardougne Monastery","x":2619,"y":3221,"z":0},{"name":"Auburnvale","x":1448,"y":3354,"z":0},{"name":"Brimhaven","x":2773,"y":3211,"z":0},{"name":"Canifis","x":3454,"y":3468,"z":0},{"name":"Catherby","x":2815,"y":3467,"z":0},{"name":"Champions' Guild","x":3182,"y":3354,"z":0},{"name":"Draynor Manor","x":3087,"y":3352,"z":0},{"name":"Entrana","x":2812,"y":3332,"z":0},{"name":"Etceteria","x":2596,"y":3860,"z":0},{"name":"Falador Farm","x":3053,"y":3305,"z":0},{"name":"Falador Park","x":3008,"y":3370,"z":0},{"name":"Farming Guild","x":1236,"y":3732,"z":0},{"name":"Fossil Island","x":3712,"y":3839,"z":0},{"name":"Harmony Island","x":3792,"y":2840,"z":0},{"name":"Hosidius Allotment","x":1741,"y":3552,"z":0},{"name":"Hosidius Saltpetre","x":1696,"y":3544,"z":0},{"name":"Hosidius Vinery","x":1806,"y":3555,"z":0},{"name":"Kastori North","x":1352,"y":3057,"z":0},{"name":"Kastori South","x":1354,"y":3029,"z":0},{"name":"Lletya","x":2346,"y":3164,"z":0},{"name":"Locus Oasis","x":1683,"y":2971,"z":0},{"name":"Lumbridge","x":3196,"y":3228,"z":0},{"name":"Nemus Retreat","x":1369,"y":3317,"z":0},{"name":"North of Ardougne","x":2671,"y":3368,"z":0},{"name":"North of McGrubor's Wood","x":2663,"y":3521,"z":0},{"name":"North of Seth Groats' farm","x":3222,"y":3316,"z":0},{"name":"Ortus Farm","x":1593,"y":3099,"z":0},{"name":"Port Phasmatys","x":3596,"y":3524,"z":0},{"name":"Port Sarim","x":3064,"y":3255,"z":0},{"name":"Prifddinas","x":3295,"y":6105,"z":0},{"name":"Rimmington","x":2939,"y":3219,"z":0},{"name":"Tai Bwo Wannai","x":2797,"y":3104,"z":0},{"name":"Taverley","x":2941,"y":3432,"z":0},{"name":"Tree Gnome Stronghold East","x":2478,"y":3444,"z":0},{"name":"Tree Gnome Stronghold West","x":2439,"y":3414,"z":0},{"name":"Tree Gnome Village","x":2485,"y":3178,"z":0},{"name":"Troll Stronghold","x":2825,"y":3685,"z":0},{"name":"Underwater","x":3732,"y":10270,"z":0},{"name":"Varrock","x":3232,"y":3455,"z":0},{"name":"Weiss","x":2848,"y":3930,"z":0},{"name":"White Wolf Mountain","x":2863,"y":3432,"z":0},{"name":"Yanille","x":2573,"y":3108,"z":0}],"briefcaseRegions":[{"name":"Asgarnia","destinations":[{"name":"Ancient Prison","x":2904,"y":5203,"z":0},{"name":"Camdozaal","x":2978,"y":5798,"z":0},{"name":"Crafting Guild","x":2935,"y":3280,"z":0},{"name":"Falador (East)","x":3013,"y":3355,"z":0},{"name":"Falador (West)","x":2947,"y":3368,"z":0},{"name":"Mining Guild","x":3013,"y":9718,"z":0},{"name":"Motherlode Mine","x":3760,"y":5666,"z":0},{"name":"Port Sarim","x":3045,"y":3235,"z":0},{"name":"Rogues' Den","x":3040,"y":4969,"z":1},{"name":"Void Knights' Outpost","x":2667,"y":2653,"z":0},{"name":"Warriors' Guild","x":2843,"y":3543,"z":0}]},{"name":"Desert","destinations":[{"name":"Al Kharid","x":3269,"y":3167,"z":0},{"name":"Emir's Arena","x":3383,"y":3270,"z":0},{"name":"Mage Training Arena","x":3365,"y":3318,"z":1},{"name":"Nardah","x":3427,"y":2891,"z":0},{"name":"Shantay Pass","x":3308,"y":3120,"z":0},{"name":"Sophanem","x":2799,"y":5169,"z":0,"quest":"Contact!"},{"name":"Tombs of Amascut","x":3354,"y":9120,"z":0,"quest":"Beneath Cursed Sands"},{"name":"Unkah","x":3156,"y":2835,"z":0}]},{"name":"Fremennik","destinations":[{"name":"Blast Furnace","x":1948,"y":4957,"z":0,"quest":"The Giant Dwarf"},{"name":"Etceteria","x":2618,"y":3895,"z":0,"quest":"Throne of Miscellania"},{"name":"Jatizso","x":2417,"y":3801,"z":0,"quest":"The Fremennik Isles"},{"name":"Keldagrim","x":2838,"y":10207,"z":0,"quest":"The Giant Dwarf"},{"name":"Lunar Isle","x":2098,"y":3919,"z":0},{"name":"Neitiznot","x":2336,"y":3808,"z":0,"quest":"The Fremennik Isles"},{"name":"Peer the Seer","x":2635,"y":3668,"z":0}]},{"name":"Kandarin","destinations":[{"name":"Ape Atoll","x":2780,"y":2783,"z":0},{"name":"Ardougne (North)","x":2615,"y":3332,"z":0},{"name":"Ardougne (South)","x":2654,"y":3283,"z":0},{"name":"Barbarian Outpost","x":2536,"y":3573,"z":0},{"name":"Castle Wars","x":2443,"y":3083,"z":0},{"name":"Catherby","x":2809,"y":3441,"z":0},{"name":"Corsair Cove","x":2569,"y":2864,"z":0},{"name":"Fishing Guild","x":2586,"y":3420,"z":0},{"name":"Gnome Stronghold (North)","x":2449,"y":3482,"z":1},{"name":"Gnome Stronghold (South)","x":2446,"y":3424,"z":1},{"name":"Legends' Guild","x":2732,"y":3379,"z":2,"quest":"Legends' Quest"},{"name":"Myths' Guild","x":2465,"y":2848,"z":1,"quest":"Dragon Slayer II"},{"name":"Ourania","x":3014,"y":5624,"z":0},{"name":"Piscatoris","x":2330,"y":3689,"z":0},{"name":"Port Khazard","x":2661,"y":3162,"z":0},{"name":"Seers' Village","x":2724,"y":3493,"z":0},{"name":"Yanille","x":2613,"y":3092,"z":0}]},{"name":"Karamja","destinations":[{"name":"Mor Ul Rek","x":2543,"y":5141,"z":0},{"name":"Rionasta","x":2783,"y":3094,"z":0},{"name":"Shilo Village","x":2852,"y":2954,"z":0},{"name":"Tzhaar City","x":2445,"y":5180,"z":0}]},{"name":"Kourend","destinations":[{"name":"Arceuus","x":1624,"y":3746,"z":0},{"name":"Blast mine","x":1499,"y":3857,"z":0},{"name":"Chambers of Xeric","x":1254,"y":3571,"z":0},{"name":"Charcoal camp","x":1719,"y":3465,"z":0},{"name":"Ent dungeon","x":1551,"y":9873,"z":0},{"name":"Farming Guild","x":1253,"y":3741,"z":0},{"name":"Hosidius","x":1748,"y":3599,"z":0},{"name":"Hosidius Kitchen","x":1676,"y":3615,"z":0},{"name":"Kourend Castle","x":1612,"y":3681,"z":2},{"name":"Land's End","x":1512,"y":3421,"z":0},{"name":"Lovakengj","x":1525,"y":3740,"z":0},{"name":"Lovakengj mine","x":1438,"y":3828,"z":0},{"name":"Mount Karuulm","x":1324,"y":3824,"z":0},{"name":"Port Piscarilius","x":1804,"y":3790,"z":0},{"name":"Saltpetre mine","x":1702,"y":3528,"z":0},{"name":"Shayzien","x":1488,"y":3592,"z":0},{"name":"Shayzien War Tent","x":1486,"y":3646,"z":0},{"name":"Sulphur mine","x":1454,"y":3858,"z":0},{"name":"Vinery","x":1809,"y":3566,"z":0},{"name":"Wintertodt","x":1640,"y":3944,"z":0},{"name":"Woodcutting Guild","x":1592,"y":3476,"z":0}]},{"name":"Misthalin","destinations":[{"name":"Chest-wreck","x":3771,"y":3898,"z":0},{"name":"Cook's Guild","x":3148,"y":3450,"z":0},{"name":"Dorgesh-Kaan","x":2701,"y":5349,"z":0},{"name":"Draynor","x":3092,"y":3243,"z":0},{"name":"Edgeville","x":3096,"y":3494,"z":0},{"name":"Fossil Island","x":3741,"y":3805,"z":0},{"name":"Grand Exchange","x":3165,"y":3486,"z":0},{"name":"Guardians of the Rift","x":3618,"y":9473,"z":0,"quest":"Temple of the Eye"},{"name":"Isle of Souls","x":2212,"y":2859,"z":0},{"name":"Lumbridge basement","x":3218,"y":9623,"z":0},{"name":"Lumbridge Castle","x":3209,"y":3220,"z":2},{"name":"Varrock (East)","x":3253,"y":3420,"z":0},{"name":"Varrock (West)","x":3185,"y":3436,"z":0},{"name":"Volcanic Mine","x":3819,"y":3809,"z":0},{"name":"Zanaris","x":2381,"y":4458,"z":0}]},{"name":"Morytania","destinations":[{"name":"Burgh de Rott","x":3495,"y":3211,"z":0},{"name":"Canifis","x":3512,"y":3479,"z":0},{"name":"Darkmeyer","x":3604,"y":3367,"z":0,"quest":"Sins of the Father"},{"name":"Hallowed Sepulchre","x":2404,"y":5986,"z":0,"quest":"Sins of the Father"},{"name":"Mos Le'Harmless","x":3680,"y":2982,"z":0},{"name":"Port Phasmatys","x":3688,"y":3466,"z":0},{"name":"Tarn's Lair","x":3195,"y":4569,"z":0,"quest":"Haunted Mine"},{"name":"Trouble Brewing","x":3810,"y":3021,"z":0},{"name":"Ver Sinhaza","x":3651,"y":3208,"z":0}]},{"name":"Tirannwn","destinations":[{"name":"Gauntlet","x":3037,"y":6128,"z":1},{"name":"Lletya","x":2352,"y":3164,"z":0},{"name":"Prifddinas (North)","x":3258,"y":6105,"z":0},{"name":"Prifddinas (South)","x":3295,"y":6059,"z":0},{"name":"Trahaearn mine","x":3307,"y":12443,"z":0}]},{"name":"Varlamore","destinations":[{"name":"Aldarin","x":1399,"y":2928,"z":0},{"name":"Cam Torum","x":1454,"y":9569,"z":1},{"name":"Civitas illa Fortis (East)","x":1780,"y":3094,"z":0},{"name":"Civitas illa Fortis (West)","x":1647,"y":3118,"z":0},{"name":"Fortis Colosseum","x":1804,"y":9502,"z":0},{"name":"Hueycoatl","x":1527,"y":3292,"z":0},{"name":"Hunter Guild","x":1543,"y":3041,"z":0},{"name":"Quetzacalli Gorge","x":1519,"y":3229,"z":0}]},{"name":"Wilderness","destinations":[{"name":"Ferox Enclave","x":3130,"y":3631,"z":0},{"name":"Mage Arena","x":2534,"y":4712,"z":0}]}],"alacrityAreas":[{"name":"Asgarnia","destinations":[{"name":"Dwarf mine: Crevice","x":3035,"y":9806},{"name":"Falador: Crumbling wall","x":2936,"y":3355},{"name":"Falador: Wall grapple","x":3033,"y":3390},{"name":"Falador: Wall tunnel","x":2948,"y":3313},{"name":"Heroes' guild: Crevice","x":2898,"y":9902},{"name":"Ice dungeon: Giants tunnel","x":2992,"y":9547},{"name":"Ice dungeon: Wyvern/hobgoblin tunnel","x":3025,"y":9571},{"name":"Ice dungeon: Wyvern entry tunnel","x":3012,"y":9550},{"name":"Ice mountain: Rocks","x":2997,"y":3483},{"name":"Taverley: Wall climb","x":2947,"y":3439},{"name":"Taverley dungeon: Blue dragon pipe","x":2886,"y":9799},{"name":"Troll stronghold: Rooftop rocks","x":2844,"y":3693},{"name":"Trollheim: Easy climb","x":2869,"y":3671},{"name":"Trollheim: Hard climb","x":2903,"y":3680},{"name":"Trollheim: Wilderness climb","x":2946,"y":3678}]},{"name":"Desert","destinations":[{"name":"Kalphite lair: Crevice","x":3500,"y":9510,"z":2},{"name":"Pollnivneach: Stepping stone","x":3371,"y":2958}]},{"name":"Fremennik","destinations":[{"name":"Slayer dungeon: Crevice","x":2735,"y":10008},{"name":"Miscellania: Stepping stone","x":2575,"y":3861},{"name":"Waterbirth island: Rocks","x":2547,"y":3749},{"name":"Waterbirth island: Dungeon crevice","x":1852,"y":4406,"z":3}]},{"name":"Kandarin","destinations":[{"name":"Corsair cove: Rocks","x":2546,"y":2871},{"name":"Corsair cove: Cave pillar jump","x":1981,"y":8999,"z":1},{"name":"Gnome Stronghold: Rock climb","x":2486,"y":3515},{"name":"Eagles peak: Rocks","x":2322,"y":3502},{"name":"Coal trucks: Log balance","x":2603,"y":3477},{"name":"Sinclair mansion: Log balance","x":2722,"y":3592},{"name":"Yanille: Wall climb","x":2561,"y":3107},{"name":"Yanille: Wall tunnel","x":2575,"y":3107},{"name":"Yanille Wall grapple","x":2556,"y":3075},{"name":"Yanille dungeon: Pipe","x":2578,"y":9506}]},{"name":"Karamja","destinations":[{"name":"Brimhaven: Rope swing","x":2709,"y":3209},{"name":"Brimhaven dungeon: Moss giants","x":2649,"y":9562},{"name":"Cairn isle: Rockslide","x":2795,"y":2979},{"name":"Crandor: Rock climb","x":2832,"y":3247},{"name":"Shilo village: Stepping stone","x":2863,"y":2971},{"name":"Shilo village: Rocks","x":2870,"y":3003}]},{"name":"Kourend","destinations":[{"name":"Karuulm: Climb","x":1324,"y":3777},{"name":"Dense essence mine: Boulder jump","x":1776,"y":3884},{"name":"Dense essence mine: Rocks (west)","x":1742,"y":3854},{"name":"Chasm of fire: Gap","x":1448,"y":10097,"z":1},{"name":"Chasm of fire: Chain","x":1435,"y":10075,"z":2},{"name":"Hosidius: River stepping stone","x":1720,"y":3551}]},{"name":"Morytania","destinations":[{"name":"Burgh de rott: Fence","x":3477,"y":3221},{"name":"Mausoleum: Bridge jump","x":3503,"y":3558},{"name":"Meyerditch lab: Cave (advanced)","x":3539,"y":9772},{"name":"Mort myre: Stepping stone","x":3417,"y":3325},{"name":"Mos le'harmless: Stepping stone","x":3715,"y":2969},{"name":"Slayer tower: Broken window","x":3444,"y":3533},{"name":"Slayer tower: Chain (medium)","x":3421,"y":3549},{"name":"Slayer tower: Chain (hard)","x":3446,"y":3575,"z":1},{"name":"Slayer tower: Ivy climb","x":3418,"y":3533}]},{"name":"Tirannwn","destinations":[{"name":"Arandar: Rocks (North)","x":2346,"y":3300},{"name":"Arandar: Rocks (Mid)","x":2338,"y":3286},{"name":"Arandar: Rocks (South)","x":2338,"y":3253},{"name":"Zul-andra: Stepping stone","x":2160,"y":3072}]},{"name":"Varlamore","destinations":[{"name":"Aldarin: Rocks","x":1343,"y":2917},{"name":"Nemus retreat (north)","x":1368,"y":3327},{"name":"Nemus retreat (south)","x":1369,"y":3294},{"name":"Nemus retreat (east)","x":1393,"y":3309},{"name":"Auburn valley: Log balance (north)","x":1453,"y":3329},{"name":"Custodia cave: Gap squeeze","x":1324,"y":3363},{"name":"Darkfrost: Rocks","x":1477,"y":3309},{"name":"Proudspire: Lower rocks","x":1586,"y":3261},{"name":"Proudspire: Upper rocks","x":1581,"y":3249},{"name":"Ralos rise: Rocks","x":1465,"y":3128},{"name":"Mokhaiotl ruins: Pillar","x":1311,"y":9506,"z":1,"quest":"The Final Dawn"},{"name":"Stalker den: Stepping stone","x":1308,"y":9786,"quest":"Shadows of Custodia"},{"name":"Tlati rainforest: Log balance","x":1283,"y":3147},{"name":"Zanaris: Cosmic altar path","x":2400,"y":4404}]},{"name":"Wilderness","destinations":[{"name":"Lava dragon isle: Stepping stone","x":3201,"y":3807},{"name":"Lava maze: Stepping stone","x":3092,"y":3878},{"name":"Wilderness god wars dungeon: Entry crevice","x":3066,"y":10149,"z":3}]}],"evilEyeMenu":{"title":"Select a region","areaTitle":"Evil Eye teleports - {region}","source":"237/04057, 01104, 01107, 01133: script menu's titles on interface 187"},"evilEyeAreas":[{"name":"Asgarnia","destinations":[{"name":"Cerberus","x":1309,"y":1269},{"name":"Commander Zilyana","x":2909,"y":5265},{"name":"Giant Mole","x":1752,"y":5236},{"name":"General Graardor","x":2862,"y":5354,"z":2},{"name":"Kree'arra","x":2839,"y":5294,"z":2},{"name":"K'ril Tsutsaroth","x":2925,"y":5333,"z":2},{"name":"Nex","x":2883,"y":5280,"z":2},{"name":"Royal Titans","x":2950,"y":9574},{"name":"Whisperer","x":2656,"y":6386}]},{"name":"Desert","region":"Kharidian Desert","destinations":[{"name":"Kalphite Queen","x":3508,"y":9497,"z":2},{"name":"Leviathan","x":2063,"y":6435},{"name":"Tempoross","x":3148,"y":2840},{"name":"Tombs of Amascut","x":3357,"y":2713}]},{"name":"Fremennik","region":"Fremennik Province","destinations":[{"name":"Dagannoth Kings","x":1910,"y":4367},{"name":"Duke Sucellus","x":3039,"y":6432},{"name":"Phantom Muspah","x":2909,"y":10317},{"name":"Vorkath","x":2272,"y":4052}]},{"name":"Kandarin","destinations":[{"name":"Kraken","x":2280,"y":10016},{"name":"Thermonuclear smoke devil","label":"Thermonuclear Smoke Devil","x":2379,"y":9452}]},{"name":"Karamja","destinations":[{"name":"Fight Cave","label":"Fight Caves","x":2438,"y":5168},{"name":"Inferno","x":2496,"y":5119},{"name":"TzHaar-Ket-Rak's Challenges","label":"TzHaar-Ket-Rak","x":2544,"y":5111}]},{"name":"Kourend","region":"Great Kourend","destinations":[{"name":"Alchemical hydra","x":1354,"y":10259},{"name":"Chambers of Xeric","x":1234,"y":3572},{"name":"Hespori","x":1230,"y":3730},{"name":"Mimic","x":1645,"y":3570,"z":1},{"name":"Sarachnis","x":1842,"y":9913},{"name":"Skotizo","x":1662,"y":10049},{"name":"Wintertodt","x":1630,"y":3963},{"name":"Yama","x":1439,"y":10076}]},{"name":"Morytania","destinations":[{"name":"Araxxor","x":3658,"y":9816},{"name":"Barrows (chest)","label":"Barrows Chest","x":3551,"y":9694},{"name":"Barrows (surface)","label":"Barrows Surface","x":3565,"y":3288},{"name":"Grotesque Guardians","x":3426,"y":3541,"z":2},{"name":"The Nightmare","x":3808,"y":9756,"z":1},{"name":"Theatre of Blood","label":"Theatre of blood","x":3676,"y":3217}]},{"name":"Tirannwn","destinations":[{"name":"The Gauntlet","x":3227,"y":6114},{"name":"Zalcano","x":3283,"y":6058},{"name":"Zulrah","x":2211,"y":3057}]},{"name":"Varlamore","destinations":[{"name":"Abyssal Sire","x":3039,"y":4800},{"name":"Amoxliatl","x":1602,"y":9631},{"name":"Doom of Mokhaiotl","x":1311,"y":9531,"z":1},{"name":"Fortis Colosseum","x":1795,"y":3107},{"name":"The Hueycoatl","label":"Hueycoatl","x":1524,"y":3290},{"name":"Blood Moon","label":"Moons of peril (Blood)","x":1413,"y":9632},{"name":"Blue Moon","label":"Moons of peril (Blue)","x":1440,"y":9658},{"name":"Eclipse Moon","label":"Moons of peril (Eclipse)","x":1466,"y":9632},{"name":"Vardorvis","x":1117,"y":3428}]},{"name":"Wilderness","destinations":[{"name":"Artio","x":3116,"y":3675},{"name":"Callisto","x":3292,"y":3848},{"name":"Calvar'ion","x":3180,"y":3682},{"name":"Chaos Elemental","x":3261,"y":3927},{"name":"Chaos Fanatic","x":2979,"y":3846},{"name":"Corporeal Beast","x":2966,"y":4252,"z":2},{"name":"Crazy Archaeologist","x":2977,"y":3702},{"name":"King Black Dragon","x":3017,"y":3850},{"name":"Scorpia","x":3233,"y":3950},{"name":"Spindel","x":3182,"y":3745},{"name":"Venenatis","x":3320,"y":3796},{"name":"Vet'ion","x":3222,"y":3786}]}],"butler":{"npc":"league_butler","bell":"Butler's bell","npcName":"Demon butler","table":"butlers_bell_actions","columns":{"action":"action_id","raw":"raw_noun","processed":"processed_noun","xp":"processed_xp","skill":"xp_skill","rate":"gather_base_rate"},"processRateDivisor":2,"jobs":{"1":{"gather":[["LOGS",20],["OAK_LOGS",30],["TEAK_LOGS",40],["MAHOGANY_LOGS",10]],"process":[["PLANK",20],["OAK_PLANK",30],["TEAK_PLANK",40],["MAHOGANY_PLANK",10]]},"2":{"gather":[["CLAY",6],["IRON_ORE",50],["MITHRIL_ORE",30],["ADAMANTITE_ORE",10],["RUNITE_ORE",4]],"process":[["SOFT_CLAY",6],["STEEL_BAR",50],["MITHRIL_BAR",30],["ADAMANTITE_BAR",10],["RUNITE_BAR",4]]},"3":{"gather":[["RAW_SALMON",260],["RAW_TUNA",210],["RAW_LOBSTER",180],["RAW_SWORDFISH",135],["RAW_MONKFISH",95],["RAW_SHARK",80],["RAW_MANTA_RAY",25],["RAW_ANGLERFISH",15]],"process":[["SALMON",260],["TUNA",210],["LOBSTER",180],["SWORDFISH",135],["MONKFISH",95],["SHARK",80],["MANTA_RAY",25],["ANGLERFISH",15]]},"4":{"gather":[["GRIMY_TARROMIN",217],["GRIMY_HARRALANDER",196],["GRIMY_RANARR_WEED",65],["GRIMY_IRIT_LEAF",130],["GRIMY_AVANTOE",130],["GRIMY_KWUARM",65],["GRIMY_CADANTINE",65],["GRIMY_LANTADYME",65],["GRIMY_DWARF_WEED",67]],"process":[["TARROMIN_POTION_UNF_",217],["HARRALANDER_POTION_UNF_",196],["RANARR_POTION_UNF_",65],["IRIT_POTION_UNF_",130],["AVANTOE_POTION_UNF_",130],["KWUARM_POTION_UNF_",65],["CADANTINE_POTION_UNF_",65],["LANTADYME_POTION_UNF_",65],["DWARF_WEED_POTION_UNF_",67]]},"5":{"gather":[["FLAX",1]],"process":[["BOW_STRING",1]]}},"lines":{"greeting":"[Yes, sir/Yes, madam/Yes]?","newJob":"I have a new job for you.","show":"Show me what you've collected so far.","nothing":"Nothing.","nothingSaid":"Nothing. As you were.","excellent":"[Excellent choice, sir/Excellent choice, madam/Excellent choice].","collectFirst":"[Apologies, sir,/Apologies, madam,/Apologies,] but you will need to collect the resources I have already procured before I commence work on anything new.","processTitle":"Process the {raw} into {processed}?","processYes":"Yes, process them. <col=3366ff>({rate}/Minute)</col>","processNo":"No, just give me the raw materials. <col=3366ff>({rate}/Minute)</col>","started":"Certainly. I'll start right away.","nothingYet":"I am afraid I have not managed to collect anything new [just yet, sir/just yet, madam/just yet].","useVoice":"[Sorry, sir,/Sorry, madam,/Sorry,] but may find it easier to communicate verbally, instead of using the bell.","noInstances":"You can't use that inside instances"},"_ours":"Not in any source, so ours: the job menu lists the jobs by the cache's raw_noun in action_id order under the default title; the butler stands beside the player who rang (the random events' tile) and leaves when they log out or he is out of their view; the collection goes to the bank (the Wiki's interface shows thousands of bars, which no inventory holds; what the bank cannot take stays with him) and its XP is shared as it is collected; the change's collection stops the job's work until a new job is assigned (no item accrues while the player is away or re-talks, offline too); a request left half-done (the dialogue closed before the collection) leaves the old job running, as live. The new-job flow itself (apology, collection, conversation ended; the player re-talks the butler for the new job) is the live transcript's."},"minion":{"whistle":"Minion whistle","durationTicks":3000,"attackTicks":3,"minHit":3,"maxHit":10,"maxHitPerItem":2,"maxItems":5,"attackRoll":45000,"spared":["Yama","Gemstone Crab"],"activeVarbit":"league_guardian_active","spawn":{"animation":"leagues_6_thrall_imp_melee_spawn","graphic":"leagues_6_thrall_imp_melee_spawn_vfx_spotanim"},"styles":{"melee":{"npc":"debug_thrall_imp_melee","attack":"leagues_6_thrall_imp_melee_attack","change":"leagues_6_thrall_imp_melee_transition_vfx_spotanim","hitDelayTicks":1},"ranged":{"npc":"debug_thrall_imp_ranged","attack":"leagues_6_thrall_imp_ranged_attack","change":"leagues_6_thrall_imp_ranged_transition_vfx_spotanim","projectile":{"id":"leagues_6_thrall_imp_ranged_attack_vfx_projanim","delay":30,"end":60,"angle":25,"startHeight":7.5,"endHeight":7.5},"hitDelayTicks":2},"magic":{"npc":"debug_thrall_imp_magic","attack":"leagues_6_thrall_imp_magic_attack_02","change":"leagues_6_thrall_imp_magic_transition_vfx_spotanim","projectile":{"id":"leagues_6_thrall_imp_magic_attack_vfx_projanim","delay":30,"end":60,"angle":25,"startHeight":25,"endHeight":25},"hitDelayTicks":2}},"_rules":"The whistle's Rules submenu (the item's subops: Area of effect, Follow, Looting) sets the cache's league_guardian_* varbits on varp 4033, each a 'disabled' flag (0 on), and varp league_guardian_pickup_value, the loot threshold in coins; all are saved and sent again at login. No recording of the whistle's Rules or Check (no capture sets these vars), so every line and the Looting menu's layout are ours. Follow off: the minion stays where it is between fights, unless its owner is more than `followLeash` tiles off or on another plane (ours, so it is never lost). The AoE and the looting are not implemented yet (Minion.LeagueRelics.js), so those settings are stored for them.","rules":{"title":"Rules","aoe":{"subop":"Area of effect","varbit":"league_guardian_aoe_disabled","on":"Your minion will now use area of effect attacks.","off":"Your minion will no longer use area of effect attacks."},"follow":{"subop":"Follow","varbit":"league_guardian_follow_disabled","on":"Your minion will now follow you.","off":"Your minion will no longer follow you."},"items":{"varbit":"league_guardian_pickup_items_disabled","on":"Your minion will now pick up items.","off":"Your minion will no longer pick up items."},"noted":{"varbit":"league_guardian_pickup_noted_disabled","on":"Your minion will now pick up items as noted.","off":"Your minion will no longer pick up items as noted."},"looting":{"subop":"Looting","valueVarp":"league_guardian_pickup_value","title":"Looting","items":"Pick up items: {state}","noted":"Pick up noted: {state}","value":"Minimum value: {value} coins","valuePrompt":"Enter the minimum value of items to pick up:","valueSet":"Your minion will now only pick up items worth at least {value} coins.","enabled":"<col=229628>On</col>","disabled":"<col=ff3045>Off</col>"}},"followLeash":15,"_check":"Check: the time the minion has left, or that none is summoned. Ours (unrecorded).","check":{"left":"Your minion has {minutes} minutes left.","lastMinute":"Your minion has less than a minute left.","none":"You do not have a minion summoned."},"_hitDelayTicks":"Ours: the projectile lands 60 client cycles (2 ticks) after the attack; a melee hit a tick on.","_zamorak":"The Wiki's 'possible accepted items' (Minion_(Demonic_Pacts_League)#Zamorak items by region), each the id its Wiki page gives for the item itself (not its broken, locked, uncharged or (u) forms: the Wiki does not know whether variants count). One used on the whistle, unnoted, not given before and with room under the five, is taken.","zamorakItems":{"Zamorak staff":2417,"Zamorak cape":2414,"Imbued Zamorak cape":21795,"Zamorak max cape":13333,"Imbued Zamorak max cape":21780,"Zamorak max hood":13334,"Imbued Zamorak max hood":21782,"Elder chaos hood":20595,"Elder chaos top":20517,"Elder chaos robe":20520,"Dagon'hai hat":24288,"Dagon'hai robe top":24291,"Dagon'hai robe bottom":24294,"Thammaron's sceptre":22555,"Thammaron's sceptre (a)":27788,"Accursed sceptre":27665,"Accursed sceptre (a)":27679,"Viggora's chainmace":22545,"Ursine chainmace":27660,"Unholy blessing":20223,"Zamorak full helm":2657,"Zamorak platebody":2653,"Zamorak platelegs":2655,"Zamorak plateskirt":3478,"Zamorak kiteshield":2659,"Zamorak coif":10374,"Zamorak d'hide body":10370,"Zamorak chaps":10372,"Zamorak bracers":10368,"Zamorak d'hide boots":19936,"Zamorak d'hide shield":23194,"Zamorak robe top":10460,"Zamorak robe legs":10468,"Zamorak mitre":10456,"Zamorak cloak":10450,"Zamorak crozier":10444,"Zamorak stole":10474,"Rune scimitar (zamorak)":23334,"Damaged book (Zamorak)":3841,"Unholy book":3842,"Steel heraldic helm (Zamorak)":8712,"Adamant heraldic helm (Zamorak)":22189,"Rune heraldic helm (Zamorak)":8494,"Steel kiteshield (Zamorak)":8776,"Adamant kiteshield (Zamorak)":22157,"Rune kiteshield (Zamorak)":8744,"Zamorak godsword":11808,"Zamorak godsword (or)":20374,"Zamorakian spear":11824,"Staff of the Dead":11791,"Staff of Light":22296,"Banner (Zamorak)":8680,"Zamorakian hasta":11889,"Toxic Staff of the Dead":12904,"Inquisitor's great helm":24419,"Inquisitor's hauberk":24420,"Inquisitor's plateskirt":24421,"Oathplate helm":30750,"Oathplate chest":30753,"Oathplate legs":30756,"Radiant oathplate helm":30777,"Radiant oathplate chest":30779,"Radiant oathplate legs":30781,"Dragon hunter lance":22978,"Zamorak halo":12638,"Zamorak monk top":1035,"Zamorak monk bottom":1033,"Unholy symbol":1724}}};

const BRIEFCASE_BY_NAME = new Map(DATA.briefcaseRegions.flatMap((r) => r.destinations.map((d) => [d.name, d])));
const ALACRITY_BY_NAME = new Map(DATA.alacrityAreas.flatMap((a) => a.destinations.map((d) => [d.name, d])));
const EVIL_EYE_BY_NAME = new Map(DATA.evilEyeAreas.flatMap((a) => a.destinations.map((d) => [d.name, d])));

const pendingMenus = new WeakMap();
const nextForagerFind = new WeakMap();

let api = null;
let core = null;
let menuCacheIds = null;
let foragerHerbOrder = null;
let foragerAlsoSaved = null;
let foragerNeverSaved = null;

const CONFIG_KEYS = {
  clueCompass: "leagues-items:clue-compass",
  fairyMushroom: "leagues-items:fairy-mushroom",
  foragersPouch: "leagues-items:foragers-pouch",
  mapOfAlacrity: "leagues-items:map-of-alacrity",
  crystalOfEchoes: "leagues-items:crystal-of-echoes",
  leprechaunsVault: "leagues-items:leprechauns-vault",
  bankersBriefcase: "leagues-items:bankers-briefcase",
  evilEye: "leagues-items:evil-eye",
  arcaneGrimoire: "leagues-items:arcane-grimoire",
  flaskOfFervour: "leagues-items:flask-of-fervour",
  butlersBell: "leagues-items:butlers-bell",
  minionWhistle: "leagues-items:minion-whistle",
  sagesAxe: "leagues-items:sages-axe",
  searingBoots: "leagues-items:searing-boots",
  knapsack: "leagues-items:knapsack",
};

function enabled(key) {
  return api?.getPluginConfig?.(CONFIG_KEYS[key] ?? key, true) !== false;
}

function inLeague(player) {
  const query = { player, league: null };
  api.emitCustomEvent("league:profile", query);
  return query.league !== null;
}

function menuIds() {
  const { CacheDefinitions } = core;
  menuCacheIds ??= {
    group: CacheDefinitions.getInterfaceId(MENU_INTERFACE),
    choices: CacheDefinitions.getComponentId(MENU_CHOICES),
  };
  return menuCacheIds;
}

function isQuestMissing(player, quest) {
  if (!quest) return false;
  const query = { player, name: quest, complete: null };
  api.emitCustomEvent("quest:is-complete", query);
  return query.complete === false;
}

function isEntranaTile(x, y, z) {
  return (z ?? 0) === ENTRANA.z
    && x >= ENTRANA.minX && x <= ENTRANA.maxX
    && y >= ENTRANA.minY && y <= ENTRANA.maxY;
}

function allowedOnEntrana(player) {
  const request = { player, allowed: true, reason: null, handled: false };
  api.emitCustomEvent("entrana:check-items", request);
  return request.allowed !== false;
}

function showItemBox(player, itemId, text) {
  const { DialogueChainBuilder, ItemStatementDialogue } = core;
  player.getDialogueManager().startDialogues(
    new DialogueChainBuilder().add(new ItemStatementDialogue(0, itemId, text)),
  );
}

function showStatementBox(player, text) {
  const { DialogueChainBuilder, StatementDialogue } = core;
  player.getDialogueManager().startDialogues(
    new DialogueChainBuilder().add(new StatementDialogue(0, text)),
  );
}

function subOption(event) {
  if (!Number.isInteger(event.subOpId) || event.subOpId <= 0) return null;
  const { CacheDefinitions, Equipment } = core;
  const definition = CacheDefinitions.getItem(event.itemId);
  const sub = event.subOpId - 1;
  if (event.interfaceId === Equipment.INVENTORY_INTERFACE_ID) {
    const op = event.clickType - WORN_OPTION_CLICK;
    const params = definition?.params;
    if (op < 0 || !params?.get) return null;
    if (sub === 0) return params.get(WORN_SUBOP_FIRST + op) ?? params.get(WORN_SUBOP_BASE + op) ?? null;
    return params.get(WORN_SUBOP_BASE + op + WORN_SUBOP_STEP * sub) ?? null;
  }
  return definition?.subops?.[event.clickType - 1]?.[sub] ?? null;
}

function reach(tile, limit) {
  const { RegionManager, Location } = core;
  const seen = new Set([`${tile.getX()},${tile.getY()}`]);
  const queue = [tile];
  while (queue.length > 0 && seen.size < limit) {
    const at = queue.shift();
    for (const [direction, dx, dy] of STEPS) {
      const key = `${at.getX() + dx},${at.getY() + dy}`;
      if (seen.has(key) || !RegionManager.canMoveIsBlocked(at, direction, null)) continue;
      seen.add(key);
      queue.push(new Location(at.getX() + dx, at.getY() + dy, at.getZ()));
    }
  }
  return seen.size;
}

function landing(location) {
  const { RegionManager, Location } = core;
  if (!RegionManager?.blocked || !RegionManager.canMoveIsBlocked) return location;
  if (!RegionManager.blocked(location, null)) return location;
  let best = null;
  for (let radius = 0; radius <= LANDING_RADIUS; radius++) {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
        const tile = radius === 0
          ? location
          : new Location(location.getX() + dx, location.getY() + dy, location.getZ());
        if (RegionManager.blocked(tile, null)) continue;
        const tiles = reach(tile, LANDING_REACH);
        if (tiles >= LANDING_REACH) return tile;
        if (!best || tiles > best.tiles) best = { tile, tiles };
      }
    }
  }
  return best?.tile ?? location;
}

function openListMenu(player, title, entries) {
  const { group, choices } = menuIds();
  const sender = player.getPacketSender();
  if (player.getInterfaceId() !== group) sender.sendInterfaceRemoval();
  sender.sendInterface(group);
  sender.sendInterfaceFlagsRange(choices, 0, MENU_SLOTS, PAUSE_BUTTON);
  sender.sendInterfaceScript(SCRIPT_MAINMODAL_OPEN, MAINMODAL_OPEN_ARGS);
  const labels = entries.map(({ label, locked }) => (locked ? `<str>${label}</str>` : label));
  sender.sendClientScript(SCRIPT_MENU, title, labels.join("|"), MENU_NUMBERED);
  pendingMenus.set(player, entries);
}

function chooseFromMenu(event) {
  const { group, choices } = menuIds();
  const buttonId = Number(event.buttonId ?? 0);
  if ((event.groupId ?? (buttonId >>> 16)) !== group || (event.childId ?? (buttonId & 0xffff)) !== (choices & 0xffff)) return;
  const { player } = event;
  const pending = pendingMenus.get(player);
  if (!pending) return;
  event.handled = true;
  pendingMenus.delete(player);
  const entry = pending[Number(event.slot ?? event.action)];
  if (!entry?.next) {
    const sender = player.getPacketSender();
    sender.sendInterfaceRemoval();
    sender.sendInterfaceScript(SCRIPT_RESTORE_INPUT);
  }
  entry?.choose();
}

function menuClosed({ player, interfaceId }) {
  if (interfaceId !== menuIds().group || !pendingMenus.has(player)) return;
  pendingMenus.delete(player);
  player.getPacketSender().sendInterfaceScript(SCRIPT_RESTORE_INPUT);
}

function forgetMenu({ player }) {
  pendingMenus.delete(player);
}

function teleportTo(player, target, limit, onStart, onArrival) {
  const { TeleportHandler, TeleportType } = core;
  if (!TeleportHandler.checkReqs(player, target, limit)) return false;
  TeleportHandler.confirm(
    player,
    target,
    () => {
      onStart?.();
      TeleportHandler.teleport(player, target, TeleportType.NORMAL, false, onArrival);
    },
    limit,
  );
  return true;
}

function teleportWithCast(player, target, limit, castSpec, onStart, onArrival) {
  const { TeleportHandler, CacheDefinitions, Animation, Graphic, Task, TaskManager } = core;
  if (!TeleportHandler.checkReqs(player, target, limit)) return false;
  const seqId = CacheDefinitions.getSeqId(castSpec.animation);
  const gfxId = CacheDefinitions.getSpotanimId(castSpec.graphic);
  const lastVarpId = castSpec.lastVarp ? (CacheDefinitions.getVarpId(castSpec.lastVarp) ?? null) : null;
  TeleportHandler.confirm(
    player,
    target,
    () => {
      onStart?.();
      if (lastVarpId !== null) {
        const packed = ((target.getZ() << 28) | (target.getX() << 14) | target.getY()) >>> 0;
        player.getPacketSender().sendConfig(lastVarpId, packed);
      }
      player.getMovementQueue().setBlockMovement(true).reset();
      player.setTeleporting(true);
      let tick = 0;
      const task = new (class extends Task {
        constructor() {
          super(1, player, true);
        }
        execute() {
          if (!player.isRegistered() || player.getHitpoints() <= 0) {
            player.setTeleporting(false);
            player.getMovementQueue().setBlockMovement(false);
            this.stop();
            return;
          }
          if (tick === 0) {
            if (Number.isInteger(seqId) && seqId >= 0) player.performAnimation(new Animation(seqId));
            if (Number.isInteger(gfxId) && gfxId >= 0) player.performGraphic(new Graphic(gfxId));
          }
          if (tick >= castSpec.landTick) {
            player.setTeleporting(false);
            player.getMovementQueue().setBlockMovement(false).reset();
            const from = player.getLocation?.()?.clone?.() ?? null;
            const fromInstance = player.getPrivateArea?.() != null;
            player.moveTo(target);
            core.PluginManager?.emitCustomEvent?.("teleport:landed", { player, from, fromInstance, to: target });
            onArrival?.();
            this.stop();
            return;
          }
          tick++;
        }
      })();
      TaskManager.submit(task);
    },
    limit,
  );
  return true;
}

function mainAction(configKey, fn) {
  return (event) => {
    if (!enabled(configKey) || inLeague(event.player)) return false;
    event.handled = true;
    fn(event);
    return true;
  };
}

// ---------------------------------------------------------------------------
// 1. Clue compass (30363)
// ---------------------------------------------------------------------------
function clueTeleportToStash(player, entry) {
  if (isQuestMissing(player, entry.quest)) {
    showItemBox(player, core.ItemIdentifiers.CLUE_COMPASS, `You need to have completed the ${entry.quest} quest to go there.`);
    return false;
  }
  if (isEntranaTile(entry.x, entry.y, entry.z) && !allowedOnEntrana(player)) {
    showItemBox(player, core.ItemIdentifiers.CLUE_COMPASS, ENTRANA_PROHIBITED);
    return false;
  }
  const target = landing(new core.Location(entry.x, entry.y, entry.z ?? 0));
  return teleportTo(player, target, ANY_WILDERNESS_LEVEL, null, () => {
    player.setAttribute(ATTR_CLUE_LAST, {
      name: entry.name,
      x: target.getX(),
      y: target.getY(),
      z: target.getZ(),
      ...(entry.quest ? { quest: entry.quest } : {}),
    });
  });
}

function clueOpenMenu({ player }) {
  openListMenu(
    player,
    "Clue Compass teleports",
    DATA.clueTeleports.map((entry) => ({
      label: entry.name,
      locked: isQuestMissing(player, entry.quest),
      choose: () => clueTeleportToStash(player, entry),
    })),
  );
}

function clueCurrentStep({ player }) {
  const step = { player, location: null, target: null, family: null };
  api.emitCustomEvent("treasure-trails:current-step", step);
  if (!step.location) {
    player.sendMessage("<col=ff0000>Read a Clue Scroll to allow the compass to find its location.</col>");
    return;
  }
  if (step.target === "kill" || step.family === "hotcold") {
    showItemBox(player, core.ItemIdentifiers.CLUE_COMPASS, "The Clue Compass doesn't respond to that clue step.");
    return;
  }
  const { x, y, z = 0 } = step.location;
  if (isEntranaTile(x, y, z) && !allowedOnEntrana(player)) {
    showStatementBox(player, "You are holding items that are prohibited on Entrana.");
    return;
  }
  const target = landing(new core.Location(x, y, z));
  teleportTo(player, target, ANY_WILDERNESS_LEVEL, null, () => {
    player.setAttribute(ATTR_CLUE_LAST, { name: "Current step", x: target.getX(), y: target.getY(), z: target.getZ() });
  });
}

function clueLastDestination({ player }) {
  const last = player.getAttribute(ATTR_CLUE_LAST);
  if (!last || !Number.isInteger(last.x) || !Number.isInteger(last.y)) {
    player.sendMessage(NO_LAST_DESTINATION);
    return;
  }
  clueTeleportToStash(player, last);
}

function clueWaiveFalo(request) {
  if (!enabled("clueCompass") || inLeague(request.player)) return;
  if (request.kind === "falo" && request.itemId === core.ItemIdentifiers.CLUE_COMPASS) request.waived = true;
}

// ---------------------------------------------------------------------------
// 2. Fairy mushroom (25102)
// ---------------------------------------------------------------------------
function fairyGo(player, destination) {
  if (isEntranaTile(destination.x, destination.y, destination.z) && !allowedOnEntrana(player)) {
    showItemBox(player, core.ItemIdentifiers.FAIRY_MUSHROOM, ENTRANA_PROHIBITED);
    return false;
  }
  const limit = destination.wildernessLevel ?? ANY_WILDERNESS_LEVEL;
  const target = landing(new core.Location(destination.x, destination.y, destination.z ?? 0));
  return teleportTo(player, target, limit, null, () => {
    player.setAttribute(ATTR_FAIRY_LAST, {
      name: destination.name,
      x: target.getX(),
      y: target.getY(),
      z: target.getZ(),
      wildernessLevel: limit,
    });
  });
}

function fairyOpenRings({ player }) {
  const query = { list: [] };
  api.emitCustomEvent("fairy-rings:destinations", query);
  const entries = query.list
    .slice()
    .sort((a, b) => a.code.localeCompare(b.code))
    .map((ring) => {
      const label = ring.name ? `${ring.code} - ${ring.name}` : ring.code;
      return {
        label,
        locked: false,
        choose: () => fairyGo(player, {
          name: label,
          x: ring.location.getX(),
          y: ring.location.getY(),
          z: ring.location.getZ(),
          wildernessLevel: ANY_WILDERNESS_LEVEL,
        }),
      };
    });
  if (!entries.length) {
    player.sendMessage("You do not have any destinations available.");
    return;
  }
  openListMenu(player, "Fairy Ring teleports", entries);
}

function fairyOpenTrees({ player }) {
  const query = { player, list: [] };
  api.emitCustomEvent("spirit-trees:destinations", query);
  const entries = query.list.map((tree) => ({
    label: tree.name,
    locked: false,
    choose: () => fairyGo(player, {
      name: tree.name,
      x: tree.location.getX(),
      y: tree.location.getY(),
      z: tree.location.getZ(),
      wildernessLevel: SPIRIT_TREE_WILDERNESS_LEVEL,
    }),
  }));
  if (!entries.length) {
    player.sendMessage("You do not have any destinations available.");
    return;
  }
  openListMenu(player, "Spirit Tree teleports", entries);
}

function fairyOpenLeprechauns({ player }) {
  openListMenu(
    player,
    "Tool Leprechaun teleports",
    DATA.leprechauns.map((lep) => ({
      label: lep.name,
      locked: false,
      choose: () => fairyGo(player, { ...lep, wildernessLevel: ANY_WILDERNESS_LEVEL }),
    })),
  );
}

function fairyTeleportPrompt({ player }) {
  api.sendMultiChatboxPrompt(
    player,
    "Where would you like to teleport?",
    "Fairy rings", () => fairyOpenRings({ player }),
    "Spirit trees", () => fairyOpenTrees({ player }),
    "Tool leprechauns", () => fairyOpenLeprechauns({ player }),
  );
}

function fairyLastDestination({ player }) {
  const last = player.getAttribute(ATTR_FAIRY_LAST);
  if (!last || !Number.isInteger(last.x) || !Number.isInteger(last.y)) {
    player.sendMessage(NO_LAST_DESTINATION);
    return;
  }
  fairyGo(player, last);
}

// ---------------------------------------------------------------------------
// 3. Forager's pouch (30357)
// ---------------------------------------------------------------------------
function foragerPouchOf(player) {
  const id = core.ItemIdentifiers.FORAGERS_POUCH;
  const worn = player?.getEquipment?.()?.getItems?.()?.find((item) => item?.getId?.() === id);
  return worn ?? player?.getInventory?.()?.getItems?.()?.find((item) => item?.getId?.() === id) ?? null;
}

function foragerClicked(event) {
  const id = core.ItemIdentifiers.FORAGERS_POUCH;
  const item = event.item ?? event.player.getInventory().getItems()[event.slot];
  return item?.getId?.() === id ? item : foragerPouchOf(event.player);
}

function foragerStored(pouch) {
  const value = pouch.getMetaValue?.(POUCH_STORE_META);
  return value && typeof value === "object" ? { ...value } : {};
}

function foragerHerbs() {
  foragerHerbOrder ??= FORAGER_HERBS
    .map(([gameval, label]) => ({ id: core.CacheDefinitions.getObjId(gameval), label }))
    .filter((herb) => Number.isInteger(herb.id));
  return foragerHerbOrder;
}

function foragerHerbName(itemId) {
  return core.ItemDefinition.forId(itemId)?.getName?.() ?? "Herbs";
}

function foragerNotedId(itemId) {
  const def = core.ItemDefinition.forId(itemId);
  if (def?.isNoted?.()) return itemId;
  const note = def?.getNoteId?.() ?? -1;
  return note > 0 ? note : itemId;
}

function spam(player, text) {
  player.getPacketSender().sendTypedMessage?.(core.ChatType.SPAM, text);
}

function foragerCheck(event) {
  const pouch = foragerClicked(event);
  if (!pouch) return;
  const { player } = event;
  const contents = foragerStored(pouch);
  const held = foragerHerbs().filter((herb) => (contents[herb.id] ?? 0) > 0);
  player.sendMessage("You look in your forager's pouch and see:");
  if (held.length === 0) player.sendMessage("The herb sack is empty.");
  for (const herb of held) player.sendMessage(`${contents[herb.id]} x ${foragerHerbName(herb.id)}`);
}

function foragerFill(event) {
  const pouch = foragerClicked(event);
  if (!pouch) return;
  const { player } = event;
  const inventory = player.getInventory();
  const carried = foragerHerbs().filter((herb) => inventory.getAmount(herb.id) > 0);
  if (carried.length === 0) {
    player.sendMessage("You have no grimy herbs to put in the pouch.");
    return;
  }
  spam(player, "You search your inventory for herbs appropriate to put in the sack...");
  const contents = foragerStored(pouch);
  let moved = 0;
  for (const { id } of carried) {
    const amount = Math.min(FORAGER_HERB_CAP - (contents[id] ?? 0), inventory.getAmount(id));
    if (amount <= 0) continue;
    inventory.deleteNumber(id, amount);
    contents[id] = (contents[id] ?? 0) + amount;
    moved += amount;
  }
  pouch.setMetaValue(POUCH_STORE_META, contents);
  if (moved > 0) spam(player, "You add the herbs to the sack.");
  else player.sendMessage("You don't have enough space for the herbs.");
}

function foragerTakeOut(player, pouch, id, wanted) {
  const contents = foragerStored(pouch);
  const amount = Math.min(wanted, contents[id] ?? 0);
  if (amount <= 0) return 0;
  const note = foragerNotedId(id);
  if (player.getInventory().getAddableAmount(new core.Item(note, amount)) < amount) return -1;
  player.getInventory().adds(note, amount);
  contents[id] -= amount;
  if (contents[id] <= 0) delete contents[id];
  pouch.setMetaValue(POUCH_STORE_META, contents);
  return amount;
}

function foragerEmptyPouch(player, pouch) {
  const contents = foragerStored(pouch);
  const held = foragerHerbs().filter((herb) => (contents[herb.id] ?? 0) > 0);
  if (held.length === 0) {
    player.sendMessage("The herb sack is empty.");
    return;
  }
  spam(player, "You rummage around to see if you can extract any herbs from your herb sack.");
  for (const herb of held) {
    if (foragerTakeOut(player, pouch, herb.id, contents[herb.id]) < 0) {
      player.sendMessage("You don't have enough inventory space.");
      break;
    }
  }
  player.getInventory().refreshItems();
}

function foragerAskAmount(player, herb) {
  player.setEnteredAmountAction({
    execute: (entered) => {
      const pouch = foragerPouchOf(player);
      if (!Number.isFinite(entered) || entered <= 0 || !pouch) return;
      const name = foragerHerbName(herb.id);
      const taken = foragerTakeOut(player, pouch, herb.id, Math.floor(entered));
      if (taken === 0) player.sendMessage(`You don't have any ${name} in your pouch.`);
      else if (taken < 0) player.sendMessage("You don't have enough inventory space.");
      else {
        player.getInventory().refreshItems();
        player.sendMessage(`You withdraw ${taken} ${name} from the pouch.`);
      }
    },
  });
  player.getPacketSender().sendEnterAmountPrompt("How many would you like to withdraw?");
}

function foragerWithdraw(event) {
  const pouch = foragerClicked(event);
  if (!pouch) return;
  const { player } = event;
  const contents = foragerStored(pouch);
  const herbList = foragerHerbs();
  openListMenu(player, "Withdraw Herb", [
    { label: "Empty Pouch", locked: false, choose: () => { const p = foragerPouchOf(player); if (p) foragerEmptyPouch(player, p); } },
    ...herbList.map((herb) => ({
      label: `${herb.label} (${contents[herb.id] ?? 0})`,
      locked: false,
      choose: () => foragerAskAmount(player, herb),
    })),
    { label: "Exit", locked: false, choose: () => {} },
  ]);
}

function foragerBankEmpty(event) {
  if (!enabled("foragersPouch") || event.handled || event.op !== FORAGER_BANK_EMPTY_OP) return;
  if (event.item?.getId?.() !== core.ItemIdentifiers.FORAGERS_POUCH) return;
  const { player } = event;
  if (inLeague(player) || !core.Bank.isOpen(player)) return;
  event.handled = true;
  const pouch = event.item;
  const contents = foragerStored(pouch);
  const held = foragerHerbs().filter((herb) => (contents[herb.id] ?? 0) > 0);
  if (held.length === 0) {
    player.sendMessage("The herb sack is empty.");
    return;
  }
  for (const { id } of held) {
    const bank = player.getBank(core.Bank.getTabForItem(player, id));
    const item = new core.Item(id, contents[id]);
    const amount = bank.getAddableAmount(item);
    if (amount <= 0) continue;
    bank.add(item.setAmount(amount), false);
    contents[id] -= amount;
    if (contents[id] <= 0) delete contents[id];
  }
  pouch.setMetaValue(POUCH_STORE_META, contents);
  if (player.isSearchingBank()) player.getBank(core.Bank.BANK_SEARCH_TAB_INDEX).refreshItems();
  else player.getBank(player.getCurrentBankTab()).refreshItems();
  player.getInventory().refreshItems();
}

function foragerFindHerb({ player, source, method }) {
  if (!enabled("foragersPouch") || source || method === "rumour-sack" || !player?.isPlayer?.() || inLeague(player)) return;
  const pouch = foragerPouchOf(player);
  if (!pouch) return;
  const cycle = core.World.getProcessCycle();
  if (cycle < (nextForagerFind.get(player) ?? 0)) return;
  const level = player.getSkillManager().getCurrentLevel(core.Skill.HERBLORE) + FORAGER_LEVEL_RANGE;
  const contents = foragerStored(pouch);
  const query = { herbs: [] };
  api.emitCustomEvent("herblore:herbs", query);
  const cleanable = query.herbs.filter((herb) => herb.level <= level);
  const candidates = cleanable.filter((herb) => (contents[herb.grimyId] ?? 0) < FORAGER_HERB_CAP);
  if (candidates.length === 0) {
    if (cleanable.length === 0) return;
    nextForagerFind.set(player, cycle + FORAGER_COOLDOWN_TICKS);
    spam(player, "You found a herb, but you have no room for it in your Forager's Pouch!");
    return;
  }
  const herb = candidates[Math.floor(Math.random() * candidates.length)];
  contents[herb.grimyId] = (contents[herb.grimyId] ?? 0) + 1;
  pouch.setMetaValue(POUCH_STORE_META, contents);
  nextForagerFind.set(player, cycle + FORAGER_COOLDOWN_TICKS);
  if (herb.xp > 0) player.getSkillManager().addExperiences(core.Skill.HERBLORE, herb.xp);
  spam(player, "You find a herb whilst gathering and stash it in your Forager's Pouch.");
}

function isPotion(itemId) {
  const name = core.ItemDefinition.forId(itemId)?.getName?.() ?? "";
  return /\(\d\)$/.test(name) || /\(unf\)$/i.test(name) || /^vial of water$/i.test(name);
}

function hasStackableSecondary(recipe) {
  return (recipe?.ingredients ?? []).some(
    ({ id }) => !isPotion(id) && core.ItemDefinition.forId(id)?.isStackable?.() === true,
  );
}

function fourDoseOf(product) {
  if (typeof product !== "string") return null;
  const productId = core.CacheDefinitions.getObjId(product);
  const name = core.ItemDefinition.forId(productId)?.getName?.() ?? "";
  if (!/\(3\)$/.test(name)) return null;
  const wanted = name.replace(/\(3\)$/, "(4)");
  const candidates = [
    product.startsWith("3dose") ? `4dose${product.slice(5)}` : null,
    /_3$/.test(product) ? product.replace(/_3$/, "_4") : null,
    /3$/.test(product) ? product.replace(/3$/, "4") : null,
  ];
  for (const candidate of candidates) {
    const id = candidate && core.CacheDefinitions.getObjId(candidate);
    if (Number.isInteger(id) && core.ItemDefinition.forId(id)?.getName?.() === wanted) return id;
  }
  return null;
}

function foragerMix(request) {
  if (!enabled("foragersPouch") || !request.player?.isPlayer?.() || inLeague(request.player) || !foragerPouchOf(request.player)) return;
  if (!foragerAlsoSaved) {
    foragerAlsoSaved = new Set(FORAGER_ALSO_SAVED.map((n) => core.CacheDefinitions.getObjId(n)).filter(Number.isInteger));
    foragerNeverSaved = new Set(FORAGER_NEVER_SAVED.map((n) => core.CacheDefinitions.getObjId(n)).filter(Number.isInteger));
  }
  const name = (id) => core.ItemDefinition.forId(id)?.getName?.() ?? "";
  const unfinished = /\(unf\)$/i.test(name(request.productId));
  if (!unfinished) {
    request.consume.forEach((item, index) => {
      if (item.count <= 0) return;
      const secondary = index > 0 && (foragerAlsoSaved.has(item.id) || !isPotion(item.id));
      if (!secondary || foragerNeverSaved.has(item.id) || Math.random() >= FORAGER_SAVE_CHANCE) return;
      item.count = 0;
      if (isPotion(item.id)) {
        const vial = request.returns?.find((returned) => returned.count > 0 && /^vial$/i.test(name(returned.id)));
        if (vial) vial.count--;
      }
    });
  }
  const upgrade = request.consume.some((item) => /\(\d\)$/.test(name(item.id)));
  const fourDose = upgrade ? null : fourDoseOf(request.recipe?.product);
  if (!Number.isInteger(fourDose)) return;
  request.productId = fourDose;
  request.extraDose = false;
}

function foragerBatch(request) {
  if (!enabled("foragersPouch") || !request.player?.isPlayer?.() || inLeague(request.player) || !foragerPouchOf(request.player)) return;
  if (request.skill !== core.Skill.HERBLORE) return;
  if (request.kind !== "clean" && request.kind !== "mix") return;
  if (request.kind === "mix" && hasStackableSecondary(request.recipe)) return;
  request.actions = Math.max(request.actions, FORAGER_MAX_BATCH);
}

// ---------------------------------------------------------------------------
// 4. Map of alacrity (33233)
// ---------------------------------------------------------------------------
const ALACRITY_CAST = { landTick: 3, animation: "hotfoot_grace_teleport", graphic: "leagues_6_hotfoot" };

function alacrityGo(player, destination) {
  if (isQuestMissing(player, destination.quest)) {
    player.sendMessage(`You need to complete ${destination.quest} before you can teleport there.`);
    return false;
  }
  const target = landing(new core.Location(destination.x, destination.y, destination.z ?? 0));
  return teleportWithCast(player, target, ANY_WILDERNESS_LEVEL, ALACRITY_CAST, () => {
    player.setAttribute(ATTR_ALACRITY_LAST, { name: destination.name, x: target.getX(), y: target.getY(), z: target.getZ() });
  }, null);
}

function alacrityRegionMenu(player) {
  openListMenu(
    player,
    "Map of Alacrity",
    DATA.alacrityAreas.map((area) => ({
      label: area.region ?? area.name,
      locked: false,
      next: true,
      choose: () => alacrityAreaMenu(player, area),
    })),
  );
}

function alacrityAreaMenu(player, area) {
  openListMenu(player, area.region ?? area.name, [
    ...area.destinations.map((destination) => ({
      label: destination.label ?? destination.name,
      locked: isQuestMissing(player, destination.quest),
      choose: () => alacrityGo(player, destination),
    })),
    { label: "Back", locked: false, next: true, choose: () => alacrityRegionMenu(player) },
  ]);
}

function alacrityRead(event) {
  const picked = subOption(event);
  const area = picked === null ? null : DATA.alacrityAreas.find((a) => a.name.toLowerCase() === picked.toLowerCase());
  if (area) alacrityAreaMenu(event.player, area);
  else alacrityRegionMenu(event.player);
}

function alacrityLast({ player }) {
  const saved = player.getAttribute(ATTR_ALACRITY_LAST);
  const destination = saved?.name ? ALACRITY_BY_NAME.get(saved.name) : null;
  if (!destination) {
    player.sendMessage(NO_LAST_DESTINATION);
    return;
  }
  alacrityGo(player, destination);
}

// ---------------------------------------------------------------------------
// 5. Crystal of Echoes (25104)
// ---------------------------------------------------------------------------
function isUnderwater(location) {
  return location.getZ() === UNDERWATER.z
    && location.getX() >= UNDERWATER.minX && location.getX() <= UNDERWATER.maxX
    && location.getY() >= UNDERWATER.minY && location.getY() <= UNDERWATER.maxY;
}

function crystalMemory(player) {
  const saved = player.getAttribute(ATTR_CRYSTAL_MEMORY);
  return saved && Number.isInteger(saved.x) && Number.isInteger(saved.y) ? saved : null;
}

function crystalSave({ player }) {
  const at = player.getLocation();
  if (player.getPrivateArea?.() || isUnderwater(at)) {
    player.sendMessage("You cannot save a memory here.");
    return;
  }
  player.setAttribute(ATTR_CRYSTAL_MEMORY, {
    x: at.getX(),
    y: at.getY(),
    z: at.getZ(),
    hitpoints: Math.min(HITPOINTS_CAP, player.getHitpoints()),
    prayer: player.getSkillManager().getCurrentLevel(core.Skill.PRAYER),
    special: player.getSpecialPercentage(),
  });
  player.sendMessage("You save a memory of this place into your Crystal of Echoes.");
}

function crystalTeleportBack({ player }) {
  const saved = crystalMemory(player);
  if (!saved) {
    player.sendMessage("Your Crystal of Echoes holds no memory yet.");
    return;
  }
  if (isEntranaTile(saved.x, saved.y, saved.z) && !allowedOnEntrana(player)) {
    player.sendMessage(ENTRANA_PROHIBITED);
    return;
  }
  const target = new core.Location(saved.x, saved.y, saved.z ?? 0);
  teleportTo(player, target, ANY_WILDERNESS_LEVEL, null, () => {
    player.getSkillManager().setCurrentLevel(core.Skill.HITPOINTS, Math.max(1, Math.min(HITPOINTS_CAP, saved.hitpoints)), true);
    player.getSkillManager().setCurrentLevel(core.Skill.PRAYER, saved.prayer, true);
    player.setSpecialPercentage(saved.special);
    core.CombatSpecial.updateBar(player);
  });
}

function crystalCheck({ player }) {
  const saved = crystalMemory(player);
  if (!saved) {
    player.sendMessage("Your Crystal of Echoes holds no memory yet.");
    return;
  }
  player.sendMessage(`Stored memory: (${saved.x}, ${saved.y}, ${saved.z ?? 0}) - Hitpoints: ${saved.hitpoints}, Prayer: ${saved.prayer}, Special: ${saved.special}%.`);
}

// ---------------------------------------------------------------------------
// 6. Leprechaun's vault (30359)
// ---------------------------------------------------------------------------
function vaultOpen({ player }) {
  api.emitCustomEvent("farming:open-seed-vault", { player, opened: false });
}

// ---------------------------------------------------------------------------
// 7. Banker's briefcase (30361)
// ---------------------------------------------------------------------------
function briefcaseGo(player, destination) {
  if (isQuestMissing(player, destination.quest)) {
    player.sendMessage(`You need to have completed the ${destination.quest} quest to go there.`);
    return false;
  }
  if (isEntranaTile(destination.x, destination.y, destination.z) && !allowedOnEntrana(player)) {
    player.sendMessage(ENTRANA_PROHIBITED);
    return false;
  }
  const target = landing(new core.Location(destination.x, destination.y, destination.z ?? 0));
  return teleportTo(player, target, ANY_WILDERNESS_LEVEL, null, () => {
    player.setAttribute(ATTR_BRIEFCASE_LAST, {
      name: destination.name,
      x: target.getX(),
      y: target.getY(),
      z: target.getZ(),
      ...(destination.quest ? { quest: destination.quest } : {}),
    });
  });
}

function briefcaseRegionMenu(player) {
  openListMenu(
    player,
    "Bank Heist teleports",
    DATA.briefcaseRegions.map((region) => ({
      label: region.name,
      locked: false,
      next: true,
      choose: () => briefcaseAreaMenu(player, region),
    })),
  );
}

function briefcaseAreaMenu(player, region) {
  openListMenu(player, `Bank Heist teleports - ${region.name}`, [
    ...region.destinations.map((destination) => ({
      label: destination.name,
      locked: isQuestMissing(player, destination.quest),
      choose: () => briefcaseGo(player, destination),
    })),
    { label: "Back", locked: false, next: true, choose: () => briefcaseRegionMenu(player) },
  ]);
}

function briefcaseTeleport(event) {
  const picked = subOption(event);
  const region = picked === null ? null : DATA.briefcaseRegions.find((r) => r.name.toLowerCase() === picked.toLowerCase());
  if (region) briefcaseAreaMenu(event.player, region);
  else briefcaseRegionMenu(event.player);
}

function briefcaseLast({ player }) {
  const saved = player.getAttribute(ATTR_BRIEFCASE_LAST);
  const destination = saved?.name ? (BRIEFCASE_BY_NAME.get(saved.name) ?? saved) : null;
  if (!destination || !Number.isInteger(destination.x) || !Number.isInteger(destination.y)) {
    player.sendMessage(NO_LAST_DESTINATION);
    return;
  }
  briefcaseGo(player, destination);
}

// ---------------------------------------------------------------------------
// 8. Evil eye (33227)
// ---------------------------------------------------------------------------
const EVIL_EYE_CAST = {
  landTick: 5,
  animation: "evil_eye_cast01",
  graphic: "leagues_6_evil_eye",
  lastVarp: "league_default_teleport_last_destination",
};

function evilEyeGo(player, destination) {
  if (isQuestMissing(player, destination.quest)) {
    player.sendMessage(`You need to complete ${destination.quest} before you can teleport there.`);
    return false;
  }
  const target = landing(new core.Location(destination.x, destination.y, destination.z ?? 0));
  return teleportWithCast(player, target, ANY_WILDERNESS_LEVEL, EVIL_EYE_CAST, () => {
    player.setAttribute(ATTR_EVIL_EYE_LAST, { name: destination.name, x: target.getX(), y: target.getY(), z: target.getZ() });
  }, null);
}

function evilEyeRegionMenu(player) {
  openListMenu(
    player,
    DATA.evilEyeMenu.title,
    DATA.evilEyeAreas.map((area) => ({
      label: area.region ?? area.name,
      locked: false,
      next: true,
      choose: () => evilEyeAreaMenu(player, area),
    })),
  );
}

function evilEyeAreaMenu(player, area) {
  const regionName = area.region ?? area.name;
  openListMenu(player, DATA.evilEyeMenu.areaTitle.replace("{region}", regionName), [
    ...area.destinations.map((destination) => ({
      label: destination.label ?? destination.name,
      locked: isQuestMissing(player, destination.quest),
      choose: () => evilEyeGo(player, destination),
    })),
    { label: "Back", locked: false, next: true, choose: () => evilEyeRegionMenu(player) },
  ]);
}

function evilEyeTeleport(event) {
  const picked = subOption(event);
  const area = picked === null ? null : DATA.evilEyeAreas.find((a) => a.name.toLowerCase() === picked.toLowerCase());
  if (area) evilEyeAreaMenu(event.player, area);
  else evilEyeRegionMenu(event.player);
}

function evilEyeLast({ player }) {
  const saved = player.getAttribute(ATTR_EVIL_EYE_LAST);
  const destination = saved?.name ? EVIL_EYE_BY_NAME.get(saved.name) : null;
  if (!destination) {
    player.sendMessage(NO_LAST_DESTINATION);
    return;
  }
  evilEyeGo(player, destination);
}

// ---------------------------------------------------------------------------
// 9. Arcane grimoire (26551)
// ---------------------------------------------------------------------------
function grimoireCurrent(player) {
  return SPELLBOOKS.find((book) => core.MagicSpellbook[book.key] === player.getSpellbook()) ?? SPELLBOOKS[0];
}

function grimoirePrevious(player) {
  const key = player.getAttribute(ATTR_GRIMOIRE_PREV);
  return SPELLBOOKS.find((book) => book.key === key) ?? null;
}

function grimoireSwap(player, book) {
  const locked = core.SpellbookLocks.spellbookLockedRefusal(player, core.MagicSpellbook[book.key]);
  if (locked) {
    player.sendMessage(locked);
    return;
  }
  const from = grimoireCurrent(player);
  const before = player.getSpellbook();
  core.MagicSpellbook.changeSpellbook(player, core.MagicSpellbook[book.key]);
  if (player.getSpellbook() !== before) player.setAttribute(ATTR_GRIMOIRE_PREV, from.key);
}

function grimoireChange({ player }) {
  const current = grimoireCurrent(player);
  const pairs = SPELLBOOKS.filter((book) => book !== current).flatMap((book) => [book.name, () => grimoireSwap(player, book)]);
  api.sendMultiChatboxPrompt(player, "Choose a spellbook", ...pairs, "Cancel", () => {});
}

function grimoirePrev({ player }) {
  const previous = grimoirePrevious(player);
  if (!previous) {
    player.sendMessage("You haven't changed spellbook with the grimoire yet.");
    return;
  }
  grimoireSwap(player, previous);
}

function grimoireCheckPrev({ player }) {
  const previous = grimoirePrevious(player);
  player.sendMessage(
    previous
      ? `Your previous spellbook was the ${previous.name} spellbook.`
      : "You haven't changed spellbook with the grimoire yet.",
  );
}

// ---------------------------------------------------------------------------
// 10. Flask of fervour (33239)
// ---------------------------------------------------------------------------
const FLASK_TICK_MS = 600;
const FLASK_COOLDOWN_TICKS = 300;
const FLASK_EXPLOSION_TICKS = [1, 3, 5];
const FLASK_RADIUS = 3;
const FLASK_PRAYER_FRACTION = 0.6;
const FLASK_PVP_PRAYER_FRACTION = 0.3;
const FLASK_IMMUNE_TICKS = 4;
const FLASK_IMPACT_DELAYS = [20, 30, 40];
const FLASK_DIRECTIONS = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];
const FLASK_ANIMATION = "vengeance_spell_anim_nostalling";
const FLASK_GRAPHIC = "leagues_6_sigil_of_life";
const FLASK_IMPACT = "leagues_6_sigil_of_life_impact";
const FLASK_SOUND = 165;
const FLASK_COOLDOWN_VARP = "league_relic_flask_of_fervour_cooldown";
const FLASK_SPARED_NAMES = new Set([
  "Yama",
  "Blood Moon", "Blue Moon", "Eclipse Moon",
  "Enraged Blood Moon", "Enraged Blue Moon", "Enraged Eclipse Moon",
  "Fragment of Seren",
  // Tier 3+ vampyres immune to non-flail/blisterwood damage (Wiki)
  "Vyrewatch", "Vyrelord", "Vyrelady", "Ranis Drakan", "Vanstrom Klause",
]);
// Nightmare & Phosani's Nightmare Sleepwalkers, Parasites, and Husks (Wiki)
const FLASK_SPARED_IDS = new Set([
  9446, 9447, 9448, 9449, 9450, 9451, 9452, 9453, 9454, 9455,
  9466, 9467, 9468, 9469, 9470,
]);
// Wiki: enemies that take reduced explosion damage (50%)
const FLASK_REDUCED_NAMES = new Set([
  "Great Olm", "Great Olm (Left claw)", "Great Olm (Right claw)",
  "Alchemical Hydra", "Skotizo", "Vyrewatch Sentinel",
  "The Nightmare", "Phosani's Nightmare", "Guardian",
]);

const flaskShielded = new WeakMap();
const flaskReadyTasks = new WeakMap();

function flaskReadyAt(player) {
  return Number(player.getAttribute(ATTR_FLASK_READY_AT)) || 0;
}

function flaskSendCooldown(player) {
  const varp = core.CacheDefinitions.getVarpId(FLASK_COOLDOWN_VARP);
  if (varp == null) return;
  const left = flaskReadyAt(player) - Date.now();
  const ends = left > 0 ? core.World.getProcessCycle() + Math.ceil(left / FLASK_TICK_MS) + 1 : 0;
  player.getPacketSender().sendConfig(varp, ends);
}

function flaskScheduleReady(player) {
  flaskReadyTasks.get(player)?.stop?.();
  const ticks = Math.max(1, Math.ceil((flaskReadyAt(player) - Date.now()) / FLASK_TICK_MS));
  const task = new core.CountdownTask(player, ticks, () => {
    flaskReadyTasks.delete(player);
    if (flaskReadyAt(player) > Date.now()) return;
    player.setAttribute(ATTR_FLASK_READY_AT, 0);
    player.sendMessage("<col=FE206A>Flask of fervour is ready to use.");
  });
  flaskReadyTasks.set(player, task);
  core.TaskManager.submit(task);
}

function flaskCoolingDown(player) {
  const left = flaskReadyAt(player) - Date.now();
  if (left <= 0) return false;
  player.sendMessage(`<col=FE206A>The Flask of fervour is on cooldown for another ${Math.ceil(left / 1000)} seconds!`);
  return true;
}

function flaskNear(player, other) {
  const here = player.getLocation();
  const base = other.getLocation();
  if (base.getZ() !== here.getZ()) return false;
  const size = Math.max(1, other.getSize?.() ?? 1);
  const dx = here.getX() < base.getX() ? base.getX() - here.getX() : Math.max(0, here.getX() - (base.getX() + size - 1));
  const dy = here.getY() < base.getY() ? base.getY() - here.getY() : Math.max(0, here.getY() - (base.getY() + size - 1));
  return Math.max(dx, dy) <= FLASK_RADIUS;
}

function flaskIsSpared(player, npc) {
  const baseName = npc.getDefinition?.()?.getName?.();
  const curName = npc.getCurrentDefinition?.(player)?.getName?.();
  return FLASK_SPARED_NAMES.has(baseName)
    || FLASK_SPARED_NAMES.has(curName)
    || FLASK_SPARED_IDS.has(npc.getId?.())
    || FLASK_SPARED_IDS.has(npc.getCurrentDefinition?.(player)?.getId?.());
}

function flaskIsReduced(player, npc) {
  const baseName = npc.getDefinition?.()?.getName?.();
  const curName = npc.getCurrentDefinition?.(player)?.getName?.();
  return FLASK_REDUCED_NAMES.has(baseName) || FLASK_REDUCED_NAMES.has(curName);
}

function flaskImpacts(player) {
  const { Graphic, Location } = core;
  const id = core.CacheDefinitions.getSpotanimId(FLASK_IMPACT);
  const here = player.getLocation();
  for (const [dx, dy] of FLASK_DIRECTIONS) {
    FLASK_IMPACT_DELAYS.forEach((delay, step) => {
      const at = new Location(here.getX() + dx * (step + 1), here.getY() + dy * (step + 1), here.getZ());
      player.getPacketSender().sendGlobalGraphic(Graphic.delayed(id, delay), at);
    });
  }
}

function flaskStrike(player, victim, damage) {
  if (damage <= 0) return;
  const hit = new core.HitDamage(damage, core.HitMask.RED).setSource(player)
    .onApplied((dealt) => victim.getCombat().addDamage(player, dealt));
  victim.getCombat().getHitQueue().addPendingDamage([hit]);
}

function flaskExplode(player) {
  if (!player.isRegistered?.() || player.getHitpoints() <= 0) return;
  const { CombatFactory, CanAttackResponse, TimerKey } = core;
  const prayer = player.getSkillManager().getMaxLevel(core.Skill.PRAYER);
  flaskImpacts(player);
  const baseNpcDmg = Math.floor(prayer * FLASK_PRAYER_FRACTION);
  const basePvpDmg = Math.floor(prayer * FLASK_PVP_PRAYER_FRACTION);
  for (const npc of player.getLocalNpcs()) {
    if (npc.getHitpoints() <= 0 || !flaskNear(player, npc) || flaskIsSpared(player, npc)) continue;
    if (!CombatFactory.validTarget(player, npc) || !npc.getCurrentDefinition().isAttackable()) continue;
    if (npc.getTimers().has(TimerKey.ATTACK_IMMUNITY)) continue;
    if (CombatFactory.canAttackByPolicy(player, npc) !== CanAttackResponse.CAN_ATTACK) continue;
    const dmg = flaskIsReduced(player, npc) ? Math.floor(baseNpcDmg * 0.5) : baseNpcDmg;
    flaskStrike(player, npc, dmg);
  }
  for (const other of player.getLocalPlayers?.() ?? []) {
    if (other === player || other.getHitpoints() <= 0 || !flaskNear(player, other)) continue;
    if (!CombatFactory.validTarget(player, other)) continue;
    if (CombatFactory.canAttackByPolicy(player, other) !== CanAttackResponse.CAN_ATTACK) continue;
    flaskStrike(player, other, basePvpDmg);
  }
}

function flaskActivate({ player }) {
  if (flaskCoolingDown(player)) return;
  const { Skill, Animation, Graphic } = core;
  const skills = player.getSkillManager();
  // Restores to base max without lowering overhealed HP or boosted Prayer (Wiki).
  player.setHitpoints(Math.max(player.getHitpoints(), skills.getMaxLevel(Skill.HITPOINTS)));
  skills.setCurrentLevel(Skill.PRAYER, Math.max(skills.getCurrentLevel(Skill.PRAYER), skills.getMaxLevel(Skill.PRAYER)), true);
  player.incrementSpecialPercentage(100);
  core.CombatSpecial.updateBar(player);
  player.setPoisonDamage?.(0);
  api.emitCustomEvent("whisperer:restore-sanity", { player, amount: 100 });
  player.performAnimation(new Animation(core.CacheDefinitions.getSeqId(FLASK_ANIMATION)));
  player.performGraphic(new Graphic(core.CacheDefinitions.getSpotanimId(FLASK_GRAPHIC)));
  player.getPacketSender().sendSound(FLASK_SOUND, 1, 0);
  player.sendMessage("<col=FE206A>Your Flask of fervour unleashes its power. The Sigil has lost power for 3 minutes.");
  flaskShielded.set(player, core.World.getProcessCycle() + FLASK_IMMUNE_TICKS);
  for (const delay of FLASK_EXPLOSION_TICKS) {
    core.TaskManager.submit(new core.CountdownTask(player, delay, () => flaskExplode(player)));
  }
  player.setAttribute(ATTR_FLASK_READY_AT, Date.now() + FLASK_COOLDOWN_TICKS * FLASK_TICK_MS);
  flaskSendCooldown(player);
  flaskScheduleReady(player);
}

function flaskCheck({ player }) {
  if (!flaskCoolingDown(player)) player.sendMessage("<col=FE206A>Flask of fervour is ready to use.");
}

function flaskDamageApply({ target, hit }) {
  const until = target?.isPlayer?.() ? flaskShielded.get(target) : undefined;
  if (until === undefined) return;
  if (core.World.getProcessCycle() >= until) {
    flaskShielded.delete(target);
    return;
  }
  hit.setDamage(0);
}

function flaskDealtDamage({ player, hit }) {
  if (!enabled("flaskOfFervour") || !player?.isPlayer?.() || inLeague(player)) return;
  if (flaskReadyAt(player) <= Date.now()) return;
  for (const damage of hit?.getHits?.() ?? []) {
    damage?.onApplied?.((taken) => {
      const cut = Math.floor((Number(taken) || 0) / 10) * FLASK_TICK_MS;
      if (cut <= 0 || flaskReadyAt(player) <= Date.now()) return;
      player.setAttribute(ATTR_FLASK_READY_AT, Math.max(Date.now(), flaskReadyAt(player) - cut));
      flaskSendCooldown(player);
      flaskScheduleReady(player);
    });
  }
}

function flaskLogin({ player }) {
  if (!enabled("flaskOfFervour") || inLeague(player)) return;
  if (flaskReadyAt(player) > Date.now()) {
    flaskSendCooldown(player);
    flaskScheduleReady(player);
  }
}

function flaskGauntletKit({ player, carried }) {
  if (!enabled("flaskOfFervour") || inLeague(player)) return;
  const id = core.ItemIdentifiers.FLASK_OF_FERVOUR;
  if (!carried?.some?.((item) => item.id === id)) return;
  player.getInventory().adds(id, 1);
  player.getInventory().refreshItems();
  flaskReadyTasks.get(player)?.stop?.();
  flaskReadyTasks.delete(player);
  player.setAttribute(ATTR_FLASK_READY_AT, 0);
  flaskSendCooldown(player);
}

// ---------------------------------------------------------------------------
// 11. Butler's bell (33237)
// ---------------------------------------------------------------------------
const BUTLER_MINUTE_MS = 60_000;
const BUTLER_MAIN_MODAL = (161 << 16) | 16;
const BUTLER_COLLECTION_IFACE = 954;
const BUTLER_WATCH_TICKS = 5;

let butlerJobsCache = null;
const activeButlers = new Map();

function butlerBankAdd(player, itemId, amount) {
  if (!Number.isInteger(itemId) || amount <= 0) return false;
  const container = player.getBank(core.Bank.getTabForItem(player, itemId));
  if (container.getFreeSlots() <= 0 && !container.contains(itemId)) return false;
  container.add(new core.Item(itemId, amount), true);
  return true;
}

function butlerJobTable() {
  if (butlerJobsCache) return butlerJobsCache;
  const { CacheDefinitions } = core;
  const B = DATA.butler;
  const table = CacheDefinitions.getDbTableId(B.table);
  const col = (name) => CacheDefinitions.getDbColumn(table, B.columns[name]);
  butlerJobsCache = new Map();
  for (const row of CacheDefinitions.getDbTableRows(table)) {
    const action = row.int(col("action"));
    butlerJobsCache.set(action, {
      action,
      raw: row.string(col("raw")),
      processed: row.string(col("processed")),
      xp: row.int(col("xp")),
      skill: row.int(col("skill")),
      rate: row.int(col("rate")),
    });
  }
  return butlerJobsCache;
}

function butlerLine(player, key, values = {}) {
  const male = player.getAppearance?.()?.isMale?.() !== false;
  return DATA.butler.lines[key]
    .replace(/\[([^\]]*\/[^\]]*)\]/g, (_m, group) => group.split("/")[male ? 0 : 1])
    .replace(/\{(\w+)\}/g, (m, name) => values[name] ?? m);
}

function butlerJob(player) {
  const saved = player.getAttribute(ATTR_BUTLER_JOB);
  return saved && typeof saved === "object" ? saved : null;
}

function butlerStore(player) {
  const saved = player.getAttribute(ATTR_BUTLER_STORE);
  return Array.isArray(saved) ? saved : [];
}

function butlerRateOf(row, processing) {
  return processing ? row.rate / DATA.butler.processRateDivisor : row.rate;
}

function butlerRoll(table) {
  const total = table.reduce((sum, [, weight]) => sum + weight, 0);
  let pick = Math.random() * total;
  for (const [name, weight] of table) {
    pick -= weight;
    if (pick < 0) return name;
  }
  return table.at(-1)[0];
}

function butlerCatchUp(player, now = Date.now()) {
  const current = butlerJob(player);
  const row = current && !current.paused && butlerJobTable().get(current.action);
  if (!row) return;
  const rate = butlerRateOf(row, current.processing);
  const items = Math.floor(((now - current.since) / BUTLER_MINUTE_MS) * rate);
  if (items <= 0) return;
  const counts = new Map(butlerStore(player));
  const table = DATA.butler.jobs[row.action][current.processing ? "process" : "gather"];
  for (let i = 0; i < items; i++) {
    const name = butlerRoll(table);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  player.setAttribute(ATTR_BUTLER_STORE, [...counts]);
  player.setAttribute(ATTR_BUTLER_JOB, {
    ...current,
    since: current.since + (items / rate) * BUTLER_MINUTE_MS,
    xp: (current.xp ?? 0) + (current.processing ? items * row.xp : 0),
  });
}

function butlerHolds(player) {
  return butlerStore(player).some(([, amount]) => amount > 0);
}

function butlerCollect(player) {
  const current = butlerJob(player);
  const row = current && butlerJobTable().get(current.action);
  const left = [];
  const collected = [];
  for (const [name, amount] of butlerStore(player)) {
    const id = core.ItemIdentifiers[name];
    if (butlerBankAdd(player, id, amount)) collected.push({ id, amount });
    else left.push([name, amount]);
  }
  player.setAttribute(ATTR_BUTLER_STORE, left);
  if (row && current.xp > 0) {
    player.getSkillManager().addExperiences(core.Skill.values()[row.skill], current.xp);
    player.setAttribute(ATTR_BUTLER_JOB, { ...current, xp: 0 });
  }
  const sender = player.getPacketSender();
  sender.sendInventory(core.CacheDefinitions.getInventoryId("butlers_bell_collection"), collected.length, collected);
  sender.sendInterfaceScript(SCRIPT_MAINMODAL_OPEN, MAINMODAL_OPEN_ARGS);
  player.setInterfaceId(BUTLER_COLLECTION_IFACE);
  sender.sendSubInterface(BUTLER_MAIN_MODAL, BUTLER_COLLECTION_IFACE, 0);
}

function butlerNpcId() {
  return core.CacheDefinitions.getNpcId(DATA.butler.npc);
}

function butlerChain(player, entries) {
  const builder = new core.DialogueChainBuilder();
  entries.forEach((make, index) => builder.add(make(index)));
  player.getDialogueManager().startDialogues(builder);
}

function butlerNpcSays(text) {
  return (index) => new core.NpcDialogue(index, butlerNpcId(), text);
}

function butlerPlayerSays(text) {
  return (index) => new core.PlayerDialogue(index, text);
}

function butlerThen(fn) {
  return (index) => new core.ActionDialogue(index, { execute: fn });
}

function butlerMenu(title, options) {
  return (index) => {
    const dlg = new core.OptionDialogue(index, { executeOption: (opt) => options[opt - 1]?.[1]() }, ...options.map(([label]) => label));
    if (title) dlg.setTitle(title);
    return dlg;
  };
}

function butlerStartJob(player, row, processing) {
  player.setAttribute(ATTR_BUTLER_JOB, { action: row.action, processing, since: Date.now(), xp: 0 });
  butlerChain(player, [butlerNpcSays(butlerLine(player, "started"))]);
}

function butlerChooseProcessing(player, row) {
  const raw = butlerRateOf(row, false);
  butlerChain(player, [butlerMenu(butlerLine(player, "processTitle", { raw: row.raw, processed: row.processed }), [
    [butlerLine(player, "processYes", { rate: butlerRateOf(row, true) }), () => butlerStartJob(player, row, true)],
    [butlerLine(player, "processNo", { rate: raw }), () => butlerStartJob(player, row, false)],
  ])]);
}

function butlerPauseJob(player) {
  const current = butlerJob(player);
  if (current && !current.paused) player.setAttribute(ATTR_BUTLER_JOB, { ...current, since: Date.now(), paused: true });
}

function butlerNewJob(player) {
  butlerCatchUp(player);
  const rows = [...butlerJobTable().values()].sort((a, b) => a.action - b.action);
  const menuStep = butlerMenu(null, rows.map((row) => [row.raw, () => butlerChooseProcessing(player, row)]));
  if (butlerHolds(player)) {
    butlerChain(player, [
      butlerPlayerSays(butlerLine(player, "newJob")),
      butlerNpcSays(butlerLine(player, "collectFirst")),
      butlerThen(() => { butlerCollect(player); butlerPauseJob(player); }),
    ]);
    return;
  }
  butlerChain(player, [butlerPlayerSays(butlerLine(player, "newJob")), menuStep]);
}

function butlerShowCollection(player, said) {
  butlerCatchUp(player);
  const opening = said ? [butlerPlayerSays(butlerLine(player, "show"))] : [];
  if (butlerHolds(player)) butlerChain(player, [...opening, butlerThen(() => butlerCollect(player))]);
  else butlerChain(player, [...opening, butlerNpcSays(butlerLine(player, "nothingYet"))]);
}

function butlerOwn(event) {
  return enabled("butlersBell") && !inLeague(event.player) && event.npc && activeButlers.get(event.player) === event.npc;
}

function butlerTalk(event) {
  if (!butlerOwn(event)) return false;
  const { player } = event;
  butlerCatchUp(player);
  const options = [[butlerLine(player, "newJob"), () => butlerNewJob(player)]];
  if (butlerHolds(player)) options.push([butlerLine(player, "show"), () => butlerShowCollection(player, true)]);
  options.push([butlerLine(player, "nothing"), () => butlerChain(player, [
    butlerPlayerSays(butlerLine(player, "nothingSaid")),
    butlerNpcSays(butlerLine(player, "excellent")),
  ])]);
  butlerChain(player, [butlerNpcSays(butlerLine(player, "greeting")), butlerMenu(null, options)]);
  return true;
}

function butlerCollectOption(event) {
  if (!butlerOwn(event)) return false;
  butlerShowCollection(event.player, false);
  return true;
}

function butlerVisible(player, npc) {
  return npc && npc.isRegistered?.() !== false && (player.getLocalNpcs?.() ?? []).includes(npc);
}

function butlerDismiss(player) {
  const npc = activeButlers.get(player);
  activeButlers.delete(player);
  if (npc && npc.isRegistered?.() !== false) api.removeNpc(npc);
}

function butlerTileBeside(player) {
  const origin = player.getLocation();
  const region = api.getRegionManager();
  const area = player.getPrivateArea?.();
  return [[1, 0], [-1, 0], [0, 1], [0, -1]]
    .map(([dx, dy]) => new core.Location(origin.getX() + dx, origin.getY() + dy, origin.getZ()))
    .find((tile) => !region.blocked(tile, area) && region.canMovestart(origin, tile, 1, 1, area)) ?? null;
}

function butlerWatch(player, npc) {
  core.TaskManager.submit(new core.CountdownTask(npc, BUTLER_WATCH_TICKS, () => {
    if (activeButlers.get(player) !== npc) return;
    if (!player.isRegistered?.() || !butlerVisible(player, npc)) butlerDismiss(player);
    else butlerWatch(player, npc);
  }));
}

function butlerRing({ player }) {
  if (player.getPrivateArea?.() != null) {
    player.sendMessage(butlerLine(player, "noInstances"));
    return;
  }
  const current = activeButlers.get(player);
  if (butlerVisible(player, current)) {
    butlerChain(player, [butlerNpcSays(butlerLine(player, "useVoice"))]);
    return;
  }
  butlerDismiss(player);
  const tile = butlerTileBeside(player);
  if (!tile) return;
  const npc = api.spawnNpc({ id: butlerNpcId(), x: tile.getX(), y: tile.getY(), z: tile.getZ(), owner: player, wanderRadius: 0 });
  if (!npc) return;
  activeButlers.set(player, npc);
  npc.setPositionToFace?.(player.getLocation());
  butlerWatch(player, npc);
}

function butlerCheck({ player }) {
  butlerCatchUp(player);
  const current = butlerJob(player);
  const row = current && butlerJobTable().get(current.action);
  const total = butlerStore(player).reduce((sum, [, n]) => sum + n, 0);
  if (!row || current.paused) {
    player.sendMessage(total > 0
      ? `Your butler is currently idle with ${total} item(s) waiting to be collected.`
      : "Your butler is not currently working on any job.");
    return;
  }
  const taskName = current.processing ? row.processed : row.raw;
  player.sendMessage(`Your butler is currently working on ${taskName} (${total} item(s) ready to collect).`);
}

// ---------------------------------------------------------------------------
// 12. Minion whistle (28769)
// ---------------------------------------------------------------------------
const MINION_RULE_ATTRS = {
  aoe: ATTR_MINION_AOE_OFF,
  follow: ATTR_MINION_FOLLOW_OFF,
  items: ATTR_MINION_ITEMS_OFF,
  noted: ATTR_MINION_NOTED_OFF,
};
const MINION_TICKS_PER_MIN = 100;
const MINION_MELEE_REACH = 1;
const MINION_RANGED_REACH = 6;
const MINION_PURSUIT_ATTR = "leagues-items:minion-pursuit";
const MINION_ZAMORAK_IDS = new Set(Object.values(DATA.minion.zamorakItems));
const activeMinions = new Map();

function minionGiven(player) {
  const saved = player.getAttribute(ATTR_MINION_ITEMS);
  return Array.isArray(saved) ? saved : [];
}

function minionMaxHit(player) {
  return DATA.minion.maxHit + DATA.minion.maxHitPerItem * Math.min(DATA.minion.maxItems, minionGiven(player).length);
}

function minionSendActive(player, on) {
  const vb = core.CacheDefinitions.getVarbitId(DATA.minion.activeVarbit);
  if (vb != null) player.getPacketSender().sendVarbit(vb, on ? 1 : 0);
}

function minionStyleNpc(style) {
  return core.CacheDefinitions.getNpcId(DATA.minion.styles[style].npc);
}

function minionSetStyle(minion, style, shown) {
  const look = DATA.minion.styles[style];
  minion.style = style;
  minion.npc.setNpcTransformationId(minionStyleNpc(style));
  if (shown) minion.npc.performGraphic(new core.Graphic(core.CacheDefinitions.getSpotanimId(look.change), 0, 0));
}

function minionRuleOn(player, rule) {
  return player.getAttribute(MINION_RULE_ATTRS[rule]) !== 1;
}

function minionPickupValue(player) {
  return Number(player.getAttribute(ATTR_MINION_VALUE) ?? 0) | 0;
}

function minionSendRules(player) {
  const { CacheDefinitions } = core;
  const sender = player.getPacketSender();
  for (const rule of Object.keys(MINION_RULE_ATTRS)) {
    const vb = CacheDefinitions.getVarbitId(DATA.minion.rules[rule].varbit);
    if (vb != null) sender.sendVarbit(vb, minionRuleOn(player, rule) ? 0 : 1);
  }
  const vp = CacheDefinitions.getVarpId(DATA.minion.rules.looting.valueVarp);
  if (vp != null) sender.sendConfig(vp, minionPickupValue(player));
}

function minionToggleRule(player, rule) {
  const on = !minionRuleOn(player, rule);
  player.setAttribute(MINION_RULE_ATTRS[rule], on ? 0 : 1);
  minionSendRules(player);
  player.sendMessage(on ? DATA.minion.rules[rule].on : DATA.minion.rules[rule].off);
}

function minionWeakestStyle(target) {
  const { AccuracyFormulasDpsCalc: Formulas, BonusManager } = core;
  const rolls = {
    melee: Math.min(...[BonusManager.ATTACK_STAB, BonusManager.ATTACK_SLASH, BonusManager.ATTACK_CRUSH].map((t) => Formulas.defenseMeleeRoll(target, t))),
    ranged: Formulas.defenseRangedRoll(target, "standard"),
    magic: Formulas.defenseMagicRoll(target),
  };
  return Object.entries(rolls).sort(([, a], [, b]) => a - b)[0][0];
}

function minionDefenceRoll(target, style) {
  const { AccuracyFormulasDpsCalc: Formulas, BonusManager } = core;
  if (style === "ranged") return Formulas.defenseRangedRoll(target, "standard");
  if (style === "magic") return Formulas.defenseMagicRoll(target);
  return Math.min(...[BonusManager.ATTACK_STAB, BonusManager.ATTACK_SLASH, BonusManager.ATTACK_CRUSH].map((t) => Formulas.defenseMeleeRoll(target, t)));
}

function minionHitChance(atk, def) {
  return atk > def ? 1 - (def + 2) / (2 * (atk + 1)) : atk / (2 * (def + 1));
}

function minionAttack(player, minion, target) {
  const look = DATA.minion.styles[minion.style];
  const npc = minion.npc;
  npc.performAnimation(new core.Animation(core.CacheDefinitions.getSeqId(look.attack)));
  if (look.projectile) {
    const shot = look.projectile;
    core.Projectile.createProjectile(npc, target, core.CacheDefinitions.getSpotanimId(shot.id), shot.delay, shot.end, shot.startHeight, shot.endHeight)
      .withAngle(shot.angle).sendProjectile();
  }
  const accurate = Math.random() < minionHitChance(DATA.minion.attackRoll, minionDefenceRoll(target, minion.style));
  const max = minionMaxHit(player);
  const damage = accurate ? DATA.minion.minHit + Math.floor(Math.random() * (max - DATA.minion.minHit + 1)) : 0;
  const land = () => {
    if (!target.isRegistered?.() || target.getHitpoints() <= 0) return;
    const hit = new core.HitDamage(damage, damage > 0 ? core.HitMask.RED : core.HitMask.BLUE).setSource(player)
      .onApplied((dealt) => target.getCombat().addDamage(player, dealt));
    target.getCombat().getHitQueue().addPendingDamage([hit]);
    target.getCombat().getLastAttack().reset();
  };
  if (look.hitDelayTicks <= 1) land();
  else core.TaskManager.submit(new core.CountdownTask(npc, look.hitDelayTicks - 1, land));
}

function minionTargetOf(player) {
  const combat = player.getCombat();
  const target = combat.getTarget() ?? combat.getAttacker?.() ?? null;
  if (!target?.isNpc?.() || !target.isRegistered?.() || target.isUntargetable?.() || target.getHitpoints() <= 0) return null;
  if (DATA.minion.spared.includes(target.getDefinition?.()?.getName?.())) return null;
  if (core.CombatFactory.canAttackPermission(player, target) !== core.CanAttackResponse.CAN_ATTACK) return null;
  return target;
}

function minionFollow(minion, player) {
  const npc = minion.npc;
  if (!minionRuleOn(player, "follow") && npc.getLocation?.()?.getZ?.() === player.getLocation().getZ()
    && npc.calculateDistance(player) <= DATA.minion.followLeash) {
    if (npc.getFollowing() != null || npc.getAttribute(MINION_PURSUIT_ATTR) != null) {
      npc.setFollowing(null);
      npc.getMovementQueue().reset();
      npc.setAttribute(MINION_PURSUIT_ATTR, null);
    }
    return;
  }
  if (npc.getFollowing() === player) return;
  npc.getMovementQueue().reset();
  npc.setAttribute(MINION_PURSUIT_ATTR, null);
  npc.setFollowing(player);
}

function minionApproach(minion, target) {
  const { CombatRange, PathFinder } = core;
  const npc = minion.npc;
  if (npc.getInteractingMobile() !== target) npc.setMobileInteraction(target);
  if (CombatRange.overlapsEntities(npc, target)) {
    npc.setFollowing(null);
    npc.setAttribute(MINION_PURSUIT_ATTR, null);
    npc.getMovementQueue().setPursuitCheckpoint(PathFinder.naiveEntityDestination(npc, target));
    return false;
  }
  const reachLimit = minion.style === "melee" ? MINION_MELEE_REACH : MINION_RANGED_REACH;
  if (npc.calculateDistance(target) > reachLimit) {
    npc.setFollowing(null);
    const dest = CombatRange.rangedDestination(npc, target, reachLimit);
    if (!npc.getAttribute(MINION_PURSUIT_ATTR)?.equals?.(dest)) {
      PathFinder.calculateGroundItemRoute(npc, dest);
      npc.setAttribute(MINION_PURSUIT_ATTR, dest);
    }
    return false;
  }
  if (npc.getFollowing() != null || npc.getAttribute(MINION_PURSUIT_ATTR) != null) {
    npc.setFollowing(null);
    npc.getMovementQueue().reset();
    npc.setAttribute(MINION_PURSUIT_ATTR, null);
  }
  return true;
}

function minionTick(player, minion) {
  if (activeMinions.get(player) !== minion) return false;
  if (!player.isRegistered?.() || --minion.ticksLeft <= 0 || !minion.npc.isRegistered?.()) {
    minionDismiss(player);
    return false;
  }
  if (minion.attackIn > 0) minion.attackIn--;
  const target = minionTargetOf(player);
  if (!target) {
    minionFollow(minion, player);
    return true;
  }
  const style = minionWeakestStyle(target);
  if (style !== minion.style) minionSetStyle(minion, style, true);
  if (!minionApproach(minion, target) || minion.attackIn > 0) return true;
  minionAttack(player, minion, target);
  minion.attackIn = DATA.minion.attackTicks;
  return true;
}

function minionSchedule(player, minion) {
  core.TaskManager.submit(new core.CountdownTask(minion.npc, 1, () => {
    if (minionTick(player, minion)) minionSchedule(player, minion);
  }));
}

function minionDismiss(player) {
  const minion = activeMinions.get(player);
  activeMinions.delete(player);
  if (minion?.npc?.isRegistered?.()) api.removeNpc(minion.npc);
  if (player.isRegistered?.()) minionSendActive(player, false);
}

function minionSummon({ player }) {
  minionDismiss(player);
  const here = player.getLocation();
  const npc = api.spawnNpc({ id: minionStyleNpc("melee"), x: here.getX(), y: here.getY(), z: here.getZ(), owner: player, wanderRadius: 0 });
  if (!npc) return;
  npc.setPet(true);
  npc.setUntargetable(true);
  npc.setFollowing(player);
  const minion = { npc, ticksLeft: DATA.minion.durationTicks, style: "melee", attackIn: 0 };
  activeMinions.set(player, minion);
  minionSetStyle(minion, "melee", false);
  npc.performAnimation(new core.Animation(core.CacheDefinitions.getSeqId(DATA.minion.spawn.animation)));
  npc.performGraphic(new core.Graphic(core.CacheDefinitions.getSpotanimId(DATA.minion.spawn.graphic), 0, 0));
  minionSendActive(player, true);
  minionSchedule(player, minion);
}

function minionCheck({ player }) {
  const minion = activeMinions.get(player);
  const count = minionGiven(player).length;
  if (!minion) {
    player.sendMessage(`${DATA.minion.check.none} (Zamorak items absorbed: ${count}/${DATA.minion.maxItems}, max hit ${minionMaxHit(player)}).`);
    return;
  }
  const mins = Math.floor(minion.ticksLeft / MINION_TICKS_PER_MIN);
  const line = mins < 1 ? DATA.minion.check.lastMinute : DATA.minion.check.left.replace("{minutes}", mins);
  player.sendMessage(`${line} (Zamorak items absorbed: ${count}/${DATA.minion.maxItems}, max hit ${minionMaxHit(player)}).`);
}

function minionLooting(player) {
  const m = DATA.minion.rules.looting;
  const state = (rule) => (minionRuleOn(player, rule) ? m.enabled : m.disabled);
  api.sendMultiChatboxPrompt(
    player,
    m.title,
    m.items.replace("{state}", state("items")), () => minionToggleRule(player, "items"),
    m.noted.replace("{state}", state("noted")), () => minionToggleRule(player, "noted"),
    m.value.replace("{value}", minionPickupValue(player).toLocaleString("en-GB")), () => {
      player.setEnteredAmountAction({
        execute: (amount) => {
          const val = Math.floor(Number(amount));
          if (!Number.isSafeInteger(val) || val < 0) return;
          player.setAttribute(ATTR_MINION_VALUE, val);
          minionSendRules(player);
          player.sendMessage(m.valueSet.replace("{value}", val.toLocaleString("en-GB")));
        },
      });
      player.getPacketSender().sendEnterAmountPrompt(m.valuePrompt);
    },
  );
}

function minionRules(event) {
  const { player } = event;
  const picked = subOption(event);
  if (picked === DATA.minion.rules.aoe.subop) minionToggleRule(player, "aoe");
  else if (picked === DATA.minion.rules.follow.subop) minionToggleRule(player, "follow");
  else if (picked === DATA.minion.rules.looting.subop) minionLooting(player);
  else {
    api.sendMultiChatboxPrompt(
      player,
      DATA.minion.rules.title,
      DATA.minion.rules.aoe.subop, () => minionToggleRule(player, "aoe"),
      DATA.minion.rules.follow.subop, () => minionToggleRule(player, "follow"),
      DATA.minion.rules.looting.subop, () => minionLooting(player),
    );
  }
}

function minionFeed(event) {
  if (!enabled("minionWhistle") || inLeague(event.player)) return;
  const whistleId = core.ItemIdentifiers.MINION_WHISTLE;
  const other = event.usedItemId === whistleId ? event.usedWithItemId : event.usedWithItemId === whistleId ? event.usedItemId : -1;
  const slot = event.usedItemId === whistleId ? event.usedWithItemSlot : event.usedItemSlot;
  if (other < 0 || !MINION_ZAMORAK_IDS.has(other)) return;
  event.handled = true;
  const { player } = event;
  const items = minionGiven(player);
  if (items.includes(other)) {
    player.sendMessage("Your Minion whistle has already absorbed that Zamorak item.");
    return;
  }
  if (items.length >= DATA.minion.maxItems) {
    player.sendMessage("Your Minion whistle has already absorbed the maximum number of Zamorak items.");
    return;
  }
  if (player.getInventory().getItems()[slot]?.getId() !== other) return;
  player.getInventory().deleteAtSlot(slot, 1);
  const next = [...items, other];
  player.setAttribute(ATTR_MINION_ITEMS, next);
  player.sendMessage(`The Minion whistle absorbs the item (${next.length}/${DATA.minion.maxItems}, max hit now ${minionMaxHit(player)}).`);
}

function minionLogin({ player }) {
  if (!enabled("minionWhistle") || inLeague(player)) return;
  minionSendActive(player, false);
  minionSendRules(player);
}

// ---------------------------------------------------------------------------
// 13. Sage's axe (28773)
// ---------------------------------------------------------------------------
const SAGES_AXE_SPARED = new Set(["Yama", "Gemstone Crab"]);
const SAGES_AXE_EXECUTE_FRACTION = 0.2;
const SAGES_AXE_BASE_REACH = 6;
const SAGES_AXE_MAX_REACH = 10;
const SAGES_AXE_EXEC_ANIM = 10649; // relics_executioner_attack
const SAGES_AXE_EXEC_GFX = 2634; // relics_executioner_attack_spotanim
const SAGES_AXE_EXEC_PROJ = 2618; // relics_executioner_projanim_01

function wieldsSagesAxe(player) {
  if (!player?.isPlayer?.()) return false;
  const weapon = player.getEquipment().get(core.Equipment.WEAPON_SLOT)?.getId?.();
  return weapon === core.ItemIdentifiers.SAGES_AXE || weapon === core.ItemIdentifiers.SAGES_AXE_2;
}

function sagesAxeCanExecute(attacker, target) {
  if (!enabled("sagesAxe") || !target?.isNpc?.() || !wieldsSagesAxe(attacker) || inLeague(attacker)) return false;
  if (SAGES_AXE_SPARED.has(target.getDefinition?.()?.getName?.())) return false;
  const hp = target.getHitpointsAfterPendingDamage?.() ?? target.getHitpoints();
  return hp > 0 && hp < target.getMaxHitpoints() * SAGES_AXE_EXECUTE_FRACTION;
}

function sagesAxeVisuals(event) {
  if (!sagesAxeCanExecute(event.attacker, event.target)) return;
  event.animation = SAGES_AXE_EXEC_ANIM;
  event.launchGraphic = SAGES_AXE_EXEC_GFX;
  event.projectileId = SAGES_AXE_EXEC_PROJ;
}

function sagesAxeExecute(event) {
  const { attacker, target, combatType, damage } = event;
  if (combatType !== core.CombatType.RANGED || !sagesAxeCanExecute(attacker, target)) return;
  const hp = target.getHitpointsAfterPendingDamage?.() ?? target.getHitpoints();
  damage.setDamage(hp);
  event.accurate = true;
}

function sagesAxeReach(event) {
  const { attacker, combatType } = event;
  if (!enabled("sagesAxe") || combatType !== core.CombatType.RANGED || !wieldsSagesAxe(attacker) || inLeague(attacker)) return;
  // Base weapon profile is 5 (7 on Longrange); Demonic Pacts Sage's axe is 6 (8 on Longrange).
  event.distance = Math.min(SAGES_AXE_MAX_REACH, Math.max(event.distance + 1, SAGES_AXE_BASE_REACH));
}

// ---------------------------------------------------------------------------
// 14. Searing boots (28771)
// ---------------------------------------------------------------------------
const SEARING_RUN_TICKS = 10;
const SEARING_RUN_STEP = 2;
const searingRunners = new WeakMap();
const searingProcessing = new WeakMap();
let searingOreBars = null;

function wearsSearingBoots(player) {
  return Boolean(player?.isPlayer?.()) && enabled("searingBoots") && !inLeague(player)
    && player.getEquipment().contains(core.ItemIdentifiers.SEARING_BOOTS);
}

function searingProcessed(skill, itemId) {
  if (skill === core.Skill.FISHING) {
    const cooked = { rawId: itemId, cookedId: null, xp: null };
    api.emitCustomEvent("cooking:cooked", cooked);
    return cooked.cookedId ? { itemId: cooked.cookedId, skill: core.Skill.COOKING, xp: cooked.xp } : null;
  }
  if (skill === core.Skill.MINING) {
    searingOreBars ??= new Map([[core.ItemIdentifiers.IRON_ORE, core.ItemIdentifiers.STEEL_BAR]]);
    const bar = { oreId: itemId, outputId: searingOreBars.get(itemId) ?? null, barId: null, xp: null };
    api.emitCustomEvent("smithing:bar-for-ore", bar);
    return bar.barId ? { itemId: bar.barId, skill: core.Skill.SMITHING, xp: bar.xp } : null;
  }
  return null;
}

function searingGatherProcess(request) {
  const { player, amount } = request;
  if (request.stored >= amount || !wearsSearingBoots(player)) return;
  const result = searingProcessed(request.skill, request.itemId);
  if (!result) return;
  searingProcessing.set(request, request.itemId);
  request.itemId = result.itemId;
  if (result.xp > 0) player.getSkillManager().addExperiences(result.skill, result.xp * (amount - request.stored));
}

function searingGatherDeliver(request) {
  if (!searingProcessing.has(request)) return;
  searingProcessing.delete(request);
  const left = request.amount - request.stored;
  if (left <= 0) return;
  request.player.getInventory().adds(request.itemId, left);
  request.stored = request.amount;
}

function searingRunTick(player) {
  const watch = searingRunners.get(player);
  const here = player.getLocation();
  const moved = watch.last && watch.last.getZ() === here.getZ()
    && Math.max(Math.abs(here.getX() - watch.last.getX()), Math.abs(here.getY() - watch.last.getY())) === SEARING_RUN_STEP;
  watch.last = here.clone();
  if (!moved || !wearsSearingBoots(player)) return;
  if (++watch.ticks < SEARING_RUN_TICKS) return;
  watch.ticks = 0;
  const level = player.getSkillManager().getMaxLevel(core.Skill.AGILITY);
  player.getSkillManager().addExperiences(core.Skill.AGILITY, 10 + Math.floor((level * 2) / 3));
}

function searingWatchLogin({ player }) {
  if (!enabled("searingBoots") || inLeague(player) || searingRunners.has(player)) return;
  searingRunners.set(player, { last: null, ticks: 0 });
  const next = () => core.TaskManager.submit(new core.CountdownTask(player, 1, () => {
    if (!player.isRegistered?.()) {
      searingRunners.delete(player);
      return;
    }
    searingRunTick(player);
    next();
  }));
  next();
}

function cleanupOnLogout({ player }) {
  forgetMenu({ player });
  butlerDismiss(player);
  minionDismiss(player);
  searingRunners.delete(player);
}

// ---------------------------------------------------------------------------
// Plugin registration
// ---------------------------------------------------------------------------
module.exports = {
  name: "LeaguesItems",
  description: "Enables League relic items on main (non-league) worlds.",
  members: true,
  config: CONFIG,
  register(pluginApi) {
    api = pluginApi;
    core = pluginApi.core;
    menuCacheIds = null;
    foragerHerbOrder = null;
    foragerAlsoSaved = null;
    foragerNeverSaved = null;

    api.persistAttribute(ATTR_CLUE_LAST, null);
    api.persistAttribute(ATTR_FAIRY_LAST, null);
    api.persistAttribute(ATTR_ALACRITY_LAST, null);
    api.persistAttribute(ATTR_CRYSTAL_MEMORY, null);
    api.persistAttribute(ATTR_BRIEFCASE_LAST, null);
    api.persistAttribute(ATTR_EVIL_EYE_LAST, null);
    api.persistAttribute(ATTR_GRIMOIRE_PREV, null);
    api.persistAttribute(ATTR_FLASK_READY_AT, 0);
    api.persistAttribute(ATTR_BUTLER_JOB, null);
    api.persistAttribute(ATTR_BUTLER_STORE, null);
    api.persistAttribute(ATTR_MINION_ITEMS, null);
    api.persistAttribute(ATTR_MINION_AOE_OFF, 0);
    api.persistAttribute(ATTR_MINION_FOLLOW_OFF, 0);
    api.persistAttribute(ATTR_MINION_ITEMS_OFF, 0);
    api.persistAttribute(ATTR_MINION_NOTED_OFF, 0);
    api.persistAttribute(ATTR_MINION_VALUE, 0);

    api.onInterfaceActionClick(chooseFromMenu);
    api.onCustomEvent("interface:closed", menuClosed);
    api.onPlayerLogout(cleanupOnLogout);

    // Clue compass
    api.onItemAction("Clue compass", {
      Teleport: mainAction("clueCompass", clueOpenMenu),
      "Current-step": mainAction("clueCompass", clueCurrentStep),
      "Last-destination": mainAction("clueCompass", clueLastDestination),
    });
    api.onCustomEvent("treasure-trails:requirement-waived", clueWaiveFalo);

    // Fairy mushroom
    api.onItemAction("Fairy mushroom", {
      Teleport: mainAction("fairyMushroom", fairyTeleportPrompt),
      "Last-destination": mainAction("fairyMushroom", fairyLastDestination),
      "Fairy-Ring": mainAction("fairyMushroom", fairyOpenRings),
      "Spirit-tree": mainAction("fairyMushroom", fairyOpenTrees),
      "Tool-leprechauns": mainAction("fairyMushroom", fairyOpenLeprechauns),
    });

    // Forager's pouch
    api.onItemAction("Forager's pouch", {
      Check: mainAction("foragersPouch", foragerCheck),
      Fill: mainAction("foragersPouch", foragerFill),
      Withdraw: mainAction("foragersPouch", foragerWithdraw),
    });
    for (const trigger of FORAGER_TRIGGERS) api.onCustomEvent(trigger, foragerFindHerb);
    api.onCustomEvent(core.Bank.INVENTORY_OP_EVENT, foragerBankEmpty);
    api.onCustomEvent("herblore:mix", foragerMix);
    api.onCustomEvent("skills:actions-per-cycle", foragerBatch);

    // Map of alacrity
    api.onItemAction("Map of alacrity", {
      Read: mainAction("mapOfAlacrity", alacrityRead),
      "Last-destination": mainAction("mapOfAlacrity", alacrityLast),
    });

    // Crystal of Echoes
    api.onItemAction("Crystal of Echoes", {
      "Save-memory": mainAction("crystalOfEchoes", crystalSave),
      "Teleport-back": mainAction("crystalOfEchoes", crystalTeleportBack),
      "Check-memories": mainAction("crystalOfEchoes", crystalCheck),
    });

    // Leprechaun's vault
    api.onItemAction("Leprechaun's vault", {
      Open: mainAction("leprechaunsVault", vaultOpen),
    });

    // Banker's briefcase
    api.onItemAction("Banker's briefcase", {
      Teleport: mainAction("bankersBriefcase", briefcaseTeleport),
      "Last-destination": mainAction("bankersBriefcase", briefcaseLast),
    });

    // Evil eye
    api.onItemAction("Evil eye", {
      Teleport: mainAction("evilEye", evilEyeTeleport),
      "Last-destination": mainAction("evilEye", evilEyeLast),
    });

    // Arcane grimoire
    api.onItemAction("Arcane grimoire", {
      "Change Spellbook": mainAction("arcaneGrimoire", grimoireChange),
      "Previous Spellbook": mainAction("arcaneGrimoire", grimoirePrev),
      "Check Previous": mainAction("arcaneGrimoire", grimoireCheckPrev),
    });

    // Flask of fervour
    api.onItemAction("Flask of fervour", {
      Activate: mainAction("flaskOfFervour", flaskActivate),
      Check: mainAction("flaskOfFervour", flaskCheck),
    });
    api.onCustomEvent("combat:damage-apply", flaskDamageApply);
    api.onPlayerDealtDamage(flaskDealtDamage);
    api.onPlayerLogin(flaskLogin);
    api.onCustomEvent("gauntlet:starting-kit", flaskGauntletKit);

    // Butler's bell
    api.onItemAction(DATA.butler.bell, {
      Ring: mainAction("butlersBell", butlerRing),
      Check: mainAction("butlersBell", butlerCheck),
    });
    api.onNpcInteraction(DATA.butler.npcName, { "Talk-to": butlerTalk, Collect: butlerCollectOption });

    // Minion whistle
    api.onItemAction(DATA.minion.whistle, {
      Blow: mainAction("minionWhistle", minionSummon),
      Banish: mainAction("minionWhistle", ({ player }) => minionDismiss(player)),
      Rules: mainAction("minionWhistle", minionRules),
      Check: mainAction("minionWhistle", minionCheck),
    });
    api.onItemOnItem(minionFeed);
    api.onPlayerLogin(minionLogin);

    // Sage's axe
    api.onCustomEvent("ranged:shot-visuals", sagesAxeVisuals);
    api.onCombatHitDamage(sagesAxeExecute);
    api.onCombatAttackDistance(sagesAxeReach);

    // Searing boots
    api.onCustomEvent("storage:gather", searingGatherProcess);
    api.onCustomEvent("storage:gather", searingGatherDeliver);
    api.onPlayerLogin(searingWatchLogin);

    // Knapsack (built-in StorageItems handles it when enabled; intercept when toggled off on main worlds)
    const blockKnapsack = (event) => {
      if (enabled("knapsack") || inLeague(event.player)) return;
      event.handled = true;
    };
    api.onItemAction("Knapsack", {
      Fill: blockKnapsack,
      Check: blockKnapsack,
      Open: blockKnapsack,
      Close: blockKnapsack,
      Dispose: blockKnapsack,
    });
    api.onItemOnItem((event) => {
      if (enabled("knapsack") || inLeague(event.player)) return;
      const a = event.usedItem?.getDefinition?.()?.getName?.();
      const b = event.usedWithItem?.getDefinition?.()?.getName?.();
      if (a === "Knapsack" || b === "Knapsack") event.handled = true;
    });
    api.onCustomEvent(core.Bank.INVENTORY_OP_EVENT, (event) => {
      if (enabled("knapsack") || inLeague(event.player)) return;
      const name = core.CacheDefinitions.getItem(event.itemId)?.name;
      if (name === "Knapsack") event.handled = true;
    });
  },
  _test: { DATA, CONFIG },
};
