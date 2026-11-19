import type { ShellPage } from "@/shell/types"
import { ColumnsIcon } from "@/icons"
import { BoardPage } from "./board-page"
import { board, sprintHash } from "./data"

/*
 * Example: a task board with sprints, columns and cards, all from `board.json`.
 * It's here to show a page of any complexity fits the shell — and that a group of pages
 * can come from data: one page per sprint. Not needed? Delete this folder and its line
 * in `src/shell.config.tsx` (and `XIcon`, `ColumnsIcon` in `src/icons` if nothing else uses them).
 */
export function boardPages(): ShellPage[] {
  return board.sprints.map((s) => ({
    id: sprintHash(s.id),
    title: s.word ? `${s.title} · ${s.word}` : s.title,
    subtitle: [s.dates, board.question].filter(Boolean).join(" · ") || undefined,
    note: s.dates,
    icon: ColumnsIcon,
    component: () => <BoardPage sprint={s.id} />,
  }))
}
