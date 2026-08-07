const themeToggles = document.querySelectorAll(".theme-toggle");

let theme = localStorage.getItem("theme");

if (!theme) {
    theme = "dark-theme";
    localStorage.setItem("theme", theme);
}

const updateThemeUI = (currentTheme) => {
    document.documentElement.classList.remove("dark-theme", "light-theme");
    document.documentElement.classList.add(currentTheme);

    const iconName = currentTheme === "dark-theme" ? "light-mode" : "dark-mode";
    document.querySelectorAll(".theme-toggle use").forEach(use => {
        use.setAttribute("href", `/sources/svgs/sprite.svg#${iconName}`);
    });
};

updateThemeUI(theme);

themeToggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
        theme = theme === "dark-theme" ? "light-theme" : "dark-theme";
        localStorage.setItem("theme", theme);
        updateThemeUI(theme);
    });
});