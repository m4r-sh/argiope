import { fx } from "orbz";
import { SHADE_NAMES, saturationOffsetFor } from "./src/color-math.js";
import {
  DEFAULT_THEMES,
  cloneTheme,
  hydrateTheme,
  migrateLegacyTheme,
  serializeTheme,
} from "./src/defaults.js";
import { neovimAdapter, neovimSetupLua, themeId } from "./src/adapters/neovim.js";
import { Studio } from "./src/shapes/studio.js";

const studio = Studio({ theme: cloneTheme(DEFAULT_THEMES[0].theme) });
let activeId = DEFAULT_THEMES[0].id;
let exportId = DEFAULT_THEMES[0].id;
let exportParent;
let savedThemes = readSavedThemes();

const root = document.documentElement;
const themeList = document.querySelector("#theme-list");
const editor = document.querySelector("#controls");
const languageControls = document.querySelector("#language-controls");
const cssOutput = document.querySelector("#css-output");
const strategyBadge = document.querySelector("#strategy-badge");
const themeTitle = document.querySelector("#theme-title");
const swatches = document.querySelector("#swatches");
const status = document.querySelector("#status");

function readSavedThemes() {
  try {
    const current = localStorage.getItem("argiope-palettes-v2");
    if (current) return JSON.parse(current);
    return JSON.parse(localStorage.getItem("argiope-palettes") || "[]")
      .map(entry => ({ ...entry, state: migrateLegacyTheme(entry.state) }));
  } catch {
    return [];
  }
}

function persistSavedThemes() {
  localStorage.setItem("argiope-palettes-v2", JSON.stringify(savedThemes));
}

function entryName(entry) {
  return entry.theme?.name ?? entry.state.name;
}

function entryStrategy(entry) {
  return entry.theme?.strategy ?? entry.state.strategy;
}

function loadTheme(entry) {
  activeId = entry.id;
  exportId = entry.builtIn ? entry.id : entry.configId ?? themeId(entryName(entry));
  exportParent = entry.builtIn ? undefined : entry.extends ?? "aurantia";
  studio.theme = entry.theme ? cloneTheme(entry.theme) : hydrateTheme(entry.state);
  renderThemeList();
  renderLanguageControls();
  syncControls();
}

function renderThemeList() {
  themeList.replaceChildren();
  for (const entry of [...DEFAULT_THEMES, ...savedThemes]) {
    const row = document.createElement("div");
    row.className = `theme-row${entry.id === activeId ? " is-active" : ""}`;
    const button = document.createElement("button");
    button.className = "theme-button";
    button.innerHTML = `<span class="theme-dot"></span><span>${entryName(entry)}</span><small>${entryStrategy(entry)}</small>`;
    button.addEventListener("click", () => loadTheme(entry));
    row.append(button);
    if (!entry.builtIn) {
      const remove = document.createElement("button");
      remove.className = "remove-theme";
      remove.setAttribute("aria-label", `Delete ${entryName(entry)}`);
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        savedThemes = savedThemes.filter(item => item.id !== entry.id);
        persistSavedThemes();
        if (activeId === entry.id) loadTheme(DEFAULT_THEMES[0]);
        else renderThemeList();
      });
      row.append(remove);
    }
    themeList.append(row);
  }
}

function range(label, field, min, max) {
  return `<label class="range-control">${label}<input type="range" min="${min}" max="${max}" data-field="${field}" /><output></output></label>`;
}

function renderLanguageControls() {
  languageControls.replaceChildren();
  studio.theme.languageEntries.forEach(([key, language], index) => {
    const details = document.createElement("details");
    details.className = "palette-tuner";
    details.dataset.language = key;
    details.open = index === 0;
    details.innerHTML = `<summary>${language.label} <small>${language.kind}</small></summary>${
      language.kind === "explicit"
        ? `<div class="color-grid">${SHADE_NAMES.map(shade =>
          `<label class="color-control"><input type="color" data-ramp="${shade}" />${shade.replace("_", " ")}</label>`
        ).join("")}</div>`
        : `${range("Hue", "hue", 0, 359)}
          ${range("Hue spread", "hueSpread", -200, 200)}
          ${range("Ramp spread", "spread", 0, 200)}
          ${range("Saturation", "saturation", 0, 100)}
          ${range("Luminance", "luminanceOffset", -30, 30)}`
    }`;
    languageControls.append(details);
  });
}

