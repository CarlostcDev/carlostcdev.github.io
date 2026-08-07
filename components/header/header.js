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
        use.setAttribute("href", `sources/svgs/sprite.svg#${iconName}`);
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

export function renderLanguageOptions(languages, selectedLanguage) {
    const lists = document.querySelectorAll(".lang-options");

    if (!lists.length || !Array.isArray(languages)) return;

    const html = languages.map(lang => {
        const isSelected = lang.code === selectedLanguage;
        return `<li data-lang="${lang.code}" data-i18n="header.${lang.code}" role="option" tabindex="0" class="${isSelected ? "active" : ""}" aria-selected="${isSelected}">${lang.name}</li>`;
    }).join("");

    lists.forEach(ul => {
        ul.innerHTML = html;
    });
}