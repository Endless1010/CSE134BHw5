// Theme switch for the portfolio. Loaded without defer in <head> so the saved
// theme is applied before the page paints (no flash of the wrong theme).
// form-no-js.html never loads this file; it always uses the default light theme.
const themeKey = "theme";
const root = document.documentElement;

function readSavedTheme() {
    try {
        const saved = localStorage.getItem(themeKey);
        return saved === "dark" || saved === "light" ? saved : "light";
    } catch (error) {
        // Storage blocked: fall back to the default theme.
        return "light";
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(themeKey, theme);
    } catch (error) {
        console.warn("The theme preference could not be saved.");
    }
}

function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
}

// Apply first, independent of whether saving works.
let currentTheme = readSavedTheme();
applyTheme(currentTheme);

function addToggle() {
    const header = document.querySelector("body > header");
    if (!header) {
        return;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.id = "theme-toggle";

    function updateLabel() {
        button.textContent = currentTheme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    }

    button.addEventListener("click", function () {
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        const change = function () {
            currentTheme = nextTheme;
            applyTheme(nextTheme);
            updateLabel();
        };
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // Same-document view transition where supported; otherwise change directly.
        if (document.startViewTransition && !reducedMotion) {
            document.startViewTransition(change);
        } else {
            change();
        }
        saveTheme(nextTheme);
    });

    updateLabel();
    header.appendChild(button);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addToggle);
} else {
    addToggle();
}
