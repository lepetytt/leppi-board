import type { CSSProperties, ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { useShape } from "@/lib/shape-context"
import { cn } from "@/lib/utils"

/** Cards without a border hold on tone: the text colour over the backing, so the tone works in both themes
 *  (in dark a card is lighter than the background, in light — darker). Headers stronger, blocks softer — 5 % and 1.5 %. */
export const TINT_HEADER = "bg-foreground/[0.05]"
export const TINT_SOFT = "bg-foreground/[0.015]"

export function Block({
  className,
  style,
  children,
}: {
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const shape = useShape()
  return (
    <Card className={cn(shape.container, "overflow-hidden", TINT_SOFT, className)} style={style}>
      <div className="flex h-full flex-col gap-3 p-4">{children}</div>
    </Card>
  )
}

export function BlockTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-[12px] uppercase tracking-wide text-muted-foreground">{children}</h3>
}
