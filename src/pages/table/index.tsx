import { useMemo, useState } from "react"
import { TINT_SOFT } from "@/components/blocks"
import { PAGE, PageHeader } from "@/components/page-header"
import { TabItem, Tabs, TabsList } from "@/components/ui/tabs"
import { ArrowDownIcon, ArrowUpIcon } from "@/icons"
import { useShape } from "@/lib/shape-context"
import { PILL, PILL_GRAY, TONE, type Tone } from "@/lib/tones"
import { cn } from "@/lib/utils"
import data from "./data.json"

/*
 * Example: a table — a filter above it, a search, sorting by any column. What the columns are and how each
 * one shows comes from `data.json`, so the same page works for any list: requests, people, vacancies, links.
 */

type Row = Record<string, string | number>
interface Column { key: string; label: string; type: "text" | "number" | "date" | "status"; sub?: string }

const COLUMNS = data.columns as Column[]
const ROWS = data.rows as Row[]
const TONES = Object.fromEntries(data.statuses.map((s) => [s.name, s.tone as Tone]))
const FILTERS = ["all", ...data.statuses.map((s) => s.name).filter((n) => ROWS.some((r) => r[data.filterBy] === n))]

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
/** "12 Nov" from "2026-11-12". */
const shortDate = (iso: string) => `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`

function Cell({ column, row }: { column: Column; row: Row }) {
  const v = row[column.key]
  if (v === undefined || v === "") return <span className="text-muted-foreground/50">—</span>
  if (column.type === "status") {
    return <span className={cn(PILL, TONE[TONES[String(v)] ?? "gray"] || PILL_GRAY)}>{v}</span>
  }
  if (column.type === "number") return <span className="tabular-nums">{Number(v).toLocaleString("en-US")}</span>
  if (column.type === "date") return <span className="text-muted-foreground tabular-nums">{shortDate(String(v))}</span>
  return (
    <span className="flex flex-col">
      <span>{v}</span>
      {column.sub && row[column.sub] && <span className="text-[12px] text-muted-foreground">{row[column.sub]}</span>}
    </span>
  )
}

export function TablePage() {
  const shape = useShape()
  const [filter, setFilter] = useState("all")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState(data.sortBy as { key: string; dir: "asc" | "desc" })

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const found = ROWS.filter(
      (r) =>
        (filter === "all" || r[data.filterBy] === filter) &&
        (!q || Object.values(r).some((v) => String(v).toLowerCase().includes(q))),
    )
    const sign = sort.dir === "asc" ? 1 : -1
    return found.sort((a, b) => {
      const x = a[sort.key] ?? ""
      const y = b[sort.key] ?? ""
      return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))) * sign
    })
  }, [filter, query, sort])

  // A click on the sorted column flips it; on another one — numbers and dates start from the biggest, text from A
  const sortBy = (c: Column) =>
    setSort((s) =>
      s.key === c.key
        ? { key: c.key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key: c.key, dir: c.type === "number" || c.type === "date" ? "desc" : "asc" },
    )

  return (
    <div className={PAGE}>
      <PageHeader title={data.title} description={data.description} />
      <div className="flex flex-wrap items-center gap-3 pb-3">
        <div className="overflow-x-auto [scrollbar-width:none]">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              {FILTERS.map((f) => (
                <TabItem key={f} value={f} label={f === "all" ? "All" : f} />
              ))}
            </TabsList>
          </Tabs>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className={cn(
            shape.input,
            "ml-auto h-8 w-56 bg-foreground/[0.05] px-3 text-[13px] outline-none placeholder:text-muted-foreground focus:bg-foreground/[0.08]",
          )}
        />
      </div>

      <div className={cn(shape.container, TINT_SOFT, "overflow-x-auto")}>
        <table className="w-full min-w-[640px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-foreground/[0.08]">
              {COLUMNS.map((c) => {
                const active = sort.key === c.key
                const Arrow = sort.dir === "asc" ? ArrowUpIcon : ArrowDownIcon
                return (
                  <th key={c.key} className={cn("px-4 py-2.5 font-normal", c.type === "number" ? "text-right" : "text-left")}>
                    <button
                      type="button"
                      onClick={() => sortBy(c)}
                      className={cn(
                        "inline-flex items-center gap-1 text-[12px] hover:text-foreground",
                        active ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {c.label}
                      <Arrow size={12} className={active ? "opacity-70" : "opacity-0"} />
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-foreground/[0.05] last:border-0 hover:bg-foreground/[0.025]">
                {COLUMNS.map((c) => (
                  <td key={c.key} className={cn("px-4 py-2.5 align-top", c.type === "number" && "text-right")}>
                    <Cell column={c} row={r} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="px-4 py-6 text-[13px] text-muted-foreground">Nothing found.</p>}
      </div>
      <p className="pt-3 text-[12px] text-muted-foreground tabular-nums">
        {rows.length} of {ROWS.length}
      </p>
    </div>
  )
}
