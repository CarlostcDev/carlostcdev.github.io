const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("theme-mode");

let theme = localStorage.getItem("theme");

if (!theme) {
    theme = "dark-theme";
    localStorage.setItem("theme", theme);
}

document.documentElement.classList.add(theme);
themeIcon.setAttribute(
    "href",
    `/sources/svgs/sprite.svg#${theme === "dark-theme" ? "light-mode" : "dark-mode"}`
);

themeToggle.addEventListener("click", () => {
    document.documentElement.classList.remove("dark-theme", "light-theme");
    theme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    localStorage.setItem("theme", theme);
    document.documentElement.classList.add(theme);
    themeIcon.setAttribute(
        "href",
        `/sources/svgs/sprite.svg#${theme === "dark-theme" ? "light-mode" : "dark-mode"}`
    );
});