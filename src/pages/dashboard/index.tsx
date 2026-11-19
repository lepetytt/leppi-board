import { Block, BlockTitle } from "@/components/blocks"
import { PAGE, PageHeader } from "@/components/page-header"
import { cn } from "@/lib/utils"
import data from "./data.json"

/*
 * Example: a dashboard — numbers on top, a chart and a ranked list below. Everything comes from `data.json`;
 * change the data and keep the page, or use the parts (Stat, BarChart, BarList) on a page of your own.
 * No chart library: the bars are plain blocks, so they follow the theme.
 */

interface Stat { label: string; value: string; note?: string; trend?: string; goodWhenDown?: boolean }
interface Point { label: string; value: number }
interface Item { label: string; note?: string; value: number }

function Stat({ label, value, note, trend, goodWhenDown }: Stat) {
  const down = trend?.trim().startsWith("-")
  const good = down === !!goodWhenDown
  return (
    <Block>
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-[26px] leading-none font-semibold tabular-nums">{value}</span>
        {trend && (
          <span className={cn("text-[12px] tabular-nums", good ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
            {trend}
          </span>
        )}
      </div>
      {note && <span className="text-[12px] text-muted-foreground/80">{note}</span>}
    </Block>
  )
}

/** Vertical bars; the last one is the current period and is drawn stronger. */
function BarChart({ points }: { points: Point[] }) {
  const max = Math.max(...points.map((p) => p.value))
  return (
    <div className="flex h-48 items-end gap-1.5 pt-4">
      {points.map((p, i) => (
        <div key={p.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
          <span className="text-[11px] text-muted-foreground tabular-nums opacity-0 transition-opacity group-hover:opacity-100">
            {p.value}
          </span>
          <div
            className={cn("w-full rounded-md", i === points.length - 1 ? "bg-foreground/70" : "bg-foreground/15 group-hover:bg-foreground/30")}
            style={{ height: `${(p.value / max) * 100}%` }}
          />
          <span className="text-[11px] text-muted-foreground tabular-nums">{p.label}</span>
        </div>
      ))}
    </div>
  )
}

/** A ranked list with a bar under each row: the share of the total. */
function BarList({ items }: { items: Item[] }) {
  const total = items.reduce((s, i) => s + i.value, 0)
  const max = Math.max(...items.map((i) => i.value))
  return (
    <ol className="flex flex-col gap-3 pt-1">
      {items.map((it) => (
        <li key={it.label} className="flex flex-col gap-1.5">
          <div className="flex items-baseline gap-2 text-[13px]">
            <span>{it.label}</span>
            {it.note && <span className="truncate text-[12px] text-muted-foreground">{it.note}</span>}
            <span className="ml-auto text-muted-foreground tabular-nums">
              {it.value.toLocaleString("en-US")} · {Math.round((it.value / total) * 100)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-foreground/[0.06]">
            <div className="h-full rounded-full bg-foreground/40" style={{ width: `${(it.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ol>
  )
}

export function DashboardPage() {
  return (
    <div className={PAGE}>
      <PageHeader title={data.title} description={data.description} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(data.stats as Stat[]).map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[3fr_2fr]">
        <Block>
          <BlockTitle>{data.chart.title}</BlockTitle>
          <BarChart points={data.chart.points} />
        </Block>
        <Block>
          <BlockTitle>{data.list.title}</BlockTitle>
          <BarList items={data.list.items} />
        </Block>
      </div>
    </div>
  )
}
