# Interactive Principles

A deck of learning science principles for designing transformational games.

Live site: https://eharpste.github.io/interactive-principles/

---

## How this is organized

- **`src/principles.json`** — the content of every card (principle name, description, questions, examples, etc). Each entry has a `categoryId` linking it to a category.
- **`src/categories.json`** — the list of categories (id, name, color). Card and filter-button colors are derived automatically from each category's color, so adding, renaming, or recoloring a category doesn't require touching any component or stylesheet.
- **`src/components/`** — the React app. `Principles.js` is the main card-deck view; `Admin.js` (and `src/components/admin/`) is the content editor described below.
- **`config/`** and **`webpack.config.js`** — the webpack 5 build setup (dev vs. prod configs get merged with `config/webpack.common.config.js`).
- **`.github/workflows/deploy.yml`** — builds the site and publishes it to the `gh-pages` branch automatically on every push to `master`. This is what GitHub Pages actually serves.

## Editing content

There are two ways to edit the cards and categories:

### 1. From the deployed site (no local setup needed)

Go to **https://eharpste.github.io/interactive-principles/#/admin**. You'll be asked for a GitHub personal access token:

1. Go to [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new).
2. Under **Repository access**, choose "Only select repositories" and pick `eharpste/interactive-principles`.
3. Click **Repository permissions** to expand it (it's collapsed by default).
4. Find **Contents** in the list and change it from "No access" to **"Read and write"**.
5. Scroll down, click **Generate token**, and paste it into the admin page.

(If that page is confusing, a [classic token](https://github.com/settings/tokens/new) with the `repo` scope checked also works, though it grants broader access than just this repo.)

The token is only stored in your browser's local storage and is only ever sent to `api.github.com`. From there you can add/edit/delete principle cards and categories; **Save Changes** commits directly to `master`, which triggers an automatic rebuild and redeploy (usually live within a minute or two). Note that `master` needs to already have `src/categories.json` and `src/principles.json` for this to work — until this feature branch is merged, the admin page will 404 trying to load them.

### 2. Editing the JSON directly

`src/principles.json` and `src/categories.json` are plain JSON — you can also edit them directly on github.com (or locally) and push to `master`; the same GitHub Actions workflow will rebuild and redeploy.

## Local development

Requires Node.js (LTS). Then:

```bash
npm install
npm start
```

This runs the dev server at `http://localhost:9000`.

To produce a production build locally (rarely needed now that CI deploys automatically):

```bash
npm run build:prod
```

Output goes to `public/`.

## Deployment

Deployment is fully automatic: any push to `master` (including a save from the admin page) triggers `.github/workflows/deploy.yml`, which builds the site and publishes `public/` to the `gh-pages` branch — the branch GitHub Pages actually serves. There's normally no need to run `npm run deploy` locally anymore.

## Analytics

Usage is counted with [GoatCounter](https://www.goatcounter.com) (cookie-free, no personal data). The code is in `src/utils/analytics.js`.

**Setup:** create a site at goatcounter.com and put its code (the `xyz` in `xyz.goatcounter.com`) in `GOATCOUNTER_CODE` at the top of `src/utils/analytics.js`. While that's empty, nothing is sent. Analytics only runs in the production build; in `npm start` the events are logged to the browser console instead (`[analytics] ...`), and GoatCounter itself ignores `localhost`.

**What's recorded:**

| GoatCounter path | Kind | Title | Meaning |
|---|---|---|---|
| `/`, `/about` | pageview | page name | Page visits |
| `/card/<id>` | pageview | `<id>: <principle>` | A card was opened (every card now has a shareable link, e.g. `#/card/12`) |
| `open-card/<source>` | event | `<id>: <principle>` | How a card was opened: `grid`, `random`, `related`, `next`, `prev` |
| `flip-card` | event | `<id>: <principle>` | A card in the grid was flipped to its detail side |
| `toolbar/<action>` | event | (`draw-5`: the ids drawn) | `reset`, `flip-all`, `sort-az`, `sort-numeric`, `shuffle`, `draw-5` |
| `filter/<category>` | event | `hide` / `show` | A category filter was toggled |
| `outbound/<target>` | event | card, or `card <id>: <url>` for citations | Clicks on `example-game`, `citation`, `ohlab`, `learnlab` |

Only the first pageview of a visit records the external referrer (e.g. a course site), so referrer counts are per visit. The `/admin` page isn't counted.

**Excluding your own visits:** open the live site with `#toggle-goatcounter` at the end of the URL (or run `localStorage.setItem('skipgc', 't')` in the browser console). This is per browser.

**Exporting data:** in GoatCounter's site settings, enable **Individual pageviews**; then use Settings → Export for a CSV (one row per pageview/event with path, title, event flag, browser, OS, session, referrer, screen size, region and timestamp), or the API (`/api/v0/export`, which supports incremental exports from the last row ID). Keep raw exports out of this public repo.

---

## Developed With

* [React](https://reactjs.org/) - UI library
* [Webpack 5](https://webpack.js.org/) - Module bundler
* [Babel 7](https://babeljs.io/) - JavaScript transpiler
* [Dart Sass](https://sass-lang.com/dart-sass/) - CSS metalanguage

---

## Authors

* **Katie McTigue** - *Original Design + Dev* - [kaitlinmctigue.github.io](https://kaitlinmctigue.github.io/#/)
