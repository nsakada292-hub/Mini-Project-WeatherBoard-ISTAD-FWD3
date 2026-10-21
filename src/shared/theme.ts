// Dark / light mode shared by every page.
// The saved choice lives in localStorage and is applied to <html> as the "dark"
// class, which is what Tailwind's dark: variants (and the custom .dark .glass
// rule) react to. A tiny inline script in each page <head> applies it before the
// first paint so the page never flashes the wrong mode.

export type Theme = "light" | "dark";

const THEME_KEY = "weatherboard.theme";

// Saves the mode and applies it to the page.
export function setTheme(theme: Theme): void {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
}

// Wires up the sun/moon button in the header (#theme-toggle).
export function initThemeToggle(): void {
  const button = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-toggle-icon");
  if (button === null || icon === null) {
    return; // this page has no theme button
  }

  // Shows a sun while dark mode is on, a moon while it is off.
  const render = (): void => {
    const isDark = document.documentElement.classList.contains("dark");
    icon.setAttribute("icon", isDark ? "solar:sun-linear" : "solar:moon-linear");
  };

  button.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
    render();
  });

  render();
}
