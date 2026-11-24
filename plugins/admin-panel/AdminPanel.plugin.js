/*
BSD 2-Clause License

Copyright (c) 2022-2026, dennisdev, xrsps
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// server/plugins/interface/widgetGroup.js
var require_widgetGroup = __commonJS({
  "server/plugins/interface/widgetGroup.js"(exports2, module2) {
    var FLAG_OP1 = 1 << 1;
    var FLAG_OP2 = 1 << 2;
    var FLAG_OP3 = 1 << 3;
    var EVENT_FLAGS = Object.freeze({
      OP1: FLAG_OP1,
      OP2: FLAG_OP2,
      OP3: FLAG_OP3,
      OP4: 1 << 4,
      OP5: 1 << 5,
      OP6: 1 << 6,
      OP7: 1 << 7,
      OP8: 1 << 8,
      OP9: 1 << 9,
      OP10: 1 << 10,
      TGTOBJ: 1 << 11,
      TGTNPC: 1 << 12,
      TGTLOC: 1 << 13,
      TGTPLAYER: 1 << 14,
      TGTINV: 1 << 15,
      TGTCOM: 1 << 16
    });
    function eventFlags(names) {
      return names.reduce((bits, name) => bits | (EVENT_FLAGS[name] ?? 0), 0);
    }
    var TYPE_LAYER = 0;
    var TYPE_RECTANGLE = 3;
    var TYPE_TEXT = 4;
    var TYPE_GRAPHIC = 5;
    var TYPE_MODEL = 6;
    function createWidgetGroup(groupId) {
      const widgets = [];
      const uid = (component) => groupId << 16 | component;
      const add = (component, parent, overrides = {}) => {
        const id = uid(component);
        widgets.push({
          uid: id,
          id,
          childIndex: -1,
          parentUid: parent,
          groupId,
          fileId: component,
          isIf3: true,
          type: TYPE_LAYER,
          contentType: 0,
          rawX: 0,
          rawY: 0,
          rawWidth: 0,
          rawHeight: 0,
          widthMode: 0,
          heightMode: 0,
          xPositionMode: 0,
          yPositionMode: 0,
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          scrollX: 0,
          scrollY: 0,
          scrollWidth: 0,
          scrollHeight: 0,
          isHidden: false,
          hidden: false,
          cachedHidden: false,
          rootIndex: -1,
          cycle: -1,
          modelFrame: 0,
          modelFrameCycle: 0,
          aspectWidth: 1,
          aspectHeight: 1,
          itemId: -1,
          itemQuantity: 0,
          ...overrides
        });
        return id;
      };
      return { groupId, widgets, uid, add };
    }
    function triggerInts(argsData) {
      const ints = [];
      let value = 0;
      let shift = 0;
      for (const byte of argsData ?? []) {
        value |= (byte & 127) << shift;
        shift += 7;
        if ((byte & 128) !== 0) continue;
        ints.push(value >>> 1 ^ -(value & 1));
        value = 0;
        shift = 0;
      }
      return ints;
    }
    function triggerVarints(argsData) {
      const ints = [];
      let value = 0;
      let shift = 0;
      for (const byte of argsData ?? []) {
        value |= (byte & 127) << shift;
        shift += 7;
        if ((byte & 128) !== 0) continue;
        ints.push(value >>> 0);
        value = 0;
        shift = 0;
      }
      return ints;
    }
    module2.exports = {
      triggerInts,
      triggerVarints,
      FLAG_OP1,
      FLAG_OP2,
      FLAG_OP3,
      EVENT_FLAGS,
      eventFlags,
      TYPE_LAYER,
      TYPE_RECTANGLE,
      TYPE_TEXT,
      TYPE_GRAPHIC,
      TYPE_MODEL,
      createWidgetGroup
    };
  }
});

// server/plugins/tools/adminpanel/Containers.AdminPanel.js
var require_Containers_AdminPanel = __commonJS({
  "server/plugins/tools/adminpanel/Containers.AdminPanel.js"(exports2, module2) {
    var { TYPE_GRAPHIC } = require_widgetGroup();
    var C = {
      VIEW: 600,
      SCROLLBAR: 601,
      INVENTORY: 602,
      EQUIPMENT: 603,
      HEIGHT: 604,
      BANK_VIEW: 650,
      BANK_SCROLLBAR: 651,
      BANK_TABS: 652,
      BANK_HEIGHT: 653,
      BANK_INFO: 654,
      BANK_TAB_START: 660,
      BANK_TAB_LABEL_START: 670,
      INVENTORY_FRAME_START: 1800,
      BANK_FRAME_START: 4500,
      INVENTORY_START: 2e3,
      EQUIPMENT_BACKGROUND_START: 2100,
      EQUIPMENT_GHOST_START: 2120,
      EQUIPMENT_START: 2140,
      BANK_START: 3e3
    };
    var BANK_SLOTS = 1410;
    var BANK_COLUMNS = 8;
    var BANK_PITCH_X = 48;
    var BANK_PITCH_Y = 36;
    var SLOT_FRAME_SPRITE = 170;
    var VERTICAL_LINK_SPRITE = 172;
    var HORIZONTAL_LINK_SPRITE = 173;
    var EQUIPMENT = [
      [0, 77, 4, "Head"],
      [1, 36, 43, "Cape"],
      [2, 77, 43, "Neck"],
      [3, 21, 82, "Weapon"],
      [4, 77, 82, "Body"],
      [5, 133, 82, "Shield"],
      [7, 77, 122, "Legs"],
      [9, 21, 162, "Hands"],
      [10, 77, 162, "Feet"],
      [12, 133, 162, "Ring"],
      [13, 118, 43, "Ammo"]
    ];
    var hide = { hidden: true, isHidden: true };
    var SLOT_FLAGS = 62 | 1 << 17 | 1 << 20;
    function slotFor(component) {
      if (component >= C.INVENTORY_START && component < C.INVENTORY_START + 28) return { container: "inventory", slot: component - C.INVENTORY_START };
      if (component >= C.EQUIPMENT_START && component < C.EQUIPMENT_START + 14 && EQUIPMENT.some(([slot]) => slot === component - C.EQUIPMENT_START)) return { container: "equipment", slot: component - C.EQUIPMENT_START };
      if (component >= C.BANK_START && component < C.BANK_START + BANK_SLOTS) return { container: "bank", slot: component - C.BANK_START };
      return null;
    }
    var slotComponents = () => [
      ...Array.from({ length: 28 }, (_, i) => C.INVENTORY_START + i),
      ...EQUIPMENT.map(([slot]) => C.EQUIPMENT_START + slot),
      ...Array.from({ length: BANK_SLOTS }, (_, i) => C.BANK_START + i)
    ];
    function build(add, root, text, box, ghostIcons = /* @__PURE__ */ new Map()) {
      const view = add(C.VIEW, root, {
        rawX: 18,
        rawY: 116,
        rawWidth: 294,
        rawHeight: 130,
        widthMode: 1,
        heightMode: 1,
        width: 200,
        height: 186,
        scrollHeight: 261,
        ...hide
      });
      add(C.SCROLLBAR, root, { rawX: 258, rawY: 116, rawWidth: 14, rawHeight: 130, heightMode: 1, xPositionMode: 2, ...hide });
      const inventory = add(C.INVENTORY, view, { rawWidth: 190, rawHeight: 261, width: 190, height: 261, xPositionMode: 1, ...hide });
      const equipment = add(C.EQUIPMENT, view, { rawWidth: 190, rawHeight: 202, width: 190, height: 202, xPositionMode: 1, ...hide });
      add(C.HEIGHT, root, { type: 4, ...hide });
      const graphic = (id, parent, x, y, width, height, extra = {}) => add(id, parent, { type: TYPE_GRAPHIC, rawX: x, rawY: y, rawWidth: width, rawHeight: height, width, height, ...extra });
      [
        [77, 39, 36, 124, VERTICAL_LINK_SPRITE],
        [21, 118, 36, 45, VERTICAL_LINK_SPRITE],
        [133, 118, 36, 45, VERTICAL_LINK_SPRITE],
        [56, 81, 78, 36, HORIZONTAL_LINK_SPRITE],
        [71, 42, 48, 36, HORIZONTAL_LINK_SPRITE]
      ].forEach(([x, y, w, h, spriteId], i) => graphic(2080 + i, equipment, x, y, w, h, { spriteId }));
      for (const [slot, x, y, name] of EQUIPMENT) {
        graphic(C.EQUIPMENT_BACKGROUND_START + slot, equipment, x, y, 36, 36, { spriteId: SLOT_FRAME_SPRITE });
        graphic(C.EQUIPMENT_GHOST_START + slot, equipment, x + 2, y + 2, 32, 32, { spriteId: ghostIcons.get(slot) ?? -1 });
        graphic(C.EQUIPMENT_START + slot, equipment, x, y, 36, 36, { adminContainer: "equipment", dataText: name, ...slotOptions() });
      }
      for (let i = 0; i < 28; i++) {
        const x = 12 + i % 4 * 42, y = 5 + Math.floor(i / 4) * 36;
        add(C.INVENTORY_FRAME_START + i, inventory, box(x, y, 36, 32, { adminContainerFrame: "inventory", filled: false, color: 8415301 }));
        graphic(C.INVENTORY_START + i, inventory, x, y, 36, 32, { adminContainer: "inventory", ...slotOptions() });
      }
      const bank = add(C.BANK_VIEW, root, { rawX: 18, rawY: 178, rawWidth: 54, rawHeight: 192, widthMode: 1, heightMode: 1, width: 440, height: 124, scrollHeight: 36, ...hide });
      add(C.BANK_SCROLLBAR, root, { rawX: 18, rawY: 178, rawWidth: 14, rawHeight: 192, heightMode: 1, xPositionMode: 2, ...hide });
      add(C.BANK_HEIGHT, root, { type: 4, ...hide });
      add(C.BANK_INFO, root, text(18, 150, 150, 26, { widthMode: 1, textColor: 12168086, ...hide }));
      const tabs = add(C.BANK_TABS, root, { rawX: 18, rawY: 116, rawWidth: 440, rawHeight: 30, width: 440, height: 30, ...hide });
      for (let i = 0; i < 10; i++) {
        add(C.BANK_TAB_START + i, tabs, box(i * 43, 0, 40, 28, { flags: 2 | 1 << 20, actions: ["View tab"], color: 3878946 }));
        add(C.BANK_TAB_LABEL_START + i, tabs, text(i * 43, 0, 40, 28, { text: i ? "Tab " + i : "Main", flags: 2 | 1 << 20, actions: ["View tab"], xTextAlignment: 1, yTextAlignment: 1 }));
      }
      for (let i = 0; i < BANK_SLOTS; i++) {
        const x = 8 + i % BANK_COLUMNS * BANK_PITCH_X, y = Math.floor(i / BANK_COLUMNS) * BANK_PITCH_Y;
        graphic(C.BANK_START + i, bank, x, y, 36, 32, { adminContainer: "bank", ...slotOptions(), ...hide });
        add(C.BANK_FRAME_START + i, bank, box(x, y, 36, 32, { adminContainerFrame: "bank", filled: false, color: 8415301, ...hide }));
      }
    }
    function actionsFor(occupied, label = "") {
      const suffix = label ? " " + label : "";
      return occupied ? ["Set quantity", "Add quantity", "Remove quantity", "Remove stack"].map((action) => action + suffix) : ["Add item" + suffix];
    }
    function slotOptions() {
      return {
        flags: SLOT_FLAGS,
        actions: actionsFor(false),
        itemQuantityMode: 1,
        outline: 1,
        spriteShadow: 3355443,
        dragZoneSize: 5,
        dragThreshold: 6
      };
    }
    module2.exports = { C, BANK_SLOTS, BANK_COLUMNS, BANK_PITCH_Y, EQUIPMENT, slotFor, slotComponents, actionsFor, build };
  }
});

// server/plugins/tools/adminpanel/Bots.AdminPanel.js
var require_Bots_AdminPanel = __commonJS({
  "server/plugins/tools/adminpanel/Bots.AdminPanel.js"(exports2, module2) {
    function catalogue(api, actor) {
      const event = { actor, action: "catalogue" };
      api.emitCustomEvent("admin:bots", event);
      const controls = { actor, action: "catalogue" };
      api.emitCustomEvent("admin:bot-controls", controls);
      event.controls = controls;
      return event;
    }
    var CATEGORIES = ["spawn", "active", "self"];
    function config(state) {
      return state.botConfig ??= { count: 1, usePlayerLocation: false, copyOwnerSkills: false, setup: {}, category: "spawn", view: "browse" };
    }
    function snapshot(api, actor, state) {
      config(state);
      return state.botSnapshot = catalogue(api, actor);
    }
    function rows(api, actor, state) {
      const event = snapshot(api, actor, state), current = config(state), rows2 = [];
      const add = (key, name, detail, description, primary, extra = {}) => rows2.push({ key, name, detail, panel: { description, primary }, ...extra });
      if (current.view !== "browse") return rows2;
      if (current.category === "active") {
        for (const bot of event.controls.bots ?? []) add(
          `manage:${bot.username}`,
          bot.name,
          ` (${bot.mode})`,
          "Manage this bot's behavior, stats, equipment and display name, or take manual control.",
          "Manage bot",
          { info: `Behavior: ${bot.mode}` }
        );
        if (!rows2.length) add("empty", "No active bots", "", "Spawn a bot in Spawn bots, then return here to manage it.", "");
        return rows2;
      }
      if (!event.allowed || event.error || !event.handled) {
        add("unavailable", "Bot spawning unavailable", "", event.error ?? "Enable PlayerBots to spawn routines and activities.", "");
        return rows2;
      }
      for (const [kind, name] of [["activity", "Bots and activities"], ["routine", "Routines"]]) {
        const entries = event.launchers.filter((launcher) => launcher.kind === kind);
        if (!entries.length) continue;
        add(`group:${kind}`, name, "", "", "", { group: true });
        for (const launcher of entries) add(launcher.key, launcher.name, "", launcher.description, "Configure", { parent: `group:${kind}`, info: launcher.detail });
      }
      if (!rows2.length) add("empty", "No bot launchers available", "", "Enable a bot routine or activity to make it available here.", "");
      return rows2;
    }
    function act(api, actor, state, key, amount) {
      const event = catalogue(api, actor), settings = config(state);
      if (key.startsWith("manage:")) {
        const bot = event.controls.bots?.find((bot2) => bot2.username === key.slice(7));
        if (!bot) return "This bot is no longer online. Refresh the Bots tab.";
        settings.bot = bot.username;
        settings.view = "manage";
        settings.category = "active";
        return;
      }
      if (key.startsWith("control:")) {
        const [, operation, mode] = key.split(":");
        const request = { actor, action: "apply", operation, mode, username: settings.bot, name: amount };
        api.emitCustomEvent("admin:bot-controls", request);
        if (request.transferred) settings.transferred = true;
        return request.error ?? (!request.handled ? "Bot controls are unavailable." : void 0);
      }
      if (!event.allowed || event.error || !event.handled) return event.error ?? "Bot deployment is unavailable.";
      if (key === "count-down" || key === "count-up") {
        settings.count = Math.max(1, Math.min(event.limit, settings.count + (key === "count-up" ? 1 : -1)));
      } else if (key === "count") {
        if (!Number.isInteger(amount) || amount < 1 || amount > event.limit) return `Choose 1-${event.limit} bots.`;
        settings.count = amount;
      } else if (key === "location") settings.usePlayerLocation = !settings.usePlayerLocation;
      else if (key === "levels") settings.copyOwnerSkills = !settings.copyOwnerSkills;
      else if (key === "deploy") {
        const request = { actor, action: "deploy", ...settings, setup: settings.setup[settings.key] ?? {} };
        api.emitCustomEvent("admin:bots", request);
        return request.result?.message ?? request.result?.error ?? request.error ?? "Bot deployment is unavailable.";
      } else if (key.startsWith("field:")) {
        const launcher = event.launchers.find((item) => item.key === settings.key);
        const field = launcher?.setupFields.find((field2) => field2.id === key.slice(6));
        if (!field) return "This option is no longer available.";
        const values = settings.setup[launcher.key] ??= {};
        const index = field.choices.findIndex((choice) => choice.value === (values[field.id] ?? field.defaultValue));
        values[field.id] = field.choices[(index + 1) % field.choices.length].value;
      } else {
        const launcher = event.launchers.find((item) => item.key === key);
        if (!launcher) return;
        if (launcher.allowLocation === false) settings.usePlayerLocation = false;
        if (launcher.allowSkills === false) settings.copyOwnerSkills = false;
        settings.key = key;
        settings.view = "setup";
      }
    }
    module2.exports = { rows, act, config, snapshot, CATEGORIES };
  }
});

// server/plugins/tools/adminpanel/BotView.AdminPanel.js
var require_BotView_AdminPanel = __commonJS({
  "server/plugins/tools/adminpanel/BotView.AdminPanel.js"(exports2, module2) {
    var Bots = require_Bots_AdminPanel();
    var { FLAG_OP1, TYPE_TEXT } = require_widgetGroup();
    var BOTS_TAB = 6;
    var C = {
      BACKGROUND: 6998,
      BORDER: 6999,
      CATEGORY: 7e3,
      CATEGORY_LABEL: 7010,
      VIEW: 7020,
      SCROLLBAR: 7021,
      TITLE: 7022,
      NOTE: 7023,
      COUNT_LABEL: 7024,
      MINUS: 7025,
      MINUS_LABEL: 7026,
      COUNT: 7027,
      PLUS: 7028,
      PLUS_LABEL: 7029,
      LOCATION: 7030,
      LOCATION_LABEL: 7031,
      LOCATION_INFO: 7032,
      LEVELS: 7033,
      LEVELS_LABEL: 7034,
      OPTION: 7040,
      OPTION_LABEL: 7050,
      HEIGHT: 7060,
      MANAGE: 7070,
      MANAGE_LABEL: 7110,
      PRIMARY: 7150,
      PRIMARY_LABEL: 7151,
      BACK: 7152,
      BACK_LABEL: 7153,
      FEEDBACK: 7154
    };
    var CATEGORIES = ["Spawn bots", "Active bots", "My character"];
    var MANAGE_SLOTS = 32;
    var categoryComponents = CATEGORIES.flatMap((_, i) => [C.CATEGORY + i, C.CATEGORY_LABEL + i]);
    var setupComponents = [
      C.COUNT_LABEL,
      C.MINUS,
      C.MINUS_LABEL,
      C.COUNT,
      C.PLUS,
      C.PLUS_LABEL,
      C.LOCATION,
      C.LOCATION_LABEL,
      C.LOCATION_INFO,
      C.LEVELS,
      C.LEVELS_LABEL,
      ...Array.from({ length: 3 }, (_, i) => [C.OPTION + i, C.OPTION_LABEL + i]).flat()
    ];
    var managementComponents = Array.from({ length: MANAGE_SLOTS }, (_, i) => [C.MANAGE + i, C.MANAGE_LABEL + i]).flat();
    var components = [
      C.BACKGROUND,
      C.BORDER,
      ...categoryComponents,
      C.VIEW,
      C.SCROLLBAR,
      C.TITLE,
      C.NOTE,
      C.FEEDBACK,
      C.PRIMARY,
      C.PRIMARY_LABEL,
      C.BACK,
      C.BACK_LABEL,
      ...setupComponents,
      ...managementComponents
    ];
    var hidden = { hidden: true, isHidden: true };
    function build(add, root, text, box, button) {
      CATEGORIES.forEach((name, i) => button(C.CATEGORY + i, C.CATEGORY_LABEL + i, root, 18 + i * 126, 88, 122, 22, name, hidden));
      add(C.BACKGROUND, root, box(18, 32, 36, 112, { widthMode: 1, heightMode: 1, ...hidden }));
      add(C.BORDER, root, box(18, 32, 36, 112, { widthMode: 1, heightMode: 1, filled: false, color: 8415301, ...hidden }));
      const view = add(C.VIEW, root, {
        rawX: 18,
        rawY: 32,
        rawWidth: 54,
        rawHeight: 112,
        widthMode: 1,
        heightMode: 1,
        scrollHeight: 400,
        ...hidden
      });
      add(C.SCROLLBAR, root, {
        rawX: 18,
        rawY: 32,
        rawWidth: 14,
        rawHeight: 112,
        xPositionMode: 2,
        heightMode: 1,
        noClickThrough: true,
        ...hidden
      });
      add(C.HEIGHT, root, { type: TYPE_TEXT, ...hidden });
      add(C.TITLE, view, text(12, 8, 24, 44, { widthMode: 1, fontId: 496, textColor: 16765567 }));
      add(C.NOTE, view, text(12, 56, 24, 48, { widthMode: 1, textColor: 12168086 }));
      add(C.COUNT_LABEL, view, text(12, 112, 150, 24, { text: "Bots to spawn", yTextAlignment: 1, ...hidden }));
      button(C.MINUS, C.MINUS_LABEL, view, 168, 112, 28, 24, "-", hidden);
      add(C.COUNT, view, text(200, 112, 48, 24, { flags: FLAG_OP1, actions: ["Set quantity"], xTextAlignment: 1, yTextAlignment: 1, ...hidden }));
      button(C.PLUS, C.PLUS_LABEL, view, 252, 112, 28, 24, "+", hidden);
      button(C.LOCATION, C.LOCATION_LABEL, view, 12, 146, 24, 26, "", { widthMode: 1, ...hidden });
      add(C.LOCATION_INFO, view, text(12, 178, 24, 30, { widthMode: 1, textColor: 12168086, ...hidden }));
      button(C.LEVELS, C.LEVELS_LABEL, view, 12, 216, 24, 26, "", { widthMode: 1, ...hidden });
      for (let i = 0; i < 3; i++) button(C.OPTION + i, C.OPTION_LABEL + i, view, 12, 254 + i * 34, 24, 28, "", { widthMode: 1, ...hidden });
      for (let i = 0; i < MANAGE_SLOTS; i++) button(C.MANAGE + i, C.MANAGE_LABEL + i, view, 12, 112 + Math.floor(i / 2) * 34, 7600, 28, "", { widthMode: 2, xPositionMode: i % 2 ? 2 : 0, ...hidden });
      button(C.PRIMARY, C.PRIMARY_LABEL, root, 18, 18, 160, 26, "", { xPositionMode: 2, yPositionMode: 2, ...hidden });
      button(C.BACK, C.BACK_LABEL, root, 18, 18, 122, 26, "Back to bots", { yPositionMode: 2, ...hidden });
      add(C.FEEDBACK, root, text(18, 48, 36, 28, { widthMode: 1, yPositionMode: 2, textColor: 16765567, ...hidden }));
    }
    function render(api, player, state, uid, hide) {
      const active = state.tab === BOTS_TAB, config = Bots.config(state), form = active && config.view !== "browse";
      const data = state.botSnapshot ?? {}, controls = data.controls ?? {};
      const sender = player.getPacketSender(), send = (component, value) => sender.sendString(String(value ?? ""), uid(component));
      hide(components, true);
      hide(categoryComponents, !active || form);
      CATEGORIES.forEach((name, i) => send(C.CATEGORY_LABEL + i, `${Bots.CATEGORIES[i] === config.category ? "<col=ffffff>" : "<col=ffd27f>"}${name}</col>`));
      if (!form) return;
      hide([C.BACKGROUND, C.BORDER, C.VIEW, C.SCROLLBAR, C.TITLE, C.NOTE, C.FEEDBACK, C.BACK, C.BACK_LABEL], false);
      const self = config.view === "self";
      send(C.FEEDBACK, (config.feedback ?? "").slice(0, 120));
      state.botButtons = /* @__PURE__ */ new Map();
      if (config.view === "setup") {
        const launcher = data.launchers?.find((item) => item.key === config.key);
        if (!launcher) {
          send(C.TITLE, "Launcher unavailable");
          send(C.NOTE, "Go back and choose another bot behavior or routine.");
          return;
        }
        send(C.TITLE, `Configure ${launcher.name}`);
        send(C.NOTE, launcher.description);
        hide(setupComponents.slice(0, -6), false);
        hide([C.LOCATION, C.LOCATION_LABEL], launcher.allowLocation === false);
        hide([C.LEVELS, C.LEVELS_LABEL], launcher.allowSkills === false);
        send(C.COUNT, config.count);
        send(C.LOCATION_LABEL, `Spawn location: ${config.usePlayerLocation ? "My current tile" : "Saved location"}`);
        const at = config.usePlayerLocation ? player.getLocation() : launcher.location;
        send(C.LOCATION_INFO, at ? `Tile ${at.getX?.() ?? at.x}, ${at.getY?.() ?? at.y}, plane ${at.getZ?.() ?? at.z}` : "No saved location. Uses your current tile.");
        send(C.LEVELS_LABEL, `Copy my levels: ${config.copyOwnerSkills ? "On" : "Off"}`);
        const values = config.setup[launcher.key] ?? {};
        launcher.setupFields.forEach((field, i) => {
          hide([C.OPTION + i, C.OPTION_LABEL + i], false);
          send(C.OPTION_LABEL + i, `${field.label}: ${field.choices.find((choice) => choice.value === (values[field.id] ?? field.defaultValue))?.label ?? "Choose"}`);
          state.botButtons.set(C.OPTION + i, `field:${field.id}`);
          state.botButtons.set(C.OPTION_LABEL + i, `field:${field.id}`);
        });
        send(C.HEIGHT, 260 + launcher.setupFields.length * 34);
        const managed = data.capacity === null ? data.managed : `${data.managed}/${data.capacity}`;
        send(C.FEEDBACK, (config.feedback || `${managed} managed bots. Limit ${data.limit} per spawn.`).slice(0, 120));
        send(C.PRIMARY_LABEL, `Spawn ${config.count} bot${config.count === 1 ? "" : "s"}`);
        hide([C.PRIMARY, C.PRIMARY_LABEL], false);
        return;
      }
      if (self) {
        send(C.TITLE, "My character");
        send(C.NOTE, `Your bot controller is ${controls.selfEnabled ? "on" : "off"}. Start it to let your character run bot behavior. Stop it to resume manual play.`);
        hide([C.PRIMARY, C.PRIMARY_LABEL], !controls.allowed?.self);
        send(C.PRIMARY_LABEL, controls.selfEnabled ? "Stop bot control" : "Start bot control");
        send(C.HEIGHT, 120);
        return;
      }
      const bot = controls.bots?.find((item) => item.username === config.bot);
      send(C.TITLE, bot ? `Manage ${bot.name}` : "Bot offline");
      send(C.NOTE, bot ? `Current behavior: ${bot.mode}. Choose an action below. Manual control returns with ::botback.` : "Go back to Active bots and choose an online bot.");
      const actions = bot ? [
        ...[["stats", "Copy my stats"], ["gear", "Copy my equipment"], ["rename", "Rename bot"], ["info", "Inspect bot"], ["control", "Take manual control"]].filter(([key]) => controls.allowed?.[key]).map(([key, name]) => ({ key: `control:${key}`, name })),
        ...controls.allowed?.behavior ? (controls.modes ?? []).map((mode) => ({
          key: `control:behavior:${mode}`,
          name: mode === "manual" ? "Pause AI" : mode === "recruit" ? "Follow me" : `Behavior: ${mode.replace(/_/g, " ")}`
        })) : []
      ].slice(0, MANAGE_SLOTS) : [];
      actions.forEach((action, i) => {
        hide([C.MANAGE + i, C.MANAGE_LABEL + i], false);
        send(C.MANAGE_LABEL + i, action.name);
        state.botButtons.set(C.MANAGE + i, action.key);
        state.botButtons.set(C.MANAGE_LABEL + i, action.key);
      });
      send(C.HEIGHT, 120 + Math.ceil(actions.length / 2) * 34);
    }
    module2.exports = { C, CATEGORIES, components, categoryComponents, setupComponents, managementComponents, build, render };
  }
});

