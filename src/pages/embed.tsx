import { cn } from "@/lib/utils"

/*
 * Example: any site or app inside the shell — a prototype, a Figma file, a Looker report, a Notion page.
 * Give it the address in `src/shell.config.tsx`; `width` makes a centred frame (390 — a phone);
 * `gray` drains the colour out of it, so a bright site sits quietly in the shell.
 * A site can forbid being framed (X-Frame-Options): then the frame stays empty and only the link works.
 */
export function EmbedPage({ src, width, gray }: { src: string; width?: number; gray?: boolean }) {
  const host = new URL(src).host
  return (
    <div className="flex h-[calc(100svh-4rem)] w-full flex-col px-6 pt-2 pb-6">
      <div className="flex shrink-0 items-center gap-3 pb-3 text-[12px] text-muted-foreground">
        <span className="truncate">{host}</span>
        <a href={src} target="_blank" rel="noreferrer" className="ml-auto shrink-0 hover:text-foreground">
          Open in a new tab ↗
        </a>
      </div>
      <div className={cn("min-h-0 flex-1", width && "flex justify-center")}>
        <iframe
          src={src}
          title={host}
          className={cn("h-full w-full rounded-2xl border border-foreground/[0.08] bg-white", gray && "grayscale")}
          style={width ? { width, maxWidth: "100%" } : undefined}
        />
      </div>
    </div>
  )
}