function syncControls() {
  editor.querySelector("[data-theme-key=name]").value = studio.theme.name;
  for (const input of editor.querySelectorAll("[data-base-key]")) {
    input.value = studio.theme.base[input.dataset.baseKey];
  }
  for (const details of languageControls.querySelectorAll("[data-language]")) {
    const language = studio.theme.languages.at(details.dataset.language);
    for (const input of details.querySelectorAll("[data-ramp]")) {
      input.value = language.ramp[input.dataset.ramp];
    }
    for (const input of details.querySelectorAll("[data-field]")) {
      input.value = input.dataset.field === "saturation"
        ? Math.round(language.effectiveSaturation * 100)
        : language[input.dataset.field];
      input.closest("label").querySelector("output").value = input.value;
    }
  }
}

function renderSwatches() {
  swatches.replaceChildren();
  for (const [, language] of studio.theme.languageEntries) {
    const group = document.createElement("div");
    group.className = "swatch-group";
    group.innerHTML = `<span>${language.label}</span>`;
    for (const shade of ["darkest", "muted", "main", "accent", "bright", "light"]) {
      const chip = document.createElement("i");
      chip.style.background = language.colors[shade];
      chip.title = `${language.label}.${shade}: ${language.colors[shade]}`;
      group.append(chip);
    }
    swatches.append(group);
  }
}

function markDraft() {
  activeId = "draft";
  renderThemeList();
}

function flash(message) {
  status.textContent = message;
  clearTimeout(flash.timer);
  flash.timer = setTimeout(() => { status.textContent = ""; }, 2200);
}

editor.addEventListener("input", event => {
  const input = event.target;
  if (input.dataset.themeKey) {
    studio.theme[input.dataset.themeKey] = input.value;
  } else if (input.dataset.baseKey) {
    studio.theme.base[input.dataset.baseKey] = input.value;
  } else if (input.dataset.ramp) {
    const details = input.closest("[data-language]");
    studio.theme.languages.at(details.dataset.language).ramp[input.dataset.ramp] = input.value;
  } else if (input.dataset.field) {
    const details = input.closest("[data-language]");
    const language = studio.theme.languages.at(details.dataset.language);
    if (input.dataset.field === "saturation") {
      language.saturationOffset = saturationOffsetFor(
        language.baselineSaturation,
        Number(input.value) / 100,
      );
    } else {
      language[input.dataset.field] = Number(input.value);
    }
    input.closest("label").querySelector("output").value = input.value;
  } else {
    return;
  }
  markDraft();
});

document.querySelector("#save-theme").addEventListener("click", () => {
  const state = serializeTheme(studio.theme);
  const id = `theme-${Date.now()}`;
  const configId = themeId(state.name);
  const extendsId = exportParent ?? exportId;
  savedThemes.push({ id, configId, extends: extendsId, builtIn: false, state });
  persistSavedThemes();
  activeId = id;
  exportId = configId;
  exportParent = extendsId;
  renderThemeList();
  flash(`Saved ${state.name}`);
});

document.querySelector("#copy-theme").addEventListener("click", async () => {
  await navigator.clipboard.writeText(neovimSetupLua(studio.theme, {
    id: exportId,
    extends: exportParent,
  }));
  flash("Neovim Lua copied");
});

document.querySelector("#copy-json").addEventListener("click", async () => {
  const payload = JSON.stringify({
    palette: serializeTheme(studio.theme),
    neovim: neovimAdapter(studio.theme),
  }, null, 2);
  await navigator.clipboard.writeText(payload);
  flash("Portable JSON copied");
});

fx(() => {
  for (const [name, value] of Object.entries(studio.theme.cssVariables)) {
    root.style.setProperty(name, value);
  }
  themeTitle.textContent = studio.theme.name;
  strategyBadge.textContent = studio.theme.strategy;
  cssOutput.textContent = studio.theme.cssText;
  renderSwatches();
});

renderThemeList();
renderLanguageControls();
syncControls();
