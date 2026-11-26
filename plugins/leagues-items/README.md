# Leagues Items

Adds 15 items from the OSRS Leagues game modes to main (non-league) worlds. On league worlds, every handler defers to the server's built-in league relic handlers.

## Included items

| Item | ID | Highlights |
| --- | --- | --- |
| **Clue compass** | `30363` | 111 alphabetical STASH & Falo teleports, `Current-step`, `Last-destination`, and Falo the Bard item waiver |
| **Fairy mushroom** | `25102` | Fairy rings, Spirit trees (Wilderness level 20 cap), 44 Tool leprechauns, and `Last-destination` |
| **Forager's pouch** | `30357` | 100-cap herb pouch (`Check`/`Fill`/`Withdraw`/bank `Empty`), gathering herb finds, batch Herblore, 90% secondary save, and 4-dose brewed potions |
| **Map of alacrity** | `33233` | Region-grouped Agility shortcut teleports (including sub-options) and `Last-destination` |
| **Crystal of Echoes** | `25104` | `Save-memory` (location, HP capped at 127, Prayer, Special), `Teleport-back`, and `Check-memories` |
| **Leprechaun's vault** | `30359` | Opens the Seed Vault anywhere |
| **Banker's briefcase** | `30361` | 11 regions / 107 Bank Heist teleports (including sub-options) and `Last-destination` |
| **Evil eye** | `33227` | Region-grouped boss & raid teleports (including sub-options) and `Last-destination` |
| **Arcane grimoire** | `26551` | `Change Spellbook`, `Previous Spellbook`, and `Check Previous` (carried & worn) |
| **Flask of fervour** | `33239` | Full HP/Prayer/Special restore (preserving boosts), poison/venom clear, 4-tick invulnerability, 3 explosions, and damage-based cooldown reduction |
| **Butler's bell** | `33237` | Summons the Demon butler for offline-accruing gather/process jobs and bank collection |
| **Minion whistle** | `28769` | Summons a 30-minute demonic minion that upgrades with unique Zamorak items, plus `Banish`, `Rules`, and `Check` |
| **Sage's axe** | `28773` | 6-tile (8 Longrange) thrown weapon that executes NPCs below 20% HP (sparing Yama & Gemstone Crab) |
| **Searing boots** | `28771` | Running Agility XP plus automatic cooking of caught fish and smelting of mined ore |
| **Knapsack** | `33218` / `33220` | 140-cap / 3-kind gathered item container (toggleable on main worlds) |

## Configuration

Every item has an individual boolean toggle under `leagues-items:*` in the server's plugin configuration panel (all enabled by default).
