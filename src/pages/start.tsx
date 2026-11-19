import { Block, BlockTitle, TINT_HEADER } from "@/components/blocks"
import { Inline } from "@/components/inline"
import { cn } from "@/lib/utils"

/*
 * Example: a plain text page. It's also the shell's own short manual — keep it, rewrite it or delete it
 * (with its line in `src/shell.config.tsx`).
 */

const ADD_PAGE = `{ id: "notes", title: "Notes", icon: FileIcon, component: NotesPage },`

function Code({ children }: { children: string }) {
  return (
    <pre className={cn("overflow-x-auto rounded-lg px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-foreground", TINT_HEADER)}>
      {children}
    </pre>
  )
}

function Steps({ items, start }: { items: string[]; start?: number }) {
  return (
    <ol start={start} className="flex list-decimal flex-col gap-1.5 pl-5 text-[13.5px] leading-relaxed text-foreground/80 marker:text-muted-foreground">
      {items.map((t) => (
        <li key={t}>
          <Inline text={t} />
        </li>
      ))}
    </ol>
  )
}

export function StartPage() {
  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4 px-6 pt-6 pb-12">
      <header className="flex flex-col gap-2 pb-2">
        <h1 className="text-[22px] font-semibold tracking-tight">Start here</h1>
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          This is an empty shell: a sidebar, a top bar and this panel. What goes inside is up to you — a board, a chart, a
          table, an embedded app, any React component. One file says what's in the sidebar; everything else is pages.
        </p>
      </header>

      <Block>
        <BlockTitle>Add a page</BlockTitle>
        <Steps
          items={[
            "Make a component in `src/pages/`, for example `src/pages/notes.tsx` that exports `NotesPage`.",
            "Add one line to a group in `src/shell.config.tsx`:",
          ]}
        />
        <Code>{ADD_PAGE}</Code>
        <Steps start={3} items={["Open it from the sidebar, or straight by the address: `#notes`."]} />
      </Block>

      <Block>
        <BlockTitle>What's in the box</BlockTitle>
        <ul className="flex flex-col gap-1.5 text-[13.5px] leading-relaxed text-foreground/80">
          <li>
            <Inline text="`src/shell.config.tsx` — the name, the sidebar and its pages. The only file you have to touch." />
          </li>
          <li>
            <Inline text="`src/pages/` — your pages. Every page in the sidebar is an example — a dashboard, a table, a comparison, an embedded app, a board: change them, copy them or delete them." />
          </li>
          <li>
            <Inline text="`src/App.tsx`, `src/components/` — the shell itself: the sidebar, the top bar, the light and dark theme." />
          </li>
        </ul>
      </Block>

      <Block>
        <BlockTitle>Run and publish</BlockTitle>
        <Steps
          items={[
            "`npm install`, then `npm run dev` — the shell opens at `http://localhost:6010`.",
            "`npm run build` checks the types and builds a static site into `dist/`.",
            "On Vercel: import the repository and deploy — `vercel.json` has the settings. Any static hosting works too: pages live after `#`, so there's nothing to rewrite.",
          ]}
        />
      </Block>
    </div>
  )
}
