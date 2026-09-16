const root = document.documentElement;
const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light-theme" : "dark-theme";

let theme;

try {
    const storedTheme = localStorage.getItem("theme");
    theme = storedTheme === "dark-theme" || storedTheme === "light-theme" ? storedTheme : systemTheme;
} catch {
    theme = systemTheme;
}

root.classList.remove("dark-theme", "light-theme");
root.classList.add(theme);