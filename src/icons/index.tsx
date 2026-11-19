import type { IconComponentProps } from "@/lib/icon-context"
import columns from "./solid/grid-columns-2.svg?raw"
import crescent from "./solid/crescent.svg?raw"
import file from "./solid/file.svg?raw"
import arrowDown from "./solid/arrow-down.svg?raw"
import arrowUp from "./solid/arrow-up.svg?raw"
import browser from "./solid/browser.svg?raw"
import chartBar from "./solid/chart-bar.svg?raw"
import check from "./solid/check.svg?raw"
import columns3 from "./solid/grid-columns-3.svg?raw"
import minus from "./solid/minus.svg?raw"
import table from "./solid/table.svg?raw"
import sun from "./solid/sun.svg?raw"
import x from "./solid/x.svg?raw"

/** Icons — the filled set of Deslop Icons, https://mishanaer-icons.vercel.app/ (Round · Filled).
 *  The SVGs in ./solid are the catalogue's files as they are: for a new icon, download it from there
 *  (`/icons/round/solid/<name>.svg`) and add a line below. Same props as Lucide (size, className). */
function fromSvg(raw: string, name: string) {
  const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 24 24"
  const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")
  function Icon(props: IconComponentProps) {
    const size = props.size ?? 16
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        aria-hidden
        className={props.className}
        dangerouslySetInnerHTML={{ __html: inner }}
      />
    )
  }
  Icon.displayName = name
  return Icon
}

export const SunIcon = fromSvg(sun, "SunIcon")
export const MoonIcon = fromSvg(crescent, "MoonIcon")
/** The sidebar button: replaces Fluid's "panel-left" slot through IconProvider. */
export const PanelIcon = fromSvg(columns, "PanelIcon")
/** A sprint of the example board in the sidebar. */
export const ColumnsIcon = fromSvg(columns, "ColumnsIcon")
/** Close a card's details on the example board. */
export const XIcon = fromSvg(x, "XIcon")
/** A text page. */
export const FileIcon = fromSvg(file, "FileIcon")
/** The example pages in the sidebar. */
export const ChartIcon = fromSvg(chartBar, "ChartIcon")
export const TableIcon = fromSvg(table, "TableIcon")
export const CompareIcon = fromSvg(columns3, "CompareIcon")
export const BrowserIcon = fromSvg(browser, "BrowserIcon")
/** Included / not included on the compare page. */
export const CheckIcon = fromSvg(check, "CheckIcon")
export const MinusIcon = fromSvg(minus, "MinusIcon")
/** Sort direction in the table; trend on the dashboard. */
export const ArrowUpIcon = fromSvg(arrowUp, "ArrowUpIcon")
export const ArrowDownIcon = fromSvg(arrowDown, "ArrowDownIcon")
