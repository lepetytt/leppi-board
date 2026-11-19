export type Tone = "violet" | "blue" | "green" | "amber" | "red" | "pink" | "gray"

/** Tag label colours — as literals, otherwise Tailwind doesn't see them. They work in both themes. */
export const TONE: Record<Tone, string> = {
  violet: "bg-violet-500/15 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300",
  blue: "bg-blue-500/15 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300",
  green: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  amber: "bg-amber-500/15 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  red: "bg-red-500/15 text-red-700 dark:bg-red-400/15 dark:text-red-300",
  pink: "bg-pink-500/15 text-pink-700 dark:bg-pink-400/15 dark:text-pink-300",
  gray: "",
}

/** A small coloured label: a tag on the board, a status in the table. Grey — no colour of its own. */
export const PILL = "inline-flex items-center rounded-full px-2 py-0.5 text-[12px] whitespace-nowrap"
export const PILL_GRAY = "text-muted-foreground bg-foreground/[0.05]"
