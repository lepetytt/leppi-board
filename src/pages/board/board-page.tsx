import { useEffect, useRef, useState, type RefObject } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Block, TINT_HEADER } from "@/components/blocks"
import { Inline } from "@/components/inline"
import { TabItem, Tabs, TabsList } from "@/components/ui/tabs"
import { XIcon } from "@/icons"
import { board, filtersOf, toneOf, type Card } from "./data"
import { useShape } from "@/lib/shape-context"
import { cn } from "@/lib/utils"

/** Priority as bars: three bars of growing height, filled by importance — P1 three (red), P2 two (amber),
 *  P3 one (grey); the unfilled ones are faint. Colours work in both themes. */
const PRIORITY: Record<NonNullable<Card["priority"]>, { filled: number; className: string }> = {
  P1: { filled: 3, className: "text-red-600 dark:text-red-400" },
  P2: { filled: 2, className: "text-amber-600 dark:text-amber-400" },
  P3: { filled: 1, className: "text-muted-foreground" },
}

function PriorityBars({ priority }: { priority: NonNullable<Card["priority"]> }) {
  const { filled, className } = PRIORITY[priority]
  return (
    <span className={cn("inline-flex h-[22px] items-center", className)} role="img" aria-label={`Priority ${priority}`} title={`Priority ${priority}`}>
      <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden>
        {[5, 8.5, 12].map((h, i) => (
          <rect key={i} x={i * 5} y={12 - h} width="3.5" height={h} rx="1" fill="currentColor" opacity={i < filled ? 1 : 0.2} />
        ))}
      </svg>
    </span>
  )
}

/** The chosen filter is kept in the browser. */
const FILTER_KEY = "board:filter"

function useBoardFilter(): [string, (v: string) => void] {
  const [filter, setFilter] = useState(() => {
    try {
      return localStorage.getItem(FILTER_KEY) ?? "all"
    } catch {
      return "all"
    }
  })
  const choose = (v: string) => {
    setFilter(v)
    try {
      localStorage.setItem(FILTER_KEY, v)
    } catch {
      // not remembered — no harm
    }
  }
  return [filter, choose]
}

const matches = (c: Card, filter: string) => filter === "all" || c.area === filter || (c.tags ?? []).includes(filter)

/** "26.10" from "2026-10-26". */
const shortDate = (iso: string) => iso.slice(8, 10) + "." + iso.slice(5, 7)

/** A column is never narrower than 200 px; narrower — the board scrolls sideways under fades. */
const COL_MIN = 200

/** A sprint's board. Columns without frames, cards toned 1.5 %, headers and cards aligned through subgrid.
 *  No big title — the sprint's name and note are in the top bar (App.tsx); an empty column has only its header;
 *  a card shows the title, priority, tags, area and date, no description. Details open in a centred dialog at any width;
 *  the cross, Esc, a click on the dim or a second click on the card close it. */
