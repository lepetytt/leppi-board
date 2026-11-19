import type { ReactNode } from "react"

/** A page's title row: the title, a grey line on the same baseline, and controls on the right. */
export function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-center gap-x-3 gap-y-3 pb-5">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-[20px] font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-[13px] text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="ml-auto flex items-center gap-2">{children}</div>}
    </header>
  )
}

/** The padding every scrolling page shares, so pages line up with each other. */
export const PAGE = "flex w-full flex-col px-6 pt-5 pb-12"
