import config from "./config.js";

const hasColorTheme = config.themes.some(t => document.documentElement.classList.contains(t));
if (!hasColorTheme) {
    const rdm = Math.floor(Math.random() * config.themes.length);
    document.documentElement.classList.add(config.themes[rdm]);
}

const div = document.querySelectorAll(".theme-toggle");
let theme = localStorage.getItem("theme") || "dark-theme";

function changeTheme(newTheme) {
    theme = newTheme;
    localStorage.setItem("theme", theme);
    const extraClasses = Array.from(document.documentElement.classList).filter(cls => cls !== "dark-theme" && cls !== "light-theme");
    document.documentElement.className = [theme, ...extraClasses].join(" ");
    const icon = theme === "dark-theme" ? "light-mode" : "dark-mode";
    document.querySelectorAll(".theme-toggle use").forEach(use => {
        use.setAttribute("href", `sources/svgs/sprite.svg#${icon}`);
    });
    const themeClasses = document.documentElement.className.trim().split(/\s+/).join(".");
    const link = document.querySelector("link[rel*='icon']");
    if (link && themeClasses) {
        link.setAttribute("href", `sources/svgs/favicon/${theme}/favicon.${themeClasses}.svg`);
    }
}

changeTheme(theme);

div.forEach(toggle => {
    toggle.addEventListener("click", () => {
        const nextTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
        changeTheme(nextTheme);
    });
});