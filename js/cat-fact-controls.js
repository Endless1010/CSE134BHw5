// Page-level control for <cat-fact-panel>. The button lives outside the custom
// element and toggles its `compact` attribute. The choice is saved in
// localStorage; restoring it uses the same function as the button click.
const MODE_KEY = "hw5-cat-fact-panel-mode";
const MODES = ["expanded", "compact"];
const DEFAULT_MODE = "expanded";

const panel = document.querySelector("cat-fact-panel");
const toggle = document.querySelector("#cat-fact-mode-toggle");

function readMode() {
  try {
    const saved = localStorage.getItem(MODE_KEY);
    return MODES.includes(saved) ? saved : DEFAULT_MODE;
  } catch (error) {
    // Storage blocked or unavailable: use the default.
    return DEFAULT_MODE;
  }
}

function saveMode(mode) {
  try {
    localStorage.setItem(MODE_KEY, mode);
  } catch (error) {
    console.warn("The cat fact panel preference could not be saved.");
  }
}

// Single path for both the click and the restore: set the attribute with
// toggleAttribute(name, force) and let the component react.
function applyMode(mode) {
  const compact = mode === "compact";
  panel.toggleAttribute("compact", compact);
  toggle.textContent = compact ? "Show details" : "Hide details";
}

if (panel && toggle) {
  applyMode(readMode());
  toggle.hidden = false;

  toggle.addEventListener("click", () => {
    const next = panel.hasAttribute("compact") ? "expanded" : "compact";
    applyMode(next); // apply immediately, even if saving fails
    saveMode(next);
  });
}
