import { useEffect, useState } from "react"

type Theme = "light" | "dark"

/** The theme is the `dark` class on <html> (the tokens in index.css read it). The choice is kept in the browser. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  )
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    try {
      localStorage.setItem("theme", theme)
    } catch {
      // a private window or blocked storage: the theme just isn't remembered
    }
  }, [theme])
  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))]
}
