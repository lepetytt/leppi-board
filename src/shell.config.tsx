import type { ShellConfig } from "@/shell/types"
import { BrowserIcon, ChartIcon, CompareIcon, FileIcon, TableIcon } from "@/icons"
import { StartPage } from "@/pages/start"
import { DashboardPage } from "@/pages/dashboard"
import { TablePage } from "@/pages/table"
import { ComparePage } from "@/pages/compare"
import { EmbedPage } from "@/pages/embed"
import { boardPages } from "@/pages/board"

/*
 * The one file you edit to shape the shell: the name, the sidebar and what each item opens.
 * A page is any React component — put it in `src/pages/` and add a line here.
 * Every page below is an example: change it, copy it or delete it.
 */
export const shell: ShellConfig = {
  title: "My project",
  subtitle: "leppi-board",
  groups: [
    {
      pages: [
        { id: "start", title: "Start here", icon: FileIcon, component: StartPage },
        { id: "dashboard", title: "Dashboard", icon: ChartIcon, component: DashboardPage },
        { id: "table", title: "Table", icon: TableIcon, component: TablePage },
        { id: "compare", title: "Compare", icon: CompareIcon, component: ComparePage },
        {
          id: "embed",
          title: "Embed",
          subtitle: "Any site or app inside the shell — here, a map",
          icon: BrowserIcon,
          component: () => (
            <EmbedPage src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1450%2C51.4990%2C-0.0950%2C51.5190&layer=mapnik" gray />
          ),
        },
      ],
    },
    {
      label: "Board",
      // A group can be generated from data: here, one page per sprint of the board
      pages: boardPages(),
    },
  ],
}
