# HW5 Part 4: Eleventy exercise

Eleventy (11ty) builds two pages from the portfolio, **Home** (`index.html`) and **About** (`about.html`).

- Layout: `src/_includes/base.njk` (header, `<main>`, and the shared footer)
- Shared section: `src/_includes/footer.njk`, included by the layout so both pages use it
- Pages: `src/index.njk`, `src/about.njk`
- Assets: `src/css`, `src/js`, `src/images` are copied unchanged

## Commands

Run these inside `ssg-exercise/` (Node 18+):

```sh
npm install        # install dependencies
npm run build      # build the site into _site/
npm start          # build, serve at http://localhost:8080/, and rebuild on changes
```

To preview a plain build instead, run `npx http-server _site` (or any static server) after `npm run build`, then open `index.html` and `about.html`.

## Verify the shared section

Edit `src/_includes/footer.njk` (for example, change the copyright line), run `npm run build`, and refresh both pages. Both footers change.
