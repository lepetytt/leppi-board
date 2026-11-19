import type { ComponentType } from "react"
import type { IconComponentProps } from "@/lib/icon-context"

/** A page of the shell: one item in the sidebar, one view in the panel. */
export interface ShellPage {
  /** In the address: `#id`. Latin letters, digits and dashes. */
  id: string
  /** The sidebar item and the top bar. */
  title: string
  /** Grey text after the title in the top bar: what the page is about. */
  subtitle?: string
  /** Small grey text at the right end of the sidebar item: a date, a count. */
  note?: string
  /** An icon from `src/icons` (or any component that takes `size` and `className`). */
  icon?: ComponentType<IconComponentProps>
  /** Whatever the page shows. It gets the whole panel under the top bar. */
  component: ComponentType
}

/** A run of pages in the sidebar, with an optional grey label above it. */
export interface ShellGroup {
  label?: string
  pages: ShellPage[]
}

export interface ShellConfig {
  /** The sidebar header and the browser tab. */
  title: string
  /** A grey line under the title. */
  subtitle?: string
  /** The page that opens without `#` in the address. Default: the first one. */
  home?: string
  groups: ShellGroup[]
}
