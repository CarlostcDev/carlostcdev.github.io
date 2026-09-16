import config from "./config.js";

const root = document.documentElement;
const toggles = document.querySelectorAll(".theme-toggle");
const favicon = document.querySelector("link[rel*='icon']");

const hasColorTheme = config.themes.some(theme => root.classList.contains(theme));
if (!hasColorTheme && config.themes.length) {
    const randomTheme = config.themes[Math.floor(Math.random() * config.themes.length)];
    root.classList.add(randomTheme);
}

function changeTheme(newTheme) {
    root.classList.remove("dark-theme", "light-theme");
    root.classList.add(newTheme);

    const icon = newTheme === "dark-theme" ? "light-mode" : "dark-mode";
    document.querySelectorAll(".theme-toggle use").forEach(use => {
        use.setAttribute("href", `/sources/svgs/sprite.svg#${icon}`);
    });

    const colorTheme = config.themes.find(colorTheme => root.classList.contains(colorTheme));
    if (favicon && colorTheme) favicon.setAttribute("href", `/sources/svgs/favicon/${newTheme}/favicon.${newTheme}.${colorTheme}.svg`);
}

const currentTheme = root.classList.contains("dark-theme") ? "dark-theme" : "light-theme";
changeTheme(currentTheme);

toggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
        const currentTheme = root.classList.contains("dark-theme") ? "dark-theme" : "light-theme";
        const newTheme = currentTheme === "dark-theme" ? "light-theme" : "dark-theme";

        changeTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    });
});