// server/plugins/tools/adminpanel/Layout.AdminPanel.js
var require_Layout_AdminPanel = __commonJS({
  "server/plugins/tools/adminpanel/Layout.AdminPanel.js"(exports2, module2) {
    var { FLAG_OP1, FLAG_OP2, TYPE_RECTANGLE, TYPE_TEXT, TYPE_GRAPHIC, TYPE_MODEL, createWidgetGroup } = require_widgetGroup();
    var ContainerView = require_Containers_AdminPanel();
    var BotView = require_BotView_AdminPanel();
    var GROUP_ID = 30022;
    var MAIN_MODAL_UID = 161 << 16 | 16;
    var COMPONENT = {
      ROOT: 0,
      FRAME: 1,
      TARGET: 2,
      TARGET_BUTTON: 3,
      SELF_BUTTON: 4,
      SEARCH_BOX: 5,
      SEARCH_INPUT: 6,
      STATUS: 7,
      LIST_VIEW: 8,
      LIST_SCROLLBAR: 9,
      PANEL: 10,
      PANEL_TITLE: 11,
      PANEL_INFO: 12,
      PANEL_INFO2: 13,
      PANEL_DESCRIPTION: 14,
      PANEL_ICON: 15,
      LAYOUT: 16,
      UTILITY: 17,
      UTILITY_LABEL: 18,
      TAB_START: 20,
      TAB_LABEL_START: 30,
      BUTTON_START: 40,
      BUTTON_LABEL_START: 44,
      DATA_START: 50,
      EXTRA_DATA_START: 400,
      SEARCH_REQUEST: 60,
      SEARCH_RESPONSE: 61,
      SEARCH_SESSION: 62,
      DETAIL_VIEW: 63,
      DETAIL_SCROLLBAR: 64,
      PANEL_BORDER: 65,
      PANEL_EMPTY: 66,
      SKILL_VIEW: 70,
      SKILL_SCROLLBAR: 71,
      SKILL_GRID: 72,
      SKILL_TOTAL: 73,
      SKILL_PRESETS: 74,
      PRESET_START: 80,
      PRESET_LABEL_START: 84,
      SKILL_LEFT_START: 100,
      SKILL_RIGHT_START: 130,
      SKILL_ICON_START: 160,
      SKILL_CURRENT_START: 190,
      SKILL_BASE_START: 220,
      SKILL_BUTTON_START: 250,
      SKILL_NAME_START: 280,
      SECTION_START: 500,
      SECTION_LABEL_START: 510,
      ADD_ITEMS: 520,
      ADD_ITEMS_LABEL: 521,
      EDITOR_HINT: 522,
      CONTAINER_ADD: 523,
      CONTAINER_ADD_LABEL: 524,
      SPAWN_START: 530,
      SPAWN_LABEL_START: 532,
      MAP_TELEPORT: 534,
      MAP_TELEPORT_LABEL: 535,
      LIST_BACKGROUND: 900,
      ROW_BACKGROUND_START: 1e3,
      ROW_LABEL_START: 1100,
      ROW_ICON_START: 1200,
      ROW_BORDER_START: 1300,
      ROW_DIVIDER_START: 1400,
      ROW_GUIDE_START: 1500,
      ROW_TOGGLE_START: 1600,
      ROW_GLYPH_START: 1700
    };
    var TAB_LABELS = ["Players", "Teleports", "Items", "Player editor", "Cheats", "Spawn", "Bots"];
    var SPAWN_LABELS = ["NPCs", "Items"];
    var SECTION_LABELS = ["Skills", "Quests", "Staff", "Inventory", "Equipment", "Bank", "Character"];
    var ROW_SLOTS = 64;
    var DATA_COMPONENTS = [COMPONENT.DATA_START, COMPONENT.EXTRA_DATA_START].flatMap((start) => Array.from({ length: 8 }, (_, i) => start + i));
    var BUTTONS = Array.from({ length: 4 }, (_, i) => ({ button: COMPONENT.BUTTON_START + i, label: COMPONENT.BUTTON_LABEL_START + i }));
    var PRESETS = [["max", "Max all"], ["combat", "Max combat"], ["reset", "Reset all"], ["restore", "Restore"]];
    var SKILL_ORDER = [0, 3, 14, 2, 16, 13, 1, 15, 10, 4, 17, 7, 5, 12, 11, 6, 9, 8, 20, 18, 19, 22, 21, 23];
    var TAB_VISIBILITY = [];
    var uid = (component) => GROUP_ID << 16 | component;
    var text = (x, y, width, height, extra = {}) => ({
      type: TYPE_TEXT,
      rawX: x,
      rawY: y,
      rawWidth: width,
      rawHeight: height,
      width,
      height,
      text: "",
      fontId: 494,
      textColor: 15261392,
      textShadowed: true,
      lineHeight: 14,
      ...extra
    });
    var box = (x, y, width, height, extra = {}) => ({
      type: TYPE_RECTANGLE,
      rawX: x,
      rawY: y,
      rawWidth: width,
      rawHeight: height,
      width,
      height,
      filled: true,
      color: 2169878,
      ...extra
    });
    var clickable = { flags: FLAG_OP1, actions: ["Select"], mouseOverColor: 5522220 };
    var hidden = { hidden: true, isHidden: true };
    function buildInterface(skillIcons = /* @__PURE__ */ new Map(), equipmentIcons = /* @__PURE__ */ new Map()) {
      const { widgets, add } = createWidgetGroup(GROUP_ID), C = COMPONENT;
      const root = add(C.ROOT, -1, {
        rawWidth: 18,
        rawHeight: 18,
        widthMode: 1,
        heightMode: 1,
        maxWidth: 920,
        maxHeight: 900,
        width: 494,
        height: 316,
        xPositionMode: 1,
        yPositionMode: 1,
        noClickThrough: true,
        suppressHoverText: true
      });
      add(C.FRAME, root, { widthMode: 1, heightMode: 1, width: 494, height: 316 });
      add(C.TARGET, root, text(18, 33, 224, 20, { fontId: 496, textColor: 16765567, yTextAlignment: 1, widthMode: 1, rawWidth: 224 }));
      add(C.TARGET_BUTTON, root, text(86, 33, 108, 20, { text: "Find player", ...clickable, xPositionMode: 2, xTextAlignment: 1, yTextAlignment: 1 }));
      add(C.SELF_BUTTON, root, text(18, 33, 64, 20, { text: "Use self", ...clickable, xPositionMode: 2, xTextAlignment: 1, yTextAlignment: 1 }));
      const button = (id, labelId, parent, x, y, width, height, name, extra = {}) => {
        add(id, parent, box(x, y, width, height, { ...clickable, color: 3156255, ...extra }));
        add(labelId, parent, text(x, y, width, height, {
          text: name,
          ...clickable,
          textColor: 16765567,
          mouseOverColor: 16777215,
          xTextAlignment: 1,
          yTextAlignment: 1,
          ...extra
        }));
      };
      TAB_LABELS.forEach((label, i) => {
        const widths = [54, 70, 0, 100, 58, 54, 48], x = 18 + widths.slice(0, i).reduce((a, b) => a + (b ? b + 4 : 0), 0);
        button(C.TAB_START + i, C.TAB_LABEL_START + i, root, x, 58, widths[i], 26, label, i === 2 ? hidden : {});
      });
      SECTION_LABELS.forEach((label, i) => {
        const widths = [44, 46, 40, 62, 70, 40, 72], x = 18 + widths.slice(0, i).reduce((a, b) => a + b + 3, 0);
        button(C.SECTION_START + i, C.SECTION_LABEL_START + i, root, x, 88, widths[i], 22, label, hidden);
      });
      SPAWN_LABELS.forEach((label, i) => button(C.SPAWN_START + i, C.SPAWN_LABEL_START + i, root, 18 + i * 68, 88, 64, 22, label, hidden));
      add(C.EDITOR_HINT, root, text(18, 88, 332, 22, { textColor: 12168086 }));
      button(C.MAP_TELEPORT, C.MAP_TELEPORT_LABEL, root, 18, 88, 458, 22, "Teleport to map location", { ...hidden, widthMode: 1, rawWidth: 36 });
      button(C.CONTAINER_ADD, C.CONTAINER_ADD_LABEL, root, 18, 88, 100, 22, "Add item", { ...hidden, xPositionMode: 2 });
      button(C.ADD_ITEMS, C.ADD_ITEMS_LABEL, root, 18, 145, 100, 18, "Add items", { ...hidden, xPositionMode: 2 });
      add(C.SEARCH_BOX, root, box(18, 116, 458, 26, { ...clickable, color: 2827291, widthMode: 1, rawWidth: 36 }));
      add(C.SEARCH_INPUT, root, text(26, 116, 446, 26, { ...clickable, mouseOverColor: 15261392, yTextAlignment: 1, widthMode: 1, rawWidth: 52 }));
      add(C.STATUS, root, text(18, 146, 458, 16, { textColor: 12102548, widthMode: 1, rawWidth: 36 }));
      [...DATA_COMPONENTS, C.LAYOUT, C.SEARCH_REQUEST, C.SEARCH_RESPONSE, C.SEARCH_SESSION].forEach((component) => add(component, root, { type: TYPE_TEXT, ...hidden }));
      const list = add(C.LIST_VIEW, root, {
        rawX: 18,
        rawY: 166,
        rawWidth: 294,
        rawHeight: 180,
        widthMode: 1,
        heightMode: 1,
        width: 200,
        height: 136,
        scrollWidth: 200,
        scrollHeight: 136
      });
      add(C.LIST_SCROLLBAR, root, {
        rawX: 258,
        rawY: 166,
        rawWidth: 14,
        rawHeight: 180,
        heightMode: 1,
        xPositionMode: 2,
        width: 14,
        height: 136,
        noClickThrough: true
      });
      add(C.LIST_BACKGROUND, list, box(0, 0, 0, 0, { widthMode: 1, heightMode: 1 }));
      for (let i = 0; i < ROW_SLOTS; i++) {
        add(C.ROW_BACKGROUND_START + i, list, box(0, 0, 438, 44, { ...clickable, mouseOverColor: 4799787, widthMode: 1, rawWidth: 2 }));
        add(C.ROW_LABEL_START + i, list, text(50, 0, 382, 44, {
          ...clickable,
          mouseOverColor: 16765567,
          yTextAlignment: 1,
          overflowScroll: true,
          fontId: 495,
          widthMode: 1,
          rawWidth: 58
        }));
        add(C.ROW_ICON_START + i, list, {
          type: TYPE_GRAPHIC,
          rawX: 6,
          rawY: 5,
          rawWidth: 36,
          rawHeight: 36,
          width: 36,
          height: 36,
          ...clickable,
          itemQuantityMode: 0,
          npcFullBody: true,
          recycleModel: true,
          rotationX: 160,
          rotationY: 256
        });
        add(C.ROW_BORDER_START + i, list, box(0, 0, 0, 0, { filled: false, color: 8415301, ...hidden }));
        add(C.ROW_DIVIDER_START + i, list, box(0, 0, 0, 1, { color: 5325615, ...hidden }));
        add(C.ROW_GUIDE_START + i, list, box(0, 0, 1, 0, { color: 8415301, ...hidden }));
        add(C.ROW_TOGGLE_START + i, list, box(0, 0, 22, 22, { ...clickable, filled: false, color: 12688224, ...hidden }));
        add(C.ROW_GLYPH_START + i, list, text(0, 0, 22, 22, {
          ...clickable,
          fontId: 496,
          textColor: 16765567,
          xTextAlignment: 1,
          yTextAlignment: 1,
          ...hidden
        }));
      }
      add(C.PANEL, root, box(18, 166, 224, 180, { xPositionMode: 2, heightMode: 1, height: 136 }));
      add(C.PANEL_BORDER, root, box(18, 166, 224, 180, { xPositionMode: 2, heightMode: 1, filled: false, color: 8415301 }));
      const detailView = add(C.DETAIL_VIEW, root, {
        rawX: 44,
        rawY: 174,
        rawWidth: 190,
        rawHeight: 258,
        xPositionMode: 2,
        heightMode: 1,
        width: 190,
        height: 58,
        scrollHeight: 330
      });
      add(C.DETAIL_SCROLLBAR, root, {
        rawX: 24,
        rawY: 174,
        rawWidth: 12,
        rawHeight: 258,
        xPositionMode: 2,
        heightMode: 1,
        width: 12,
        height: 58
      });
      add(C.PANEL_EMPTY, detailView, text(8, 16, 174, 80, {
        text: "Select an entry to see its preview and actions.",
        textColor: 12168086,
        xTextAlignment: 1
      }));
      add(C.PANEL_TITLE, detailView, text(0, 0, 190, 40, { fontId: 496, textColor: 16765567, xTextAlignment: 1, yTextAlignment: 1 }));
      add(C.PANEL_INFO, detailView, text(0, 44, 190, 36, { xTextAlignment: 1 }));
      add(C.PANEL_INFO2, detailView, text(0, 84, 190, 28, { textColor: 12168086, xTextAlignment: 1 }));
      add(C.PANEL_DESCRIPTION, detailView, text(88, 118, 102, 174));
      add(C.PANEL_ICON, detailView, {
        type: TYPE_MODEL,
        rawX: 0,
        rawY: 118,
        rawWidth: 80,
        rawHeight: 114,
        width: 80,
        height: 114,
        itemQuantityMode: 0,
        npcFullBody: true,
        recycleModel: true,
        fitModel: true,
        rotationX: 160,
        rotationY: 256,
        ...hidden
      });
      BUTTONS.forEach(({ button: id, label }, i) => button(
        id,
        label,
        root,
        i % 2 ? 26 : 130,
        i < 2 ? 46 : 18,
        100,
        24,
        "",
        { xPositionMode: 2, yPositionMode: 2, flags: FLAG_OP1 | FLAG_OP2, ...hidden }
      ));
      button(C.UTILITY, C.UTILITY_LABEL, root, 18, 16, 458, 24, "Refresh", { yPositionMode: 2, widthMode: 1, rawWidth: 36, ...hidden });
      const skillView = add(C.SKILL_VIEW, root, {
        rawX: 18,
        rawY: 116,
        rawWidth: 54,
        rawHeight: 130,
        widthMode: 1,
        heightMode: 1,
        width: 440,
        height: 170,
        scrollHeight: 406,
        ...hidden
      });
      add(C.SKILL_SCROLLBAR, root, {
        rawX: 18,
        rawY: 116,
        rawWidth: 16,
        rawHeight: 130,
        heightMode: 1,
        xPositionMode: 2,
        width: 16,
        height: 76,
        noClickThrough: true,
        ...hidden
      });
      const grid = add(C.SKILL_GRID, skillView, { rawWidth: 426, rawHeight: 406, width: 426, height: 406, xPositionMode: 1 });
      SKILL_ORDER.forEach((skill, slot) => {
        const x = slot % 3 * 142, y = Math.floor(slot / 3) * 44;
        add(C.SKILL_LEFT_START + skill, grid, box(x, y, 138, 40, { color: 3880235 }));
        add(C.SKILL_ICON_START + skill, grid, {
          type: TYPE_GRAPHIC,
          rawX: x + 5,
          rawY: y + 9,
          rawWidth: 20,
          rawHeight: 20,
          width: 20,
          height: 20,
          spriteId: skillIcons.get(skill) ?? -1
        });
        add(C.SKILL_NAME_START + skill, grid, text(x + 30, y + 3, 104, 17, { textColor: 16765567 }));
        add(C.SKILL_CURRENT_START + skill, grid, text(x + 30, y + 20, 44, 17, { textColor: 16776960 }));
        add(C.SKILL_BASE_START + skill, grid, text(x + 76, y + 20, 58, 17, { textColor: 16776960 }));
        add(C.SKILL_BUTTON_START + skill, grid, box(x, y, 138, 40, { ...clickable, filled: false, opacity: 255, actions: ["Set level"] }));
      });
      add(C.SKILL_TOTAL, grid, text(0, 354, 426, 20, { xTextAlignment: 1, textColor: 16776960 }));
      const presets = add(C.SKILL_PRESETS, grid, { rawY: 380, rawWidth: 426, rawHeight: 24, width: 426, height: 24 });
      PRESETS.forEach(([, name], i) => button(C.PRESET_START + i, C.PRESET_LABEL_START + i, presets, i * 107, 0, 104, 24, name));
      ContainerView.build(add, root, text, box, equipmentIcons);
      BotView.build(add, root, text, box, button);
      return {
        groupId: GROUP_ID,
        widgets,
        lifecycle: { persistOnWorldInteraction: true, blocksGameplay: false },
        search: {
          inputComponent: C.SEARCH_INPUT,
          backgroundComponent: C.SEARCH_BOX,
          dataComponent: DATA_COMPONENTS[0],
          extraDataComponents: DATA_COMPONENTS.slice(1),
          maxLength: 60,
          placeholder: "<col=8f7f66>Search names...</col>",
          focusColor: 4471079,
          blurColor: 2169878,
          caret: "|",
          textTemplate: "%s",
          focusOnOpen: false,
          focusOnTabs: [2, 5],
          socket: {
            requestComponent: C.SEARCH_REQUEST,
            responseComponent: C.SEARCH_RESPONSE,
            sessionComponent: C.SEARCH_SESSION,
            tabs: [2, 5],
            minimumLength: 2,
            allowNumeric: true,
            pageSize: 40,
            retainedPages: 3,
            idle: "Search a name (2+ letters)."
          },
          debounceMs: 180
        },
        list: {
          viewComponent: C.LIST_VIEW,
          scrollbarComponent: C.LIST_SCROLLBAR,
          slotCount: ROW_SLOTS,
          columns: 1,
          rowHeight: 46,
          stripeColors: [2630171, 3156255],
          labelXWithoutIcon: 10,
          textOnly: true,
          backgroundStart: C.ROW_BACKGROUND_START,
          iconStart: C.ROW_ICON_START,
          labelStart: C.ROW_LABEL_START,
          iconBaseY: 5,
          itemLabel: "%name<col=b8ab94>%detail</col>",
          clickable: true,
          headerStyle: { height: 22, backgroundColor: 3878946, textColor: 16765567, labelX: 6, labelWidth: 12 },
          collapsible: true,
          groupLabel: "%name",
          groupHeight: 36,
          groupColor: 3878946,
          rowChrome: {
            borderStart: C.ROW_BORDER_START,
            dividerStart: C.ROW_DIVIDER_START,
            guideStart: C.ROW_GUIDE_START,
            toggleStart: C.ROW_TOGGLE_START,
            toggleGlyphStart: C.ROW_GLYPH_START,
            indent: 16,
            maxIndent: 64
          },
          select: {
            op: 1,
            clearOnQuery: true,
            backgroundColor: 5522220,
            emptyComponent: C.PANEL_EMPTY,
            iconComponent: C.PANEL_ICON,
            autoHideIcon: true,
            clearComponents: [C.PANEL_ICON, ...BUTTONS.flatMap(({ button: button2, label }) => [button2, label])],
            actionComponents: BUTTONS.map(({ button: button2, label }, i) => ({ field: ["primary", "secondary", "third", "fourth"][i], components: [button2, label] })),
            texts: {
              title: C.PANEL_TITLE,
              info: C.PANEL_INFO,
              info2: C.PANEL_INFO2,
              description: C.PANEL_DESCRIPTION,
              primary: BUTTONS[0].label,
              secondary: BUTTONS[1].label,
              third: BUTTONS[2].label,
              fourth: BUTTONS[3].label
            }
          }
        },
        scroll: [
          {
            viewComponent: BotView.C.VIEW,
            scrollbarComponent: BotView.C.SCROLLBAR,
            contentHeightComponent: BotView.C.HEIGHT,
            contentHeight: 400,
            resetOnComponents: [...BotView.categoryComponents, BotView.C.BACK, BotView.C.BACK_LABEL]
          },
          { viewComponent: ContainerView.C.VIEW, scrollbarComponent: ContainerView.C.SCROLLBAR, contentHeightComponent: ContainerView.C.HEIGHT, contentHeight: 261 },
          { viewComponent: ContainerView.C.BANK_VIEW, scrollbarComponent: ContainerView.C.BANK_SCROLLBAR, contentHeightComponent: ContainerView.C.BANK_HEIGHT, contentHeight: 36 },
          {
            viewComponent: C.DETAIL_VIEW,
            scrollbarComponent: C.DETAIL_SCROLLBAR,
            contentHeight: 330,
            resetOnComponents: [C.TAB_START, C.TAB_LABEL_START].flatMap((start) => TAB_LABELS.map((_, i) => start + i))
          },
          { viewComponent: C.SKILL_VIEW, scrollbarComponent: C.SKILL_SCROLLBAR, contentHeight: 406 }
        ],
        tabs: {
          components: TAB_LABELS.map((_, i) => C.TAB_START + i),
          labelComponents: TAB_LABELS.map((_, i) => C.TAB_LABEL_START + i),
          labels: TAB_LABELS,
          activeTemplate: "<col=ffffff>%s</col>",
          inactiveTemplate: "<col=ffd27f>%s</col>",
          activeLabelIndices: { 2: 3 },
          activeColor: 5850926,
          inactiveColor: 3156255,
          layoutComponent: C.LAYOUT,
          clearQuery: true,
          visibility: TAB_VISIBILITY,
          serverDriven: true,
          pendingComponents: [
            ...BotView.components,
            C.TARGET_BUTTON,
            C.SELF_BUTTON,
            C.SEARCH_BOX,
            C.SEARCH_INPUT,
            C.STATUS,
            C.LIST_VIEW,
            C.LIST_SCROLLBAR,
            C.PANEL,
            C.PANEL_BORDER,
            C.DETAIL_VIEW,
            C.DETAIL_SCROLLBAR,
            C.SKILL_VIEW,
            C.SKILL_SCROLLBAR,
            ContainerView.C.VIEW,
            ContainerView.C.SCROLLBAR,
            ContainerView.C.BANK_VIEW,
            ContainerView.C.BANK_SCROLLBAR,
            ContainerView.C.BANK_TABS,
            ContainerView.C.BANK_INFO,
            C.UTILITY,
            C.UTILITY_LABEL,
            C.EDITOR_HINT,
            C.ADD_ITEMS,
            C.ADD_ITEMS_LABEL,
            C.CONTAINER_ADD,
            C.CONTAINER_ADD_LABEL,
            C.MAP_TELEPORT,
            C.MAP_TELEPORT_LABEL,
            ...BUTTONS.flatMap(({ button: button2, label }) => [button2, label]),
            ...SECTION_LABELS.flatMap((_, i) => [C.SECTION_START + i, C.SECTION_LABEL_START + i]),
            ...SPAWN_LABELS.flatMap((_, i) => [C.SPAWN_START + i, C.SPAWN_LABEL_START + i])
          ],
          geometry: [
            { component: C.SEARCH_BOX, base: { rawWidth: 36 }, overrides: { 6: { rawWidth: 294 } } },
            { component: C.SEARCH_INPUT, base: { rawWidth: 52 }, overrides: { 6: { rawWidth: 310 } } },
            { component: C.STATUS, base: { rawWidth: 36 }, overrides: { 6: { rawWidth: 294 } } },
            { component: C.PANEL, base: { rawY: 166, rawHeight: 180 }, overrides: { 6: { rawY: 116, rawHeight: 130 } } },
            { component: C.PANEL_BORDER, base: { rawY: 166, rawHeight: 180 }, overrides: { 6: { rawY: 116, rawHeight: 130 } } },
            { component: C.DETAIL_VIEW, base: { rawY: 174, rawHeight: 258 }, overrides: { 6: { rawY: 124, rawHeight: 176 } } },
            { component: C.DETAIL_SCROLLBAR, base: { rawY: 174, rawHeight: 258 }, overrides: { 6: { rawY: 124, rawHeight: 176 } } },
            ...[BUTTONS[0].button, BUTTONS[0].label].map((component) => ({ component, base: { rawY: 46 }, overrides: { 6: { rawY: 18 } } })),
            { component: C.PANEL_TITLE, base: { rawY: 0, rawHeight: 40 }, overrides: { 6: { rawY: 0, rawHeight: 52 } } },
            { component: C.PANEL_INFO, base: { rawY: 44, rawHeight: 36 }, overrides: { 6: { rawY: 56, rawHeight: 24 } } },
            { component: C.PANEL_INFO2, base: { rawY: 84, rawHeight: 28 }, overrides: { 6: { rawY: 82, rawHeight: 0 } } },
            { component: C.PANEL_DESCRIPTION, base: { rawX: 88, rawY: 118, rawWidth: 102, rawHeight: 174 }, overrides: { 6: { rawX: 0, rawY: 88, rawWidth: 190, rawHeight: 212 } } },
            { component: C.EDITOR_HINT, base: { rawX: 18, rawWidth: 332 }, overrides: { 5: { rawX: 164, rawWidth: 290 } } },
            { component: C.LIST_VIEW, base: { rawWidth: 294, rawHeight: 180 }, overrides: { 1: { rawWidth: 54, rawHeight: 218 } } },
            { component: C.LIST_SCROLLBAR, base: { rawX: 258, rawHeight: 180 }, overrides: { 1: { rawX: 18, rawHeight: 218 } } }
          ]
        },
        status: { component: C.STATUS, matches: "%total listed", loading: "Searching...", error: "Search unavailable. Try again.", empty: "No matches. Try another name." }
      };
    }
    module2.exports = { GROUP_ID, MAIN_MODAL_UID, COMPONENT, TAB_LABELS, SECTION_LABELS, SPAWN_LABELS, DATA_COMPONENTS, BUTTONS, ROW_SLOTS, PRESETS, SKILL_ORDER, TAB_VISIBILITY, uid, buildInterface };
  }
});

// server/plugins/interface/data/minigame-teleports.json
var require_minigame_teleports = __commonJS({
  "server/plugins/interface/data/minigame-teleports.json"(exports2, module2) {
    module2.exports = {
      $comment: "Minigame Teleport destinations and requirements by the cache's minigame name (db table 214, the list interface 951 shows). From https://oldschool.runescape.wiki/w/Minigame_Teleport; Nightmare Zone and the Ardougne rat pit are where live captures landed (docs/minigame-teleports.md). 'notes' are requirements the server does not track.",
      source: "https://oldschool.runescape.wiki/w/Minigame_Teleport",
      minigames: {
        "Barbarian Assault": { x: 2531, y: 3577, members: true, notes: "Barbarian Assault tutorial" },
        "Blast Furnace": { x: 2930, y: 10193, members: true, visited: ["Keldagrim"] },
        "Bounty Hunter": { x: 3140, y: 3626, members: true },
        "Burthorpe Games Room": { x: 2899, y: 3553, members: true },
        "Castle Wars": { x: 2442, y: 3093 },
        "Clan Wars": { x: 3149, y: 3634 },
        "Fishing Trawler": { x: 2658, y: 3157, members: true, skills: { FISHING: 15 } },
        "Giants' Foundry": { x: 3361, y: 3149, members: true, skills: { SMITHING: 15 } },
        "Guardians of the Rift": { x: 3615, y: 9477, members: true, quests: ["Temple of the Eye"] },
        "Last Man Standing": { x: 3149, y: 3634 },
        "Mage Training Arena": { x: 3363, y: 3295, members: true, notes: "spoken to the Entrance Guardian" },
        "Mastering Mixology": { x: 1388, y: 2918, members: true, quests: ["Children of the Sun"], skills: { HERBLORE: 60 } },
        "Nightmare Zone": { x: 2609, y: 3121, members: true, notes: "five eligible quests with boss fights" },
        "Pest Control": { x: 2658, y: 2663, members: true, combat: 40 },
        "Rat Pits": {
          members: true,
          quests: ["Ratcatchers"],
          prompt: "Which rat pit would you like to visit?",
          choices: [
            { option: "Ardougne (kittens)", x: 2565, y: 3320 },
            { option: "Varrock (grown cats)", x: 3267, y: 3400 },
            { option: "Keldagrim (overgrown cats)", x: 2914, y: 10193 },
            { option: "Port Sarim (wily cats)", x: 3018, y: 3232 }
          ]
        },
        "Shades of Mort'ton": { x: 3506, y: 3304, members: true, quests: ["Shades of Mort'ton"] },
        "Sorceress's Garden": { groupingName: "Sorceress Garden", x: 3321, y: 3138, members: true, quests: ["Prince Ali Rescue"], notes: "spoken to Osman after the quest, or previously teleported by the Apprentice" },
        "Soul Wars": { x: 2210, y: 2857, members: true, notes: "Soul Wars lobby on the Isle of Souls (Wiki, Minigame Teleport: 2210,2857)" },
        "Tithe Farm": { x: 1792, y: 3501, members: true, skills: { FARMING: 34 }, visited: ["Tithe Farm"] },
        "Trouble Brewing": { x: 3816, y: 3024, members: true, quests: ["Cabin Fever"], skills: { COOKING: 40 } },
        "TzHaar Fight Pit": { x: 2399, y: 5177, members: true }
      }
    };
  }
});

