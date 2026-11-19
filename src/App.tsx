import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar"
import { SidebarInsetTopbar } from "@/components/sidebar-app/inset-topbar"
import { ThemeToggle } from "@/components/theme-toggle"
import { PanelIcon } from "@/icons"
import { IconProvider } from "@/lib/icon-context"
import { shell } from "@/shell.config"

/*
 * The shell: a sidebar, a top bar and a panel. What goes where comes from `src/shell.config.tsx`;
 * this file doesn't need to change when pages are added.
 */

const PAGES = shell.groups.flatMap((g) => g.pages)
const HOME = shell.home && PAGES.some((p) => p.id === shell.home) ? shell.home : PAGES[0]?.id

/** Icons the sidebar components show themselves — from the same filled set. */
const FLUID_ICONS = { "panel-left": PanelIcon }

/** The page lives in the address (`#start`), so a link opens straight on it. Without one — the home page. */
function useHashPage(): [string, (id: string) => void] {
  const read = () => {
    const h = window.location.hash.slice(1)
    return PAGES.some((p) => p.id === h) ? h : HOME
  }
  const [page, setPage] = useState(read)
  useEffect(() => {
    const onHash = () => {
      setPage(read())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [page, (id) => (window.location.hash = id)]
}

/** On a phone the sidebar slides over the page: it closes once a page is picked. */
function Menu({ page, go }: { page: string; go: (id: string) => void }) {
  const { isMobile, setOpenMobile } = useSidebar()
  return (
    <>
      {shell.groups.map((group, i) => (
        <SidebarGroup key={group.label ?? i}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarMenu>
            {group.pages.map((p) => (
              <SidebarMenuItem key={p.id}>
                <SidebarMenuButton
                  icon={p.icon}
                  isActive={p.id === page}
                  onClick={() => {
                    go(p.id)
                    if (isMobile) setOpenMobile(false)
                  }}
                >
                  {p.title}
                  {p.note && (
                    <span className="ml-auto shrink-0 whitespace-nowrap text-[12px] text-muted-foreground/70 tabular-nums">
                      {p.note}
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}

export default function App() {
  const [page, go] = useHashPage()
  const current = PAGES.find((p) => p.id === page)
  const Page = current?.component

  // No peek on hover: when collapsed, hovering slid the sidebar over the page and hid the button that opens it.
  return (
    <IconProvider icons={FLUID_ICONS}>
      <SidebarProvider width="16.5rem">
        <Sidebar variant="inset">
          <SidebarHeader>
            {/* The title and the menu highlights share one left edge: no padding of its own. */}
            <div className="flex flex-col pt-1">
              <span className="text-[15px] font-semibold">{shell.title}</span>
              {shell.subtitle && <span className="text-[12px] text-muted-foreground">{shell.subtitle}</span>}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Menu page={page} go={go} />
          </SidebarContent>
        </Sidebar>
        {/* Under 768 px the sidebar slides in and the panel loses its left margin: give it 8 px, like on top.
            ! — otherwise the sidebar's peer rule wins. */}
        <SidebarInset className="max-md:ml-2!">
          <SidebarInsetTopbar>
            {current && <span className="shrink-0 text-[13px] text-muted-foreground">{current.title}</span>}
            {current?.subtitle && (
              <span className="min-w-0 truncate pl-2 text-[13px] text-muted-foreground/70">{current.subtitle}</span>
            )}
            <ThemeToggle className="ml-auto shrink-0" />
          </SidebarInsetTopbar>
          <main className="flex flex-1 flex-col">
            {Page ? <Page key={page} /> : <p className="p-6 text-[13px] text-muted-foreground">No pages yet: add one in src/shell.config.tsx.</p>}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </IconProvider>
  )
}
