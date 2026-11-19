import { MoonIcon, SunIcon } from "@/icons"
import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"
import { useTheme } from "@/lib/theme"

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, toggle] = useTheme()
  const label = theme === "dark" ? "Light theme" : "Dark theme"
  const Icon = theme === "dark" ? SunIcon : MoonIcon
  return (
    <Tooltip side="bottom" content={label}>
      <Button variant="ghost" size="icon" aria-label={label} onClick={toggle} className={className}>
        <Icon size={16} />
      </Button>
    </Tooltip>
  )
}