export function BoardPage({ sprint }: { sprint: string }) {
  const shape = useShape()
  const [openId, setOpenId] = useState<string | null>(null)
  const [chosen, setFilter] = useBoardFilter()
  // The sprint's cards; the filters come from them (a chosen tag or area missing in this sprint falls back to "All").
  const cards = board.cards.filter((c) => c.sprint === sprint)
  const FILTERS = filtersOf(cards)
  const filter = FILTERS.includes(chosen) ? chosen : "all"
  const open = cards.find((c) => c.id === openId) ?? null
  const close = () => setOpenId(null)

  const scroller = useRef<HTMLDivElement>(null)
  const edges = useScrollEdges(scroller)

  // The board takes the page panel's full height and scrolls by itself, sideways and down: the scrollbar sits at the bottom edge of the screen.
  // Height — the screen minus the panel's margins (8 + 8) and the top bar (48). Fades in the page colour, only on the side
  // there's more to scroll to, and never over the scrollbars.
  return (
    <div className="flex h-[calc(100svh-4rem)] w-full flex-col">
      {/* The filter above the board: "All", tags, areas. One choice; on a narrow screen it scrolls sideways, without a scrollbar. */}
      <div className="shrink-0 overflow-x-auto pt-2 pr-6 pb-1 pl-6 [scrollbar-width:none]">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            {FILTERS.map((f) => (
              <TabItem key={f} value={f} label={f === "all" ? "All" : f} />
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="relative min-h-0 w-full flex-1">
        <div ref={scroller} className="h-full overflow-auto">
          {/* No right padding: when scrolling sideways the browser doesn't add it to the scroll, and the last column hit
              the edge. Instead — an empty 12 px grid track: with the 12 gap it gives the same 24 as on the left. */}
          <div className="max-w-[1180px] pt-2 pb-12 pl-6">
            <div
              className="grid grid-flow-col grid-rows-[auto_1fr] gap-3"
              style={{ gridTemplateColumns: `repeat(${board.columns.length}, minmax(${COL_MIN}px, 1fr)) 12px` }}
            >
              {board.columns.map((col) => {
                const inCol = cards.filter((c) => c.column === col.id && matches(c, filter))
                return (
                  <section key={col.id} className="row-span-2 grid grid-rows-subgrid" aria-label={col.title}>
                    {/* A column header — a 14 px plate, faint; the count even quieter. Headers stick to the top of the board: under the plate
                        the panel's colour (surface-2), cards slide under it. Below the plate — a 24 fade, only when
                        the board is scrolled down. z-20: a card has its own z-10 layer (Card), the header must be above. */}
                    <div className="sticky top-0 z-20 -mt-2 bg-surface-2 pt-2">
                      <div className={cn(shape.container, TINT_HEADER, "px-4 py-2.5")}>
                        <h2 className="text-[14px] font-semibold text-muted-foreground">
                          {col.title}
                          <span className="ml-1.5 text-[12px] font-medium text-muted-foreground/60 tabular-nums">{inCol.length}</span>
                        </h2>
                      </div>
                      <div
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute inset-x-0 top-full h-6 bg-linear-to-b from-surface-2 to-transparent transition-opacity duration-200",
                          edges.top ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      {inCol.map((c) => (
                        <button
                          key={c.id}
                          data-card={c.id}
                          type="button"
                          aria-expanded={c.id === openId}
                          onClick={() => setOpenId((cur) => (cur === c.id ? null : c.id))}
                          className={cn(
                            shape.container,
                            "group block w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          )}
                        >
                          <BoardCard card={c} active={c.id === openId} />
                        </button>
                      ))}
                    </div>
                  </section>
                )
              })}
              {/* The empty track on the right counts in the scroll only when something is in it. */}
              <div aria-hidden className="row-span-2" style={{ gridColumn: board.columns.length + 1 }} />
            </div>
          </div>
        </div>
        <Fade side="left" show={edges.left} bar={edges} />
        <Fade side="right" show={edges.right} bar={edges} />
        <Fade side="bottom" show={edges.bottom} bar={edges} />
      </div>

      {/* Details — a dialog centred over a dim at any width. Background like the page panel (surface-2), width
          up to 560, 16 from the screen edge; a long description scrolls inside. */}
      <Dialog.Root open={open !== null} onOpenChange={(o) => !o && close()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <Dialog.Content
            aria-describedby={undefined}
            // Focus on open goes to the dialog itself, not the cross: otherwise the cross shows a focus ring right away.
            // Tab still leads to the cross, Esc closes.
            onOpenAutoFocus={(e) => {
              e.preventDefault()
              ;(e.currentTarget as HTMLElement).focus()
            }}
            className={cn(
              shape.container,
              "fixed top-1/2 left-1/2 z-50 max-h-[calc(100svh-2rem)] w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-surface-2 p-4 shadow-surface-2 outline-none",
            )}
          >
            {open && <Details card={open} onClose={close} />}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

type Edges = { left: boolean; right: boolean; top: boolean; bottom: boolean; barX: number; barY: number }

/** Which sides of the scroll still have content — and the scrollbars' thickness, so fades don't cover them. */
function useScrollEdges(ref: RefObject<HTMLElement | null>): Edges {
  const [edges, setEdges] = useState<Edges>({ left: false, right: false, top: false, bottom: false, barX: 0, barY: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const read = () => {
      const next: Edges = {
        left: el.scrollLeft > 1,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
        top: el.scrollTop > 1,
        bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 1,
        barX: el.offsetHeight - el.clientHeight,
        barY: el.offsetWidth - el.clientWidth,
      }
      setEdges((cur) =>
        Object.keys(next).every((k) => cur[k as keyof Edges] === next[k as keyof Edges]) ? cur : next,
      )
    }
    read()
    el.addEventListener("scroll", read, { passive: true })
    const ro = new ResizeObserver(read)
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)
    return () => {
      el.removeEventListener("scroll", read)
      ro.disconnect()
    }
  }, [ref])
  return edges
}

/** A fade at the board's edge: the page colour into transparency, 32 px; visible only when there's more to scroll on that side. */
function Fade({ side, show, bar }: { side: "left" | "right" | "bottom"; show: boolean; bar: Edges }) {
  const style =
    side === "bottom"
      ? { left: 0, right: bar.barY, bottom: bar.barX, height: 48 }
      : { top: 0, bottom: bar.barX, width: 32, ...(side === "left" ? { left: 0 } : { right: bar.barY }) }
  return (
    <div
      aria-hidden
      style={style}
      className={cn(
        // The page panel's colour (surface-2), not background: that one is darker and left a dark strip at the edge.
        "pointer-events-none absolute from-surface-2 to-transparent transition-opacity duration-200",
        side === "left" && "bg-linear-to-r",
        side === "right" && "bg-linear-to-l",
        side === "bottom" && "bg-linear-to-t",
        show ? "opacity-100" : "opacity-0",
      )}
    />
  )
}

function Tags({ card, long }: { card: Card; long?: boolean }) {
  // Tags first — in their colour from `tags`, then the area — as a grey label.
  const tags = [...(card.tags ?? []), ...(card.area ? [card.area] : [])]
  if (tags.length === 0 && !card.added && !card.priority) return null
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {card.priority && <PriorityBars priority={card.priority} />}
      {tags.map((t, i) => (
        <span
          key={`${t}-${i}`}
          className={cn(
            "rounded-full px-2 py-0.5 text-[12px]",
            (i < (card.tags?.length ?? 0) && toneOf(t)) || cn("text-muted-foreground", TINT_HEADER),
          )}
        >
          {t}
        </span>
      ))}
      {card.added && (
        <span className="ml-auto text-[12px] text-muted-foreground tabular-nums">
          {long ? `added ${shortDate(card.added)}` : shortDate(card.added)}
        </span>
      )}
    </div>
  )
}

/** A card on the board: title, labels and date, no description. When open — in the header's tone, under the cursor — a bit lighter. */
function BoardCard({ card, active }: { card: Card; active: boolean }) {
  return (
    <Block className={cn("pb-0 transition-colors", active ? TINT_HEADER : "group-hover:bg-foreground/[0.035]")}>
      {/* Regular weight, 400: column headers are 600, cards lighter. */}
      <h3 className="text-[14px] leading-snug font-normal">{card.title}</h3>
      <Tags card={card} />
    </Block>
  )
}

/** A card's details in the dialog: column, title, labels, description, context images; cards in Review and Done add
 *  "What's done" and "How to check". */
function Details({ card, onClose }: { card: Card; onClose: () => void }) {
  const column = board.columns.find((c) => c.id === card.column)?.title
  const titleClass = "text-[17px] leading-snug font-semibold tracking-tight"
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-muted-foreground">{column}</span>
        {/* The cross, a 28 circle — the size of a compact button. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-1 ml-auto flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-foreground/[0.08] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <XIcon size={16} />
        </button>
      </div>
      <Dialog.Title className={titleClass}>{card.title}</Dialog.Title>
      <Tags card={card} long />
      {/* The description is quieter and smaller than the title: 75 % of the text colour and 13 px. A line break is a paragraph. */}
      {card.text ? (
        <p className="whitespace-pre-line text-[13px] leading-relaxed text-foreground/75 [&_code]:text-current">
          <Inline text={card.text} />
        </p>
      ) : (
        <p className="text-[13px] text-muted-foreground">No description</p>
      )}
      {/* Context — screenshots sent along, full width of the dialog; a click opens the full size in a new tab. */}
      {card.images && card.images.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[12px] text-muted-foreground">Context</span>
          {card.images.map((src) => (
            <a key={src} href={src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-border">
              <img src={src} alt="" loading="lazy" className="block h-auto w-full" />
            </a>
          ))}
        </div>
      )}
      {/* "What's done" and "How to check" — set apart by a rule. */}
      {(card.done || card.check) && (
        <div className="flex flex-col gap-3 border-t border-border pt-3">
          {card.done && (
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-muted-foreground">What's done</span>
              <p className="whitespace-pre-line text-[13px] leading-relaxed text-foreground/75 [&_code]:text-current">
                <Inline text={card.done} />
              </p>
            </div>
          )}
          {card.check && (
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-muted-foreground">How to check</span>
              <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-[13px] leading-relaxed text-foreground/75 marker:text-muted-foreground [&_a]:underline [&_a]:underline-offset-2 [&_code]:text-current">
                {card.check.map((step) => (
                  <li key={step}>
                    <Inline text={step} />
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
