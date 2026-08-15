import config from "./config.js";

const root = document.documentElement;
const toggles = document.querySelectorAll(".theme-toggle");
const favicon = document.querySelector("link[rel*='icon']");
const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light-theme" : "dark-theme";
const hasColorTheme = config.themes.some(theme => root.classList.contains(theme));
if (!hasColorTheme && config.themes.length) {
    const randomTheme = config.themes[Math.floor(Math.random() * config.themes.length)];
    root.classList.add(randomTheme);
}
let theme;
try {
    const storedTheme = localStorage.getItem("theme");
    theme = storedTheme === "dark-theme" || storedTheme === "light-theme" ? storedTheme : systemTheme;
} catch {theme = systemTheme;}

function changeTheme(newTheme) {
    theme = newTheme;
    try {localStorage.setItem("theme", theme);} catch {}
    root.classList.remove("dark-theme", "light-theme");
    root.classList.add(theme);
    const icon = theme === "dark-theme" ? "light-mode" : "dark-mode";
    document.querySelectorAll(".theme-toggle use").forEach(use => {
        use.setAttribute("href", `/sources/svgs/sprite.svg#${icon}`);
    });
    const colorTheme = config.themes.find(colorTheme => root.classList.contains(colorTheme));
    if (favicon && colorTheme) favicon.setAttribute("href", `/sources/svgs/favicon/${theme}/favicon.${theme}.${colorTheme}.svg`);
}

changeTheme(theme);

toggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
        changeTheme(theme === "dark-theme" ? "light-theme" : "dark-theme");
    });
});