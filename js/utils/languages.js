const langSelected = document.getElementById("langSelected");
const langOptions = document.getElementById("langOptions");
const langDropdown = document.querySelector(".lang-dropdown");
const roleEl = document.getElementById("roles");

let currentRoles = [];
let roleIndex = 0;
const translationsCache = {};

const fontMap = {
    zh: '"Noto Sans TC", "Google Sans", "Open Sans", sans-serif',
    ja: '"Noto Sans JP", "Google Sans", "Open Sans", sans-serif'
};

async function setLanguage(lang) {
    try {
        if (!translationsCache[lang]) {
            const response = await fetch(`../sources/translates/${lang}.json`);
            if (!response.ok) throw new Error();

            translationsCache[lang] = await response.json();
        }

        const selectedLang = translationsCache[lang];

        document.querySelectorAll("[data-key]").forEach(element => {
            const key = element.dataset.key;

            if (selectedLang[key] !== undefined) {
                if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                    element.placeholder = selectedLang[key];
                } else {
                    element.textContent = selectedLang[key];
                }
            }
        });

        const arrow = document.createElement("span");
        arrow.className = "arrow";
        langSelected.textContent = selectedLang.lang || lang.toUpperCase();
        langSelected.appendChild(arrow);

        currentRoles = selectedLang["roles-list"] || [];

        if (roleEl && currentRoles.length) {
            roleIndex = 0;
            roleEl.textContent = currentRoles[0];
        }

        localStorage.setItem("preferredLang", lang);
        document.documentElement.lang = lang;

        document.documentElement.style.setProperty(
            "--font-general",
            fontMap[lang] || '"Google Sans", "Open Sans", "Inter", sans-serif'
        );

    } catch {
        if (lang !== "en") {
            await setLanguage("en");
        }
    } finally {
        langOptions.style.display = "none";
        langDropdown.classList.remove("active");
    }
}

function getBrowserLanguage() {
    const saved = localStorage.getItem("preferredLang");
    if (saved) return saved;

    const browserLang = navigator.language.split("-")[0];
    const supportedLangs = ["es", "en", "va", "zh", "ja"];

    if (browserLang === "ca") return "va";

    return supportedLangs.includes(browserLang) ? browserLang : "en";
}

langSelected.addEventListener("click", e => {
    e.stopPropagation();

    const isVisible = langOptions.style.display === "block";
    langOptions.style.display = isVisible ? "none" : "block";
    langDropdown.classList.toggle("active");
});

langOptions.addEventListener("click", e => {
    const option = e.target.closest("li");
    if (!option) return;

    e.stopPropagation();
    setLanguage(option.dataset.lang);
});

document.addEventListener("click", () => {
    langOptions.style.display = "none";
    langDropdown.classList.remove("active");
});

(function () {
    if (!roleEl) return;

    roleEl.style.display = "inline-block";
    roleEl.style.transition = "all 0.5s ease";

    setInterval(() => {
        if (!currentRoles.length) return;

        roleEl.style.opacity = "0";
        roleEl.style.transform = "translateY(-20px)";

        setTimeout(() => {
            roleEl.style.transition = "none";
            roleEl.style.transform = "translateY(20px)";

            roleIndex = (roleIndex + 1) % currentRoles.length;
            roleEl.textContent = currentRoles[roleIndex];

            setTimeout(() => {
                roleEl.style.transition = "all 0.5s ease";
                roleEl.style.opacity = "1";
                roleEl.style.transform = "translateY(0)";
            }, 50);
        }, 500);
    }, 5000);
})();

document.addEventListener("DOMContentLoaded", () => {
    langOptions.style.display = "none";
    setLanguage(getBrowserLanguage());
});