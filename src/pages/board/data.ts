import { TONE, type Tone } from "@/lib/tones"
import boardData from "./board.json"

/** A card on the board. Fields — README, "Board example". */
export interface Card {
  id: string
  /** Column id: ideas · backlog · doing · review · done · declined. */
  column: string
  /** Sprint id from `sprints`. None — the card is in the last sprint. */
  sprint?: string
  title: string
  /** Description; markup — `**bold**`, `` `code` ``, `[link](…)`, `\n` — a paragraph. */
  text?: string
  /** Where the task is — one of `areas`. A grey label on the card. */
  area?: string
  /** Tags from `tags` — who or what the card waits on (e.g. "Client"). A coloured label. */
  tags?: string[]
  /** Date YYYY-MM-DD. */
  added?: string
  /** Priority as bars. None — the card waits on someone, or it's an idea. */
  priority?: "P1" | "P2" | "P3"
  /** "What's done" — on cards in Review, Done and Declined (there — the reason). */
  done?: string
  /** "How to check" — steps with links, on cards in Review. */
  check?: string[]
  /** Context images (screenshots) — shown only in the details. Paths from the site root: files go to `public/board/`. */
  images?: string[]
}

export type { Tone }

export interface Board {
  /** Grey text in the top bar after the sprint's dates: what the board holds. */
  question?: string
  /** Where tasks happen, in the filter's order (e.g. the product's screens, then "General"). */
  areas?: string[]
  /** Tags — a coloured label before the area; first in the filter. */
  tags?: { name: string; tone?: Tone; note?: string }[]
  columns: { id: string; title: string }[]
  sprints: { id: string; title: string; dates?: string; word?: string }[]
  cards: Card[]
}

const raw = boardData as unknown as Partial<Board>

/** Without sprints the board still opens: one "Sprint 1". */
const sprints = raw.sprints && raw.sprints.length > 0 ? raw.sprints : [{ id: "s1", title: "Sprint 1" }]
const lastSprint = sprints[sprints.length - 1].id

export const board: Board = {
  question: raw.question,
  areas: raw.areas ?? [],
  tags: raw.tags ?? [],
  columns: raw.columns ?? [],
  sprints,
  cards: (raw.cards ?? []).map((c) => ({ ...c, sprint: c.sprint ?? lastSprint })),
}

/** A tag's colour by name; a tag without a colour in `tags` (or not listed there) — a grey label, like an area. */
export const toneOf = (tag: string) => {
  const tone = board.tags?.find((t) => t.name === tag)?.tone ?? "gray"
  return TONE[tone] || null
}

/** A sprint's filter: "All", tags, then areas — only those on the sprint's cards.
 *  Order — as in `tags` and `areas`; unlisted ones follow, in order of appearance. */
export function filtersOf(cards: Card[]) {
  const order = (known: string[], found: string[]) => [
    ...known.filter((k) => found.includes(k)),
    ...found.filter((f) => !known.includes(f)),
  ]
  const tags = Array.from(new Set(cards.flatMap((c) => c.tags ?? [])))
  const areas = Array.from(new Set(cards.flatMap((c) => (c.area ? [c.area] : []))))
  return ["all", ...order(board.tags?.map((t) => t.name) ?? [], tags), ...order(board.areas ?? [], areas)]
}

/** A sprint's address: `#sprint-1` for id `s1`, otherwise the id itself. */
export const sprintHash = (id: string) => (/^s\d+$/.test(id) ? `sprint-${id.slice(1)}` : id)
