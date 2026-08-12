import config from "./config.js";

const key = "portfolio.language";
const lang = "es";
const translationsCache = new Map();
let selectorReady = false;
let languageState = { code: lang, translations: {}, roles: [] };

export function renderLanguageOptions(languages = config.languages, selectedLanguage = getCurrentLanguage()) {
    const lists = document.querySelectorAll(".lang-options");
    if (!lists.length || !Array.isArray(languages)) return;

    const html = languages.map(language => {
        const selected = language.code === selectedLanguage;
        return `
            <li data-lang="${language.code}"
                data-i18n="global.languages.${language.code}"
                role="option"
                tabindex="0"
                class="${selected ? "active" : ""}"
                aria-selected="${selected}">
                ${language.name}
            </li>`;
    }).join("");

    lists.forEach(list => { list.innerHTML = html; });
}

export async function applyLanguage(language) {
    const targetCode = resolveLanguage(language) ?? lang;
    let translations = await loadTranslations(targetCode);

    if (!translations && targetCode !== lang) {
        translations = await loadTranslations(lang);
    }
    if (!translations) return;

    const fallback = targetCode === lang
        ? translations
        : (await loadTranslations(lang)) ?? translations;

    const roles = getValue(translations, "portfolio.home.roles-list")
        ?? getValue(fallback, "portfolio.home.roles-list")
        ?? [];

    languageState = { code: targetCode, translations, roles };

    document.documentElement.lang = targetCode;
    translateDocument(translations, fallback);
    updateActiveLanguage(targetCode);
    setStoredLanguage(targetCode);

    window.dispatchEvent(new CustomEvent("portfolio:languagechange", { detail: languageState }));
}

async function loadTranslations(language) {
    if (translationsCache.has(language)) return translationsCache.get(language);
    try {
        const response = await fetch(`/data/translates/${language}.json`);
        if (!response.ok) return null;
        const translations = await response.json();
        translationsCache.set(language, translations);
        return translations;
    } catch {
        return null;
    }
}

function getInitialLanguage() {
    const storedLanguage = resolveLanguage(getStoredLanguage());
    if (storedLanguage) return storedLanguage;

    const browserLangs = navigator.languages ?? [navigator.language];
    for (const language of browserLangs) {
        const resolvedLanguage = resolveLanguage(language);
        if (resolvedLanguage) return resolvedLanguage;
    }
    return lang;
}

function resolveLanguage(language) {
    if (!language) return null;
    const normalized = normalizeLanguage(language);
    const base = normalized.split("-")[0];

    for (const item of config.languages) {
        const itemCode = normalizeLanguage(item.code);
        const aliases = (item.aliases ?? []).map(normalizeLanguage);

        if (itemCode === normalized || itemCode === base || aliases.includes(normalized) || aliases.includes(base)) {
            return item.code;
        }
    }
    return null;
}

function normalizeLanguage(language) {
    return String(language).trim().toLowerCase().replace("_", "-");
}

function translateDocument(translations, fallback) {
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const keyPath = element.dataset.i18n;
        if (!keyPath) return;

        const value = getValue(translations, keyPath) ?? getValue(fallback, keyPath);
        if (value === undefined || value === null) return;
        if (typeof value !== "string" && typeof value !== "number") return;

        const attribute = element.dataset.i18nAttr;
        if (attribute) {
            element.setAttribute(attribute, String(value));
        } else {
            element.textContent = String(value);
        }
    });
}

function getValue(source, path) {
    if (!source || !path) return undefined;
    return path.split(".").reduce((acc, k) => acc?.[k], source);
}

function updateActiveLanguage(language) {
    document.querySelectorAll(".lang-options [data-lang]").forEach(option => {
        const active = option.dataset.lang === language;
        option.classList.toggle("active", active);
        option.setAttribute("aria-selected", String(active));
    });
}

export function bindLanguageSelector() {
    if (selectorReady) return;

    const setOpen = open => {
        const headerDropdown = document.querySelector(".lang-dropdown");
        const selected = document.getElementById("langSelected");
        const allOptions = document.querySelectorAll(".lang-options");

        if (headerDropdown) headerDropdown.classList.toggle("active", open);
        if (selected) selected.setAttribute("aria-expanded", String(open));
        allOptions.forEach(opt => opt.hidden = !open);
    };

    document.addEventListener("click", event => {
        const toggleBtn = event.target.closest("#langSelected, .lang-toggle");
        const optionItem = event.target.closest("[data-lang]");

        if (toggleBtn) {
            event.stopPropagation();
            const navOptions = document.querySelector(".lang-options");
            const isHidden = navOptions ? navOptions.hidden : true;
            setOpen(isHidden);
            return;
        }

        if (optionItem) {
            const selectedLang = optionItem.getAttribute("data-lang");
            if (selectedLang) {
                applyLanguage(selectedLang);
                setOpen(false);
                return;
            }
        }

        if (!event.target.closest(".lang-dropdown")) {
            setOpen(false);
        }
    });

    selectorReady = true;
}

function getCurrentLanguage() {
    return languageState.code || getInitialLanguage();
}

function getStoredLanguage() {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function setStoredLanguage(language) {
    try {
        localStorage.setItem(key, language);
        const cv = document.querySelector('[data-i18n="shared.cv"]');
        const info = config.info?.items?.find(item => item.i18n === "shared.cv");
        if (cv && info) cv.href = `${info.href}_${language.toUpperCase()}.pdf`;
    } catch {
        return null;
    }
}

export async function loadLanguages() {
    const initialLanguage = getInitialLanguage();
    renderLanguageOptions(config.languages, initialLanguage);
    bindLanguageSelector();
    await applyLanguage(initialLanguage);
}