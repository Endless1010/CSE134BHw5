| Field | Value |
| --- | --- |
| Repository URL | https://github.com/Endless1010/CSE134BHw5 |
| Deployed URL | https://cse134bhw5bowen.netlify.app/ |
| Component page | https://cse134bhw5bowen.netlify.app/ (home page) |

# CSE 134B HW5: Bowen Wu

The HW4 portfolio plus a Web Component (`<cat-fact-panel>`) and a static site generator exercise.

## Where to find each part

| Part | What | Where |
| --- | --- | --- |
| 1 | Custom element built with DOM methods; an outside button toggles the observed `compact` attribute. | `js/cat-fact-panel.js`, `js/cat-fact-controls.js`, `index.html` ("Cat fact of the moment") |
| 2 | Live data from the Cat Facts API (`https://catfact.ninja/fact`) with loading, success, error, and retry states. | `js/cat-fact-panel.js` |
| 3 | `--panel-*` custom properties with fallbacks; compact/expanded preference saved in `localStorage` under `hw5-cat-fact-panel-mode`. | `css/styles.css`, `js/cat-fact-controls.js` |
| 4 | Eleventy project that builds Home and About with one shared footer. | `ssg-exercise/` |

## SSG exercise

Folder: `ssg-exercise/`. Pages to preview: **Home** (`index.html`) and **About** (`about.html`). Install, build, and preview commands are in [`ssg-exercise/README.md`](ssg-exercise/README.md):

```sh
cd ssg-exercise
npm install
npm run build
npm start      # preview at http://localhost:8080/
```

## Design note

**What the visitor wants.** To see a fun random cat fact, get another one when they want it, and choose how much of the panel they see (details shown or hidden).

**One action, traced.** The visitor activates "Tell me something about cats" inside `<cat-fact-panel>`:

1. The button's click listener calls `loadFact()`. It disables the button, sets the `role="status"` paragraph to "Loading a cat fact…", and starts an 8 second timeout.
2. `fetch("https://catfact.ninja/fact")` sends a `GET` request asking for JSON.
3. The component throws unless `response.ok` is true and the parsed JSON has a non-empty string `fact`. Network failures, timeouts, and invalid JSON also land in the `catch` block.
4. On success, the fact is placed in the page with `textContent` (never `innerHTML`), the details line is updated, and the status reads "New cat fact loaded."
5. In every case the button is re-enabled, so the visitor can try again.

**While waiting:** the button is disabled and the status says "Loading a cat fact…". **On success:** the new fact replaces the old one and the status confirms it. **On failure:** the previous fact stays, the status says "Could not load a cat fact. Check your connection and try again." in the error color, and the button becomes "Try again". A retry works without reloading the page, and the error message clears on success.

**Page control.** The "Hide details" / "Show details" button sits outside the element and calls `toggleAttribute("compact")`. The component lists `compact` in `observedAttributes` and hides or shows its details line in `attributeChangedCallback()`. The choice is saved to `localStorage`; on load the same `applyMode()` function restores it. Reads and writes are wrapped in `try`/`catch`, so a blocked or failing storage still lets the button work for the current page.

**Without JavaScript.** The rest of the portfolio is unaffected. A `<noscript>` message says "Enable JavaScript to load live data for this widget.", and the page-control button stays hidden.

**Theming.** The component reads `--panel-background`, `--panel-text`, `--panel-border`, `--panel-accent`, and more, each with a fallback. `css/styles.css` sets them from the site's theme variables, so the panel follows the light and dark themes.

## Earlier work

HW4 features (contact forms, theme switch, view transitions) remain: `form-no-js.html`, `form-with-js.html`, `form.js`, `js/theme.js`. `part1/` holds the HW3 CSS warm-up.
