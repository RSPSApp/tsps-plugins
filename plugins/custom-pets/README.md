# Custom Pets

Turns any NPC into a pet. Each pet is a follower summoned from a custom item. It says one of its
own lines when talked to, can have a chathead of its own, and Probita gives it back if lost.

Requires a TSPS server with the Pets plugin's `pets:extensions` hook and per-source custom
definitions.

## Install

1. Upload `custom-pets-<version>.zip` from your server's **Plugins** panel.
2. Add your pets to `server/data/definitions/custom-pets.json`. This folder's `custom-pets.json`
   is an example.
3. Restart the server.

## Defining a pet

Each pet needs a custom item of its own in `server/data/definitions/custom-items.json`: the item
it's summoned from. Give that item's `objType` these options, as a real pet item has (Drop
summons the pet):

```json
"inventoryActions": [null, null, null, null, "Drop"]
```

Then add a row to `custom-pets.json`:

```json
{
  "version": 1,
  "pets": [
    {
      "npcId": 12980,
      "itemId": 54000,
      "name": "Fennec fox",
      "scale": 70,
      "lines": ["Yip!", "*The fox's ears twitch.*", "Yelp!"],
      "chathead": "fennec-fox/chathead.dat"
    }
  ]
}
```

| Field | What it does |
| --- | --- |
| `npcId` | The NPC the pet looks like: its models, recolours, idle and walk animations |
| `itemId` | The pet's item, a row of `custom-items.json` with Drop as its fifth option |
| `name` | The follower's name |
| `scale` | Its size in percent of the NPC's, 10 to 400 (default 100) |
| `lines` | What it says on Talk-to: one line, picked at random each time |
| `chathead` | Optional: a `.dat` model under `server/data/models`, shown as its head when it talks. Without it, the NPC's own chathead shows, if it has one |
| `petNpcId` | Optional: the follower's own NPC id, from 50000 to 65534. Default: the item id |

## In game

- **The follower:** each pet's follower is the NPC's look under its own NPC id, with Talk-to and
  Pick-up, no combat level, one tile and your scale.
- **Like a real pet:** Drop to summon, Pick-up, banking, following, coming back after a relog,
  and being recorded as owned when awarded (`pets:award`) or first summoned.
- **Chathead:** a `chathead` model is sent to players with the custom item models, as model
  2,000,000 plus the follower's NPC id. It's shown still, because the game's talking
  expressions are animations for human heads.
- **Probita:** her own window lists only the game's 72 pets, so she gets an extra option,
  "Can I reclaim my custom pets?". It gives back every custom pet you own but no longer have
  anywhere (following, carried, banked, in a house or in a grave), one free inventory space each.

A row with a problem loads no custom pets, with every problem logged under `[custom-pets]`.
Problems include an item that isn't in `custom-items.json` or lacks Drop, an empty name or
`lines`, a scale out of range, a duplicate item or NPC id, or a `chathead` that isn't an existing
`.dat` inside `server/data/models`.
