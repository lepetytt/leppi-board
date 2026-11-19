import { Fragment } from "react"
import { TINT_HEADER } from "@/components/blocks"
import { cn } from "@/lib/utils"

/** Markup in a line of text: `**bold**`, `` `code` ``, `[link](#anchor)` or `[link](https://…)` —
 *  an external one opens in a new tab. The rest is as is; a line break `\n` makes a paragraph (whitespace-pre-line). */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith("`")) {
          return (
            <code key={i} className={cn("rounded px-1 py-px font-mono text-[0.9em] text-foreground", TINT_HEADER)}>
              {part.slice(1, -1)}
            </code>
          )
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (link) {
          return (
            <a
              key={i}
              href={link[2]}
              {...(link[2].startsWith("http") && { target: "_blank", rel: "noreferrer" })}
              className="text-foreground underline decoration-foreground/30 underline-offset-2 hover:decoration-foreground">
              {link[1]}
            </a>
          )
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}
