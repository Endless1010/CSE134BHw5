<img width="1457" height="697" alt="image" src="https://github.com/user-attachments/assets/7bf21fbe-011a-4f7e-8e90-517f3ff4549e" />| Field | Value |
| --- | --- |
| Repository URL | https://github.com/Endless1010/CSE134BHw4 |
| Deployed URL | https://cse134bhw4bowen.netlify.app/ |

# CSE 134B HW4: Bowen Wu

The HW3 portfolio plus a behavior layer: a contact form (without and with JavaScript), theme switching, and view transitions.

## Where to find each part

| Part | What | Where |
| --- | --- | --- |
| 1 and 2 | Contact form using only HTML and CSS: native fields, labels, `required`, `minlength`/`maxlength`, `:user-invalid`/`:user-valid` styling. No JavaScript. | `form-no-js.html` |
| 3 | Same form enhanced with JavaScript: Constraint Validation API messages, error and info areas, character counter, `form_errors` history sent as `form-errors`. | `form-with-js.html`, `form.js` |
| 4.1 | Light/dark theme switch saved in `localStorage`. | `js/theme.js`, `css/styles.css` |
| 4.2 | View transitions: a same-document transition on the theme switch and cross-document page navigation. | `js/theme.js`, `css/styles.css` |

Both forms are linked from the main navigation ("Form (no JS)" and "Form (with JS)") and submit with `POST` to `https://httpbin.org/post`.

## Files

- `form-no-js.html`: script-free form. It always uses the default light theme and loads no JavaScript.
- `form-with-js.html` + `form.js` (repository root): enhanced form, loaded with `defer`. No frameworks or libraries.
- `js/theme.js`: theme switch, loaded in the `<head>` so the saved theme applies before the page paints. Not loaded by `form-no-js.html`.
- `css/styles.css`: shared stylesheet for every page, including the dark theme variables and view transition rules.
- Everything else: the HW3 portfolio (`index.html`, `about.html`, `projects.html`, `experience.html`, `contact.html`, `experiments.html`, `projects/`).

## Design notes

- **Progressive enhancement.** `form-no-js.html` works on its own. On `form-with-js.html`, the error, info and counter areas are `hidden` until `form.js` runs, and the theme button is created by JavaScript, so nothing empty or misleading shows without it. HTML validation and the normal POST still work if the script fails.
- **Error history.** `form_errors` records the field and error type for each invalid field on each failed submission, using capturing `invalid` listeners. It never stores the name, email, or message text. It is serialized into a hidden `form-errors` field only when the form is valid.
- **Themes.** All colors are CSS custom properties. The default is light, not the OS preference. Saving to `localStorage` is wrapped in `try/catch`, and the theme is applied even if saving fails.
- **View transitions.** The theme switch uses `document.startViewTransition()` when available, and cross-document navigation opts in with `@view-transition { navigation: auto; }`. Both are disabled under `prefers-reduced-motion: reduce`, and the underlying interactions still work.
- **Earlier work.** `part1/` holds the HW3 CSS warm-up. HW2 and HW3 live in their own repositories and deployments.