// server/plugins/interface/data/teleports.json
var require_teleports = __commonJS({
  "server/plugins/interface/data/teleports.json"(exports2, module2) {
    module2.exports = {
      tabs: [
        {
          key: "saved",
          label: "Saved"
        },
        {
          key: "all",
          label: "All"
        },
        {
          key: "places",
          label: "Places"
        },
        {
          key: "bosses",
          label: "Bosses"
        },
        {
          key: "minigames",
          label: "Minigames"
        },
        {
          key: "wilderness",
          label: "Wilderness"
        },
        {
          key: "skilling",
          label: "Skilling"
        }
      ],
      destinations: [
        {
          key: "standard-lumbridge",
          name: "Lumbridge",
          tab: "places",
          group: "Standard spellbook",
          tile: [
            3222,
            3218,
            0
          ],
          icon: "poh_tablet_lumbridgeteleport",
          description: "Where the Standard spellbook's Lumbridge Teleport lands.",
          terms: "standard spell modern"
        },
        {
          key: "standard-varrock",
          name: "Varrock",
          tab: "places",
          group: "Standard spellbook",
          tile: [
            3213,
            3424,
            0
          ],
          icon: "poh_tablet_varrockteleport",
          description: "Where the Standard spellbook's Varrock Teleport lands.",
          terms: "standard spell modern"
        },
        {
          key: "standard-falador",
          name: "Falador",
          tab: "places",
          group: "Standard spellbook",
          tile: [
            2964,
            3378,
            0
          ],
          icon: "poh_tablet_faladorteleport",
          description: "Where the Standard spellbook's Falador Teleport lands.",
          terms: "standard spell modern"
        },
        {
          key: "standard-house-portal",
          name: "House portal (Rimmington)",
          tab: "places",
          group: "Standard spellbook",
          tile: [
            2953,
            3224,
            0
          ],
          icon: "poh_tablet_teleporttohouse",
          description: "Where the Standard spellbook's House portal Teleport lands.",
          terms: "standard spell modern"
        },
        {
          key: "standard-camelot",
          name: "Camelot",
          tab: "places",
          group: "Standard spellbook",
          tile: [
            2757,
            3478,
            0
          ],
          icon: "poh_tablet_camelotteleport",
          description: "Where the Standard spellbook's Camelot Teleport lands.",
          terms: "standard spell modern"
        },
        {
          key: "standard-kourend-castle",
          name: "Kourend Castle",
          tab: "places",
          group: "Standard spellbook",
          tile: [
            1643,
            3672,
            0
          ],
          icon: "lawrune",
          description: "Where the Standard spellbook's Kourend Castle Teleport lands.",
          terms: "standard spell modern"
        },
        {
          key: "standard-ardougne",
          name: "Ardougne",
          tab: "places",
          group: "Standard spellbook",
          tile: [
            2661,
            3301,
            0
          ],
          icon: "poh_tablet_ardougneteleport",
          description: "Where the Standard spellbook's Ardougne Teleport lands.",
          terms: "standard spell modern"
        },
        {
          key: "standard-civitas-illa-fortis",
          name: "Civitas illa Fortis",
          tab: "places",
          group: "Standard spellbook",
          tile: [
            1680,
            3130,
            0
          ],
          icon: "lawrune",
          description: "Where the Standard spellbook's Civitas illa Fortis Teleport lands.",
          terms: "standard spell modern"
        },
        {
          key: "standard-watchtower",
          name: "Watchtower",
          tab: "places",
          group: "Standard spellbook",
          tile: [
            2933,
            4712,
            2
          ],
          icon: "poh_tablet_watchtowerteleport",
          description: "Where the Standard spellbook's Watchtower Teleport lands.",
          terms: "standard spell modern"
        },
        {
          key: "standard-trollheim",
          name: "Trollheim",
          tab: "places",
          group: "Standard spellbook",
          tile: [
            2891,
            3678,
            0
          ],
          icon: "lawrune",
          description: "Where the Standard spellbook's Trollheim Teleport lands.",
          terms: "standard spell modern"
        },
        {
          key: "standard-ape-atoll",
          name: "Ape Atoll",
          tab: "places",
          group: "Standard spellbook",
          tile: [
            2796,
            2798,
            0
          ],
          icon: "lawrune",
          description: "Where the Standard spellbook's Ape Atoll Teleport lands.",
          terms: "standard spell modern"
        },
        {
          key: "ancient-edgeville",
          name: "Edgeville",
          tab: "places",
          group: "Ancient Magicks",
          tile: [
            3087,
            3496,
            0
          ],
          type: "ANCIENT",
          icon: "staff_of_zaros",
          description: "Where the Ancient Magicks Edgeville Teleport lands.",
          terms: "ancient spell ancients"
        },
        {
          key: "ancient-paddewwa",
          name: "Paddewwa",
          tab: "places",
          group: "Ancient Magicks",
          tile: [
            3097,
            9880,
            0
          ],
          type: "ANCIENT",
          icon: "staff_of_zaros",
          description: "Where the Ancient Magicks Paddewwa Teleport lands.",
          terms: "ancient spell ancients"
        },
        {
          key: "ancient-senntisten",
          name: "Senntisten",
          tab: "places",
          group: "Ancient Magicks",
          tile: [
            3320,
            3338,
            0
          ],
          type: "ANCIENT",
          icon: "staff_of_zaros",
          description: "Where the Ancient Magicks Senntisten Teleport lands.",
          terms: "ancient spell ancients"
        },
        {
          key: "ancient-kharyrll",
          name: "Kharyrll",
          tab: "places",
          group: "Ancient Magicks",
          tile: [
            3492,
            3471,
            0
          ],
          type: "ANCIENT",
          icon: "staff_of_zaros",
          description: "Where the Ancient Magicks Kharyrll Teleport lands.",
          terms: "ancient spell ancients"
        },
        {
          key: "ancient-lassar",
          name: "Lassar",
          tab: "places",
          group: "Ancient Magicks",
          tile: [
            3002,
            3470,
            0
          ],
          type: "ANCIENT",
          icon: "staff_of_zaros",
          description: "Where the Ancient Magicks Lassar Teleport lands.",
          terms: "ancient spell ancients"
        },
        {
          key: "arceuus-library",
          name: "Arceuus Library",
          tab: "places",
          group: "Arceuus spellbook",
          tile: [
            1632,
            3838,
            0
          ],
          type: "ARCEUUS",
          icon: "teletab_lumbridge",
          description: "Where the Arceuus spellbook's Arceuus Library Teleport lands.",
          terms: "arceuus spell necro"
        },
        {
          key: "arceuus-draynor-manor",
          name: "Draynor Manor",
          tab: "places",
          group: "Arceuus spellbook",
          tile: [
            3108,
            3352,
            0
          ],
          type: "ARCEUUS",
          icon: "soulrune",
          description: "Where the Arceuus spellbook's Draynor Manor Teleport lands.",
          terms: "arceuus spell necro"
        },
        {
          key: "arceuus-battlefront",
          name: "Battlefront",
          tab: "places",
          group: "Arceuus spellbook",
          tile: [
            1348,
            3739,
            0
          ],
          type: "ARCEUUS",
          icon: "soulrune",
          description: "Where the Arceuus spellbook's Battlefront Teleport lands.",
          terms: "arceuus spell necro"
        },
        {
          key: "arceuus-mind-altar",
          name: "Mind Altar",
          tab: "places",
          group: "Arceuus spellbook",
          tile: [
            2980,
            3510,
            0
          ],
          type: "ARCEUUS",
          icon: "soulrune",
          description: "Where the Arceuus spellbook's Mind Altar Teleport lands.",
          terms: "arceuus spell necro"
        },
        {
          key: "arceuus-salve-graveyard",
          name: "Salve Graveyard",
          tab: "places",
          group: "Arceuus spellbook",
          tile: [
            3432,
            3461,
            0
          ],
          type: "ARCEUUS",
          icon: "soulrune",
          description: "Where the Arceuus spellbook's Salve Graveyard Teleport lands.",
          terms: "arceuus spell necro"
        },
        {
          key: "arceuus-fenkenstrains-castle",
          name: "Fenkenstrain's Castle",
          tab: "places",
          group: "Arceuus spellbook",
          tile: [
            3548,
            3528,
            0
          ],
          type: "ARCEUUS",
          icon: "soulrune",
          description: "Where the Arceuus spellbook's Fenkenstrain's Castle Teleport lands.",
          terms: "arceuus spell necro"
        },
        {
          key: "arceuus-west-ardougne",
          name: "West Ardougne",
          tab: "places",
          group: "Arceuus spellbook",
          tile: [
            2500,
            3291,
            0
          ],
          type: "ARCEUUS",
          icon: "soulrune",
          description: "Where the Arceuus spellbook's West Ardougne Teleport lands.",
          terms: "arceuus spell necro"
        },
        {
          key: "arceuus-harmony-island",
          name: "Harmony Island",
          tab: "places",
          group: "Arceuus spellbook",
          tile: [
            3797,
            2866,
            0
          ],
          type: "ARCEUUS",
          icon: "soulrune",
          description: "Where the Arceuus spellbook's Harmony Island Teleport lands.",
          terms: "arceuus spell necro"
        },
        {
          key: "arceuus-barrows",
          name: "Barrows",
          tab: "places",
          group: "Arceuus spellbook",
          tile: [
            3565,
            3315,
            0
          ],
          type: "ARCEUUS",
          icon: "soulrune",
          description: "Where the Arceuus spellbook's Barrows Teleport lands.",
          terms: "arceuus spell necro"
        },
        {
          key: "arceuus-ape-atoll-dungeon",
          name: "Ape Atoll Dungeon",
          tab: "places",
          group: "Arceuus spellbook",
          tile: [
            2770,
            9100,
            0
          ],
          type: "ARCEUUS",
          icon: "soulrune",
          description: "Where the Arceuus spellbook's Ape Atoll Dungeon Teleport lands.",
          terms: "arceuus spell necro"
        },
        {
          key: "arceuus-home",
          name: "Arceuus Home",
          tab: "places",
          group: "Arceuus spellbook",
          tile: [
            1712,
            3882,
            0
          ],
          type: "ARCEUUS",
          icon: "soulrune",
          description: "The Arceuus spellbook's home teleport.",
          terms: "arceuus spell"
        },
        {
          key: "wealth-grand-exchange",
          name: "Grand Exchange",
          tab: "places",
          group: "Ring of wealth",
          tile: [
            3163,
            3478,
            0
          ],
          icon: "ring_of_wealth",
          description: "Where a ring of wealth's Grand Exchange teleport lands.",
          terms: "ring of wealth row jewellery"
        },
        {
          key: "wealth-miscellania",
          name: "Miscellania",
          tab: "places",
          group: "Ring of wealth",
          tile: [
            2539,
            3864,
            0
          ],
          icon: "ring_of_wealth",
          description: "Where a ring of wealth's Miscellania teleport lands.",
          terms: "ring of wealth row jewellery"
        },
        {
          key: "wealth-falador-park",
          name: "Falador Park",
          tab: "places",
          group: "Ring of wealth",
          tile: [
            2994,
            3377,
            0
          ],
          icon: "ring_of_wealth",
          description: "Where a ring of wealth's Falador Park teleport lands.",
          terms: "ring of wealth row jewellery"
        },
        {
          key: "wealth-dondakans-rock",
          name: "Dondakan's Rock",
          tab: "places",
          group: "Ring of wealth",
          tile: [
            2824,
            10168,
            0
          ],
          icon: "ring_of_wealth",
          description: "Where a ring of wealth's Dondakan's Rock teleport lands.",
          terms: "ring of wealth row jewellery"
        },
        {
          key: "glory-edgeville",
          name: "Edgeville",
          tab: "places",
          group: "Amulet of glory",
          tile: [
            3087,
            3496,
            0
          ],
          icon: "amulet_of_glory",
          description: "Where an amulet of glory's Edgeville teleport lands.",
          terms: "amulet of glory jewellery"
        },
        {
          key: "glory-karamja",
          name: "Karamja",
          tab: "places",
          group: "Amulet of glory",
          tile: [
            2918,
            3176,
            0
          ],
          icon: "amulet_of_glory",
          description: "Where an amulet of glory's Karamja teleport lands.",
          terms: "amulet of glory jewellery"
        },
        {
          key: "glory-draynor-village",
          name: "Draynor Village",
          tab: "places",
          group: "Amulet of glory",
          tile: [
            3105,
            3251,
            0
          ],
          icon: "amulet_of_glory",
          description: "Where an amulet of glory's Draynor Village teleport lands.",
          terms: "amulet of glory jewellery"
        },
        {
          key: "glory-al-kharid",
          name: "Al Kharid",
          tab: "places",
          group: "Amulet of glory",
          tile: [
            3293,
            3163,
            0
          ],
          icon: "amulet_of_glory",
          description: "Where an amulet of glory's Al Kharid teleport lands.",
          terms: "amulet of glory jewellery"
        },
        {
          key: "abyssal-sire",
          name: "Abyssal Sire",
          tab: "bosses",
          group: "Bosses",
          tile: [
            3039,
            4800,
            0
          ],
          icon: "abyssalsire_unsired",
          description: "The Abyssal Nexus. The Sire only wakes for players on an abyssal demon task.",
          kc: "Abyssal Sire",
          terms: "slayer nexus"
        },
        {
          key: "amoxliatl",
          name: "Amoxliatl",
          tab: "bosses",
          group: "Bosses",
          tile: [
            1602,
            9631,
            0
          ],
          icon: "glacial_temotli",
          description: "Outside the frozen door. It opens once The Heart of Darkness is complete.",
          kc: "Amoxliatl"
        },
        {
          key: "araxxor",
          name: "Araxxor",
          tab: "bosses",
          group: "Bosses",
          tile: [
            3658,
            9816,
            0
          ],
          icon: "araxyte_fang",
          description: "Morytania Spider Nest.",
          kc: "Araxxor",
          terms: "spider slayer"
        },
        {
          key: "bryophyta",
          name: "Bryophyta",
          tab: "bosses",
          group: "Bosses",
          tile: [
            3174,
            9900,
            0
          ],
          icon: "mossy_key",
          description: "Outside Bryophyta's gate in the Varrock Sewers. Needs a mossy key.",
          kc: "Bryophyta",
          terms: "moss giant"
        },
        {
          key: "corporeal-beast",
          name: "Corporeal Beast",
          tab: "bosses",
          group: "Bosses",
          live: "corporeal:teleport-destination",
          unavailable: "The Corporeal Beast's cave is unavailable.",
          tile: [
            2966,
            4252,
            2
          ],
          icon: "spirit_shield",
          description: "The Corporeal Beast's cave.",
          kc: "Corporeal Beast",
          terms: "corp"
        },
        {
          key: "count-draynor",
          name: "Count Draynor",
          tab: "bosses",
          group: "Bosses",
          tile: [
            3077,
            9772,
            0
          ],
          icon: "garlic",
          description: "The Count's crypt beneath Draynor Manor.",
          terms: "vampyre",
          arrival: "count-draynor:arriving"
        },
        {
          key: "dagannoth-kings",
          name: "Dagannoth Kings",
          tab: "bosses",
          group: "Bosses",
          tile: [
            1908,
            4367,
            0
          ],
          icon: "berzerker_ring",
          description: "Waterbirth Island Dungeon, by the kings' lair.",
          kc: "Dagannoth Rex",
          terms: "dks rex prime supreme"
        },
        {
          key: "doom-of-mokhaiotl",
          name: "Doom of Mokhaiotl",
          tab: "bosses",
          group: "Bosses",
          tile: [
            1311,
            9531,
            1
          ],
          icon: "mokhaiotl_cloth",
          description: "The delve beneath Varlamore.",
          kc: "Doom of Mokhaiotl",
          terms: "doom"
        },
        {
          key: "elvarg",
          name: "Elvarg",
          tab: "bosses",
          group: "Bosses",
          tile: [
            2852,
            9637,
            0
          ],
          icon: "antidragonbreathshield",
          description: "Elvarg's lair on Crandor.",
          terms: "dragon slayer"
        },
        {
          key: "gemstone-crab",
          name: "Gemstone Crab",
          tab: "bosses",
          group: "Bosses",
          live: "gemstone-crab:location",
          unavailable: "The Gemstone Crab hasn't surfaced yet.",
          icon: "uncut_diamond",
          description: "The mine the Gemstone Crab is in now, or rises at next while it burrows.",
          terms: "crab"
        },
        {
          key: "giant-mole",
          name: "Giant Mole",
          tab: "bosses",
          group: "Bosses",
          tile: [
            1752,
            5236,
            0
          ],
          icon: "mole_claw",
          description: "Inside the Giant Mole's lair under Falador Park.",
          kc: "Giant Mole"
        },
        {
          key: "hueycoatl",
          name: "Hueycoatl",
          tab: "bosses",
          group: "Bosses",
          tile: [
            1524,
            3290,
            0
          ],
          icon: "huey_hide",
          description: "The Hueycoatl camp in Varlamore.",
          kc: "The Hueycoatl",
          terms: "huey"
        },
        {
          key: "kalphite-queen",
          name: "Kalphite Queen",
          tab: "bosses",
          group: "Bosses",
          tile: [
            3508,
            9494,
            0
          ],
          icon: "poh_trophydrop_kalphitequeen",
          description: "The Kalphite Lair's queen chamber.",
          kc: "Kalphite Queen",
          terms: "kq"
        },
        {
          key: "kraken",
          name: "Kraken",
          tab: "bosses",
          group: "Bosses",
          tile: [
            2279,
            10016,
            0
          ],
          icon: "kraken_tentacle",
          description: "Kraken Cove.",
          kc: "Kraken",
          terms: "slayer cove"
        },
        {
          key: "mad-angel",
          name: "Mad Angel",
          tab: "bosses",
          group: "Bosses",
          tile: [
            2539,
            2216,
            0
          ],
          icon: "blessedstar",
          description: "Outside the broken pew in Ardeaglais cathedral.",
          terms: "wyrmscraig"
        },
        {
          key: "the-mimic",
          name: "The Mimic",
          tab: "bosses",
          group: "Bosses",
          tile: [
            1645,
            3572,
            1
          ],
          icon: "casket",
          description: "The Mimic's chamber.",
          kc: "The Mimic",
          terms: "clue"
        },
        {
          key: "moons-of-peril",
          name: "Moons of Peril",
          tab: "bosses",
          group: "Bosses",
          tile: [
            1441,
            9637,
            1
          ],
          icon: "blood_moon_chestplate",
          description: "The antechamber by the monolith. Facing a Moon needs Perilous Moons.",
          kc: "Blood Moon",
          terms: "moons perilous blue eclipse blood"
        },
        {
          key: "nightmare",
          name: "Nightmare",
          tab: "bosses",
          group: "Bosses",
          tile: [
            3808,
            9756,
            1
          ],
          icon: "nightmare_staff",
          description: "Beside the sleeping Nightmare in the Sisterhood Sanctuary.",
          kc: "The Nightmare",
          terms: "nightmare slepe"
        },
        {
          key: "phosanis-nightmare",
          name: "Phosani's Nightmare",
          tab: "bosses",
          group: "Bosses",
          tile: [
            3808,
            9779,
            1
          ],
          icon: "nightmare_staff",
          description: "Beside the Pool of Nightmares.",
          kc: "Phosani's Nightmare",
          terms: "nightmare slepe"
        },
        {
          key: "obor",
          name: "Obor",
          tab: "bosses",
          group: "Bosses",
          tile: [
            3095,
            9833,
            0
          ],
          icon: "hillgiant_boss_key",
          description: "Outside Obor's gate in Edgeville Dungeon. Needs a giant key.",
          kc: "Obor",
          terms: "hill giant"
        },
        {
          key: "phantom-muspah",
          name: "Phantom Muspah",
          tab: "bosses",
          group: "Bosses",
          tile: [
            2909,
            10317,
            0
          ],
          icon: "ancient_icon",
          description: "By the crevice in Ghorrock Dungeon. Needs Secrets of the North.",
          kc: "Phantom Muspah",
          terms: "muspah"
        },
        {
          key: "royal-titans",
          name: "Royal Titans",
          tab: "bosses",
          group: "Bosses",
          tile: [
            2950,
            9574,
            0
          ],
          icon: "giantsoul_amulet_charged",
          description: "Asgarnian Ice Dungeon, by the titans' arena.",
          kc: "Royal Titans",
          terms: "branda eldric"
        },
        {
          key: "sarachnis",
          name: "Sarachnis",
          tab: "bosses",
          group: "Bosses",
          tile: [
            1842,
            9913,
            0
          ],
          icon: "sarachnis_cudgel",
          description: "The Forthos Dungeon tomb.",
          kc: "Sarachnis",
          terms: "spider"
        },
        {
          key: "scurrius",
          name: "Scurrius",
          tab: "bosses",
          group: "Bosses",
          tile: [
            3279,
            9869,
            0
          ],
          icon: "rat_boss_spine",
          description: "Outside Scurrius' lair in the Varrock Sewers.",
          kc: "Scurrius",
          terms: "rat"
        },
        {
          key: "skotizo",
          name: "Skotizo",
          tab: "bosses",
          group: "Bosses",
          tile: [
            1662,
            10049,
            0
          ],
          icon: "cata_totem",
          description: "The Catacombs of Kourend altar. Needs a dark totem.",
          kc: "Skotizo",
          terms: "catacombs"
        },
        {
          key: "thermonuclear-smoke-devil",
          name: "Thermonuclear Smoke Devil",
          tab: "bosses",
          group: "Bosses",
          tile: [
            2379,
            9452,
            0
          ],
          icon: "smoke_battlestaff",
          description: "The smoke devil boss room.",
          kc: "Thermonuclear Smoke Devil",
          terms: "thermy slayer"
        },
        {
          key: "tormented-demons",
          name: "Tormented Demons",
          tab: "bosses",
          group: "Bosses",
          tile: [
            4063,
            4557,
            0
          ],
          icon: "tormented_synapse",
          description: "The Ancient Guthixian Temple.",
          terms: "td guthix"
        },
        {
          key: "vardorvis",
          name: "Vardorvis",
          tab: "bosses",
          group: "Bosses",
          tile: [
            1117,
            3428,
            0
          ],
          icon: "ultor_vestige",
          description: "Outside the Stranglewood gate. Needs Desert Treasure II.",
          kc: "Vardorvis",
          terms: "dt2"
        },
        {
          key: "vorkath",
          name: "Vorkath",
          tab: "bosses",
          group: "Bosses",
          tile: [
            2272,
            4052,
            0
          ],
          icon: "vorkathpet",
          description: "Ungael, by Vorkath's island.",
          kc: "Vorkath",
          terms: "dragon"
        },
        {
          key: "yama",
          name: "Yama",
          tab: "bosses",
          group: "Bosses",
          tile: [
            1439,
            10076,
            0
          ],
          icon: "oathplate_helm",
          description: "Yama's throne room.",
          kc: "Yama"
        },
        {
          key: "zulrah",
          name: "Zulrah",
          tab: "bosses",
          group: "Bosses",
          tile: [
            2196,
            3056,
            0
          ],
          icon: "snakeboss_scale",
          description: "Zul-Andra, ready to board the boat to Zulrah's shrine.",
          kc: "Zulrah",
          terms: "snake"
        },
        {
          key: "gwd-entrance",
          name: "God Wars Dungeon",
          tab: "bosses",
          group: "God Wars Dungeon",
          tile: [
            2916,
            3745,
            0
          ],
          icon: "godwars_godsword_blade1",
          description: "The dungeon entrance on Trollheim. 40 kill count opens a general's door.",
          terms: "gwd"
        },
        {
          key: "gwd-bandos",
          name: "General Graardor",
          tab: "bosses",
          group: "God Wars Dungeon",
          tile: [
            2862,
            5354,
            2
          ],
          icon: "bgs",
          description: "Outside Bandos' stronghold door.",
          kc: "General Graardor",
          terms: "gwd bandos"
        },
        {
          key: "gwd-saradomin",
          name: "Commander Zilyana",
          tab: "bosses",
          group: "God Wars Dungeon",
          tile: [
            2909,
            5265,
            0
          ],
          icon: "sgs",
          description: "Outside Saradomin's encampment door.",
          kc: "Commander Zilyana",
          terms: "gwd sara saradomin"
        },
        {
          key: "gwd-zamorak",
          name: "K'ril Tsutsaroth",
          tab: "bosses",
          group: "God Wars Dungeon",
          tile: [
            2925,
            5333,
            2
          ],
          icon: "zgs",
          description: "Outside Zamorak's fortress door.",
          kc: "K'ril Tsutsaroth",
          terms: "gwd zammy zamorak kril"
        },
        {
          key: "gwd-armadyl",
          name: "Kree'arra",
          tab: "bosses",
          group: "God Wars Dungeon",
          tile: [
            2839,
            5294,
            2
          ],
          icon: "ags",
          description: "Outside Armadyl's eyrie door.",
          kc: "Kree'arra",
          terms: "gwd arma armadyl"
        },
        {
          key: "gwd-nex",
          name: "Nex",
          tab: "bosses",
          group: "God Wars Dungeon",
          tile: [
            2883,
            5280,
            2
          ],
          icon: "zaryte_vambraces",
          description: "The God Wars side of the frozen door to Nex's prison.",
          kc: "Nex",
          terms: "gwd ancient zaros"
        },
        {
          key: "chambers-of-xeric",
          name: "Chambers of Xeric",
          tab: "minigames",
          group: "Raids",
          tile: [
            1234,
            3566,
            0
          ],
          icon: "olmpet",
          description: "Mount Quidamortem, at the raid entrance.",
          kc: "Chambers of Xeric",
          terms: "cox raids 1"
        },
        {
          key: "theatre-of-blood",
          name: "Theatre of Blood",
          tab: "minigames",
          group: "Raids",
          tile: [
            3670,
            3219,
            0
          ],
          icon: "verzikpet",
          description: "Ver Sinhaza, outside the theatre.",
          kc: "Theatre of Blood",
          terms: "tob raids 2"
        },
        {
          key: "fractured-archive",
          name: "The Fractured Archive",
          tab: "minigames",
          group: "Raids",
          tile: [
            4127,
            5508,
            0
          ],
          icon: "guthixbook_complete",
          description: "The archive lobby.",
          terms: "tfa raids 4"
        },
        {
          key: "tombs-of-amascut",
          name: "Tombs of Amascut",
          tab: "minigames",
          group: "Raids",
          tile: [
            3357,
            2713,
            0
          ],
          icon: "wardenpet_tumeken",
          description: "The Necropolis, above the tombs.",
          kc: "Tombs of Amascut",
          terms: "toa raids 3"
        },
        {
          key: "archery-competition",
          name: "Archery Competition",
          tab: "minigames",
          group: "Minigames",
          tile: [
            2655,
            3443,
            0
          ],
          icon: "archery_ticket",
          description: "The Ranging Guild.",
          terms: "ranging guild"
        },
        {
          key: "barrows",
          name: "Barrows",
          tab: "minigames",
          group: "Minigames",
          tile: [
            3565,
            3315,
            0
          ],
          icon: "spade",
          description: "The barrows mounds.",
          kc: "Barrows",
          terms: "brothers"
        },
        {
          key: "brimhaven-agility-arena",
          name: "Brimhaven Agility Arena",
          tab: "minigames",
          group: "Minigames",
          tile: [
            2808,
            3193,
            0
          ],
          icon: "agilityarena_ticket",
          description: "The arena entrance hut. Entry costs 200 coins.",
          terms: "agility"
        },
        {
          key: "castle-wars",
          name: "Castle Wars",
          tab: "minigames",
          group: "Minigames",
          tile: [
            2440,
            3089,
            0
          ],
          icon: "castlewars_ticket",
          description: "The Castle Wars lobby.",
          terms: "cw"
        },
        {
          key: "creature-creation",
          name: "Creature Creation",
          tab: "minigames",
          group: "Minigames",
          tile: [
            2649,
            3213,
            0
          ],
          icon: "unicorn_horn",
          description: "Beside the Tower of Life trapdoor. Needs Tower of Life."
        },
        {
          key: "duel-arena",
          name: "Duel Arena",
          tab: "minigames",
          group: "Minigames",
          tile: [
            3366,
            3266,
            0
          ],
          icon: "coins",
          description: "The Duel Arena.",
          terms: "emir's arena"
        },
        {
          key: "fortis-colosseum",
          name: "Fortis Colosseum",
          tab: "minigames",
          group: "Minigames",
          tile: [
            1799,
            9506,
            0
          ],
          icon: "dizanas_quiver_charged",
          description: "The Colosseum lobby.",
          kc: "Sol Heredit",
          terms: "colosseum varlamore"
        },
        {
          key: "gnome-ball",
          name: "Gnome Ball",
          tab: "minigames",
          group: "Minigames",
          tile: [
            2384,
            3488,
            0
          ],
          icon: "ball_gnomeball_game",
          description: "The Gnome Stronghold pitch."
        },
        {
          key: "guardians-of-the-rift",
          name: "Guardians of the Rift",
          tab: "minigames",
          group: "Minigames",
          tile: [
            3615,
            9480,
            0
          ],
          icon: "abyssal_needle",
          description: "The Temple of the Eye lobby. Needs Temple of the Eye.",
          terms: "gotr runecraft"
        },
        {
          key: "impetuous-impulses",
          name: "Impetuous Impulses",
          tab: "minigames",
          group: "Minigames",
          tile: [
            2427,
            4446,
            0
          ],
          icon: "hunting_butterfly_net",
          description: "The Zanaris crop circle to Puro-Puro.",
          terms: "puro implings"
        },
        {
          key: "mastering-mixology",
          name: "Mastering Mixology",
          tab: "minigames",
          group: "Minigames",
          tile: [
            1388,
            2918,
            0
          ],
          icon: "mm_alchemist_hat",
          description: "Aldarin, at the top of the lab stairs. Needs Children of the Sun and 60 Herblore.",
          terms: "mixology herblore"
        },
        {
          key: "pest-control",
          name: "Pest Control",
          tab: "minigames",
          group: "Minigames",
          tile: [
            2657,
            2639,
            0
          ],
          icon: "pest_void_knight_top",
          description: "The Void Knights' Outpost.",
          terms: "pc void"
        },
        {
          key: "sorceresss-garden",
          name: "Sorceress's Garden",
          tab: "minigames",
          group: "Minigames",
          tile: [
            3321,
            3138,
            0
          ],
          icon: "summer_pie",
          description: "Beside the apprentice in Al Kharid. Needs Prince Ali Rescue.",
          terms: "thieving"
        },
        {
          key: "stealing-artefacts",
          name: "Stealing Artefacts",
          tab: "minigames",
          group: "Minigames",
          tile: [
            1847,
            3753,
            0
          ],
          icon: "lockpick",
          description: "Port Piscarilius, by Captain Khaled.",
          terms: "thieving"
        },
        {
          key: "tears-of-guthix",
          name: "Tears of Guthix",
          tab: "minigames",
          group: "Minigames",
          tile: [
            3251,
            9516,
            2
          ],
          icon: "tog_bowl",
          description: "Juna's cave in the Lumbridge Swamp Caves.",
          terms: "tog"
        },
        {
          key: "temple-trekking",
          name: "Temple Trekking",
          tab: "minigames",
          group: "Minigames",
          tile: [
            3477,
            3235,
            0
          ],
          icon: "ramble_lumberjack_top",
          description: "Burgh de Rott, where a trek begins.",
          terms: "morytania"
        },
        {
          key: "the-gauntlet",
          name: "The Gauntlet",
          tab: "minigames",
          group: "Minigames",
          tile: [
            3032,
            6127,
            1
          ],
          icon: "prif_crystal_shard",
          description: "Prifddinas, at the Gauntlet entrance.",
          kc: "Crystalline Hunllef",
          terms: "hunllef corrupted cg"
        },
        {
          key: "the-inferno",
          name: "The Inferno",
          tab: "minigames",
          group: "Minigames",
          tile: [
            2495,
            5111,
            0
          ],
          icon: "infernal_cape",
          description: "Mor Ul Rek, at the Inferno entrance.",
          kc: "TzKal-Zuk",
          terms: "zuk tzhaar"
        },
        {
          key: "the-mess",
          name: "The Mess",
          tab: "minigames",
          group: "Minigames",
          tile: [
            1640,
            3627,
            0
          ],
          icon: "chefs_hat",
          description: "The Shayzien mess hall.",
          terms: "cooking"
        },
        {
          key: "tzhaar-fight-caves",
          name: "TzHaar Fight Caves",
          tab: "minigames",
          group: "Minigames",
          tile: [
            2438,
            5168,
            0
          ],
          icon: "tzhaar_cape_fire",
          description: "Mor Ul Rek, at the Fight Caves entrance.",
          kc: "TzTok-Jad",
          terms: "jad tzhaar"
        },
        {
          key: "tzhaar-fight-pits",
          name: "TzHaar Fight Pits",
          tab: "minigames",
          group: "Minigames",
          tile: [
            2399,
            5177,
            0
          ],
          icon: "tzhaar_token",
          description: "Mor Ul Rek, at the Fight Pits.",
          terms: "tzhaar"
        },
        {
          key: "vale-totems",
          name: "Vale Totems",
          tab: "minigames",
          group: "Minigames",
          tile: [
            1370,
            3376,
            0
          ],
          icon: "fletching_knife",
          description: "The first totem site in Ralos' Rise.",
          terms: "fletching"
        },
        {
          key: "warriors-guild",
          name: "Warriors' Guild",
          tab: "minigames",
          group: "Minigames",
          tile: [
            2876,
            3546,
            0
          ],
          icon: "dragon_parryingdagger",
          description: "Outside the Warriors' Guild.",
          terms: "defender"
        },
        {
          key: "port-port-sarim",
          name: "Port Sarim",
          tab: "places",
          group: "Ports",
          tile: [
            3050,
            3193,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Port Sarim dock, where a boat lets you ashore. Sailing 1 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-the-pandemonium",
          name: "The Pandemonium",
          tab: "places",
          group: "Ports",
          tile: [
            3069,
            2987,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The The Pandemonium dock, where a boat lets you ashore. Sailing 1 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-lands-end",
          name: "Land's End",
          tab: "places",
          group: "Ports",
          tile: [
            1506,
            3403,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Land's End dock, where a boat lets you ashore. Sailing 5 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-musa-point",
          name: "Musa Point",
          tab: "places",
          group: "Ports",
          tile: [
            2960,
            3146,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Musa Point dock, where a boat lets you ashore. Sailing 10 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-hosidius",
          name: "Hosidius",
          tab: "places",
          group: "Ports",
          tile: [
            1726,
            3453,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Hosidius dock, where a boat lets you ashore. Sailing 5 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-rimmington",
          name: "Rimmington",
          tab: "places",
          group: "Ports",
          tile: [
            2907,
            3225,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Rimmington dock, where a boat lets you ashore. Sailing 18 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-catherby",
          name: "Catherby",
          tab: "places",
          group: "Ports",
          tile: [
            2796,
            3413,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Catherby dock, where a boat lets you ashore. Sailing 20 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-port-piscarilius",
          name: "Port Piscarilius",
          tab: "places",
          group: "Ports",
          tile: [
            1845,
            3688,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Port Piscarilius dock, where a boat lets you ashore. Sailing 15 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-brimhaven",
          name: "Brimhaven",
          tab: "places",
          group: "Ports",
          tile: [
            2759,
            3230,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Brimhaven dock, where a boat lets you ashore. Sailing 25 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-ardougne",
          name: "Ardougne",
          tab: "places",
          group: "Ports",
          tile: [
            2671,
            3266,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Ardougne dock, where a boat lets you ashore. Sailing 28 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-port-khazard",
          name: "Port Khazard",
          tab: "places",
          group: "Ports",
          tile: [
            2685,
            3162,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Port Khazard dock, where a boat lets you ashore. Sailing 30 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-witchaven",
          name: "Witchaven",
          tab: "places",
          group: "Ports",
          tile: [
            2746,
            3305,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Witchaven dock, where a boat lets you ashore. Sailing 34 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-entrana",
          name: "Entrana",
          tab: "places",
          group: "Ports",
          tile: [
            2878,
            3336,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Entrana dock, where a boat lets you ashore. Sailing 36 to sail there.",
          terms: "sailing port dock boat",
          admission: "entrana:check-items"
        },
        {
          key: "port-civitas-illa-fortis",
          name: "Civitas illa Fortis",
          tab: "places",
          group: "Ports",
          tile: [
            1776,
            3142,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Civitas illa Fortis dock, where a boat lets you ashore. Sailing 38 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-corsair-cove",
          name: "Corsair Cove",
          tab: "places",
          group: "Ports",
          tile: [
            2579,
            2844,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Corsair Cove dock, where a boat lets you ashore. Sailing 40 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-cairn-isle",
          name: "Cairn Isle",
          tab: "places",
          group: "Ports",
          tile: [
            2751,
            2952,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Cairn Isle dock, where a boat lets you ashore. Sailing 42 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-sunset-coast",
          name: "Sunset Coast",
          tab: "places",
          group: "Ports",
          tile: [
            1513,
            2974,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Sunset Coast dock, where a boat lets you ashore. Sailing 44 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-the-summer-shore",
          name: "The Summer Shore",
          tab: "places",
          group: "Ports",
          tile: [
            3174,
            2368,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The The Summer Shore dock, where a boat lets you ashore. Sailing 45 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-aldarin",
          name: "Aldarin",
          tab: "places",
          group: "Ports",
          tile: [
            1452,
            2969,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Aldarin dock, where a boat lets you ashore. Sailing 46 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-ruins-of-unkah",
          name: "Ruins of Unkah",
          tab: "places",
          group: "Ports",
          tile: [
            3145,
            2825,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Ruins of Unkah dock, where a boat lets you ashore. Sailing 48 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-void-knights-outpost",
          name: "Void Knights' Outpost",
          tab: "places",
          group: "Ports",
          tile: [
            2651,
            2677,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Void Knights' Outpost dock, where a boat lets you ashore. Sailing 50 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-port-roberts",
          name: "Port Roberts",
          tab: "places",
          group: "Ports",
          tile: [
            1862,
            3307,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Port Roberts dock, where a boat lets you ashore. Sailing 50 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-red-rock",
          name: "Red Rock",
          tab: "places",
          group: "Ports",
          tile: [
            2808,
            2509,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Red Rock dock, where a boat lets you ashore. Sailing 52 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-rellekka",
          name: "Rellekka",
          tab: "places",
          group: "Ports",
          tile: [
            2630,
            3704,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Rellekka dock, where a boat lets you ashore. Sailing 62 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-etceteria",
          name: "Etceteria",
          tab: "places",
          group: "Ports",
          tile: [
            2613,
            3841,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Etceteria dock, where a boat lets you ashore. Sailing 65 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-port-tyras",
          name: "Port Tyras",
          tab: "places",
          group: "Ports",
          tile: [
            2144,
            3121,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Port Tyras dock, where a boat lets you ashore. Sailing 66 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-deepfin-point",
          name: "Deepfin Point",
          tab: "places",
          group: "Ports",
          tile: [
            1923,
            2759,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Deepfin Point dock, where a boat lets you ashore. Sailing 67 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-jatizso",
          name: "Jatizso",
          tab: "places",
          group: "Ports",
          tile: [
            2412,
            3781,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Jatizso dock, where a boat lets you ashore. Sailing 68 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-neitiznot",
          name: "Neitiznot",
          tab: "places",
          group: "Ports",
          tile: [
            2310,
            3782,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Neitiznot dock, where a boat lets you ashore. Sailing 68 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-prifddinas",
          name: "Prifddinas",
          tab: "places",
          group: "Ports",
          tile: [
            2158,
            3325,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Prifddinas dock, where a boat lets you ashore. Sailing 70 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-piscatoris",
          name: "Piscatoris",
          tab: "places",
          group: "Ports",
          tile: [
            2305,
            3689,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Piscatoris dock, where a boat lets you ashore. Sailing 75 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-lunar-isle",
          name: "Lunar Isle",
          tab: "places",
          group: "Ports",
          tile: [
            2151,
            3881,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Lunar Isle dock, where a boat lets you ashore. Sailing 76 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-isle-of-souls",
          name: "Isle of Souls",
          tab: "places",
          group: "Islands",
          tile: [
            2282,
            2822,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on the Isle of Souls, where a moored boat lets you off. Sailing 55 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-waterbirth-island",
          name: "Waterbirth Island",
          tab: "places",
          group: "Islands",
          tile: [
            2542,
            3765,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Waterbirth Island, where a moored boat lets you off. Sailing 74 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-weiss",
          name: "Weiss",
          tab: "places",
          group: "Islands",
          tile: [
            2861,
            3970,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Weiss, where a moored boat lets you off. Sailing 80 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-dognose-island",
          name: "Dognose Island",
          tab: "places",
          group: "Islands",
          tile: [
            3060,
            2639,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Dognose Island, where a moored boat lets you off. Sailing 40 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-remote-island",
          name: "Remote Island",
          tab: "places",
          group: "Islands",
          tile: [
            2971,
            2603,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on a remote island, where a moored boat lets you off. Sailing 45 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-the-little-pearl",
          name: "The Little Pearl",
          tab: "places",
          group: "Islands",
          tile: [
            3354,
            2215,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on the Little Pearl, where a moored boat lets you off. Sailing 45 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-the-onyx-crest",
          name: "The Onyx Crest",
          tab: "places",
          group: "Islands",
          tile: [
            2998,
            2287,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on the Onyx Crest, where a moored boat lets you off. Sailing 47 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-last-light",
          name: "Last Light",
          tab: "places",
          group: "Islands",
          tile: [
            2851,
            2326,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Last Light, where a moored boat lets you off. Sailing 52 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-charred-island",
          name: "Charred Island",
          tab: "places",
          group: "Islands",
          tile: [
            2659,
            2394,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Charred Island, where a moored boat lets you off. Sailing 60 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-vatrachos-island",
          name: "Vatrachos Island",
          tab: "places",
          group: "Islands",
          tile: [
            1874,
            2983,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Vatrachos Island, where a moored boat lets you off. Sailing 46 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-anglers-retreat",
          name: "Anglers' Retreat",
          tab: "places",
          group: "Islands",
          tile: [
            2469,
            2719,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Anglers' Retreat, where a moored boat lets you off. Sailing 51 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-minotaurs-rest",
          name: "Minotaurs' Rest",
          tab: "places",
          group: "Islands",
          tile: [
            1960,
            3114,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Minotaurs' Rest, where a moored boat lets you off. Sailing 54 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-isle-of-bones",
          name: "Isle of Bones",
          tab: "places",
          group: "Islands",
          tile: [
            2532,
            2531,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on the Isle of Bones, where a moored boat lets you off. Sailing 56 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-tear-of-the-soul",
          name: "Tear of the Soul",
          tab: "places",
          group: "Islands",
          tile: [
            2321,
            2774,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on the Tear of the Soul, where a moored boat lets you off. Sailing 61 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-wintumber-island",
          name: "Wintumber Island",
          tab: "places",
          group: "Islands",
          tile: [
            2060,
            2606,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Wintumber Island, where a moored boat lets you off. Sailing 63 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-the-crown-jewel",
          name: "The Crown Jewel",
          tab: "places",
          group: "Islands",
          tile: [
            1764,
            2659,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on the Crown Jewel, where a moored boat lets you off. Sailing 64 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-rainbows-end",
          name: "Rainbow's End",
          tab: "places",
          group: "Islands",
          tile: [
            2343,
            2269,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Rainbow's End, where a moored boat lets you off. Sailing 69 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-sunbleak-island",
          name: "Sunbleak Island",
          tab: "places",
          group: "Islands",
          tile: [
            2189,
            2325,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Sunbleak Island, where a moored boat lets you off. Sailing 72 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-shimmering-atoll",
          name: "Shimmering Atoll",
          tab: "places",
          group: "Islands",
          tile: [
            1558,
            2773,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on the Shimmering Atoll, where a moored boat lets you off. Sailing 49 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-laguna-aurorae",
          name: "Laguna Aurorae",
          tab: "places",
          group: "Islands",
          tile: [
            1201,
            2733,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Laguna Aurorae, where a moored boat lets you off. Sailing 58 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-chinchompa-island",
          name: "Chinchompa Island",
          tab: "places",
          group: "Islands",
          tile: [
            1893,
            3428,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Chinchompa Island, where a moored boat lets you off. Sailing 42 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-lledrith-island",
          name: "Lledrith Island",
          tab: "places",
          group: "Islands",
          tile: [
            2096,
            3187,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Lledrith Island, where a moored boat lets you off. Sailing 66 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-ynysdail",
          name: "Ynysdail",
          tab: "places",
          group: "Islands",
          tile: [
            2221,
            3464,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Ynysdail, where a moored boat lets you off. Sailing 73 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-buccaneers-haven",
          name: "Buccaneers' Haven",
          tab: "places",
          group: "Islands",
          tile: [
            2081,
            3689,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Buccaneers' Haven, where a moored boat lets you off. Sailing 76 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-drumstick-isle",
          name: "Drumstick Isle",
          tab: "places",
          group: "Islands",
          tile: [
            2149,
            3529,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Drumstick Isle, where a moored boat lets you off. Sailing 79 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-brittle-isle",
          name: "Brittle Isle",
          tab: "places",
          group: "Islands",
          tile: [
            1955,
            4058,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Brittle Isle, where a moored boat lets you off. Sailing 81 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-grimstone",
          name: "Grimstone",
          tab: "places",
          group: "Islands",
          tile: [
            2927,
            4055,
            0
          ],
          icon: "sailing_charting_spyglass",
          description: "Ashore on Grimstone, where a moored boat lets you off. Sailing 87 to sail there.",
          terms: "sailing port dock boat island"
        },
        {
          key: "port-wyrmscraig",
          name: "Wyrmscraig",
          tab: "places",
          group: "Ports",
          tile: [
            2569,
            2295,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Wyrmscraig dock, where a boat lets you ashore. Sailing 62 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "port-wyrmscraig-cave",
          name: "Wyrmscraig Cavern",
          tab: "places",
          group: "Ports",
          tile: [
            2583,
            8605,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The Wyrmscraig Cavern dock, where a boat lets you ashore. Sailing 62 to sail there.",
          terms: "sailing port dock boat"
        },
        {
          key: "shipyard",
          name: "Shipyard",
          tab: "places",
          group: "Ports",
          tile: [
            2086,
            2724,
            0
          ],
          icon: "sailing_skillguide_anchor",
          description: "The shipyard, where boats are built and fitted.",
          terms: "sailing boat"
        },
        {
          key: "house-rimmington",
          name: "Rimmington",
          tab: "places",
          group: "House portals",
          tile: [
            2954,
            3224,
            0
          ],
          icon: "poh_tablet_teleporttohouse",
          description: "The house portal in Rimmington.",
          terms: "poh house portal construction"
        },
        {
          key: "house-taverley",
          name: "Taverley",
          tab: "places",
          group: "House portals",
          tile: [
            2894,
            3465,
            0
          ],
          icon: "poh_tablet_teleporttohouse",
          description: "The house portal in Taverley.",
          terms: "poh house portal construction"
        },
        {
          key: "house-pollnivneach",
          name: "Pollnivneach",
          tab: "places",
          group: "House portals",
          tile: [
            3340,
            3004,
            0
          ],
          icon: "poh_tablet_teleporttohouse",
          description: "The house portal in Pollnivneach.",
          terms: "poh house portal construction"
        },
        {
          key: "house-hosidius",
          name: "Hosidius",
          tab: "places",
          group: "House portals",
          tile: [
            1744,
            3517,
            0
          ],
          icon: "poh_tablet_teleporttohouse",
          description: "The house portal in Hosidius.",
          terms: "poh house portal construction"
        },
        {
          key: "house-aldarin",
          name: "Aldarin",
          tab: "places",
          group: "House portals",
          tile: [
            1422,
            2965,
            0
          ],
          icon: "poh_tablet_teleporttohouse",
          description: "The house portal in Aldarin.",
          terms: "poh house portal construction"
        },
        {
          key: "house-rellekka",
          name: "Rellekka",
          tab: "places",
          group: "House portals",
          tile: [
            2670,
            3632,
            0
          ],
          icon: "poh_tablet_teleporttohouse",
          description: "The house portal in Rellekka.",
          terms: "poh house portal construction"
        },
        {
          key: "house-brimhaven",
          name: "Brimhaven",
          tab: "places",
          group: "House portals",
          tile: [
            2758,
            3178,
            0
          ],
          icon: "poh_tablet_teleporttohouse",
          description: "The house portal in Brimhaven.",
          terms: "poh house portal construction"
        },
        {
          key: "house-yanille",
          name: "Yanille",
          tab: "places",
          group: "House portals",
          tile: [
            2544,
            3095,
            0
          ],
          icon: "poh_tablet_teleporttohouse",
          description: "The house portal in Yanille.",
          terms: "poh house portal construction"
        },
        {
          key: "house-prifddinas",
          name: "Prifddinas",
          tab: "places",
          group: "House portals",
          tile: [
            3239,
            6076,
            0
          ],
          icon: "poh_tablet_teleporttohouse",
          description: "The house portal in Prifddinas.",
          terms: "poh house portal construction"
        },
        {
          key: "slayer-turael",
          name: "Turael",
          tab: "places",
          group: "Slayer masters",
          tile: [
            2931,
            3537,
            0
          ],
          icon: "slayer_gem",
          description: "Burthorpe. No combat level needed.",
          terms: "slayer master task"
        },
        {
          key: "slayer-spria",
          name: "Spria",
          tab: "places",
          group: "Slayer masters",
          tile: [
            3091,
            3267,
            0
          ],
          icon: "slayer_gem",
          description: "Draynor Village. No combat level needed.",
          terms: "slayer master task"
        },
        {
          key: "slayer-mazchna",
          name: "Mazchna",
          tab: "places",
          group: "Slayer masters",
          tile: [
            3511,
            3508,
            0
          ],
          icon: "slayer_gem",
          description: "Canifis. Needs combat level 20.",
          terms: "slayer master task"
        },
        {
          key: "slayer-vannaka",
          name: "Vannaka",
          tab: "places",
          group: "Slayer masters",
          tile: [
            3147,
            9913,
            0
          ],
          icon: "slayer_gem",
          description: "Edgeville Dungeon. Needs combat level 40.",
          terms: "slayer master task"
        },
        {
          key: "slayer-chaeldar",
          name: "Chaeldar",
          tab: "places",
          group: "Slayer masters",
          tile: [
            2444,
            4432,
            0
          ],
          icon: "slayer_gem",
          description: "Zanaris. Needs combat level 70.",
          terms: "slayer master task"
        },
        {
          key: "slayer-konar-quo-maten",
          name: "Konar quo Maten",
          tab: "places",
          group: "Slayer masters",
          tile: [
            1308,
            3785,
            0
          ],
          icon: "slayer_gem",
          description: "Mount Karuulm. Needs combat level 75; every task names where to kill it.",
          terms: "slayer master task"
        },
        {
          key: "slayer-nieve",
          name: "Nieve",
          tab: "places",
          group: "Slayer masters",
          tile: [
            2465,
            3491,
            0
          ],
          icon: "slayer_gem",
          description: "The Tree Gnome Stronghold. Needs combat level 85.",
          terms: "slayer master task"
        },
        {
          key: "slayer-duradel",
          name: "Duradel",
          tab: "places",
          group: "Slayer masters",
          tile: [
            2869,
            2983,
            1
          ],
          icon: "slayer_gem",
          description: "Shilo Village, upstairs in his hut. Needs combat level 100 and 50 Slayer.",
          terms: "slayer master task"
        },
        {
          key: "slayer-mortimer",
          name: "Mortimer",
          tab: "places",
          group: "Slayer masters",
          tile: [
            2589,
            8615,
            0
          ],
          icon: "slayer_gem",
          description: "Needs combat level 100 and 70 Slayer.",
          terms: "slayer master task"
        },
        {
          key: "slayer-tower",
          name: "Slayer Tower",
          tab: "places",
          group: "Dungeons",
          tile: [
            3428,
            3533,
            0
          ],
          icon: "slayer_ring_8",
          description: "Outside the Slayer Tower door in Morytania.",
          terms: "slayer"
        },
        {
          key: "catacombs-of-kourend",
          name: "Catacombs of Kourend",
          tab: "places",
          group: "Dungeons",
          tile: [
            1639,
            3673,
            0
          ],
          icon: "cata_totem",
          description: "By the statue in Kourend Castle's courtyard, over the catacombs.",
          terms: "slayer"
        },
        {
          key: "stronghold-of-security",
          name: "Stronghold of Security",
          tab: "places",
          group: "Dungeons",
          tile: [
            3081,
            3421,
            0
          ],
          icon: "fake_coins",
          description: "The entrance in Barbarian Village.",
          terms: "sos"
        },
        {
          key: "edgeville-dungeon",
          name: "Edgeville Dungeon",
          tab: "places",
          group: "Dungeons",
          tile: [
            3096,
            3467,
            0
          ],
          icon: "slayer_ring_8",
          description: "Beside the trapdoor in Edgeville.",
          terms: "slayer"
        },
        {
          key: "wyrmscraig",
          name: "Wyrmscraig",
          tab: "places",
          group: "Dungeons",
          tile: [
            2592,
            2220,
            0
          ],
          icon: "slayer_ring_8",
          description: "The town on the Wyrmscraig coast.",
          terms: "wyrms slayer"
        },
        {
          key: "wyrmscraig-cave",
          name: "Wyrmscraig cave",
          tab: "places",
          group: "Dungeons",
          tile: [
            2530,
            2205,
            0
          ],
          icon: "slayer_ring_8",
          description: "Outside the cave below Wyrmscraig.",
          terms: "wyrms slayer"
        },
        {
          key: "shooting-star",
          name: "Shooting star",
          tab: "skilling",
          group: "Skilling",
          live: "shooting-stars:current",
          unavailable: "No shooting star has landed at the moment.",
          icon: "star_dust",
          description: "Beside the star that has crashed most recently, while one is down.",
          terms: "mining stardust"
        },
        {
          key: "artio",
          name: "Artio",
          tab: "wilderness",
          group: "Wilderness bosses",
          tile: [
            3116,
            3675,
            0
          ],
          icon: "callisto_pet",
          description: "Hunter's End, Artio's lair.",
          kc: "Artio"
        },
        {
          key: "callisto",
          name: "Callisto",
          tab: "wilderness",
          group: "Wilderness bosses",
          tile: [
            3290,
            3847,
            0
          ],
          icon: "callisto_pet",
          description: "Callisto's den.",
          kc: "Callisto"
        },
        {
          key: "calvarion",
          name: "Calvar'ion",
          tab: "wilderness",
          group: "Wilderness bosses",
          tile: [
            3180,
            3682,
            0
          ],
          icon: "vetion_pet",
          description: "The Skeletal Tomb, Calvar'ion's lair.",
          kc: "Calvar'ion"
        },
        {
          key: "chaos-elemental",
          name: "Chaos Elemental",
          tab: "wilderness",
          group: "Wilderness bosses",
          tile: [
            3261,
            3927,
            0
          ],
          icon: "chaoselepet",
          description: "The Rogues' Castle grounds.",
          kc: "Chaos Elemental"
        },
        {
          key: "chaos-fanatic",
          name: "Chaos Fanatic",
          tab: "wilderness",
          group: "Wilderness bosses",
          tile: [
            2979,
            3846,
            0
          ],
          icon: "staff_of_zaros",
          description: "West of the Lava Maze.",
          kc: "Chaos Fanatic"
        },
        {
          key: "crazy-archaeologist",
          name: "Crazy Archaeologist",
          tab: "wilderness",
          group: "Wilderness bosses",
          tile: [
            2977,
            3702,
            0
          ],
          icon: "fedora",
          description: "The Crazy Archaeologist's dig site.",
          kc: "Crazy Archaeologist"
        },
        {
          key: "king-black-dragon",
          name: "King Black Dragon",
          tab: "wilderness",
          group: "Wilderness bosses",
          tile: [
            3010,
            3849,
            0
          ],
          icon: "kbdpet",
          description: "Beside the lever to the King Black Dragon's lair.",
          kc: "King Black Dragon",
          terms: "kbd"
        },
        {
          key: "scorpia",
          name: "Scorpia",
          tab: "wilderness",
          group: "Wilderness bosses",
          tile: [
            3233,
            10341,
            0
          ],
          icon: "scorpia_pet",
          description: "Scorpia's pit.",
          kc: "Scorpia"
        },
        {
          key: "spindel",
          name: "Spindel",
          tab: "wilderness",
          group: "Wilderness bosses",
          tile: [
            3182,
            3745,
            0
          ],
          icon: "venenatis_pet",
          description: "The Silk Chasm, Spindel's lair.",
          kc: "Spindel"
        },
        {
          key: "venenatis",
          name: "Venenatis",
          tab: "wilderness",
          group: "Wilderness bosses",
          tile: [
            3320,
            3796,
            0
          ],
          icon: "venenatis_pet",
          description: "Venenatis' nest.",
          kc: "Venenatis"
        },
        {
          key: "vetion",
          name: "Vet'ion",
          tab: "wilderness",
          group: "Wilderness bosses",
          tile: [
            3219,
            3788,
            0
          ],
          icon: "vetion_pet",
          description: "The Skeletal Tomb.",
          kc: "Vet'ion"
        },
        {
          key: "ancient-dareeyak",
          name: "Dareeyak",
          tab: "wilderness",
          group: "Wilderness spells",
          tile: [
            2966,
            3696,
            0
          ],
          type: "ANCIENT",
          icon: "staff_of_zaros",
          description: "Where the Ancient Magicks Dareeyak Teleport lands.",
          terms: "ancient spell ancients"
        },
        {
          key: "ancient-carrallanger",
          name: "Carrallanger",
          tab: "wilderness",
          group: "Wilderness spells",
          tile: [
            3156,
            3666,
            0
          ],
          type: "ANCIENT",
          icon: "staff_of_zaros",
          description: "Where the Ancient Magicks Carrallanger Teleport lands.",
          terms: "ancient spell ancients"
        },
        {
          key: "ancient-annakarl",
          name: "Annakarl",
          tab: "wilderness",
          group: "Wilderness spells",
          tile: [
            3288,
            3886,
            0
          ],
          type: "ANCIENT",
          icon: "staff_of_zaros",
          description: "Where the Ancient Magicks Annakarl Teleport lands.",
          terms: "ancient spell ancients"
        },
        {
          key: "ancient-ghorrock",
          name: "Ghorrock",
          tab: "wilderness",
          group: "Wilderness spells",
          tile: [
            2977,
            3873,
            0
          ],
          type: "ANCIENT",
          icon: "staff_of_zaros",
          description: "Where the Ancient Magicks Ghorrock Teleport lands.",
          terms: "ancient spell ancients"
        },
        {
          key: "arceuus-cemetery",
          name: "Cemetery",
          tab: "wilderness",
          group: "Wilderness spells",
          tile: [
            2978,
            3763,
            0
          ],
          type: "ARCEUUS",
          icon: "soulrune",
          description: "Where the Arceuus Cemetery Teleport lands.",
          terms: "arceuus spell"
        },
        {
          key: "mage-arena",
          name: "Mage Arena",
          tab: "wilderness",
          group: "Activities",
          tile: [
            3105,
            3956,
            0
          ],
          icon: "saradomin_cape",
          description: "Outside Kolodion's arena.",
          terms: "kolodion god capes"
        },
        {
          key: "wilderness-agility-course",
          name: "Wilderness Agility Course",
          tab: "wilderness",
          group: "Activities",
          tile: [
            2998,
            3916,
            0
          ],
          icon: "graceful_hood",
          description: "The course entrance gate.",
          terms: "agility"
        },
        {
          key: "ferox-enclave",
          name: "Ferox Enclave",
          tab: "wilderness",
          group: "Places",
          tile: [
            3151,
            3636,
            0
          ],
          icon: "ring_of_dueling_8",
          description: "The safe enclave, with a bank and a pool.",
          terms: "ferox safe bank"
        },
        {
          key: "revenant-caves-south",
          name: "Revenant Caves (south)",
          tab: "wilderness",
          group: "Places",
          tile: [
            3080,
            3655,
            0
          ],
          icon: "wild_cave_shard",
          description: "By the southern entrance to the Revenant Caves.",
          terms: "revenants revs"
        },
        {
          key: "revenant-caves-middle",
          name: "Revenant Caves (middle)",
          tab: "wilderness",
          group: "Places",
          tile: [
            3074,
            3739,
            0
          ],
          icon: "wild_cave_shard",
          description: "By the middle entrance to the Revenant Caves.",
          terms: "revenants revs"
        },
        {
          key: "revenant-caves-north",
          name: "Revenant Caves (north)",
          tab: "wilderness",
          group: "Places",
          tile: [
            3128,
            3832,
            0
          ],
          icon: "wild_cave_shard",
          description: "By the northern entrance to the Revenant Caves.",
          terms: "revenants revs"
        },
        {
          key: "chaos-altar",
          name: "Chaos altar",
          tab: "wilderness",
          group: "Altars",
          tile: [
            2948,
            3819,
            0
          ],
          icon: "dragon_bones",
          description: "The Chaos Temple altar, where bones offered may be saved.",
          terms: "prayer bones gilded"
        },
        {
          key: "cooking-guild",
          name: "Cooking Guild",
          tab: "skilling",
          group: "Guilds",
          tile: [
            3143,
            3439,
            0
          ],
          icon: "chefs_hat",
          description: "Outside the Cooking Guild.",
          terms: "guild"
        },
        {
          key: "crafting-guild",
          name: "Crafting Guild",
          tab: "skilling",
          group: "Guilds",
          tile: [
            2935,
            3295,
            0
          ],
          icon: "brown_apron",
          description: "Outside the Crafting Guild.",
          terms: "guild"
        },
        {
          key: "farming-guild",
          name: "Farming Guild",
          tab: "skilling",
          group: "Guilds",
          tile: [
            1248,
            3719,
            0
          ],
          icon: "dibber",
          description: "Outside the Farming Guild.",
          terms: "guild"
        },
        {
          key: "fishing-guild",
          name: "Fishing Guild",
          tab: "skilling",
          group: "Guilds",
          tile: [
            2613,
            3389,
            0
          ],
          icon: "lobster",
          description: "Outside the Fishing Guild.",
          terms: "guild"
        },
        {
          key: "hunter-guild",
          name: "Hunter Guild",
          tab: "skilling",
          group: "Guilds",
          tile: [
            1558,
            3046,
            0
          ],
          icon: "hunting_box_trap",
          description: "Outside the Hunter Guild.",
          terms: "guild"
        },
        {
          key: "mining-guild",
          name: "Mining Guild",
          tab: "skilling",
          group: "Guilds",
          tile: [
            3048,
            9763,
            0
          ],
          icon: "bronze_pickaxe",
          description: "Outside the Mining Guild.",
          terms: "guild"
        },
        {
          key: "ranging-guild",
          name: "Ranging Guild",
          tab: "skilling",
          group: "Guilds",
          tile: [
            2655,
            3443,
            0
          ],
          icon: "shortbow",
          description: "Outside the Ranging Guild.",
          terms: "guild"
        },
        {
          key: "woodcutting-guild",
          name: "Woodcutting Guild",
          tab: "skilling",
          group: "Guilds",
          tile: [
            1661,
            3505,
            0
          ],
          icon: "bronze_axe",
          description: "Outside the Woodcutting Guild.",
          terms: "guild"
        },
        {
          key: "ectofuntus",
          name: "Ectofuntus",
          tab: "skilling",
          group: "Skilling",
          tile: [
            3659,
            3522,
            0
          ],
          icon: "ectophial",
          description: "Beside the Ectofuntus in Port Phasmatys.",
          terms: "prayer bones ecto"
        },
        {
          key: "blast-furnace",
          name: "Blast Furnace",
          tab: "skilling",
          group: "Skilling",
          tile: [
            1939,
            4958,
            0
          ],
          icon: "steel_bar",
          description: "Keldagrim's Blast Furnace.",
          terms: "smithing"
        },
        {
          key: "giants-foundry",
          name: "Giants' Foundry",
          tab: "skilling",
          group: "Skilling",
          tile: [
            3361,
            3149,
            0
          ],
          icon: "smithing_uniform_torso",
          description: "Kovac's foundry. Needs Sleeping Giants.",
          terms: "smithing"
        },
        {
          key: "motherlode-mine",
          name: "Motherlode Mine",
          tab: "skilling",
          group: "Skilling",
          tile: [
            3728,
            5692,
            0
          ],
          icon: "paydirt",
          description: "The Motherlode Mine.",
          terms: "mining mlm"
        },
        {
          key: "ottos-grotto",
          name: "Otto's Grotto",
          tab: "skilling",
          group: "Skilling",
          tile: [
            2504,
            3484,
            0
          ],
          icon: "brut_fishing_rod",
          description: "Barbarian fishing by Otto's Grotto.",
          terms: "fishing barbarian"
        },
        {
          key: "tempoross",
          name: "Tempoross",
          tab: "skilling",
          group: "Skilling",
          tile: [
            3137,
            2840,
            0
          ],
          icon: "harpoon",
          description: "The Ruins of Unkah jetty.",
          kc: "Tempoross",
          terms: "fishing"
        },
        {
          key: "wintertodt",
          name: "Wintertodt",
          tab: "skilling",
          group: "Skilling",
          tile: [
            1630,
            3955,
            0
          ],
          icon: "wint_bruma_root",
          description: "The Wintertodt camp.",
          kc: "Wintertodt",
          terms: "firemaking"
        },
        {
          key: "black-chinchompas",
          name: "Black chinchompas",
          tab: "skilling",
          group: "Skilling",
          tile: [
            3141,
            3777,
            0
          ],
          icon: "chinchompa_black",
          description: "The black chinchompa hunting grounds.",
          terms: "hunter"
        },
        {
          key: "carnivorous-chinchompas",
          name: "Carnivorous chinchompas",
          tab: "skilling",
          group: "Skilling",
          tile: [
            2556,
            2916,
            0
          ],
          icon: "huntguide_chinchompa_big_captured",
          description: "Feldip Hills red chinchompa grounds.",
          terms: "hunter"
        },
        {
          key: "gnome-stronghold-agility",
          name: "Gnome Stronghold Agility",
          tab: "skilling",
          group: "Agility courses",
          tile: [
            2474,
            3436,
            0
          ],
          icon: "grace",
          description: "The start of the Gnome Stronghold Agility course.",
          terms: "agility"
        },
        {
          key: "barbarian-outpost-agility",
          name: "Barbarian Outpost Agility",
          tab: "skilling",
          group: "Agility courses",
          tile: [
            2551,
            3554,
            0
          ],
          icon: "grace",
          description: "The start of the Barbarian Outpost Agility course.",
          terms: "agility"
        },
        {
          key: "draynor-village-rooftop",
          name: "Draynor Village Rooftop",
          tab: "skilling",
          group: "Agility courses",
          tile: [
            3103,
            3279,
            0
          ],
          icon: "grace",
          description: "The start of the Draynor Village Rooftop course.",
          terms: "agility"
        },
        {
          key: "al-kharid-rooftop",
          name: "Al Kharid Rooftop",
          tab: "skilling",
          group: "Agility courses",
          tile: [
            3273,
            3196,
            0
          ],
          icon: "grace",
          description: "The start of the Al Kharid Rooftop course.",
          terms: "agility"
        },
        {
          key: "varrock-rooftop",
          name: "Varrock Rooftop",
          tab: "skilling",
          group: "Agility courses",
          tile: [
            3221,
            3414,
            0
          ],
          icon: "grace",
          description: "The start of the Varrock Rooftop course.",
          terms: "agility"
        },
        {
          key: "canifis-rooftop",
          name: "Canifis Rooftop",
          tab: "skilling",
          group: "Agility courses",
          tile: [
            3507,
            3488,
            0
          ],
          icon: "grace",
          description: "The start of the Canifis Rooftop course.",
          terms: "agility"
        },
        {
          key: "falador-rooftop",
          name: "Falador Rooftop",
          tab: "skilling",
          group: "Agility courses",
          tile: [
            3036,
            3341,
            0
          ],
          icon: "grace",
          description: "The start of the Falador Rooftop course.",
          terms: "agility"
        },
        {
          key: "seers-village-rooftop",
          name: "Seers' Village Rooftop",
          tab: "skilling",
          group: "Agility courses",
          tile: [
            2729,
            3488,
            0
          ],
          icon: "grace",
          description: "The start of the Seers' Village Rooftop course.",
          terms: "agility"
        },
        {
          key: "pollnivneach-rooftop",
          name: "Pollnivneach Rooftop",
          tab: "skilling",
          group: "Agility courses",
          tile: [
            3351,
            2961,
            0
          ],
          icon: "grace",
          description: "The start of the Pollnivneach Rooftop course.",
          terms: "agility"
        },
        {
          key: "rellekka-rooftop",
          name: "Rellekka Rooftop",
          tab: "skilling",
          group: "Agility courses",
          tile: [
            2625,
            3678,
            0
          ],
          icon: "grace",
          description: "The start of the Rellekka Rooftop course.",
          terms: "agility"
        },
        {
          key: "ardougne-rooftop",
          name: "Ardougne Rooftop",
          tab: "skilling",
          group: "Agility courses",
          tile: [
            2673,
            3298,
            0
          ],
          icon: "grace",
          description: "The start of the Ardougne Rooftop course.",
          terms: "agility"
        },
        {
          key: "agility-pyramid",
          name: "Agility Pyramid",
          tab: "skilling",
          group: "Agility courses",
          tile: [
            3364,
            2830,
            0
          ],
          icon: "grace",
          description: "The start of the Agility Pyramid course.",
          terms: "agility"
        },
        {
          key: "shayzien-agility-course",
          name: "Shayzien Agility Course",
          tab: "skilling",
          group: "Agility courses",
          tile: [
            1554,
            3630,
            0
          ],
          icon: "grace",
          description: "The start of the Shayzien Agility Course course.",
          terms: "agility"
        },
        {
          key: "colossal-wyrm-agility",
          name: "Colossal Wyrm Agility",
          tab: "skilling",
          group: "Agility courses",
          tile: [
            1652,
            2931,
            0
          ],
          icon: "grace",
          description: "The start of the Colossal Wyrm Agility course.",
          terms: "agility"
        }
      ]
    };
  }
});

// server/plugins/combat/data/teleport-tablets.json
var require_teleport_tablets = __commonJS({
  "server/plugins/combat/data/teleport-tablets.json"(exports2, module2) {
    module2.exports = {
      redirects: {
        "rimmington teleport": [2953, 3224, 0],
        "taverley teleport": [2893, 3466, 0],
        "pollnivneach teleport": [3340, 3004, 0],
        "hosidius teleport": [1743, 3517, 0],
        "rellekka teleport": [2670, 3632, 0],
        "aldarin teleport": [1422, 2965, 0],
        "brimhaven teleport": [2757, 3179, 0],
        "yanille teleport": [2544, 3096, 0],
        "prifddinas teleport": [3239, 6076, 0]
      },
      tablets: {
        "wilderness crabs teleport": [3352, 3782, 0],
        "volcanic mine teleport": [3811, 3813, 0]
      },
      scrolls: {
        "nardah teleport": [3419, 2917, 0],
        "digsite teleport": [3324, 3412, 0],
        "feldip hills teleport": [2542, 2925, 0],
        "lunar isle teleport": [2094, 3913, 0],
        "mort'ton teleport": [3489, 3288, 0],
        "pest control teleport": [2657, 2658, 0],
        "piscatoris teleport": [2339, 3648, 0],
        "tai bwo wannai teleport": [2788, 3066, 0],
        "iorwerth camp teleport": [2194, 3259, 0],
        "mos le'harmless teleport": [3702, 2995, 0],
        "lumberyard teleport": [3303, 3487, 0],
        "zul-andra teleport": [2197, 3056, 0],
        "key master teleport": [1310, 1250, 0],
        "watson teleport": [1644, 3580, 0],
        "spider cave teleport": [3658, 3404, 0],
        "colossal wyrm teleport scroll": [1641, 2921, 0],
        "chasm teleport scroll": [1439, 10076, 0],
        "ardeaglais teleport": [2543, 2216, 0]
      },
      alternates: {
        "varrock teleport": {
          primary: "Varrock",
          alternate: "Grand Exchange",
          varbit: "varrock_ge_teleport",
          tile: [3163, 3478, 0],
          diary: { key: "varrock", tier: "medium", name: "Varrock" },
          configure: {
            primary: {
              change: "Change to Varrock.",
              message: "Your default option is now the central Varrock teleport."
            },
            alternate: {
              change: "Change to the Grand Exchange.",
              message: "Your default option is now the Grand Exchange teleport."
            }
          }
        },
        "camelot teleport": {
          primary: "Camelot",
          alternate: "Seers' Village",
          varbit: "seers_camelot_teleport",
          tile: [2726, 3484, 0],
          diary: { key: "kandarin", tier: "hard", name: "Kandarin" },
          configure: {
            primary: {
              change: "Change to Camelot.",
              message: "Your default option is now the Camelot teleport."
            },
            alternate: {
              change: "Change to Seers' Village.",
              message: "Your default option is now the Seers' Village teleport."
            }
          }
        },
        "watchtower teleport": {
          primary: "Watchtower",
          alternate: "Yanille",
          varbit: "yanille_teleport_location",
          tile: [2584, 3098, 0],
          diary: { key: "ardougne", tier: "hard", name: "Ardougne" },
          configure: {
            primary: {
              change: "Change to the Watchtower",
              message: "Your default option is now the Watchtower teleport."
            },
            alternate: {
              change: "Change to Yanille.",
              message: "Your default option is now the Yanille teleport."
            }
          }
        }
      }
    };
  }
});

// server/plugins/items/data/diary-rewards.json
var require_diary_rewards = __commonJS({
  "server/plugins/items/data/diary-rewards.json"(exports2, module2) {
    module2.exports = {
      casts: {
        standard: { seq: "human_castteleport", spotanim: "teleport_casting" },
        clap: { seq: "human_castteleport", spotanim: "teleport_casting", clap: true },
        monastery: { seq: "teleport_nardah_human", spotanim: "teleport_monastery" },
        farm: { seq: "teleport_nardah_human", spotanim: "teleport_farm" },
        nardah: { seq: "teleport_nardah_human", spotanim: "teleport_nardah" },
        slime: { seq: "teleport_slime_human", spotanim: "teleport_slimepit" },
        rune: { seq: "teleport_rune_human", spotanim: "teleport_rune" },
        cabbage: { seq: "teleport_cabbage_human", spotanim: "teleport_cabbage" }
      },
      destinations: {
        "kandarin-monastery": { tile: [2607, 3221, 0], radius: 2, cast: "monastery" },
        "ardougne-farm": { tile: [2665, 3375, 0], radius: 2, cast: "farm" },
        "gem-mine": { tile: [2840, 9387, 0], radius: 2, cast: "clap" },
        "slayer-master": { tile: [2869, 2982, 1], radius: 1, cast: "clap" },
        "fountain-of-rune": { tile: [3375, 3892, 0], radius: 0, cast: "rune" },
        ectofuntus: { tile: [3683, 9888, 0], radius: 1, cast: "slime" },
        "burgh-de-rott": { tile: [3482, 3230, 0], radius: 2, cast: "slime" },
        rellekka: { tile: [2645, 3672, 0], radius: 2, cast: "standard" },
        nardah: { tile: [3420, 2918, 0], radius: 3, cast: "nardah" },
        "nardah-shrine": { tile: [3426, 2928, 0], radius: 2, cast: "nardah" },
        "kalphite-cave": { tile: [3322, 3122, 0], radius: 0, cast: "nardah" },
        sherlock: { tile: [2733, 3415, 0], radius: 2, cast: "standard" },
        piscatoris: { tile: [2332, 3681, 0], radius: 3, cast: "standard" },
        "cabbage-patch": { tile: [3052, 3291, 0], radius: 4, cast: "cabbage" },
        "kourend-woodland": { tile: [1555, 3456, 0], radius: 2, cast: "standard" },
        "mount-karuulm": { tile: [1311, 3796, 0], radius: 1, cast: "standard" }
      },
      limits: {
        "ardougne-farm": { label: "Ardougne Farm", varbit: null },
        "fountain-of-rune": { label: "Fountain of Rune", varbit: "wilderness_sword_last_teleport" },
        ectofuntus: { label: "Ectofuntus", varbit: "morytania_legs_last_teleport" },
        rellekka: { label: "Rellekka", varbit: "fremennik_basic_teleport" },
        nardah: { label: "Nardah", varbit: "desert_nardah_teleport" },
        sherlock: { label: "Sherlock", varbit: "seers_sherlock_teleport" },
        piscatoris: { label: "Piscatoris", varbit: "western_pisc_teleport" },
        "cabbage-patch": { label: "cabbage patch", varbit: "lumbridge_cabbage_teleport" },
        "kourend-woodland": { label: "Kourend Woodland", varbit: "zeah_blessing_woodland_teleport" },
        "mount-karuulm": { label: "Mount Karuulm", varbit: "zeah_blessing_brimstone_teleport" }
      },
      families: [
        {
          name: "Ardougne cloak",
          objs: ["ardy_cape_easy", "ardy_cape_medium", "ardy_cape_hard", "ardy_cape_elite"],
          teleports: [
            { options: ["Monastery Teleport", "Kandarin Monastery"], to: "kandarin-monastery" },
            { options: ["Farm Teleport", "Ardougne Farm"], to: "ardougne-farm", limit: "ardougne-farm", perDay: [0, 3, 5, null] }
          ]
        },
        {
          name: "Karamja gloves",
          objs: ["atjun_gloves_easy", "atjun_gloves_med", "atjun_gloves_hard", "atjun_gloves_elite"],
          teleports: [
            { options: ["Gem Mine"], to: "gem-mine" },
            { options: ["Slayer Master"], to: "slayer-master" }
          ]
        },
        {
          name: "Wilderness sword",
          objs: ["wilderness_sword_easy", "wilderness_sword_medium", "wilderness_sword_hard", "wilderness_sword_elite"],
          teleports: [
            { options: ["Teleport"], to: "fountain-of-rune", limit: "fountain-of-rune", perDay: [0, 0, 1, null] }
          ]
        },
        {
          name: "Morytania legs",
          objs: ["morytania_legs_easy", "morytania_legs_medium", "morytania_legs_hard", "morytania_legs_elite"],
          teleports: [
            { options: ["Ecto Teleport", "Ectofuntus Pit"], to: "ectofuntus", limit: "ectofuntus", perDay: [2, 5, 5, null] },
            { options: ["Burgh Teleport", "Burgh de Rott"], to: "burgh-de-rott" }
          ]
        },
        {
          name: "Fremennik sea boots",
          objs: ["fremennik_boots_easy", "fremennik_boots_medium", "fremennik_boots_hard", "fremennik_boots_elite"],
          teleports: [
            { options: ["Teleport"], to: "rellekka", limit: "rellekka", perDay: [1, 3, 5, null] }
          ]
        },
        {
          name: "Desert amulet",
          objs: ["desert_amulet_easy", "desert_amulet_medium", "desert_amulet_hard", "desert_amulet_elite"],
          locked: "Your amulet can't teleport you until you have completed the medium Desert Diary.",
          teleports: [
            { options: ["Teleport", "Nardah"], to: ["nardah", "nardah", "nardah", "nardah-shrine"], limit: "nardah", perDay: [0, 1, 1, null] },
            { options: ["Kalphite cave"], to: "kalphite-cave" }
          ]
        },
        {
          name: "Kandarin headgear",
          objs: ["seers_headband_easy", "seers_headband_medium", "seers_headband_hard", "seers_headband_elite"],
          teleports: [
            { options: ["Teleport"], to: "sherlock", limit: "sherlock", perDay: [0, 0, 1, null] }
          ]
        },
        {
          name: "Western banner",
          objs: ["western_banner_easy", "western_banner_medium", "western_banner_hard", "western_banner_elite"],
          locked: "Your banner can't teleport you until you have completed the hard Western Provinces Diary.",
          teleports: [
            { options: ["Teleport"], to: "piscatoris", limit: "piscatoris", perDay: [0, 0, 1, null] }
          ]
        },
        {
          name: "Explorer's ring",
          objs: ["lumbridge_ring_easy", "lumbridge_ring_medium", "lumbridge_ring_hard", "lumbridge_ring_elite"],
          teleports: [
            { options: ["Teleport"], to: "cabbage-patch", limit: "cabbage-patch", perDay: [0, 3, null, null] }
          ]
        },
        {
          name: "Rada's blessing",
          objs: ["zeah_blessing_easy", "zeah_blessing_medium", "zeah_blessing_hard", "zeah_blessing_elite"],
          teleports: [
            { options: ["Kourend Woodland"], to: "kourend-woodland", limit: "kourend-woodland", perDay: [3, 5, null, null] },
            { options: ["Mount Karuulm"], to: "mount-karuulm", limit: "mount-karuulm", perDay: [0, 0, 3, null] }
          ]
        }
      ],
      faladorShield: {
        objs: ["falador_shield_easy", "falador_shield_medium", "falador_shield_hard", "falador_shield_elite"],
        restorePercent: [25, 50, 100, 100],
        perDay: [1, 1, 1, 2],
        varbit: "falador_shield_recharge",
        spotanim: "elysian_shield_defend_spotanim"
      },
      zaffBattlestaves: {
        loc: "fai_varrock_battlestaff_barrel_multi",
        item: "cert_battlestaff",
        price: 7e3,
        perDay: [15, 30, 60, 120],
        varbit: "zaff_last_claimed",
        seq: "human_pickuptable"
      },
      explorersRing: {
        objs: ["lumbridge_ring_easy", "lumbridge_ring_medium", "lumbridge_ring_hard", "lumbridge_ring_elite"],
        energyPercent: [50, 50, 50, 100],
        energyPerDay: [2, 3, 4, 3],
        energyVarbit: "lumbridge_energy_restore",
        alchemyPerDay: 30,
        alchemyVarbit: "lumbridge_free_alchs"
      },
      flaxKeeper: {
        npc: "Flax keeper",
        diary: "kandarin",
        perDay: [30, 60, 120, 250]
      },
      robin: {
        npc: "Robin",
        diary: "morytania",
        perDay: [
          0,
          13,
          26,
          39
        ],
        varbit: 4543
      },
      thirus: {
        npc: "Thirus",
        npcGameval: "lovakengj_thirus_post_diary",
        diary: "kourend",
        item: "cert_lovakengj_dynamite_fused",
        perDay: [0, 20, 40, 80],
        varbit: "kourend_free_dynamite"
      },
      cromperty: {
        npc: "Wizard Cromperty",
        npcGamevals: ["cromperty_pre_diary", "cromperty_post_diary"],
        diary: "ardougne",
        item: "cert_blankrune_high",
        perDay: [0, 100, 150, 250],
        varbit: "ardougne_free_essence"
      },
      rantz: { npc: "Rantz", diary: "western", item: "ogre_arrow", perDay: [25, 50, 100, 150], varbit: "western_rantz_arrows" },
      lundail: {
        npc: "Lundail",
        diary: "wilderness",
        perDay: [40, 80, 120, 200],
        runes: ["MIND_RUNE", "BODY_RUNE", "NATURE_RUNE", "CHAOS_RUNE", "LAW_RUNE", "COSMIC_RUNE", "DEATH_RUNE"]
      }
    };
  }
});

// server/plugins/items/data/pharaohs-sceptre.json
var require_pharaohs_sceptre = __commonJS({
  "server/plugins/items/data/pharaohs-sceptre.json"(exports2, module2) {
    module2.exports = {
      _source: "OSRS Wiki: Pharaoh's_sceptre (teleports, charges, recharging, diary capacities) and Transcript:Guardian_mummy (the recharge talk, in npc-dialogues.json). Ids are cache gamevals; the artefacts and their materials come from plugins/minigames/pyramidplunder/data/pyramid-plunder.json.",
      names: {
        objs: {
          uncharged: "pharaohs_sceptre",
          charged: "pharaohs_sceptre_charged",
          initial: "pharaohs_sceptre_charged_initial"
        },
        varbits: {
          mummyMet: "pharaohs_sceptre_mummy_met",
          lastTeleport: "pharaohs_sceptre_last_teleport",
          necropolis: "pharaohs_sceptre_necropolis"
        },
        locs: { obelisk: "necropolis_obelisk" },
        seqs: { teleport: "ntk_human_tele" },
        spotanims: { teleport: "ntk_tele" },
        npcs: { mummy: "ntk_mummy_guardian" }
      },
      _capacity: "Charges held: 3 by default, more with each Desert Diary tier (Wiki).",
      capacity: { default: 3, easy: 10, medium: 25, hard: 50, elite: 100 },
      _cost: "Artefacts of one material for a full recharge, noted ones too (Wiki).",
      cost: { gold: 6, stone: 12, pottery: 24 },
      wildernessLevel: 30,
      _destinations: "In the order of the sceptre's options. Jalsavrah, Jaldraocht and Jaltevas land on a tile from rsprox recordings 3015-3199 (live varies it by a tile or two: Jalsavrah 1935,4429 / 1937,4426; Jaldraocht 3232,2895-2897 / 3233,2895); Jaleustrophos, with no recording, is the Wiki's map pin. Jalsavrah is the default for Last-Teleport before any teleport (Wiki).",
      _teleport: "Recorded (rsprox 3015, 3017, 3170, 3199): ntk_human_tele and spotanim ntk_tele at once, no sound and no message; the move 3 ticks later with the end animation then and a tick after, and pharaohs_sceptre_last_teleport set to the destination's number.",
      teleportTicks: 3,
      destinations: [
        { key: "jalsavrah", name: "Jalsavrah", tile: [1935, 4429, 3] },
        { key: "jaleustrophos", name: "Jaleustrophos", tile: [3341, 2827, 0] },
        { key: "jaldraocht", name: "Jaldraocht", tile: [3232, 2896, 0] },
        { key: "jaltevas", name: "Jaltevas", tile: [3314, 2720, 0], needsNecropolis: true }
      ],
      messages: {
        prompt: "Where would you like to teleport to?",
        charges: "Your sceptre has {charges} charge{s} left.",
        empty: "Your sceptre has run out of charges.",
        noCharges: "Your sceptre has no charges left. The guardian mummy in Jalsavrah can recharge it.",
        check: "Your sceptre has {charges} charge{s} left.",
        checkEmpty: "Your sceptre has no charges left.",
        uncharged: "You remove the charges from your sceptre.",
        unchargeConfirm: "Uncharge the sceptre? Its {charges} charge{s} will be lost.",
        needNecropolis: "You must commune with the obelisk in the Necropolis before you can teleport there.",
        communed: "The obelisk attunes itself to your sceptre.",
        _recorded: "check: rsprox 3015 (Check). A teleport sends no message.",
        _unverified: "the rest has no recording behind it; the Wiki gives none for the sceptre itself"
      }
    };
  }
});

// server/plugins/items/data/teleport-spheres.json
var require_teleport_spheres = __commonJS({
  "server/plugins/items/data/teleport-spheres.json"(exports2, module2) {
    module2.exports = {
      _source: "rsprox captures: the tile each Break landed on (recording, tick of the click). Wiki: each sphere goes to a random location in its area; these are the captured ones.",
      spheres: {
        "Dorgesh-kaan sphere": [
          { tile: [2729, 5313, 0], recording: "3189 t1285" },
          { tile: [2700, 5353, 1], recording: "3191 t3018" },
          { tile: [2701, 5318, 1], recording: "3196 t3281" }
        ],
        "Goblin village sphere": [
          { tile: [2954, 3477, 0], recording: "3191 t2965" },
          { tile: [2957, 3511, 0], recording: "3931 t4171" }
        ],
        "Plain of Mud sphere": [
          { tile: [2606, 9837, 0], recording: "3191 t2715" }
        ]
      }
    };
  }
});

// server/plugins/world/data/spirit-trees.json
var require_spirit_trees = __commonJS({
  "server/plugins/world/data/spirit-trees.json"(exports2, module2) {
    module2.exports = {
      $comment: "The spirit tree network, played by plugins/world/SpiritTrees.plugin.js (docs/spirit-trees.md). `trees` are in the menu's order, as live OSRS lists them (rsprox capture database, https://rsprox.net/database, rev 237-238). `tree` is where the tree stands (Wiki); `landing` where travelling there puts the player (captured where recorded, else beside the tree). Permanent trees may need a quest (`requires`, enforced only for quests this server has; `requiresStage` accepts that quest stage before completion, as Poison Waste opens once the crystal chime heals Incomitatus, stage 38) or a skill (`skills`); `grown` trees are farming patches, usable once grown and checked; `house` is a player-owned house's tree; `mooredAt` requires a prior moor at that Sailing dock id. Requirements from https://oldschool.runescape.wiki/w/Spirit_tree.",
      trees: [
        { name: "Tree Gnome Village", tree: [2539, 3166, 0], landing: [2542, 3170, 0] },
        { name: "Gnome Stronghold", tree: [2460, 3446, 0], landing: [2461, 3444, 0], leaveRequires: "The Grand Tree" },
        { name: "Battlefield of Khazard", tree: [2555, 3260, 0], landing: [2555, 3259, 0] },
        { name: "Grand Exchange", tree: [3184, 3509, 0], landing: [3185, 3508, 0] },
        { name: "Feldip Hills", tree: [2486, 2850, 0], landing: [2488, 2850, 0] },
        { name: "Prifddinas", tree: [3274, 6124, 0], landing: [3274, 6123, 0], requires: "Song of the Elves" },
        { name: "Port Sarim", grown: [3060, 3258, 0], landing: [3058, 3257, 0] },
        { name: "Etceteria", grown: [2613, 3858, 0] },
        { name: "Brimhaven", grown: [2802, 3203, 0] },
        { name: "Hosidius", grown: [1693, 3542, 0] },
        { name: "Farming Guild", grown: [1253, 3750, 0], skills: { Farming: 85 } },
        { name: "Your house", house: true },
        { name: "Poison Waste", tree: [2339, 3111, 0], landing: [2339, 3109, 0], requires: "The Path of Glouphrie", requiresStage: 38 },
        { name: "Laguna Aurorae", tree: [1202, 2786, 0], landing: [1203, 2785, 0], requires: "Pandemonium", skills: { Sailing: 58 }, mooredAt: "laguna_aurorae" }
      ]
    };
  }
});

// server/plugins/tools/adminpanel/Teleports.AdminPanel.js
var require_Teleports_AdminPanel = __commonJS({
  "server/plugins/tools/adminpanel/Teleports.AdminPanel.js"(exports2, module2) {
    var MINIGAMES = require_minigame_teleports().minigames;
    var SERVER_TELEPORTS = require_teleports().destinations;
    var TABLETS = require_teleport_tablets();
    var DIARIES = require_diary_rewards();
    var SCEPTRE = require_pharaohs_sceptre();
    var SPHERES = require_teleport_spheres().spheres;
    var TREES = require_spirit_trees().trees;
    var title = (name) => String(name).replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    var tileOf = (location) => Array.isArray(location) ? location : location?.getX ? [location.getX(), location.getY(), location.getZ()] : [location?.x, location?.y, location?.z ?? 0];
    var validTile = (tile) => Array.isArray(tile) && tile.length === 3 && tile.every(Number.isInteger) && tile[0] >= 0 && tile[0] <= 16383 && tile[1] >= 0 && tile[1] <= 16383 && tile[2] >= 0 && tile[2] <= 3;
    function destinations(api, player) {
      const { core } = api;
      const groups = /* @__PURE__ */ new Map();
      function add(path, name, location, key = name, resolve) {
        const tile = tileOf(location);
        if (!validTile(tile)) return;
        const group = path.join("/");
        if (!groups.has(group)) groups.set(group, { path, places: [] });
        const places = groups.get(group).places;
        const qualifiedKey = `${group}:${key}`;
        if (places.some((place) => place.key === qualifiedKey)) return;
        places.push({ key: qualifiedKey, name, x: tile[0], y: tile[1], z: tile[2], resolve });
      }
      add(["World"], "World spawn", core.GameConstants.DEFAULT_LOCATION);
      for (const [unit, book] of [["SpellTeleports", null], ["LunarSpells", "Lunar spellbook"], ["ArceuusSpells", "Arceuus spellbook"]]) {
        for (const spell of core[unit]?.getTeleportDestinations?.(unit === "LunarSpells") ?? []) {
          if (spell.name === "teleport to house") continue;
          const source = book ?? (spell.spellbook === core.MagicSpellbook?.ANCIENT ? "Ancient spellbook" : "Standard spellbook");
          add(["Spellbooks", source], spell.name, spell.destination);
        }
      }
      for (const [name, alternate] of Object.entries(TABLETS.alternates)) {
        add(["Spellbooks", "Standard spellbook"], `${name}: ${alternate.alternate}`, alternate.tile);
      }
      for (const [name, game] of Object.entries(MINIGAMES)) {
        if (game.choices) for (const choice of game.choices) add(["Minigame teleports", name], choice.option, choice);
        else add(["Minigame teleports"], name, game);
      }
      for (const [kind, label] of [["redirects", "House tablets"], ["tablets", "Other tablets"], ["scrolls", "Teleport scrolls"]]) {
        for (const [name, tile] of Object.entries(TABLETS[kind])) add(["Items", label], title(name), tile);
      }
      for (const family of DIARIES.families) for (const teleport of family.teleports) {
        for (const key of new Set([].concat(teleport.to))) {
          add(["Diary rewards", family.name], title(key), DIARIES.destinations[key]?.tile, key);
        }
      }
      for (const place of SCEPTRE.destinations) add(["Items", "Pharaoh's sceptre"], place.name, place.tile);
      for (const [name, landings] of Object.entries(SPHERES)) landings.forEach(({ tile }, index) => add(["Items", name], `Landing ${index + 1}`, tile, String(index)));
      for (const tree of TREES) if (tree.landing) add(["Spirit trees"], tree.name, tree.landing);
      for (const [event, path] of [["fairy-rings:destinations", ["Fairy rings"]]]) {
        const request = { player, list: [] };
        api.emitCustomEvent(event, request);
        for (const place of request.list) add(path, place.code ? `${place.code}: ${place.name}` : place.name, place.location);
      }
      for (const place of SERVER_TELEPORTS) if (place.tile) {
        add(["Server destinations", place.group ?? "Places"], place.name, place.tile, place.key);
      }
      const extra = { player, list: [] };
      api.emitCustomEvent("adminpanel:teleport-destinations", extra);
      for (const place of extra.list) if (typeof place?.name === "string" && place.name.length > 0 && place.name.length <= 120 && Array.isArray(place.path) && place.path.length > 0 && place.path.every((label) => typeof label === "string" && label.length > 0 && label.length <= 80)) {
        add(
          place.path.slice(0, 6),
          place.name,
          place.location ?? place.tile,
          place.key ?? place.name,
          typeof place.resolve === "function" ? (target) => {
            try {
              return tileOf(place.resolve(target));
            } catch {
              return [];
            }
          } : void 0
        );
      }
      return [...groups.values()];
    }
    module2.exports = { destinations, tileOf, validTile };
  }
});

// server/plugins/tools/Containers.PlayerTools.js
var require_Containers_PlayerTools = __commonJS({
  "server/plugins/tools/Containers.PlayerTools.js"(exports2, module2) {
    var fail = (message) => {
      const error = new Error(message);
      error.status = 409;
      throw error;
    };
    var signature = (item) => JSON.stringify([item?.getId(), item?.getAmount(), item?.getMeta?.() ?? null]);
    var fingerprint = (container2) => container2.getItems().map(signature).join("|");
    var sameMeta = (a, b) => JSON.stringify(a.getMeta?.() ?? null) === JSON.stringify(b.getMeta?.() ?? null);
    var EQUIPMENT_NAMES = {
      HEAD_SLOT: "Head",
      CAPE_SLOT: "Cape",
      AMULET_SLOT: "Neck",
      WEAPON_SLOT: "Weapon",
      BODY_SLOT: "Body",
      SHIELD_SLOT: "Shield",
      LEG_SLOT: "Legs",
      HANDS_SLOT: "Hands",
      FEET_SLOT: "Feet",
      RING_SLOT: "Ring",
      AMMUNITION_SLOT: "Ammo"
    };
    var equipmentNames = (core) => new Map(Object.entries(EQUIPMENT_NAMES).map(([key, name]) => [core.Equipment[key], name]));
    function container(core, player, name, tab = 0) {
      if (name === "inventory") return player.getInventory();
      if (name === "equipment") return player.getEquipment();
      if (name !== "bank" || !Number.isInteger(tab) || tab < 0 || tab >= core.Bank.BANK_SEARCH_TAB_INDEX) fail("Choose a bank tab.");
      return player.getBank(tab);
    }
    function entries(core, player, name) {
      const tabs = name === "bank" ? Array.from({ length: core.Bank.BANK_SEARCH_TAB_INDEX }, (_, tab) => tab) : [0];
      const slots = equipmentNames(core);
      return tabs.flatMap((tab) => container(core, player, name, tab).getItems().flatMap((item, slot) => item && item.getId() >= 0 && item.getAmount() > 0 ? [{
        container: name,
        bankTab: tab,
        slot,
        itemId: item.getId(),
        quantity: item.getAmount(),
        signature: signature(item),
        name: core.ItemDefinition.forId(item.getId()).getName(),
        location: name === "equipment" ? slots.get(slot) ?? "Worn slot" : name === "bank" ? `Bank tab ${tab + 1}` : `Slot ${slot + 1}`
      }] : []));
    }
    function scope(core, player, name) {
      return name === "bank" ? Array.from({ length: core.Bank.BANK_SEARCH_TAB_INDEX }, (_, tab) => player.getBank(tab)) : [container(core, player, name)];
    }
    var scopeFingerprint = (held) => held.map(fingerprint).join("\n");
    function refresh(core, player, held, name) {
      held.refreshItems();
      if (name === "equipment") {
        core.BonusManager.update(player);
        core.WeaponInterfaceManager.assign(player);
        player.getUpdateFlag().flag(core.Flag.APPEARANCE);
      }
    }
    function checkedSlot(core, held, name, slot) {
      const limit = name === "bank" ? core.Bank.MAX_SLOTS : held.capacity();
      if (!Number.isInteger(slot) || slot < 0 || slot >= limit || name === "equipment" && !equipmentNames(core).has(slot)) fail("Choose a valid item slot.");
      return held.getItems()[slot];
    }
    function raisesQuantity(core, player, body) {
      const held = container(core, player, body.container, body.bankTab ?? 0);
      const item = checkedSlot(core, held, body.container, body.slot);
      return body.quantity > (item?.getAmount() ?? 0);
    }
    function putSlot(core, held, name, slot, item) {
      if (name === "bank") while (held.getItems().length <= slot) held.getItems().push(new core.Item(-1, 0));
      held.setItem(slot, item);
    }
    function addDestination(core, containers, item, bank) {
      const id = item.getId();
      const matching = containers.find((held) => held.getItems().some((entry) => entry.getAmount() > 0 && entry.getId() === id && sameMeta(entry, item)));
      if (matching || !bank) return matching;
      return containers.find((held) => held.getItems().some((entry) => entry.getAmount() === 0 && core.Bank.sharesPlaceholder(entry.getId(), id)));
    }
    function equipAllowed(core, player, slot, item) {
      if (!item || item.getId() < 0) return;
      const definition = item.getDefinition();
      if (definition.getEquipmentType().getSlot() !== slot) fail("That item belongs in a different equipment slot.");
      const unmet = core.EquipmentRequirements.getUnmet(player, definition);
      if (unmet) fail(core.EquipmentRequirements.message(unmet));
      if (!definition.isStackable() && item.getAmount() !== 1) fail("Equip one of this item at a time.");
      if (core.PluginManager.emitCanEquip(player, slot, item) === false) fail("This equipment cannot be equipped now.");
    }
    function apply(core, player, body) {
      const held = container(core, player, body.container, body.bankTab ?? 0);
      const affected = scope(core, player, body.container);
      const before = affected.map((held2) => held2.getCopiedItems());
      let message;
      let changed = held;
      if (body.mode === "undo") {
        const undo = body.undo;
        if (!undo || undo.container !== body.container || body.container !== "bank" && undo.held !== held || scopeFingerprint(affected) !== undo.after) fail("Items changed since this edit. Undo is no longer available.");
        if (body.container === "equipment") {
          for (let slot = 0; slot < before[0].length; slot++) {
            const item = before[0][slot], restored = undo.before[0][slot];
            if (signature(item) === signature(restored)) continue;
            if (item.getId() >= 0 && core.PluginManager.emitCanUnequip(player, slot, item) === false) fail("This equipment cannot be removed now.");
            if (restored.getId() >= 0 && (core.EquipmentRequirements.getUnmet(player, restored.getDefinition()) || core.PluginManager.emitCanEquip(player, slot, restored) === false)) fail("This equipment cannot be restored now.");
          }
        }
        affected.forEach((target, index) => target.setItems(undo.before[index].map((item) => item.clone())));
        message = `Undid the item edit for ${player.getUsername()}.`;
      } else if (body.mode === "set" || body.mode === "increase") {
        const item = checkedSlot(core, held, body.container, body.slot);
        if (!item || item.getId() < 0 || signature(item) !== body.signature) fail("That slot changed. Select the current item again.");
        const adding = body.mode === "increase";
        if (!Number.isInteger(body.quantity) || body.quantity < (adding ? 1 : 0) || body.quantity > 2147483647) fail(adding ? "Enter a positive whole quantity up to 2147483647." : "Enter a whole quantity from 0 to 2147483647.");
        const quantity = adding ? item.getAmount() + body.quantity : body.quantity;
        if (quantity > 2147483647) fail("The item stack is full.");
        if (body.container !== "bank" && !item.getDefinition().isStackable() && quantity > 1) fail("This item uses one per slot. Add another through an empty slot.");
        if (body.container === "equipment") {
          if (core.PluginManager.emitCanUnequip(player, body.slot, item) === false) fail("This equipment cannot be changed now.");
          if (quantity) equipAllowed(core, player, body.slot, item.clone().setAmount(quantity));
        }
        if (!quantity) held.deleteAtSlot(body.slot, item.getAmount(), false);
        else held.setItem(body.slot, item.clone().setAmount(quantity));
        message = adding ? `Added ${body.quantity} x ${item.getDefinition().getName()} to ${player.getUsername()}'s ${body.container}.` : `Set ${item.getDefinition().getName()} to ${quantity} in ${player.getUsername()}'s ${body.container}.`;
      } else if (body.mode === "move") {
        const item = checkedSlot(core, held, body.container, body.slot);
        const destination = container(core, player, body.container, body.destinationBankTab ?? body.bankTab ?? 0);
        const other = checkedSlot(core, destination, body.container, body.destinationSlot);
        if (!item || item.getId() < 0 || signature(item) !== body.signature || signature(other) !== body.destinationSignature) fail("An item moved during the drag. Try again.");
        if (held === destination && body.slot === body.destinationSlot) fail("Drop on another slot.");
        if (body.container === "equipment") {
          if (core.PluginManager.emitCanUnequip(player, body.slot, item) === false || other?.getId() >= 0 && core.PluginManager.emitCanUnequip(player, body.destinationSlot, other) === false) fail("This equipment cannot be moved now.");
          equipAllowed(core, player, body.destinationSlot, item);
          equipAllowed(core, player, body.slot, other);
        }
        const merge = body.container === "bank" && other?.getId() === item.getId() && sameMeta(other, item);
        if (merge && item.getAmount() + other.getAmount() > 2147483647) fail("The destination stack is full.");
        putSlot(core, destination, body.container, body.destinationSlot, merge ? other.clone().setAmount(item.getAmount() + other.getAmount()) : item.clone());
        putSlot(core, held, body.container, body.slot, merge || !other ? new core.Item(-1, 0) : other.clone());
        message = `Moved ${item.getDefinition().getName()} in ${player.getUsername()}'s ${body.container}.`;
      } else if (body.mode === "remove") {
        if (!Number.isInteger(body.slot) || body.slot < 0 || body.slot >= held.capacity()) fail("Select an occupied slot.");
        const item = held.getItems()[body.slot];
        if (!item || signature(item) !== body.signature) fail("That slot changed. Select the current item again.");
        if (!Number.isInteger(body.quantity) || body.quantity < 1 || body.quantity > item.getAmount()) fail("Enter an amount within the selected stack.");
        if (body.container === "equipment" && core.PluginManager.emitCanUnequip(player, body.slot, item) === false) fail("This equipment cannot be removed now.");
        held.deleteAtSlot(body.slot, body.quantity, false);
        message = `Removed ${body.quantity} x ${item.getDefinition().getName()} from ${player.getUsername()}'s ${body.container}.`;
      } else if (body.mode === "add") {
        if (!Number.isInteger(body.itemId) || !core.CacheDefinitions.hasItem(body.itemId) || core.CacheDefinitions.getItem(body.itemId).placeholderTemplate >= 0) fail("Choose a loaded, usable item.");
        if (!Number.isInteger(body.quantity) || body.quantity < 1 || body.quantity > 2147483647) fail("Enter a positive whole quantity up to 2147483647.");
        const item = new core.Item(body.itemId, body.quantity);
        const bank = body.container === "bank";
        if (bank) item.setId(item.getDefinition().unNote());
        const definition = item.getDefinition();
        if (body.slot !== void 0) {
          const selected = checkedSlot(core, held, body.container, body.slot);
          if (signature(selected) !== body.signature) fail("That slot changed. Choose the slot again.");
          if (selected?.getId() >= 0 && body.container !== "equipment") fail("Choose an empty slot, or edit the selected stack.");
          if (body.container === "equipment" && definition.getEquipmentType().getSlot() !== body.slot) fail("That item belongs in a different equipment slot.");
        }
        let given = body.quantity;
        if (body.container === "equipment") {
          const slot = definition.getEquipmentType().getSlot();
          if (!equipmentNames(core).has(slot)) fail("This item cannot be equipped.");
          const unmet = core.EquipmentRequirements.getUnmet(player, definition);
          if (unmet) fail(core.EquipmentRequirements.message(unmet));
          if (core.PluginManager.emitCanEquip(player, slot, item) === false) fail("This item cannot be equipped now.");
          if (!definition.isStackable() && body.quantity !== 1) fail("Equip one of this item at a time.");
          const existing = held.getItems()[slot];
          if (existing.getId() >= 0 && (existing.getId() !== body.itemId || !definition.isStackable() || existing.getMeta?.())) fail("Remove the item already in this equipment slot first.");
          if (definition.isDoubleHanded() && held.getItems()[core.Equipment.SHIELD_SLOT].getId() >= 0) fail("Remove the shield before equipping a two-handed weapon.");
          if (slot === core.Equipment.SHIELD_SLOT && held.getItems()[core.Equipment.WEAPON_SLOT].getId() >= 0 && held.getItems()[core.Equipment.WEAPON_SLOT].getDefinition().isDoubleHanded()) fail("Remove the two-handed weapon before equipping a shield.");
          const total = (existing.getId() === body.itemId ? existing.getAmount() : 0) + body.quantity;
          if (total > 2147483647) fail("The equipment stack is full.");
          held.setItem(slot, new core.Item(body.itemId, total));
        } else {
          const stackable = bank || definition.isStackable();
          const stack = stackable ? addDestination(core, affected, item, bank) : null;
          changed = stack ?? held;
          given = changed.getAddableAmount(item);
          if (given < 1) fail("There is no room for this item.");
          item.setAmount(given);
          if (body.slot !== void 0 && !stack) {
            const first = stackable ? given : 1;
            putSlot(core, held, body.container, body.slot, item.clone().setAmount(first));
            if (given > first) held.add(item.setAmount(given - first), false);
          } else changed.add(item, false);
        }
        message = `Added ${given} x ${definition.getName()} to ${player.getUsername()}'s ${body.container}.${given < body.quantity ? ` Only ${given} of ${body.quantity} fit.` : ""}`;
      } else fail("Choose a valid item action.");
      refresh(core, player, changed, body.container);
      return { message, undo: body.mode === "undo" ? null : { held, before, after: scopeFingerprint(scope(core, player, body.container)), container: body.container, bankTab: body.bankTab ?? 0 } };
    }
    module2.exports = {
      raisesQuantity,
      entries,
      apply,
      fingerprint,
      signature,
      container,
      viewFingerprint: (core, player, name) => scopeFingerprint(scope(core, player, name))
    };
  }
});

// server/plugins/tools/PlayerTools.js
var require_PlayerTools = __commonJS({
  "server/plugins/tools/PlayerTools.js"(exports2, module2) {
    var PlayerToolError = class extends Error {
      constructor(status, message) {
        super(message);
        this.status = status;
      }
    };
    var MAX_QUANTITY = 2147483647;
    var itemCatalogues = /* @__PURE__ */ new WeakMap();
    var position = (location) => ({ x: location.getX(), y: location.getY(), z: location.getZ() });
    function skills(core, player) {
      const manager = player?.getSkillManager();
      return core.Skill.values().map((skill) => ({
        name: skill.getName(),
        index: skill.getIndex(),
        minimum: skill === core.Skill.HITPOINTS ? 10 : 1,
        maximum: core.SkillManager.getMaxAchievingLevel(skill),
        ...manager ? { level: manager.getMaxLevel(skill), current: manager.getCurrentLevel(skill), experience: manager.getExperience(skill) } : {}
      }));
    }
    function destinations(core) {
      return [
        { name: "World spawn", location: core.GameConstants.DEFAULT_LOCATION },
        ...core.SpellTeleports.getTeleportDestinations().map(({ name, destination }) => ({ name, location: destination }))
      ].map(({ name, location }) => ({ name, ...position(location) }));
    }
    function describePlayer(api, player) {
      const quests = { player };
      if (player) api.emitCustomEvent("quests:admin", quests);
      return {
        enabled: true,
        skills: skills(api.core, player),
        destinations: destinations(api.core),
        ...player ? { position: position(player.getLocation()), quests: quests.quests ?? [] } : {}
      };
    }
    function searchItems(core, query) {
      const wanted = query.trim().toLowerCase();
      if (wanted.length < 2 && !/^\d+$/.test(wanted)) return [];
      if (wanted.length > 80) throw new PlayerToolError(400, "Use an item name of at most 80 characters.");
      let catalogue = itemCatalogues.get(core);
      if (!catalogue || Date.now() - catalogue.at > 15e3) {
        const cache = core.CacheDefinitions;
        const count = (cache.getBaseCounts?.() ?? cache.getCounts()).items;
        const ids = new Set(Array.from({ length: count }, (_, id) => id));
        for (const item of cache.getCustomItems()) ids.add(item.id);
        for (const item of cache.getCustomDefinitions()) if (item.kind === "item") ids.add(item.id);
        const items = [];
        for (const id of ids) {
          if (!cache.hasItem(id)) continue;
          const definition = core.ItemDefinition.forId(id);
          const cached = cache.getItem(id);
          if (cached.placeholderTemplate >= 0) continue;
          items.push({ id, name: definition.getName(), noted: definition.isNoted(), stackable: definition.isStackable() });
        }
        catalogue = { at: Date.now(), items };
        itemCatalogues.set(core, catalogue);
      }
      return catalogue.items.filter((item) => item.name.toLowerCase().includes(wanted) || String(item.id) === wanted).sort((a, b) => Number(b.name.toLowerCase() === wanted) - Number(a.name.toLowerCase() === wanted) || a.name.localeCompare(b.name) || a.id - b.id);
    }
    function requireNativeAccess(core, actor, target, commands = []) {
      if (!core.PlayerRights.hasAdminRights(actor) || !core.PluginManager.playerHasCommandRights(actor, "admin")) {
        throw new PlayerToolError(403, "Admin access is no longer available.");
      }
      if (target && target.getRights().getId() > actor.getRights().getId()) {
        throw new PlayerToolError(403, "You cannot edit a higher-ranked player.");
      }
      if (!commands.length) return;
      const available = core.PluginManager.getRegisteredCommands(actor);
      for (const command of commands) {
        if (!available.some((entry) => entry.command === command)) {
          throw new PlayerToolError(403, `This action requires ::${command} permission.`);
        }
      }
    }
    function requiredCommands(core, actor, target, body, teleportCommand) {
      const grants = actor === target ? "item" : "give";
      switch (body.action) {
        case "teleport":
          return [teleportCommand];
        case "give":
          return [grants];
        case "skill":
          return ["setlevel"];
        case "preset":
          return [body.preset === "reset" ? "reset" : "master"];
        case "quest":
          return ["quest"];
        case "container": {
          const creating = body.mode === "add" || body.mode === "increase" || body.mode === "set" && require_Containers_PlayerTools().raisesQuantity(core, target, body);
          return creating ? ["copybank", grants] : ["copybank"];
        }
        default:
          return [];
      }
    }
    async function applyPlayerTool(api, target, body, { actor, teleportCommand = "tele" } = {}) {
      if (!["teleport", "give", "skill", "preset", "restore", "quest", "rank", "container"].includes(body.action)) return null;
      const core = api.core;
      if (core.Server?.isShuttingDown?.()) throw new PlayerToolError(409, "Wait until the server has finished restarting.");
      if (!target || target.isRegistered?.() === false) throw new PlayerToolError(409, "The player is offline.");
      if (actor) requireNativeAccess(core, actor, target, requiredCommands(core, actor, target, body, teleportCommand));
      if (target.getProfile() !== (core.GameConstants.WORLD_PROFILE ?? "main")) throw new PlayerToolError(409, "The player is on a different world profile.");
      if (target.isDyingReturn() || target.getHitpoints() <= 0 || target.isTeleportingReturn()) {
        throw new PlayerToolError(409, "Wait until the player is alive and has finished teleporting.");
      }
      const persistence = core.GameConstants.PLAYER_PERSISTENCE;
      if (persistence.constructor.name === "NullPlayerPersistence") throw new PlayerToolError(409, "Enable player persistence before using player tools.");
      let message, extra;
      if (body.action === "container") {
        extra = require_Containers_PlayerTools().apply(core, target, body);
        message = extra.message;
      } else if (body.action === "teleport") {
        if (target.getPrivateArea()) throw new PlayerToolError(409, "Leave the player's instance in game before using this teleport.");
        const destination = body.destination === void 0 ? body : destinations(core).find((place) => place.name === body.destination);
        if (!destination || ![destination.x, destination.y, destination.z].every(Number.isInteger) || destination.x < 0 || destination.x > 16383 || destination.y < 0 || destination.y > 16383 || destination.z < 0 || destination.z > 3) {
          throw new PlayerToolError(400, "Choose a named destination or whole coordinates X/Y 0-16383 and plane 0-3.");
        }
        core.TeleportHandler.onTeleporting(target, body.preserveInterface !== true);
        target.moveTo(new core.Location(destination.x, destination.y, destination.z));
        message = `Teleported ${target.getUsername()} to ${destination.name ?? `${destination.x}, ${destination.y}, ${destination.z}`}.`;
      } else if (body.action === "give") {
        const { itemId, quantity } = body;
        if (!Number.isInteger(itemId) || !core.CacheDefinitions.hasItem(itemId)) throw new PlayerToolError(400, "Select an item loaded in this world.");
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) throw new PlayerToolError(400, `Quantity must be a whole number from 1 to ${MAX_QUANTITY}.`);
        const cached = core.CacheDefinitions.getItem(itemId);
        if (cached.placeholderTemplate >= 0) throw new PlayerToolError(400, "Choose a usable item, not a bank placeholder.");
        const inventory = target.getInventory();
        const room = Math.min(quantity, inventory.getAddableAmount(new core.Item(itemId, quantity)));
        if (room <= 0) throw new PlayerToolError(409, "The player's inventory has no room for this item.");
        const before = inventory.getAmount(itemId);
        inventory.adds(itemId, room);
        const given = inventory.getAmount(itemId) - before;
        if (given <= 0) throw new PlayerToolError(409, "The item could not be added to the inventory.");
        message = `Gave ${target.getUsername()} ${given} x ${core.ItemDefinition.forId(itemId).getName()}.${given < quantity ? ` Only ${given} of ${quantity} fit.` : ""}`;
      } else if (body.action === "skill") {
        const skill = core.Skill.values().find((skill2) => skill2.getName() === body.skill);
        const minimum = skill === core.Skill.HITPOINTS ? 10 : 1;
        if (!skill || !Number.isInteger(body.level) || body.level < minimum || body.level > core.SkillManager.getMaxAchievingLevel(skill)) {
          throw new PlayerToolError(400, "Choose a skill and a level within its displayed limits.");
        }
        target.getSkillManager().setCurrentLevels(skill, body.level, false).setMaxLevels(skill, body.level, false).setExperience(skill, core.SkillManager.getExperienceForLevel(body.level));
        core.WeaponInterfaceManager.assign(target);
        target.getUpdateFlag().flag(core.Flag.APPEARANCE);
        message = `Set ${target.getUsername()}'s ${skill.getName()} to level ${body.level}.`;
      } else if (body.action === "preset") {
        if (!["max", "combat", "reset"].includes(body.preset)) throw new PlayerToolError(400, "Choose a listed skill preset.");
        const combat = [
          core.Skill.ATTACK,
          core.Skill.DEFENCE,
          core.Skill.STRENGTH,
          core.Skill.HITPOINTS,
          core.Skill.RANGED,
          core.Skill.PRAYER,
          core.Skill.MAGIC
        ];
        for (const skill of core.Skill.values()) {
          if (body.preset === "combat" && !combat.includes(skill)) continue;
          const level = body.preset === "reset" ? skill === core.Skill.HITPOINTS ? 10 : 1 : core.SkillManager.getMaxAchievingLevel(skill);
          target.getSkillManager().setCurrentLevels(skill, level, false).setMaxLevels(skill, level, false).setExperience(skill, core.SkillManager.getExperienceForLevel(level));
        }
        core.WeaponInterfaceManager.assign(target);
        target.getUpdateFlag().flag(core.Flag.APPEARANCE);
        message = `Applied ${body.preset} skills to ${target.getUsername()}.`;
      } else if (body.action === "rank") {
        const rights = core.PlayerRights;
        const callerRank = actor?.getRights?.().getId();
        const rank = rights?.[body.rank];
        if (!Number.isInteger(callerRank) || callerRank < rights.OWNER.getId() || !rank || !["NONE", "MODERATOR", "ADMINISTRATOR", "OWNER", "DEVELOPER"].includes(body.rank) || actor === target || target.getRights().getId() >= callerRank || rank.getId() >= callerRank) {
          throw new PlayerToolError(403, "Only owners can change a lower-ranked player's rank to a rank below their own. You cannot change your own rank.");
        }
        target.setRights(rank);
        target.getUpdateFlag().flag(core.Flag.APPEARANCE);
        message = `Set ${target.getUsername()}'s rank to ${body.rank.toLowerCase()}.`;
      } else if (body.action === "restore") {
        const manager = target.getSkillManager();
        for (const skill of core.Skill.values()) manager.setCurrentLevels(skill, manager.getMaxLevel(skill));
        target.setRunEnergy(100);
        message = `Restored ${target.getUsername()}'s current levels and run energy.`;
      } else {
        if (typeof body.quest !== "string" || !["complete", "reset"].includes(body.mode)) throw new PlayerToolError(400, "Choose a quest and Complete or Reset.");
        const event = { player: target, key: body.quest, action: body.mode };
        api.emitCustomEvent("quests:admin", event);
        if (!event.handled) throw new PlayerToolError(409, "Quest tools are unavailable. Enable QuestCommand on the next server start.");
        if (event.error) throw new PlayerToolError(400, event.error);
        message = event.message;
      }
      try {
        persistence.save(target, `player-tools-${body.action}`);
        await persistence.flush();
      } catch (error) {
        console.error(`[player-tools] Could not save ${target.getUsername()} after ${body.action}`, error);
        throw new PlayerToolError(500, "The live change happened, but saving failed. Do not repeat item or quest grants; check the server's persistence error.");
      }
      target.sendMessage(`[Admin] ${message}`);
      return { ok: true, message, ...extra ? { undo: extra.undo } : {} };
    }
    module2.exports = { PlayerToolError, describePlayer, searchItems, applyPlayerTool, requireNativeAccess };
  }
});

// server/plugins/tools/adminpanel/Testing.AdminPanel.js
var require_Testing_AdminPanel = __commonJS({
  "server/plugins/tools/adminpanel/Testing.AdminPanel.js"(exports2, module2) {
    var { PlayerToolError, requireNativeAccess } = require_PlayerTools();
    var BOOKS = [["NORMAL", "Standard"], ["ANCIENT", "Ancient"], ["LUNAR", "Lunar"], ["ARCEUUS", "Arceuus"]];
    var BOOK_COMMANDS = { NORMAL: "normal", ANCIENT: "ancients", LUNAR: "lunar", ARCEUUS: "arceuus" };
    var PRAYERS = ["PRESERVE", "RIGOUR", "AUGURY"];
    var fail = (message) => {
      throw new PlayerToolError(409, message);
    };
    function modes(api, actor, player) {
      const event = { actor, player };
      api.emitCustomEvent("admin:testing-modes", event);
      return event;
    }
    function rows(api, actor, player) {
      const { core } = api;
      const rows2 = [];
      const add = (key, name, description, actions, detail = "", tab = "TESTING") => rows2.push({ key, name, description, actions, detail, tab, section: key.startsWith("mode:") ? "Temporary modes" : key.startsWith("book:") ? "Spellbooks" : key.startsWith("prayer:") ? "Prayer unlocks" : key === "bank" ? "Bank" : "Resources and combat" });
      for (const [key, name] of BOOKS) add(
        `book:${key}`,
        `${name} spellbook`,
        "Switch instantly, bypassing unlock requirements. Clears autocast when changing books.",
        ["Switch"],
        player.getSpellbook() === core.MagicSpellbook[key] ? " (current)" : ""
      );
      add("restore", "Full restore", "Restore current skills, hitpoints, prayer, run and special attack. Cure poison, venom and disease. Base levels and XP stay the same.", ["Restore"]);
      add("hp", "Hitpoints", "Set current hitpoints between 1 and the base level. Base level and XP stay the same.", ["Full", "Set amount", "1 HP"], ` ${player.getHitpoints()}/${player.getSkillManager().getMaxLevel(core.Skill.HITPOINTS)}`);
      add("prayer", "Prayer points", "Set current prayer points between 0 and the base level. Base level and XP stay the same.", ["Full", "Set amount", "Empty"], ` ${player.getSkillManager().getCurrentLevel(core.Skill.PRAYER)}`);
      add("run", "Run energy", "Set run energy between 0 and 100 percent.", ["Full", "Set amount", "Empty"], ` ${player.getRunEnergy()}%`);
      add("special", "Special attack", "Set special attack energy between 0 and 100 percent.", ["Full", "Set amount", "Empty"], ` ${player.getSpecialPercentage()}%`);
      add("cure", "Cure ailments", "Remove poison, venom and disease without granting lasting immunity.", ["Cure"]);
      add("restrictions", "Clear combat restrictions", "Clear Tele Block, prayer block, freeze and stun, including their immunity timers.", ["Clear"]);
      add("combat", "Stop combat", "Stop this player's current attack and movement. Other creatures can attack again; pending hits still land.", ["Stop"]);
      add("prayers-off", "Deactivate prayers", "Turn off active standard prayers. TSPS has no supported alternate prayer book.", ["Deactivate"]);
      for (const prayer of PRAYERS) add(
        `prayer:${prayer}`,
        `Unlock ${prayer[0]}${prayer.slice(1).toLowerCase()}`,
        "Permanently unlock this scroll prayer. Normal level requirements still apply.",
        ["Unlock"]
      );
      const state = modes(api, actor, player);
      for (const [key, name, description] of [
        ["invisible", "Invisible", "Hide the selected player's model, overheads and minimap dot. Combat participation stays active. Session only."],
        ["health", "Infinite hitpoints", "Restore hitpoints now and prevent HP loss. Session only."],
        ["prayer", "Infinite prayer", "Restore prayer now and prevent active-prayer and supported combat prayer drain. Session only."],
        ["run", "Infinite run energy", "Keep run energy full. Session only."],
        ["runes", "Infinite runes", "Cast without owning or consuming spell runes. Keeps normal Magic XP and other spell requirements. Does not create inventory items. Session only."],
        ["special", "Infinite special attack", "Restore special energy and bypass special attack energy costs. Session only."],
        ["noclip", "Noclip", "Ignore movement collision for the selected player. Session only."]
      ]) {
        if (state.allowed?.[key]) add(`mode:${key}`, name, description, ["Enable", "Disable"], state[key] ? " (on)" : " (off)", "GODMODE");
      }
      const tools = { actor, player };
      api.emitCustomEvent("admin:testing-tools", tools);
      if (tools.allowed?.npc) {
        add("spawn-npcs", "Spawn test NPCs", "Enter NPC ID and count, 1 to 20. Spawn at the selected player's location, capped at 100 active panel spawns per admin. Never saved; no default respawn after death.", ["Spawn"], "", "NPCS");
        add("remove-npcs", "Remove test NPCs", "Remove only NPCs you spawned through this panel, including spawns at another player's location. Also cleaned up when you log out. Boss-created adds are managed by their encounter.", ["Remove"], ` (${tools.spawned})`, "NPCS");
      }
      if (actor === player && actor.getRights().getId() >= core.PlayerRights.OWNER.getId() && core.PluginManager.playerHasCommandRights(actor, "bank")) {
        add("bank", "Open bank", "Open your bank at your current location. Replaces this panel. Uses the existing bank command's permission.", ["Open"]);
      }
      return rows2;
    }
    function resourceLimit(core, player, key) {
      if (key === "hp") return player.getSkillManager().getMaxLevel(core.Skill.HITPOINTS);
      if (key === "prayer") return player.getSkillManager().getMaxLevel(core.Skill.PRAYER);
      return 100;
    }
    function setResource(core, player, key, amount) {
      if (key === "hp" || key === "prayer") player.getSkillManager().setCurrentLevels(key === "hp" ? core.Skill.HITPOINTS : core.Skill.PRAYER, amount);
      else if (key === "run") {
        player.setRunEnergy(amount);
        player.getPacketSender().sendRunEnergy();
      } else {
        player.setSpecialPercentage(amount);
        core.CombatSpecial.updateBar(player);
      }
    }
    function cure(api, player) {
      player.setPoisonDamage(0);
      player.setVenomed(false);
      api.emitCustomEvent("disease:cure", { player, immunity: 0 });
    }
    async function apply(api, actor, player, body) {
      const { core } = api;
      const command = body.testing === "special" || body.testing === "restore" ? "spec" : body.testing?.startsWith("prayer:") ? "unlockprayers" : body.testing?.startsWith("book:") ? BOOK_COMMANDS[body.testing.slice(5)] : null;
      requireNativeAccess(core, actor, player, command ? [command] : []);
      if (core.Server.isShuttingDown()) fail("Wait until the server has finished restarting.");
      if (!player?.isRegistered() || core.World.getPlayerByName(player.getUsername()) !== player) fail("The player is offline.");
      if (player.getProfile() !== (core.GameConstants.WORLD_PROFILE ?? "main")) fail("The player is on a different world profile.");
      if (player.isDyingReturn() || player.getHitpoints() <= 0 || player.isTeleportingReturn()) fail("Wait until the player is alive and has finished teleporting.");
      const entry = rows(api, actor, player).find((entry2) => entry2.key === body.testing);
      if (!entry || !Number.isInteger(body.option) || !entry.actions[body.option]) throw new PlayerToolError(400, "Choose an available testing action.");
      const persistence = core.GameConstants.PLAYER_PERSISTENCE;
      if (persistence.constructor.name === "NullPlayerPersistence") fail("Enable player persistence before using player tools.");
      const key = entry.key;
      let actionMessage;
      if (key.startsWith("book:")) core.MagicSpellbook.changeSpellbook(player, core.MagicSpellbook[key.slice(5)], true, null);
      else if (["hp", "prayer", "run", "special"].includes(key)) {
        const minimum = key === "hp" ? 1 : 0;
        const maximum = resourceLimit(core, player, key);
        const amount = body.option === 0 ? maximum : body.option === 2 ? minimum : body.amount;
        if (!Number.isInteger(amount) || amount < minimum || amount > maximum) throw new PlayerToolError(400, `Enter a whole amount from ${minimum} to ${maximum}.`);
        setResource(core, player, key, amount);
      } else if (key === "restore") {
        const skills = player.getSkillManager();
        for (const skill of core.Skill.values()) skills.setCurrentLevels(skill, skills.getMaxLevel(skill));
        setResource(core, player, "run", 100);
        setResource(core, player, "special", 100);
        cure(api, player);
      } else if (key === "cure") cure(api, player);
      else if (key === "restrictions") {
        player.getCombat().getTeleblockTimer().stop();
        player.getCombat().getPrayerBlockTimer().stop();
        for (const timer of ["FREEZE", "FREEZE_IMMUNITY", "STUN", "STUN_IMMUNITY"]) player.getTimers().cancel(core.TimerKey[timer]);
      } else if (key === "combat") player.getCombat().reset();
      else if (key === "prayers-off") core.PrayerHandler.deactivatePrayers(player);
      else if (key.startsWith("prayer:")) {
        const event = { player, prayer: core.PrayerData[key.slice(7)] };
        api.emitCustomEvent("prayer:unlock", event);
        if (!event.handled) fail("PrayerUnlocks is unavailable. Enable it on the next server start.");
      } else if (key.startsWith("mode:")) {
        const event = { actor, player, action: "set", mode: key.slice(5), enabled: body.option === 0 };
        api.emitCustomEvent("admin:testing-modes", event);
        if (!event.handled) fail(event.error ?? "Admin testing modes are unavailable.");
      } else if (["spawn-npcs", "remove-npcs"].includes(key)) {
        const event = { actor, player, action: key, id: body.npcId, amount: body.count };
        api.emitCustomEvent("admin:testing-tools", event);
        if (!event.handled) fail(event.error ?? "Admin testing tools are unavailable.");
        actionMessage = event.message;
      } else if (key === "bank") player.getBank(player.getCurrentBankTab()).open();
      const message = actionMessage ?? `${entry.name}: ${entry.actions[body.option]} applied to ${player.getUsername()}.`;
      if (!["bank", "spawn-npcs", "remove-npcs"].includes(key) && !key.startsWith("mode:")) {
        try {
          persistence.save(player, `admin-testing-${key}`);
          await persistence.flush();
        } catch (error) {
          console.error("[admin-panel] Testing change could not be saved", error);
          throw new PlayerToolError(500, "The live change happened, but saving failed. Check the server log before repeating it.");
        }
      }
      player.sendMessage(`[Admin] ${message}`);
      return { ok: true, message };
    }
    module2.exports = { rows, apply };
  }
});

// server/plugins/tools/adminpanel/Npcs.AdminPanel.js
var require_Npcs_AdminPanel = __commonJS({
  "server/plugins/tools/adminpanel/Npcs.AdminPanel.js"(exports2, module2) {
    var catalogues = /* @__PURE__ */ new WeakMap();
    function search(core, query) {
      const wanted = query.trim().toLowerCase();
      if (wanted.length < 2 && !/^\d+$/.test(wanted)) return [];
      let catalogue = catalogues.get(core);
      if (!catalogue || Date.now() - catalogue.at > 15e3) {
        const count = (core.CacheDefinitions.getBaseCounts?.() ?? core.CacheDefinitions.getCounts()).npcs;
        const ids = new Set(Array.from({ length: count }, (_, id) => id));
        for (const entry of core.CacheDefinitions.getCustomDefinitions()) if (entry.kind === "npc") ids.add(entry.id);
        const rows = [];
        for (const id of ids) {
          try {
            const cached = core.CacheDefinitions.getNpc(id);
            const name = cached?.name;
            if (!name || name.toLowerCase() === "null" || !(cached.modelIds?.length || cached.models?.length)) continue;
            rows.push({
              id,
              name,
              level: cached.combatLevel >= 0 ? cached.combatLevel : void 0,
              hp: cached.hitpoints > 0 ? cached.hitpoints : void 0
            });
          } catch {
          }
        }
        catalogue = { at: Date.now(), rows };
        catalogues.set(core, catalogue);
      }
      return catalogue.rows.filter((row) => row.name.toLowerCase().includes(wanted) || String(row.id) === wanted).sort((a, b) => Number(b.name.toLowerCase() === wanted) - Number(a.name.toLowerCase() === wanted) || a.name.localeCompare(b.name) || a.id - b.id).slice(0, 50);
    }
    module2.exports = { search };
  }
});

// server/plugins/tools/adminpanel/Spawn.AdminPanel.js
var require_Spawn_AdminPanel = __commonJS({
  "server/plugins/tools/adminpanel/Spawn.AdminPanel.js"(exports2, module2) {
    var { PlayerToolError, searchItems } = require_PlayerTools();
    var Npcs = require_Npcs_AdminPanel();
    var MAX_BATCH = 20;
    var KINDS = ["npc", "item"];
    var actions = () => ["Spawn 1 under me", "Spawn X"];
    function fail(message, status2 = 409) {
      throw new PlayerToolError(status2, message);
    }
    function requireActor(api, actor) {
      const { core } = api;
      if (!actor || !core.PlayerRights.hasAdminRights(actor) || !core.PluginManager.playerHasCommandRights(actor, "admin")) fail("Admin access is no longer available.", 403);
      if (!actor.isRegistered() || core.World.getPlayerByName(actor.getUsername()) !== actor) fail("Your player session is offline. Reopen Admin after logging in.");
      if (actor.getProfile() !== (core.GameConstants.WORLD_PROFILE ?? "main")) fail("Your player is on a different world profile.");
      if (core.Server.isShuttingDown()) fail("Wait until the server has finished restarting.");
      if (actor.isDyingReturn() || actor.getHitpoints() <= 0 || actor.isTeleportingReturn()) fail("Wait until you are alive and have finished teleporting.");
    }
    function status(api, actor) {
      const event = { actor, player: actor };
      api.emitCustomEvent("admin:testing-tools", event);
      return { allowed: event.allowed ?? {}, spawned: event.spawned ?? 0 };
    }
    function search(api, actor, kind, query) {
      requireActor(api, actor);
      if (!KINDS.includes(kind)) fail("Choose NPCs or Items.", 400);
      if (!status(api, actor).allowed[kind]) return [];
      return kind === "npc" ? Npcs.search(api.core, String(query)) : searchItems(api.core, String(query));
    }
    function apply(api, actor, { kind, id, count = 1, random = false }) {
      requireActor(api, actor);
      if (!KINDS.includes(kind)) fail("Choose NPCs or Items.", 400);
      if (!Number.isInteger(count) || count < 1 || count > MAX_BATCH) fail(`Choose a count from 1 to ${MAX_BATCH}.`, 400);
      if (!random && count !== 1) fail("Use Spawn X to spawn a batch.", 400);
      const event = {
        actor,
        player: actor,
        action: kind === "npc" ? "spawn-npcs" : "spawn-items",
        id,
        amount: count,
        placement: random ? "near-actor" : "under-actor"
      };
      api.emitCustomEvent("admin:testing-tools", event);
      if (!event.handled) fail(event.error ?? "Admin spawning is unavailable.");
      return { ok: true, message: event.message, count: event.count ?? count };
    }
    function clearNpcs(api, actor) {
      requireActor(api, actor);
      const event = { actor, player: actor, action: "remove-npcs" };
      api.emitCustomEvent("admin:testing-tools", event);
      if (!event.handled) fail(event.error ?? "Admin NPC cleanup is unavailable.");
      return { ok: true, message: event.message };
    }
    module2.exports = { MAX_BATCH, KINDS, actions, search, status, apply, clearNpcs };
  }
});

// server/plugins/tools/adminpanel/Controller.AdminPanel.js
var require_Controller_AdminPanel = __commonJS({
  "server/plugins/tools/adminpanel/Controller.AdminPanel.js"(exports2, module2) {
    var Layout = require_Layout_AdminPanel();
    var Teleports = require_Teleports_AdminPanel();
    var Bots = require_Bots_AdminPanel();
    var BotView = require_BotView_AdminPanel();
    var Testing = require_Testing_AdminPanel();
    var Spawn = require_Spawn_AdminPanel();
    var ContainerView = require_Containers_AdminPanel();
    var V = ContainerView.C;
    var Containers = require_Containers_PlayerTools();
    var { randomUUID } = require("node:crypto");
    var { describePlayer, searchItems, applyPlayerTool } = require_PlayerTools();
    var { GROUP_ID, MAIN_MODAL_UID, COMPONENT: C, TAB_LABELS, DATA_COMPONENTS, BUTTONS, ROW_SLOTS, PRESETS, SKILL_ORDER, uid } = Layout;
    var TAB = { PLAYERS: 0, TELEPORTS: 1, ITEMS: 2, EDITOR: 3, STATS: 3, QUESTS: 3, STAFF: 3, CHEATS: 4, TESTING: 4, GODMODE: 4, SPAWN: 5, NPCS: 5, BOTS: 6 };
    var SECTION = { SKILLS: 0, QUESTS: 1, STAFF: 2, INVENTORY: 3, EQUIPMENT: 4, BANK: 5, CHARACTER: 6 };
    var CONTAINERS = ["inventory", "equipment", "bank"];
    var RANKS = [["NONE", "Player"], ["MODERATOR", "Moderator"], ["ADMINISTRATOR", "Admin"], ["OWNER", "Owner"], ["DEVELOPER", "Developer"]];
    var MAINMODAL_BACKGROUND_SCRIPT = 917;
    var WORLD_MAP_GROUP_ID = 595;
    var EXPANDED_MODAL_SIZE = -3;
    var SKILL_ICON_ENUM = 255;
    var EQUIPMENT_EMPTY_ICON_ENUM = 904;
    var CLOSE_ON_INTERFACE_CLOSE_ATTRIBUTE = "interface:close-on-interface-close";
    var TAB_BUTTONS = TAB_LABELS.flatMap((_, i) => [uid(C.TAB_START + i), uid(C.TAB_LABEL_START + i)]);
    var ROW_BUTTONS = [C.ROW_LABEL_START, C.ROW_ICON_START, C.ROW_BACKGROUND_START].flatMap((start2) => Array.from({ length: ROW_SLOTS }, (_, i) => uid(start2 + i)));
    var ACTION_BUTTONS = BUTTONS.flatMap(({ button, label }) => [uid(button), uid(label)]);
    var UTILITY_BUTTONS = [uid(C.UTILITY), uid(C.UTILITY_LABEL)];
    var SKILL_BUTTONS = SKILL_ORDER.map((index) => uid(C.SKILL_BUTTON_START + index));
    var PRESET_BUTTONS = PRESETS.flatMap((_, index) => [uid(C.PRESET_START + index), uid(C.PRESET_LABEL_START + index)]);
    var sessions = /* @__PURE__ */ new WeakMap();
    var api;
    var core;
    var safe = (value) => String(value).replace(/[<>]/g, (character) => character === "<" ? "<lt>" : "<gt>");
    var tell = (player, message) => player.sendMessage(`[Admin] ${message}`);
    var registered = (player) => player && player.isRegistered() && player.getProfile() === (core.GameConstants.WORLD_PROFILE ?? "main") && core.World.getPlayerByName(player.getUsername()) === player;
    var online = (player) => registered(player) && !player.isPlayerBot?.();
    var actorOnline = (player) => registered(player) && (!player.isPlayerBot?.() || player.getSession()?.hasNetworkClient?.());
    var eligible = (player) => core.PlayerRights.hasAdminRights(player) && core.PluginManager.playerHasCommandRights(player, "admin");
    function session(player) {
      const state = sessions.get(player);
      if (!state || player.getInterfaceId() !== GROUP_ID) return null;
      if (!eligible(player) || !actorOnline(player)) {
        sessions.delete(player);
        player.getPacketSender().sendInterfaceRemoval();
        tell(player, "Admin access is no longer available.");
        return null;
      }
      return state;
    }
    function ready(player) {
      const state = session(player);
      if (state?.busy) {
        tell(player, "Wait for the current change to finish saving.");
        return null;
      }
      return state;
    }
    function targetOf(player, state) {
      if (!online(state.target)) {
        tell(player, "The selected player is offline. Select an online player.");
        return null;
      }
      return state.target;
    }
    function visibility(player, state) {
      const sender = player.getPacketSender();
      const editor = state.tab === TAB.EDITOR || state.tab === TAB.ITEMS, skills = state.tab === TAB.EDITOR && state.section === SECTION.SKILLS;
      const teleport = state.tab === TAB.TELEPORTS;
      const botForm = state.tab === TAB.BOTS && Bots.config(state).view !== "browse";
      state.visibility = /* @__PURE__ */ new Map();
      const hide = (components, value) => components.forEach((component) => {
        state.visibility.set(component, value);
        sender.sendInterfaceDisplayState(uid(component), value);
      });
      const container = state.tab === TAB.EDITOR && state.section >= SECTION.INVENTORY && state.section <= SECTION.BANK;
      const bank = container && state.section === SECTION.BANK;
      hide([C.SEARCH_BOX, C.SEARCH_INPUT, C.STATUS, C.LIST_VIEW, C.LIST_SCROLLBAR], skills || container || botForm);
      hide([V.VIEW, V.SCROLLBAR], !container || bank);
      hide([V.INVENTORY], !container || state.section !== SECTION.INVENTORY);
      hide([V.EQUIPMENT], !container || state.section !== SECTION.EQUIPMENT);
      hide([V.BANK_VIEW, V.BANK_SCROLLBAR, V.BANK_TABS, V.BANK_INFO], !bank);
      hide([C.SKILL_VIEW, C.SKILL_SCROLLBAR], !skills);
      hide([C.PANEL, C.PANEL_BORDER, C.DETAIL_VIEW, C.DETAIL_SCROLLBAR], teleport || skills || bank || botForm);
      hide([C.UTILITY, C.UTILITY_LABEL, C.MAP_TELEPORT, C.MAP_TELEPORT_LABEL], !teleport);
      hide(Layout.SECTION_LABELS.flatMap((_, i) => [C.SECTION_START + i, C.SECTION_LABEL_START + i]), !editor);
      hide(Layout.SPAWN_LABELS.flatMap((_, i) => [C.SPAWN_START + i, C.SPAWN_LABEL_START + i]), state.tab !== TAB.SPAWN);
      Layout.SPAWN_LABELS.forEach((label, i) => sender.sendString(`${(state.spawnKind ?? "npc") === (i ? "item" : "npc") ? "<col=ffffff>" : "<col=ffd27f>"}${label}</col>`, uid(C.SPAWN_LABEL_START + i)));
      const npcTools = { actor: player, player };
      if (state.tab === TAB.NPCS) api.emitCustomEvent("admin:testing-tools", npcTools);
      hide([C.ADD_ITEMS, C.ADD_ITEMS_LABEL], state.tab !== TAB.ITEMS && !(state.tab === TAB.SPAWN && (state.spawnKind ?? "npc") === "npc" && npcTools.allowed?.npc));
      sender.sendString(state.tab === TAB.NPCS ? "Clear my NPCs" : state.tab === TAB.ITEMS ? "Back to slots" : "Add items", uid(C.ADD_ITEMS_LABEL));
      hide([C.EDITOR_HINT], editor || teleport || state.tab === TAB.BOTS);
      hide([C.TARGET_BUTTON, C.SELF_BUTTON], state.tab === TAB.BOTS);
      hide([C.TARGET], botForm);
      TAB_LABELS.forEach((_, i) => hide([C.TAB_START + i, C.TAB_LABEL_START + i], botForm || i === TAB.ITEMS));
      hide([C.CONTAINER_ADD, C.CONTAINER_ADD_LABEL], !(container && [SECTION.INVENTORY, SECTION.BANK].includes(state.section)));
      sender.sendString("Add item", uid(C.CONTAINER_ADD_LABEL));
      for (let i = 0; i < Layout.SECTION_LABELS.length; i++) sender.sendString(
        `${i === state.section ? "<col=ffffff>" : "<col=ffd27f>"}${Layout.SECTION_LABELS[i]}</col>`,
        uid(C.SECTION_LABEL_START + i)
      );
      sender.sendString(teleport ? "Click a destination to teleport" : state.tab === TAB.ITEMS ? `Add to ${state.target.getUsername()}'s ${state.itemDestination ?? "inventory"}` : state.tab === TAB.BOTS ? "Configure and deploy bots as yourself" : state.tab === TAB.SPAWN ? `Spawns under ${safe(player.getUsername())} or nearby` : "", uid(C.EDITOR_HINT));
      sender.sendString("Enter coordinates", uid(C.UTILITY_LABEL));
      BotView.render(api, player, state, uid, hide);
    }
    function activeContainer(state) {
      return state.tab === TAB.EDITOR && state.section >= SECTION.INVENTORY && state.section <= SECTION.BANK ? CONTAINERS[state.section - SECTION.INVENTORY] : null;
    }
    function bankTabLimit(target) {
      let last = 0;
      for (let tab = 1; tab < core.Bank.BANK_SEARCH_TAB_INDEX; tab++) {
        if (target.getBank(tab).getItems().some((item) => item?.getId() >= 0)) last = tab;
      }
      return Math.min(core.Bank.BANK_SEARCH_TAB_INDEX - 1, last + 1);
    }
    function clearContainer(player, state) {
      const sender = player.getPacketSender();
      for (const component of state.slotCache?.keys() ?? []) sender.clearItemOnInterface(uid(component));
      state.slotCache = null;
      state.containerSlots = /* @__PURE__ */ new Map();
    }
    function sendContainer(player, state) {
      const name = activeContainer(state);
      if (!name || !online(state.target)) return;
      const sender = player.getPacketSender(), limit = name === "bank" ? bankTabLimit(state.target) : 0;
      const bankTab = name === "bank" ? Math.min(state.bankTab ?? 0, limit) : 0;
      if (name === "bank") state.bankTab = bankTab;
      const held = Containers.container(core, state.target, name, bankTab), items = held.getItems();
      const last = items.reduce((last2, item, i) => item?.getId() >= 0 && item.getAmount() > 0 ? i : last2, -1);
      const count = name === "bank" ? Math.min(ContainerView.BANK_SLOTS, Math.max(64, Math.ceil((last + 9) / 8) * 8)) : name === "inventory" ? 28 : 14;
      const start2 = name === "bank" ? V.BANK_START : name === "inventory" ? V.INVENTORY_START : V.EQUIPMENT_START;
      const slots = /* @__PURE__ */ new Map(), cache = state.slotCache ?? /* @__PURE__ */ new Map();
      for (let slot = 0; slot < count; slot++) {
        const component = start2 + slot;
        if (!ContainerView.slotFor(component)) continue;
        const item = items[slot], occupied = item?.getId() >= 0 && item.getAmount() > 0;
        const snapshot = { container: name, bankTab, slot, itemId: occupied ? item.getId() : -1, quantity: occupied ? item.getAmount() : 0, signature: Containers.signature(item) };
        slots.set(component, snapshot);
        const stamp = JSON.stringify(snapshot);
        if (cache.get(component) === stamp) continue;
        cache.set(component, stamp);
        if (occupied) sender.sendItemOnInterface(uid(component), snapshot.itemId, 0, snapshot.quantity);
        else sender.clearItemOnInterface(uid(component));
        if (name === "bank") sender.sendInterfaceDisplayState(uid(component), false).sendInterfaceDisplayState(uid(V.BANK_FRAME_START + slot), false);
        if (name === "equipment") sender.sendInterfaceDisplayState(uid(V.EQUIPMENT_GHOST_START + slot), occupied);
        const label = occupied ? safe(core.ItemDefinition.forId(snapshot.itemId).getName()) : name === "equipment" ? ContainerView.EQUIPMENT.find(([s]) => s === slot)[3] : "slot " + (slot + 1);
        sender.sendInterfaceActions(uid(component), ContainerView.actionsFor(occupied, label));
      }
      if (name === "bank") {
        for (let slot = count; slot < (state.bankVisibleCount ?? 0); slot++) {
          sender.sendInterfaceDisplayState(uid(start2 + slot), true).sendInterfaceDisplayState(uid(V.BANK_FRAME_START + slot), true);
          cache.delete(start2 + slot);
        }
        state.bankVisibleCount = count;
        sender.sendString(String(Math.ceil(count / 8) * ContainerView.BANK_PITCH_Y), uid(V.BANK_HEIGHT));
        sender.sendString("Click an item to set quantity. Right-click to add or remove. Drag to move.", uid(V.BANK_INFO));
        for (let i = 0; i < 10; i++) {
          sender.sendInterfaceDisplayState(uid(V.BANK_TAB_START + i), i > limit).sendInterfaceDisplayState(uid(V.BANK_TAB_LABEL_START + i), i > limit);
          const empty = i > 0 && !state.target.getBank(i).getItems().some((item) => item?.getId() >= 0);
          sender.sendString(`${i === bankTab ? "<col=ffffff>" : "<col=ffd27f>"}${empty ? "New" : i ? "Tab " + i : "Main"}</col>`, uid(V.BANK_TAB_LABEL_START + i));
        }
      } else sender.sendString(String(name === "equipment" ? 202 : 261), uid(V.HEIGHT));
      state.slotCache = cache;
      state.containerSlots = slots;
    }
    function chooseSlotItems(player, state, slot) {
      cancelPrompt(player, state);
      state.itemDestination = slot.container;
      state.bankTab = slot.bankTab;
      state.pickerSlot = slot.itemId < 0 ? { slot: slot.slot, signature: slot.signature } : null;
      state.tab = TAB.ITEMS;
      state.selected = null;
      beginSearch(player, state);
      sendRows(player, state, state.tab);
    }
    function clickSlot({ player, buttonId, opId = 1 }) {
      const state = ready(player), component = buttonId & 65535, slot = state?.containerSlots?.get(component);
      if (!state || !slot || slot.container !== activeContainer(state) || !targetOf(player, state)) return true;
      cancelPrompt(player, state);
      if (slot.itemId < 0) {
        if (opId === 1) chooseSlotItems(player, state, slot);
        return true;
      }
      const held = { ...slot, name: core.ItemDefinition.forId(slot.itemId).getName() };
      state.selected = { tab: TAB.EDITOR, held };
      showSelection(player, state.selected, { title: safe(held.name), info: `${safe(state.target.getUsername())}'s ${held.container}`, info2: `${held.quantity.toLocaleString("en-US")} held`, description: safe(core.ItemDefinition.forId(held.itemId).getExamine()), primary: "Set quantity", secondary: "Add quantity", third: "Remove quantity", fourth: "Cancel" });
      if (opId === 4) void apply(player, state, { action: "container", ...slot, mode: "remove", quantity: slot.quantity });
      else if (opId >= 1 && opId <= 3) editSlotQuantity(player, state, held, ["set", "increase", "remove"][opId - 1]);
      return true;
    }
    function editSlotQuantity(player, state, held, mode) {
      const title = mode === "set" ? `Set ${held.name} quantity for ${state.target.getUsername()}? (0 removes)` : `${mode === "increase" ? "Add" : "Remove"} how many ${held.name} ${mode === "increase" ? "to" : "from"} ${state.target.getUsername()}'s ${held.container}?`;
      prompt(player, state, title, true, (quantity) => void apply(player, state, { action: "container", ...held, mode, quantity }), { acceptsZero: mode === "set" });
    }
    function clickBankTab({ player, buttonId, opId = 1 }) {
      const state = ready(player);
      if (!state || activeContainer(state) !== "bank" || opId !== 1) return true;
      const component = buttonId & 65535, tab = component > V.BANK_TAB_LABEL_START - 1 ? component - V.BANK_TAB_LABEL_START : component - V.BANK_TAB_START;
      if (tab < 0 || tab > bankTabLimit(state.target)) return true;
      cancelPrompt(player, state);
      state.bankTab = tab;
      state.selected = null;
      state.slotCache = null;
      sendRows(player, state, state.tab);
      return true;
    }
    function dragSlot(event) {
      const { packet, player } = event;
      if (packet.sourceWidgetId >>> 16 !== GROUP_ID && packet.targetWidgetId >>> 16 !== GROUP_ID) return;
      event.handled = true;
      const state = ready(player), name = state && activeContainer(state);
      if (!name || !targetOf(player, state) || packet.sourceWidgetId >>> 16 !== GROUP_ID || packet.targetWidgetId >>> 16 !== GROUP_ID) return;
      const source = state.containerSlots?.get(packet.sourceWidgetId & 65535);
      if (!source || source.itemId < 0 || source.container !== name) return;
      let destination = state.containerSlots?.get(packet.targetWidgetId & 65535);
      const component = packet.targetWidgetId & 65535;
      if (name === "bank" && !destination) {
        const tab = component >= V.BANK_TAB_LABEL_START ? component - V.BANK_TAB_LABEL_START : component - V.BANK_TAB_START;
        if (tab >= 0 && tab <= bankTabLimit(state.target) && tab !== (state.bankTab ?? 0)) {
          const held = Containers.container(core, state.target, name, tab), items = held.getItems();
          let slot = items.findIndex((item) => item?.getId() === source?.itemId && JSON.stringify(item.getMeta?.()) === JSON.stringify(Containers.container(core, state.target, name, source.bankTab).getItems()[source.slot]?.getMeta?.()));
          if (slot < 0) slot = items.findIndex((item) => !item || item.getId() < 0);
          if (slot < 0) slot = items.length;
          destination = { container: name, bankTab: tab, slot, itemId: items[slot]?.getId() ?? -1, signature: Containers.signature(items[slot]) };
        }
      }
      const targetItemId = packet.targetItemId === 65535 ? -1 : packet.targetItemId;
      if (!destination || destination.container !== name || packet.sourceItemId !== source.itemId || targetItemId !== destination.itemId && ContainerView.slotFor(component)) return;
      cancelPrompt(player, state);
      void apply(player, state, { action: "container", ...source, mode: "move", destinationSlot: destination.slot, destinationBankTab: destination.bankTab, destinationSignature: destination.signature });
    }
    function emptyPanel(player, state) {
      const sender = player.getPacketSender();
      sender.sendInterfaceDisplayState(uid(C.PANEL_EMPTY), false);
      for (const component of [C.PANEL_TITLE, C.PANEL_INFO, C.PANEL_INFO2, C.PANEL_DESCRIPTION, ...BUTTONS.map(({ label }) => label)]) {
        player.getFrameUpdater().clear(uid(component));
        sender.sendString("", uid(component));
      }
      sender.clearItemOnInterface(uid(C.PANEL_ICON));
      sender.sendInterfaceDisplayState(uid(C.PANEL_ICON), true);
      for (const { button, label } of BUTTONS) sender.sendInterfaceDisplayState(uid(button), true).sendInterfaceDisplayState(uid(label), true);
      visibility(player, state);
    }
    function rowId(state, key) {
      if (!state.ids.has(key)) {
        if (state.nextRowId >= 65534) return null;
        state.ids.set(key, ++state.nextRowId);
      }
      return state.ids.get(key);
    }
    function itemRow(state, item) {
      const id = rowId(state, `${TAB.ITEMS}:${item.id}`);
      if (!id) return null;
      state.rows.set(id, { id, tab: TAB.ITEMS, item });
      return { id, name: safe(item.name), icon: item.id, detail: item.noted ? " (noted)" : "", terms: String(item.id), panel: {
        title: safe(item.name),
        info: `For ${safe(state.target.getUsername())}'s ${state.itemDestination ?? "inventory"}`,
        info2: `${item.stackable ? "Stackable" : "One per slot"} / Item ${item.id}`,
        description: safe(core.ItemDefinition.forId(item.id).getExamine()),
        primary: "Add 1",
        secondary: "Add quantity",
        third: "",
        fourth: ""
      } };
    }
    function spawnRow(player, state, record) {
      const kind = state.spawnKind ?? "npc", npc = kind === "npc";
      const id = rowId(state, `${TAB.SPAWN}:${kind}:${record.id}`);
      if (!id) return null;
      state.rows.set(id, { id, tab: TAB.SPAWN, spawn: { kind, id: record.id, name: record.name }, ...npc ? { npc: record } : { item: record } });
      const [primary, secondary] = Spawn.actions();
      return {
        id,
        name: safe(record.name),
        ...npc ? { npc: record.id } : { icon: record.id },
        terms: String(record.id),
        detail: npc && record.level > 0 ? ` (level ${record.level})` : !npc && record.noted ? " (noted)" : "",
        panel: {
          title: safe(record.name),
          info: `Spawn as ${safe(player.getUsername())}`,
          info2: npc ? `${record.level > 0 ? `Level ${record.level}` : "No combat level"}${record.hp > 0 ? ` / ${record.hp} HP` : ""} / NPC ${record.id}` : `Ground item / Item ${record.id}`,
          description: npc ? "Temporary NPCs. Removed on logout. Spawn X places each on a separate reachable tile within 10 tiles." : `${safe(core.ItemDefinition.forId(record.id).getExamine())}
Spawn X places one item on each separate reachable tile.`,
          primary,
          secondary
        }
      };
    }
    var SEARCH_PAGE_SIZE = 40;
    var SEARCH_RETAINED_PAGES = 3;
    function sendItemResponse(player, state, error = false) {
      const matches = state.searchMatches ?? (state.tab === TAB.SPAWN ? (state.spawnKind ?? "npc") === "npc" ? state.npcs : state.spawnItems ?? [] : state.items);
      const offset = state.searchOffset ?? 0, page = matches.slice(offset, offset + SEARCH_PAGE_SIZE);
      const rows = page.map((record) => state.tab === TAB.SPAWN ? spawnRow(player, state, record) : itemRow(state, record)).filter(Boolean);
      state.searchPages ??= /* @__PURE__ */ new Map();
      state.searchPages.set(offset, page);
      const pages = [...state.searchPages.keys()].sort((a, b) => Math.abs(a - offset) - Math.abs(b - offset));
      for (const old of pages.slice(SEARCH_RETAINED_PAGES)) state.searchPages.delete(old);
      const records = [...state.searchPages.values()].flat(), keep = new Set(records.map((r) => r.id));
      for (const [id, entry] of state.rows) if (entry.tab === state.tab && !keep.has(entry.item?.id ?? entry.npc?.id) && id !== state.selected?.id) {
        state.rows.delete(id);
        state.displayRows?.delete(id);
      }
      if (state.tab === TAB.SPAWN) {
        if ((state.spawnKind ?? "npc") === "npc") state.npcs = records;
        else state.spawnItems = records;
      } else state.items = records;
      for (const row of rows) state.displayRows?.set(row.id, row);
      player.getPacketSender().sendString(JSON.stringify({
        session: state.searchSession,
        sequence: state.searchSequence,
        query: state.itemQuery,
        offset,
        pageSize: SEARCH_PAGE_SIZE,
        rows,
        total: matches.length,
        error
      }), uid(C.SEARCH_RESPONSE));
    }
    function sendRows(player, state, active) {
      const metadata = describePlayer(api, state.target);
      sendContainer(player, state);
      const rows = [];
      const tabs = TAB_LABELS.map(() => []);
      let exhausted = false;
      const selectedId = state.selected?.id;
      state.rows = /* @__PURE__ */ new Map();
      state.selected = null;
      state.version++;
      const row = (tab, name, detail, data, panel, extra = {}) => {
        if (tab === TAB.EDITOR && data.section !== state.section) return;
        const key = `${tab}:${data.target?.getUsername() ?? data.place?.key ?? data.item?.id ?? data.skill ?? data.preset ?? data.quest ?? data.rank ?? data.group ?? data.testing ?? data.botKey ?? data.containerKey}`;
        const id = rowId(state, key);
        if (!id) {
          exhausted = true;
          return;
        }
        const entry = { id, tab, ...data };
        state.rows.set(id, entry);
        tabs[tab].push(id);
        rows.push({ id, name: safe(name), detail: safe(detail), terms: name, ...extra, panel: {
          title: safe(name),
          info: `For ${safe(state.target.getUsername())}`,
          info2: "",
          description: "",
          primary: "",
          secondary: "",
          third: "",
          fourth: "",
          ...panel
        } });
        return id;
      };
      const players = core.World.getPlayers().stream().filter(online).sort((a, b) => a.getUsername().localeCompare(b.getUsername()));
      for (const target of players.slice(0, 200)) row(
        TAB.PLAYERS,
        target.getUsername(),
        target === state.target ? " (selected)" : "",
        { target },
        {
          info: `Rank: ${RANKS.find(([key]) => core.PlayerRights[key].getId() === target.getRights().getId())?.[1] ?? "Unknown"}`,
          description: "",
          primary: "Edit player",
          secondary: "Go to",
          third: "Bring here"
        }
      );
      const folders = /* @__PURE__ */ new Map();
      for (const group of Teleports.destinations(api, state.target)) {
        let children = folders, folder;
        group.path.forEach((label, index) => {
          const key = group.path.slice(0, index + 1).join("/");
          if (!children.has(key)) children.set(key, { key, label, children: /* @__PURE__ */ new Map(), places: [] });
          folder = children.get(key);
          children = folder.children;
        });
        if (folder) folder.places.push(...group.places);
      }
      function sendFolder(folder, parentId) {
        const id = row(
          TAB.TELEPORTS,
          folder.label,
          "",
          { group: folder.key },
          {},
          { ...parentId ? { parentId } : {}, expandable: true, collapsed: true }
        );
        for (const place of folder.places) row(
          TAB.TELEPORTS,
          place.name,
          "",
          { place },
          { info: `${place.x}, ${place.y}, plane ${place.z}`, description: "Admin teleport bypasses travel requirements. Leave private instances in game first." },
          { parentId: id }
        );
        for (const child of folder.children.values()) sendFolder(child, id);
      }
      for (const folder of folders.values()) sendFolder(folder);
      for (const item of state.items) {
        const entry = itemRow(state, item);
        if (entry) {
          rows.push(entry);
          tabs[TAB.ITEMS].push(entry.id);
        } else exhausted = true;
      }
      for (const skill of metadata.skills) row(
        TAB.STATS,
        skill.name,
        ` ${skill.current}/${skill.level}`,
        { skill: skill.name, section: SECTION.SKILLS },
        {
          info: `Current ${skill.current} / base ${skill.level}`,
          info2: `XP ${skill.experience.toLocaleString("en-US")}`,
          description: `Level ${skill.minimum}-${skill.maximum}.`,
          primary: "Set level",
          secondary: "-1 level",
          third: "+1 level"
        }
      );
      for (const [preset, name] of [["max", "Max all skills"], ["combat", "Max combat skills"], ["reset", "Reset all skills"]]) {
        row(TAB.STATS, name, "", { preset, section: SECTION.SKILLS }, { description: "Changes base levels, current levels and XP. Reset keeps Hitpoints at 10 and other skills at 1. Confirmation required.", primary: "Apply preset" });
      }
      for (const quest of metadata.quests ?? []) row(
        TAB.QUESTS,
        quest.name,
        quest.complete ? " (complete)" : ` (stage ${quest.stage})`,
        { quest: quest.key, section: SECTION.QUESTS },
        { info: quest.complete ? "Complete" : `Stage ${quest.stage}`, description: "Reset keeps item/XP rewards. Completing again grants rewards again.", primary: "Complete", secondary: "Reset" }
      );
      if (player.getRights().getId() >= core.PlayerRights.OWNER.getId()) {
        for (const [rank, name] of RANKS.filter(([key]) => core.PlayerRights[key].getId() < player.getRights().getId())) {
          row(TAB.STAFF, name, "", { rank, section: SECTION.STAFF }, { description: "Change the selected player's staff rank. You cannot change your own rank or a rank at or above your own.", primary: "Set rank" });
        }
      }
      if (state.section >= SECTION.INVENTORY && state.section <= SECTION.BANK && online(state.target)) {
        const name = CONTAINERS[state.section - SECTION.INVENTORY];
        state.containerFingerprint = Containers.viewFingerprint(core, state.target, name);
      }
      const cheatGroups = /* @__PURE__ */ new Map();
      for (const entry of Testing.rows(api, player, state.target)) {
        if (["spawn-npcs", "remove-npcs"].includes(entry.key)) continue;
        const character = entry.key.startsWith("book:") || entry.key.startsWith("prayer:");
        const tab = character ? TAB.EDITOR : TAB.CHEATS;
        const section = character ? SECTION.CHARACTER : void 0;
        if (character && state.section !== section) continue;
        const groupKey = `${tab}:${entry.section}`;
        if (!cheatGroups.has(groupKey)) cheatGroups.set(
          groupKey,
          row(tab, entry.section, "", { group: groupKey, section }, {}, { expandable: true, collapsed: !character })
        );
        row(tab, entry.name, entry.detail, { testing: entry.key, section }, {
          description: entry.description,
          ...Object.fromEntries(["primary", "secondary", "third", "fourth"].map((key, i) => [key, entry.actions[i] ?? ""]))
        }, { parentId: cheatGroups.get(groupKey) });
      }
      if (state.tab === TAB.BOTS) {
        const groups = /* @__PURE__ */ new Map();
        for (const entry of Bots.rows(api, player, state)) {
          const id = row(
            TAB.BOTS,
            entry.name,
            entry.detail,
            entry.group ? { group: entry.key } : { botKey: entry.key },
            { ...entry.panel, info: entry.info ?? `Spawning as ${safe(player.getUsername())}` },
            entry.group ? { expandable: true, collapsed: entry.collapsed ?? false } : entry.parent ? { parentId: groups.get(entry.parent) } : {}
          );
          if (entry.group) groups.set(entry.key, id);
        }
      }
      if (exhausted) {
        sessions.delete(player);
        player.getPacketSender().sendInterfaceRemoval();
        tell(player, "Reopen ::admin to reset the selection limit.");
        return;
      }
      const parts = [[]];
      let bytes = 2;
      for (const entry of rows) {
        const size = Buffer.byteLength(JSON.stringify(entry), "latin1") + 1;
        if (bytes + size > 4e4) {
          parts.push([]);
          bytes = 2;
        }
        parts.at(-1).push(entry);
        bytes += size;
      }
      if (parts.length > DATA_COMPONENTS.length) throw new Error("Admin panel data exceeds its packet budget.");
      state.displayRows = new Map(rows.map((row2) => [row2.id, row2]));
      const sender = player.getPacketSender();
      DATA_COMPONENTS.forEach((component, i) => sender.sendString(JSON.stringify(parts[i] ?? []), uid(component)));
      sender.sendString(state.tab === TAB.BOTS ? `Deploying as: ${safe(player.getUsername())}` : state.tab === TAB.SPAWN ? `Spawning as: ${safe(player.getUsername())}` : `Target: ${safe(state.target.getUsername())}`, uid(C.TARGET));
      let total = 0;
      for (const skill of metadata.skills) {
        total += skill.level;
        sender.sendString(String(skill.current), uid(C.SKILL_CURRENT_START + skill.index));
        sender.sendString(`/ ${skill.level}`, uid(C.SKILL_BASE_START + skill.index));
        sender.sendString(skill.name, uid(C.SKILL_NAME_START + skill.index));
        sender.sendInterfaceActions(uid(C.SKILL_BUTTON_START + skill.index), [`Set ${state.target.getUsername()}'s ${skill.name} level`]);
      }
      sender.sendString(`Total level: ${total}`, uid(C.SKILL_TOTAL));
      emptyPanel(player, state);
      if (selectedId && state.rows.get(selectedId)?.tab === state.tab) {
        state.selected = state.rows.get(selectedId);
        const panel = rows.find((entry) => entry.id === selectedId)?.panel;
        if (panel) {
          for (const [key, component] of Object.entries({
            title: C.PANEL_TITLE,
            info: C.PANEL_INFO,
            info2: C.PANEL_INFO2,
            description: C.PANEL_DESCRIPTION,
            primary: BUTTONS[0].label,
            secondary: BUTTONS[1].label,
            third: BUTTONS[2].label,
            fourth: BUTTONS[3].label
          })) sender.sendString(panel[key], uid(component));
          showSelection(player, state.selected, panel);
        }
      }
      if ([TAB.ITEMS, TAB.NPCS].includes(state.tab)) sendItemResponse(player, state);
      player.getFrameUpdater().clear(uid(C.LAYOUT));
      sender.sendString(JSON.stringify({
        tabs,
        visibility: [...state.visibility ?? []].map(([component, hidden]) => ({ component, hidden })),
        ...state.focusSearch ? { focusSearch: true } : {},
        ...active !== void 0 ? { active } : {}
      }), uid(C.LAYOUT));
      state.focusSearch = false;
    }
    function openAdmin({ player, tab }) {
      if (!eligible(player) || !actorOnline(player)) return true;
      if (sessions.get(player)?.busy) {
        tell(player, "Wait for the current change to finish saving.");
        return true;
      }
      player.getPacketSender().sendInterfaceRemoval();
      const state = {
        target: player,
        tab: tab === "bots" ? TAB.BOTS : TAB.PLAYERS,
        section: SECTION.SKILLS,
        itemDestination: "inventory",
        items: [],
        npcs: [],
        undo: null,
        ids: /* @__PURE__ */ new Map(),
        nextRowId: 0,
        version: 0,
        selected: null,
        busy: false,
        searchSession: randomUUID(),
        searchSequence: 0,
        itemQuery: "",
        spawnKind: "npc",
        spawnItems: []
      };
      sessions.set(player, state);
      player.setInterfaceId(GROUP_ID);
      player.setAttribute(CLOSE_ON_INTERFACE_CLOSE_ATTRIBUTE, GROUP_ID);
      const sender = player.getPacketSender();
      sender.sendInterfaceScript(MAINMODAL_BACKGROUND_SCRIPT, [-1, EXPANDED_MODAL_SIZE]);
      sender.sendSubInterface(MAIN_MODAL_UID, GROUP_ID, 0, {
        postScripts: [
          { scriptId: MAINMODAL_BACKGROUND_SCRIPT, args: [-1, EXPANDED_MODAL_SIZE] },
          { scriptId: 227, args: [uid(C.FRAME), "Admin tools"] }
        ]
      });
      player.getFrameUpdater().clear(uid(C.SEARCH_INPUT));
      player.getPacketSender().sendString("", uid(C.SEARCH_INPUT));
      sender.sendString(state.searchSession, uid(C.SEARCH_SESSION));
      sendRows(player, state, state.tab);
      return true;
    }
    function beginSearch(player, state) {
      state.searchSession = randomUUID();
      state.searchSequence = 0;
      state.itemQuery = "";
      state.items = [];
      state.npcs = [];
      state.spawnItems = [];
      state.searchMatches = void 0;
      state.searchOffset = 0;
      state.searchPages = /* @__PURE__ */ new Map();
      state.focusSearch = true;
      const sender = player.getPacketSender();
      sender.sendString(state.searchSession, uid(C.SEARCH_SESSION));
      player.getFrameUpdater().clear(uid(C.SEARCH_INPUT));
      sender.sendString("", uid(C.SEARCH_INPUT));
    }
    function clickSpawnKind({ player, buttonId, opId = 1 }) {
      const state = ready(player);
      if (!state || state.tab !== TAB.SPAWN || opId !== 1) return true;
      const component = buttonId & 65535;
      const index = component >= C.SPAWN_LABEL_START ? component - C.SPAWN_LABEL_START : component - C.SPAWN_START;
      if (index < 0 || index >= Layout.SPAWN_LABELS.length) return true;
      cancelPrompt(player, state);
      state.spawnKind = index ? "item" : "npc";
      state.selected = null;
      state.version++;
      beginSearch(player, state);
      sendRows(player, state, state.tab);
      return true;
    }
    function spawnSelection(player, state, entry, count, random) {
      if (ready(player) !== state || state.tab !== TAB.SPAWN || state.selected !== entry || state.spawnKind !== entry.spawn.kind) return;
      try {
        const result = Spawn.apply(api, player, { kind: entry.spawn.kind, id: entry.spawn.id, count, random });
        tell(player, result.message);
      } catch (error) {
        tell(player, error.status ? error.message : "Spawn failed. Check the server log before trying again.");
        if (!error.status) console.error("[admin-panel] Spawn failed", error);
      }
    }
    function clickTab({ player, buttonId, opId = 1 }) {
      const state = session(player);
      if (!state || opId !== 1) return true;
      cancelPrompt(player, state);
      state.mapTarget = null;
      state.pickerSlot = null;
      state.tab = buttonId >= uid(C.TAB_LABEL_START) ? buttonId - uid(C.TAB_LABEL_START) : buttonId - uid(C.TAB_START);
      state.selected = null;
      state.version++;
      state.itemQuery = "";
      state.items = [];
      state.npcs = [];
      if ([TAB.ITEMS, TAB.SPAWN].includes(state.tab)) beginSearch(player, state);
      sendRows(player, state, state.tab);
      return true;
    }
    function selectRow({ player, slot, opId = 1 }) {
      const state = session(player);
      const entry = state?.rows.get(slot);
      if (!entry || entry.group || entry.tab !== state.tab) return true;
      if (opId !== 1) return true;
      cancelPrompt(player, state);
      state.version++;
      state.selected = entry;
      if (entry.target) {
        useTarget(player, state, entry.target);
        return true;
      }
      if (entry.place) {
        teleportRow(player, state, entry);
        return true;
      }
      showSelection(player, entry);
      return true;
    }
    function showSelection(player, entry, panel) {
      const sender = player.getPacketSender();
      if (!panel) {
        const state = sessions.get(player);
        panel = state?.displayRows?.get(entry.id)?.panel;
      }
      if (!panel) return;
      sender.sendInterfaceDisplayState(uid(C.PANEL_EMPTY), true);
      const fields = { title: C.PANEL_TITLE, info: C.PANEL_INFO, info2: C.PANEL_INFO2, description: C.PANEL_DESCRIPTION };
      for (const [key, component] of Object.entries(fields)) {
        player.getFrameUpdater().clear(uid(component));
        sender.sendString(panel[key] ?? "", uid(component));
      }
      BUTTONS.forEach(({ button, label }, i) => {
        const value = panel[["primary", "secondary", "third", "fourth"][i]] ?? "";
        player.getFrameUpdater().clear(uid(label));
        sender.sendString(value, uid(label));
        sender.sendInterfaceDisplayState(uid(button), !value).sendInterfaceDisplayState(uid(label), !value);
        const actions = entry.skill && [1, 2].includes(i) ? [value, i === 1 ? "-5 levels" : "+5 levels"] : [value];
        sender.sendInterfaceActions(uid(button), actions).sendInterfaceActions(uid(label), actions);
      });
      sender.sendInterfaceDisplayState(uid(C.PANEL_ICON), !(entry.item || entry.held || entry.npc));
      if (entry.item || entry.held) sender.sendItemOnInterface(uid(C.PANEL_ICON), entry.item?.id ?? entry.held.itemId, 0, 1);
    }
    function teleportRow(player, state, entry) {
      const target = targetOf(player, state);
      if (!target) return;
      let tile;
      try {
        tile = entry.place.resolve ? entry.place.resolve(target) : [entry.place.x, entry.place.y, entry.place.z];
      } catch {
        tile = null;
      }
      if (!Teleports.validTile(tile)) {
        tell(player, "This destination is unavailable. Refresh the teleports list.");
        return;
      }
      void apply(player, state, { action: "teleport", x: tile[0], y: tile[1], z: tile[2], preserveInterface: target === player });
    }
    function cancelPrompt(player, state) {
      const action = state?.prompt;
      if (!action) return;
      state.prompt = null;
      if (player.getEnteredAmountAction() === action || player.getEnteredSyntaxAction() === action) {
        player.getPacketSender().abortInputPrompt();
      }
      action.cancel();
      if (activeContainer(state) === "bank") player.getPacketSender().sendInterfaceDisplayState(uid(C.ADD_ITEMS), true).sendInterfaceDisplayState(uid(C.ADD_ITEMS_LABEL), true);
    }
    function prompt(player, state, title, amount, callback, options = {}) {
      cancelPrompt(player, state);
      const version = ++state.version;
      const target = state.target;
      let consumed = false;
      const action = { acceptsZero: options.acceptsZero === true, cancel() {
        consumed = true;
      }, execute(input) {
        if (consumed) return;
        consumed = true;
        if (state.prompt === action) state.prompt = null;
        if (activeContainer(state) === "bank") player.getPacketSender().sendInterfaceDisplayState(uid(C.ADD_ITEMS), true).sendInterfaceDisplayState(uid(C.ADD_ITEMS_LABEL), true);
        if (ready(player) !== state || state.version !== version || state.target !== target) return;
        callback(input);
      } };
      state.prompt = action;
      if (amount) {
        player.setEnteredAmountAction(action);
        player.getPacketSender().sendEnterAmountPrompt(title);
      } else {
        player.setEnteredSyntaxAction(action);
        player.getPacketSender().sendEnterInputPrompt(title);
      }
      if (activeContainer(state) === "bank") player.getPacketSender().sendString("Cancel", uid(C.ADD_ITEMS_LABEL)).sendInterfaceDisplayState(uid(C.ADD_ITEMS), false).sendInterfaceDisplayState(uid(C.ADD_ITEMS_LABEL), false);
    }
    function confirm(player, state, title, body) {
      tell(player, title);
      prompt(player, state, "Type CONFIRM to apply this change.", false, (input) => {
        if (String(input).trim().toUpperCase() === "CONFIRM") void apply(player, state, body);
        else tell(player, "Change cancelled.");
      });
    }
    async function apply(player, state, body, { targetOverride, teleportCommand } = {}) {
      if (ready(player) !== state) return;
      const target = targetOverride ?? targetOf(player, state);
      if (!target) return;
      state.busy = true;
      const editVersion = ++state.version;
      try {
        const result = body.action === "testing" ? await Testing.apply(api, player, target, body) : await applyPlayerTool(api, target, body, { actor: player, teleportCommand });
        if (body.action === "container" && body.mode === "add" && state.tab === TAB.ITEMS && state.target === target && state.version === editVersion) {
          state.tab = TAB.EDITOR;
          state.selected = null;
          state.pickerSlot = null;
        }
        if (body.action === "container" && state.target === target) state.undo = result.undo ? { ...result.undo, target } : null;
        if (target !== player) tell(player, result.message);
        if (session(player) === state && online(target)) sendRows(player, state, state.tab);
      } catch (error) {
        tell(player, error.status ? error.message : "The action failed. Check the server log before repeating a grant.");
        if (!error.status) console.error("[admin-panel] Action failed", error);
      } finally {
        state.busy = false;
      }
    }
    function changeSkill(player, state, entry, delta) {
      const target = targetOf(player, state);
      if (!target) return;
      const skill = core.Skill.values().find((value) => value.getName() === entry.skill);
      if (skill) void apply(player, state, { action: "skill", skill: entry.skill, level: target.getSkillManager().getMaxLevel(skill) + delta });
    }
    function promptSkill(player, state, entry) {
      prompt(
        player,
        state,
        `New ${entry.skill} level for ${state.target.getUsername()}?`,
        true,
        (level) => void apply(player, state, { action: "skill", skill: entry.skill, level })
      );
    }
    function clickSkill({ player, buttonId, opId = 1 }) {
      const state = ready(player);
      if (!state || state.tab !== TAB.EDITOR || state.section !== SECTION.SKILLS || opId !== 1 || !targetOf(player, state)) return true;
      const index = buttonId - uid(C.SKILL_BUTTON_START);
      const skill = core.Skill.values().find((skill2) => skill2.getIndex() === index);
      const entry = [...state.rows.values()].find((entry2) => entry2.tab === TAB.STATS && entry2.skill === skill?.getName());
      if (!entry) return true;
      state.selected = entry;
      sendRows(player, state);
      promptSkill(player, state, entry);
      return true;
    }
    function clickPreset({ player, buttonId, opId = 1 }) {
      const state = ready(player);
      if (!state || state.tab !== TAB.EDITOR || state.section !== SECTION.SKILLS || opId !== 1 || !targetOf(player, state)) return true;
      const index = PRESETS.findIndex((_, index2) => buttonId === uid(C.PRESET_START + index2) || buttonId === uid(C.PRESET_LABEL_START + index2));
      if (index < 0) return true;
      const [preset, name] = PRESETS[index];
      if (preset === "restore") void apply(player, state, { action: "restore" });
      else confirm(player, state, `${name} skills for ${state.target.getUsername()}?`, { action: "preset", preset });
      return true;
    }
    function useTarget(player, state, target) {
      if (!online(target)) {
        tell(player, "Choose an online human player on this world.");
        return;
      }
      cancelPrompt(player, state);
      state.mapTarget = null;
      state.target = target;
      state.targetOffline = false;
      state.ids.clear();
      state.selected = null;
      state.items = [];
      state.npcs = [];
      state.undo = null;
      state.itemDestination = "inventory";
      state.bankTab = 0;
      state.pickerSlot = null;
      state.slotCache = null;
      sendRows(player, state);
      state.selected = [...state.rows.values()].find((entry) => entry.target === target) ?? null;
      if (state.selected?.tab === state.tab) showSelection(player, state.selected);
    }
    function clickAction({ player, buttonId, opId = 1 }) {
      const state = ready(player);
      const entry = state?.selected;
      if (!entry || entry.tab !== state.tab) return true;
      const index = BUTTONS.findIndex(({ button, label }) => buttonId === uid(button) || buttonId === uid(label));
      if (opId !== 1) {
        if (opId === 2 && entry.skill && [1, 2].includes(index)) changeSkill(player, state, entry, index === 1 ? -5 : 5);
        return true;
      }
      if (entry.target) {
        if (index === 0) {
          useTarget(player, state, entry.target);
          state.tab = TAB.EDITOR;
          state.section = SECTION.SKILLS;
          state.selected = null;
          sendRows(player, state, state.tab);
        } else if ([1, 2].includes(index)) {
          if (!online(entry.target)) {
            tell(player, "This player is offline. Refresh the players list.");
            return true;
          }
          const destination = index === 1 ? entry.target : player;
          if (destination.getPrivateArea()) {
            tell(player, "The destination player must leave their private instance first.");
            return true;
          }
          const location = destination.getLocation();
          void apply(
            player,
            state,
            { action: "teleport", x: location.getX(), y: location.getY(), z: location.getZ() },
            { targetOverride: index === 1 ? player : entry.target, teleportCommand: index === 1 ? "teleto" : "teletome" }
          );
        }
      } else if (entry.botKey && index === 0) {
        changeBot(player, state, entry.botKey);
      } else if (entry.spawn && [0, 1].includes(index)) {
        if (index === 0) spawnSelection(player, state, entry, 1, false);
        else prompt(
          player,
          state,
          `Spawn how many ${entry.spawn.name}? (1-${Spawn.MAX_BATCH})`,
          true,
          (count) => spawnSelection(player, state, entry, count, true)
        );
      } else if (entry.held && [0, 1, 2, 3].includes(index)) {
        if (index === 3) {
          cancelPrompt(player, state);
          state.selected = null;
          emptyPanel(player, state);
        } else editSlotQuantity(player, state, entry.held, ["set", "increase", "remove"][index]);
      } else if (entry.item && [0, 1].includes(index)) {
        const body = { action: "container", mode: "add", container: state.itemDestination ?? "inventory", itemId: entry.item.id, bankTab: state.bankTab ?? 0, ...state.pickerSlot ?? {} };
        if (index === 0) void apply(player, state, { ...body, quantity: 1 });
        else prompt(
          player,
          state,
          `Quantity of ${entry.item.name} for ${state.target.getUsername()}'s ${body.container}?`,
          true,
          (quantity) => void apply(player, state, { ...body, quantity })
        );
      } else if (entry.skill) {
        if (index === 0) promptSkill(player, state, entry);
        else if (index === 1 || index === 2) changeSkill(player, state, entry, index === 1 ? -1 : 1);
      } else if (entry.preset && index === 0) confirm(player, state, `Apply ${entry.preset} skills to ${state.target.getUsername()}?`, { action: "preset", preset: entry.preset });
      else if (entry.quest && [0, 1].includes(index)) void apply(
        player,
        state,
        { action: "quest", quest: entry.quest, mode: index === 0 ? "complete" : "reset" }
      );
      else if (entry.rank && index === 0) confirm(player, state, `Set ${state.target.getUsername()}'s rank to ${entry.rank}?`, { action: "rank", rank: entry.rank });
      else if (entry.testing) {
        const body = { action: "testing", testing: entry.testing, option: index };
        if (index === 1 && ["hp", "prayer", "run", "special"].includes(entry.testing)) {
          prompt(
            player,
            state,
            `New ${entry.testing === "hp" ? "hitpoints" : entry.testing} amount for ${state.target.getUsername()}?`,
            true,
            (amount) => void apply(player, state, { ...body, amount })
          );
        } else void apply(player, state, body);
      }
      return true;
    }
    function changeBot(player, state, key, value) {
      const message = Bots.act(api, player, state, key, value);
      if (state.botConfig?.transferred) {
        logout({ player });
        return;
      }
      if (session(player) !== state) return;
      state.botConfig.feedback = message ?? "";
      if (message) tell(player, message);
      state.selected = null;
      player.getFrameUpdater().clear(uid(C.SEARCH_INPUT));
      player.getPacketSender().sendString("", uid(C.SEARCH_INPUT));
      sendRows(player, state, state.tab);
    }
    function clickBot({ player, buttonId, opId = 1 }) {
      const state = ready(player);
      if (!state || state.tab !== TAB.BOTS || opId !== 1) return true;
      cancelPrompt(player, state);
      const B = BotView.C, component = buttonId & 65535, config = Bots.config(state);
      const category = component >= B.CATEGORY_LABEL && component < B.CATEGORY_LABEL + Bots.CATEGORIES.length ? component - B.CATEGORY_LABEL : component - B.CATEGORY;
      if (category >= 0 && category < Bots.CATEGORIES.length) {
        config.category = Bots.CATEGORIES[category];
        config.view = config.category === "self" ? "self" : "browse";
        config.feedback = "";
        state.selected = null;
        state.botButtons = /* @__PURE__ */ new Map();
        player.getFrameUpdater().clear(uid(C.SEARCH_INPUT));
        player.getPacketSender().sendString("", uid(C.SEARCH_INPUT));
        sendRows(player, state, state.tab);
        return true;
      }
      if ([B.BACK, B.BACK_LABEL].includes(component)) {
        config.view = "browse";
        if (config.category === "self") config.category = "spawn";
        config.feedback = "";
        state.selected = null;
        state.botButtons = /* @__PURE__ */ new Map();
        sendRows(player, state, state.tab);
        return true;
      }
      let key = state.botButtons?.get(component);
      if (config.view === "setup") {
        if ([B.MINUS, B.MINUS_LABEL].includes(component)) key = "count-down";
        else if ([B.PLUS, B.PLUS_LABEL].includes(component)) key = "count-up";
        else if (component === B.COUNT) key = "count";
        else if ([B.LOCATION, B.LOCATION_LABEL].includes(component)) key = "location";
        else if ([B.LEVELS, B.LEVELS_LABEL].includes(component)) key = "levels";
        else if ([B.PRIMARY, B.PRIMARY_LABEL].includes(component)) key = "deploy";
      } else if (config.view === "self" && [B.PRIMARY, B.PRIMARY_LABEL].includes(component)) key = "control:self";
      if (key === "count") prompt(player, state, `Bots to spawn (1-${state.botSnapshot?.limit ?? 20})?`, true, (amount) => changeBot(player, state, key, amount));
      else if (key === "control:rename") prompt(player, state, "Enter the bot's new display name (up to 12 characters).", false, (name) => changeBot(player, state, key, name));
      else if (key) changeBot(player, state, key);
      return true;
    }
    function clickUtility({ player }) {
      const state = ready(player);
      if (!state) return true;
      if (state.tab === TAB.ITEMS) {
        state.selected = null;
        player.getFrameUpdater().clear(uid(C.SEARCH_INPUT));
        player.getPacketSender().sendString("", uid(C.SEARCH_INPUT));
        emptyPanel(player, state);
      } else if (state.tab === TAB.TELEPORTS) prompt(player, state, "Enter X Y plane (X/Y 0-16383, plane 0-3).", false, (input) => {
        const text = String(input).trim();
        if (!/^\d+\s+\d+\s+[0-3]$/.test(text)) {
          tell(player, "Enter whole X Y plane, for example 3221 3218 0.");
          return;
        }
        const [x, y, z] = text.split(/\s+/).map(Number);
        void apply(player, state, { action: "teleport", x, y, z, preserveInterface: state.target === player });
      });
      else sendRows(player, state);
      return true;
    }
    function openFromEvent(event) {
      if (!eligible(event.player) || !actorOnline(event.player)) return;
      event.handled = true;
      openAdmin(event);
    }
    function openTeleportMap({ player, opId = 1 }) {
      const state = ready(player);
      if (!state || state.tab !== TAB.TELEPORTS || opId !== 1 || !targetOf(player, state)) return true;
      cancelPrompt(player, state);
      state.mapTarget = state.target;
      const sender = player.getPacketSender();
      if (!sender.isWorldMapOpen()) sender.toggleWorldMap();
      tell(player, `Choose a map or dungeon, then click a tile to teleport ${state.target.getUsername()}. Drag to pan; scroll to zoom.`);
      return true;
    }
    function mapTeleport(event) {
      const { player, packet } = event, state = sessions.get(player);
      if (packet.type !== "world_map_click" || !state?.mapTarget || event.handled) return;
      event.handled = true;
      const target = state.mapTarget;
      state.mapTarget = null;
      if (ready(player) !== state || state.tab !== TAB.TELEPORTS || state.target !== target || !player.getPacketSender().isWorldMapOpen()) return;
      if (!Teleports.validTile([packet.x, packet.y, packet.level])) {
        tell(player, "Choose a valid map tile.");
        return;
      }
      player.getPacketSender().closeWorldMap();
      void apply(player, state, { action: "teleport", x: packet.x, y: packet.y, z: packet.level, preserveInterface: target === player });
    }
    function findPlayer({ player }) {
      const state = ready(player);
      if (state) prompt(player, state, "Enter the online player's full name.", false, (input) => {
        const name = String(input).trim();
        if (!/^[a-zA-Z0-9 _-]{1,12}$/.test(name)) {
          tell(player, "Enter a player name of 1-12 characters.");
          return;
        }
        useTarget(player, state, core.World.getPlayerByName(name));
      });
      return true;
    }
    function useSelf({ player }) {
      const state = ready(player);
      if (state) useTarget(player, state, player);
      return true;
    }
    function start(pluginApi) {
      api = pluginApi;
      core = api.core;
    }
    function searchSocket(event) {
      const packet = event.packet;
      if (packet?.type === "widget_drag") {
        dragSlot(event);
        return;
      }
      if (packet?.groupId !== GROUP_ID || packet.childId !== C.SEARCH_REQUEST || packet.widgetId !== uid(C.SEARCH_REQUEST)) return;
      event.handled = true;
      const { player } = event;
      const state = session(player);
      if (!state || ![TAB.ITEMS, TAB.NPCS].includes(state.tab) || packet.opId !== 1 || typeof packet.target !== "string" || packet.target.length > 300) return;
      let request;
      try {
        request = JSON.parse(packet.target);
      } catch {
        return;
      }
      const offset = request.offset ?? 0;
      if (request?.session !== state.searchSession || !Number.isSafeInteger(request.sequence) || request.sequence < state.searchSequence || typeof request.query !== "string" || request.query.length > 60 || /[^ -~]/.test(request.query) || !Number.isSafeInteger(offset) || offset < 0 || offset % SEARCH_PAGE_SIZE !== 0) return;
      const fresh = request.sequence > state.searchSequence;
      if (!fresh && (request.query !== state.itemQuery || !state.searchMatches)) return;
      if (fresh) {
        if (offset !== 0) return;
        state.searchSequence = request.sequence;
        state.itemQuery = request.query;
        state.selected = null;
        state.version++;
        for (const [id, entry] of state.rows) if (entry.tab === state.tab) {
          state.rows.delete(id);
          state.displayRows?.delete(id);
        }
        state.items = [];
        state.npcs = [];
        state.spawnItems = [];
        state.searchMatches = [];
        state.searchPages = /* @__PURE__ */ new Map();
        emptyPanel(player, state);
      }
      if (!fresh && offset >= state.searchMatches.length && offset !== 0) return;
      state.searchOffset = offset;
      try {
        if (fresh) state.searchMatches = state.tab === TAB.SPAWN ? Spawn.search(api, player, state.spawnKind ?? "npc", request.query) : searchItems(core, request.query);
        sendItemResponse(player, state);
      } catch {
        state.searchMatches = [];
        sendItemResponse(player, state, true);
      }
    }
    function clickSection({ player, buttonId, opId = 1 }) {
      const state = session(player);
      if (!state || ![TAB.EDITOR, TAB.ITEMS].includes(state.tab) || opId !== 1) return true;
      const index = buttonId >= uid(C.SECTION_LABEL_START) ? buttonId - uid(C.SECTION_LABEL_START) : buttonId - uid(C.SECTION_START);
      if (index < 0 || index >= Layout.SECTION_LABELS.length) return true;
      cancelPrompt(player, state);
      state.section = index;
      state.tab = TAB.EDITOR;
      state.selected = null;
      state.version++;
      sendRows(player, state, state.tab);
      return true;
    }
    function addItems({ player }) {
      const state = ready(player);
      if (state && activeContainer(state) === "bank" && state.prompt) {
        cancelPrompt(player, state);
        state.selected = null;
        emptyPanel(player, state);
        return true;
      }
      if (state?.tab === TAB.SPAWN) {
        if ((state.spawnKind ?? "npc") === "npc") try {
          tell(player, Spawn.clearNpcs(api, player).message);
        } catch (error) {
          tell(player, error.message);
        }
        return true;
      }
      if (state?.tab === TAB.ITEMS) {
        state.tab = TAB.EDITOR;
        state.pickerSlot = null;
        sendRows(player, state, state.tab);
        return true;
      }
      if (!state || state.tab !== TAB.EDITOR || ![SECTION.INVENTORY, SECTION.BANK].includes(state.section) || !targetOf(player, state)) return true;
      const name = CONTAINERS[state.section - SECTION.INVENTORY];
      cancelPrompt(player, state);
      state.itemDestination = name;
      state.pickerSlot = null;
      state.tab = TAB.ITEMS;
      state.selected = null;
      beginSearch(player, state);
      sendRows(player, state, state.tab);
      return true;
    }
    function refreshLive({ player }) {
      const state = sessions.get(player);
      if (!state) return;
      if (player.getInterfaceId() !== GROUP_ID || !actorOnline(player)) {
        logout({ player });
        return;
      }
      if (!session(player) || state.busy || state.tab !== TAB.EDITOR || state.section < SECTION.INVENTORY || state.section > SECTION.BANK) return;
      if (!online(state.target)) {
        if (!state.targetOffline) {
          state.targetOffline = true;
          state.selected = null;
          state.version++;
          state.rows.clear();
          state.displayRows.clear();
          DATA_COMPONENTS.forEach((component) => player.getPacketSender().sendString("[]", uid(component)));
          player.getPacketSender().sendString(`Target: ${safe(state.target.getUsername())} (offline)`, uid(C.TARGET));
          clearContainer(player, state);
          emptyPanel(player, state);
        }
        return;
      }
      const name = CONTAINERS[state.section - SECTION.INVENTORY];
      const fingerprint = Containers.viewFingerprint(core, state.target, name);
      if (state.containerFingerprint === fingerprint) return;
      state.containerFingerprint = fingerprint;
      state.selected = null;
      sendRows(player, state);
    }
    function logout({ player }) {
      cancelPrompt(player, sessions.get(player));
      sessions.delete(player);
      if (player.getAttribute(CLOSE_ON_INTERFACE_CLOSE_ATTRIBUTE) === GROUP_ID) player.setAttribute(CLOSE_ON_INTERFACE_CLOSE_ATTRIBUTE, null);
    }
    function closed({ player, interfaceId }) {
      if (interfaceId === WORLD_MAP_GROUP_ID && sessions.has(player)) sessions.get(player).mapTarget = null;
      if (interfaceId === GROUP_ID) logout({ player });
    }
    function opened({ player, groupId }) {
      if (groupId !== GROUP_ID && sessions.has(player) && player.getInterfaceId() !== GROUP_ID) logout({ player });
    }
    function attach(pluginApi) {
      pluginApi.registerCustomInterface(Layout.buildInterface(pluginApi.core.CacheDefinitions.getEnumValues(SKILL_ICON_ENUM), pluginApi.core.CacheDefinitions.getEnumValues(EQUIPMENT_EMPTY_ICON_ENUM)));
      pluginApi.registerCommand("admin", openAdmin, pluginApi.core.PlayerRights.ADMINISTRATOR, "Open the in-game admin panel");
      pluginApi.onInterfaceActionButton(TAB_BUTTONS, clickTab);
      pluginApi.onInterfaceActionButton(BotView.components.map(uid), clickBot);
      pluginApi.onInterfaceActionButton(ROW_BUTTONS, selectRow);
      pluginApi.onInterfaceActionButton(ACTION_BUTTONS, clickAction);
      pluginApi.onInterfaceActionButton(UTILITY_BUTTONS, clickUtility);
      pluginApi.onInterfaceActionButton(ContainerView.slotComponents().map(uid), clickSlot);
      pluginApi.onInterfaceActionButton(Array.from({ length: 10 }, (_, i) => [uid(V.BANK_TAB_START + i), uid(V.BANK_TAB_LABEL_START + i)]).flat(), clickBankTab);
      pluginApi.onInterfaceActionButton(uid(C.TARGET_BUTTON), findPlayer);
      pluginApi.onInterfaceActionButton(uid(C.SELF_BUTTON), useSelf);
      pluginApi.onInterfaceActionButton(SKILL_BUTTONS, clickSkill);
      pluginApi.onInterfaceActionButton(PRESET_BUTTONS, clickPreset);
      pluginApi.onCustomEvent("player:widget-action", searchSocket);
      pluginApi.onCustomEvent("player:world-input", mapTeleport);
      pluginApi.onCustomEvent("admin:open", openFromEvent);
      pluginApi.onInterfaceActionButton([uid(C.MAP_TELEPORT), uid(C.MAP_TELEPORT_LABEL)], openTeleportMap);
      pluginApi.onCustomEvent("interface:closed", closed);
      pluginApi.onCustomEvent("interface:opened", opened);
      pluginApi.onPlayerLogout(logout);
      pluginApi.onPlayerProcess(refreshLive);
      pluginApi.onInterfaceActionButton(Layout.SECTION_LABELS.flatMap((_, i) => [uid(C.SECTION_START + i), uid(C.SECTION_LABEL_START + i)]), clickSection);
      pluginApi.onInterfaceActionButton([uid(C.ADD_ITEMS), uid(C.ADD_ITEMS_LABEL)], addItems);
      pluginApi.onInterfaceActionButton([uid(C.CONTAINER_ADD), uid(C.CONTAINER_ADD_LABEL)], addItems);
      pluginApi.onInterfaceActionButton(Layout.SPAWN_LABELS.flatMap((_, i) => [uid(C.SPAWN_START + i), uid(C.SPAWN_LABEL_START + i)]), clickSpawnKind);
      pluginApi.onServerStartup(start.bind(null, pluginApi));
    }
    module2.exports = attach;
    module2.exports._test = { Layout, TAB, SECTION, BotView };
  }
});

// server/plugins/tools/AdminPanel.entry.js
var register = require_Controller_AdminPanel();
module.exports = {
  name: "AdminPanel",
  category: "@ Ghost Plugins @",
  description: "Native ::admin panel for Admin, Owner and Developer accounts: players, direct teleports, pictured items and NPCs, live player editing, cheats and bot deployment.",
  register
};
