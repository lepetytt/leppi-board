import { useState } from "react"
import { Block, TINT_SOFT } from "@/components/blocks"
import { PAGE, PageHeader } from "@/components/page-header"
import { TabItem, Tabs, TabsList } from "@/components/ui/tabs"
import { CheckIcon, CompareIcon, MinusIcon, TableIcon } from "@/icons"
import { useShape } from "@/lib/shape-context"
import { cn } from "@/lib/utils"
import data from "./data.json"

/*
 * Example: options side by side — plans, offers, tools, apartments. Two views of the same data:
 * columns (one card per option) and a table (one row per feature). Everything comes from `data.json`.
 */

type Value = boolean | string
interface Variant { id: string; name: string; price?: string; time?: string; text?: string }
interface Row { label: string; values: Record<string, Value> }

const VARIANTS = data.variants as Variant[]
const GROUPS = data.groups as { title: string; rows: Row[] }[]

/** Included, not included, or a short text instead of a tick. */
function Mark({ value }: { value: Value | undefined }) {
  if (value === true) return <CheckIcon size={14} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
  if (!value) return <MinusIcon size={14} className="shrink-0 text-muted-foreground/40" />
  return <span className="text-[12.5px] text-foreground/80">{value}</span>
}

function Columns() {
  return (
    <div className="overflow-x-auto [scrollbar-width:none]">
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${VARIANTS.length}, minmax(240px, 1fr))` }}>
        {VARIANTS.map((v, i) => (
          <Block key={v.id}>
            <span className="text-[12px] uppercase tracking-wide text-muted-foreground">Option {i + 1}</span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-[18px] font-semibold">{v.name}</h2>
              {v.price && <span className="ml-auto text-[14px] tabular-nums">{v.price}</span>}
            </div>
            {v.time && <span className="-mt-2 text-right text-[12px] text-muted-foreground">{v.time}</span>}
            {v.text && <p className="text-[13px] leading-relaxed text-muted-foreground">{v.text}</p>}
            {GROUPS.map((g) => (
              <div key={g.title} className="flex flex-col gap-2 border-t border-foreground/[0.06] pt-3">
                <h3 className="text-[12px] uppercase tracking-wide text-muted-foreground">{g.title}</h3>
                <ul className="flex flex-col gap-1.5">
                  {g.rows.map((r) => {
                    const value = r.values[v.id]
                    return (
                      <li key={r.label} className={cn("flex items-center gap-2 text-[13px]", !value && "text-muted-foreground/60")}>
                        {typeof value === "string" ? <CheckIcon size={14} className="shrink-0 text-emerald-600 dark:text-emerald-400" /> : <Mark value={value} />}
                        <span>{r.label}</span>
                        {typeof value === "string" && <span className="ml-auto text-[12px] text-muted-foreground">{value}</span>}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </Block>
        ))}
      </div>
    </div>
  )
}

function Table() {
  const shape = useShape()
  return (
    <div className={cn(shape.container, TINT_SOFT, "overflow-x-auto")}>
      <table className="w-full min-w-[560px] border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-foreground/[0.08]">
            <th className="w-[40%] px-4 py-3" />
            {VARIANTS.map((v) => (
              <th key={v.id} className="px-4 py-3 text-left font-normal">
                <span className="block text-[14px] font-semibold">{v.name}</span>
                <span className="text-[12px] text-muted-foreground tabular-nums">{[v.price, v.time].filter(Boolean).join(" · ")}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GROUPS.map((g) => [
            <tr key={g.title}>
              <td colSpan={VARIANTS.length + 1} className="px-4 pt-4 pb-1.5 text-[12px] uppercase tracking-wide text-muted-foreground">
                {g.title}
              </td>
            </tr>,
            ...g.rows.map((r) => (
              <tr key={`${g.title}-${r.label}`} className="border-b border-foreground/[0.05] hover:bg-foreground/[0.025]">
                <td className="px-4 py-2">{r.label}</td>
                {VARIANTS.map((v) => (
                  <td key={v.id} className="px-4 py-2">
                    <Mark value={r.values[v.id]} />
                  </td>
                ))}
              </tr>
            )),
          ])}
        </tbody>
      </table>
    </div>
  )
}

export function ComparePage() {
  const [view, setView] = useState("columns")
  return (
    <div className={PAGE}>
      <PageHeader title={data.title} description={data.description}>
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabItem value="columns" label="Columns" icon={CompareIcon} />
            <TabItem value="table" label="Table" icon={TableIcon} />
          </TabsList>
        </Tabs>
      </PageHeader>
      {view === "columns" ? <Columns /> : <Table />}
    </div>
  )
}
