# leppi-board

An empty dashboard shell: a sidebar, a top bar and a panel, in a dark and a light theme. What goes inside is up to you — a task board, a chart, a table, an embedded app, any React component. One file says what's in the sidebar; everything else is pages.

Made from the dashboards Igor kept rebuilding for different projects: a proposal with plan variants, a sprint board, a personal kit. The inside was different every time, the frame was the same.

## Quick start

```bash
npm install
npm run dev        # → http://localhost:6010
npm run build      # checks the types, builds a static site into dist/
```

Node **22.12** or newer (Vite 8). Another port: `PORT=6011 npm run dev`.

## Add a page

1. Make a component in `src/pages/`, for example `src/pages/notes.tsx` that exports `NotesPage`.
2. Add one line to a group in `src/shell.config.tsx`:
   ```tsx
   { id: "notes", title: "Notes", icon: FileIcon, component: NotesPage },
   ```
3. Open it from the sidebar, or straight by the address: `#notes`.

The page gets the whole panel under the top bar and draws whatever it wants there.

## `src/shell.config.tsx`

| field | what it is |
|---|---|
| `title`, `subtitle` | The sidebar header; `title` is also the browser tab. |
| `home` | The page that opens without `#` in the address. Default: the first one. |
| `groups` | Runs of pages in the sidebar, each with an optional grey `label`. |

A page:

| field | | what it is |
|---|---|---|
| `id` | required | In the address: `#id`. |
| `title` | required | The sidebar item and the top bar. |
| `component` | required | What the page shows. |
| `subtitle` | | Grey text after the title in the top bar. |
| `note` | | Small grey text at the right end of the sidebar item: a date, a count. |
| `icon` | | An icon from `src/icons`. |

A group can be generated from data — the board example makes one page per sprint (`boardPages()` in `src/pages/board/index.tsx`).

## What's in the folder

```
src/
├── shell.config.tsx     ← the name, the sidebar, the pages — the file you edit
├── pages/               ← your pages; every one here is an example
│   ├── start.tsx        ← a text page: the shell's short manual
│   ├── dashboard/       ← numbers, a bar chart, a ranked list — data.json
│   ├── table/           ← a filter, a search, sorting by any column — data.json
│   ├── compare/         ← options side by side, as columns or a table — data.json
│   ├── embed.tsx        ← any site or app in a frame
│   └── board/           ← a task board with sprints — board.json
├── App.tsx              ← the shell: sidebar, top bar, routing by #
├── shell/types.ts       ← the config's types
├── components/          ← the sidebar, buttons, tabs, cards (shadcn + Fluid Functionalism), the page header
└── icons/               ← filled icons from Deslop Icons; a new one — a file from the catalogue + a line in index.tsx
```

## The examples

Each example page reads its own `data.json` — change the data and keep the page, or copy the page and make it yours.

- **Dashboard** — `stats` (text values as they are, a `trend` like `+9%`; `goodWhenDown` for numbers that should fall), `chart.points` and `list.items` (numbers). No chart library: bars are plain blocks, so they follow the theme.
- **Table** — `columns` say what to show and how: `text` (with an optional grey `sub` line), `number`, `date` (`YYYY-MM-DD`) or `status` (a coloured label from `statuses`). The filter goes by `filterBy`, the first sort by `sortBy`. The search looks through every field.
- **Compare** — `variants` are the options, each row in `groups` says per option: `true`, `false` or a short text. Two views: columns and a table.
- **Embed** — `<EmbedPage src="…" />` in the config, here an OpenStreetMap map; `width={390}` makes a centred, phone-wide frame, `gray` shows the site in greys. A site can forbid being framed (`X-Frame-Options`), then only the link above the frame works.

### The board

`src/pages/board/board.json` — columns, sprints, areas, tags and cards. A card: `id`, `column`, `title`, and optionally `sprint`, `text` (markup: `**bold**`, `` `code` ``, `[link](…)`), `area`, `tags`, `priority` (`P1`–`P3`, shown as bars), `added` (`YYYY-MM-DD`), `done` ("What's done"), `check` ("How to check", a list), `images` (files in `public/board/`). The order in a column is the order in the list.

`src/pages/board/board-sync.md` is a rule for a coding agent (Claude Code) to keep the board as the work goes: a new request becomes a card, a finished task moves to Review with "What's done" and "How to check". Copy it into your project's agent rules.

Not needed? Delete `src/pages/board/` and its line in `src/shell.config.tsx`.

## Publish

Vercel: import the repository and deploy — `vercel.json` has the settings (Vite, `npm ci`, `npm run build`, `dist`). If the shell lives in a subfolder of a bigger repository, set **Root Directory** to that folder. Any static hosting works too: pages live after `#`, so there are no rewrites to set up.

The page has `noindex`: it's a working dashboard, not a page for search engines. Remove the line in `index.html` to let them in. A published shell is public to anyone with the link.

## Built with

- [shadcn/ui](https://ui.shadcn.com) and [Fluid Functionalism](https://www.fluidfunctionalism.com) (MIT) — the sidebar, buttons, tabs and cards, from the `@fluid` registry.
- [Deslop Icons](https://mishanaer-icons.vercel.app) — the filled icon set.
- [Inter](https://rsms.me/inter/) (OFL), React 19, Tailwind 4, Vite 8.

## License

MIT — see [LICENSE](LICENSE). Take it, change it, use it anywhere; keep the copyright line.
