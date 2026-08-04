import config from "../config.js";
import "../config.js";

import { renderLanguageOptions } from "../dom/autolanguages.js";

const storageKey = "portfolio.language";
const defaultLanguage = "es";

const translationsCache = new Map();
let selectorReady = false;

let languageState = {
    code: defaultLanguage,
    translations: {},
    roles: []
};

export async function applyLanguage(language) {
    let code = resolveLanguage(language) ?? defaultLanguage;
    let translations = await loadTranslations(code);

    if (!translations && code !== defaultLanguage) {
        code = defaultLanguage;
        translations = await loadTranslations(defaultLanguage);
    }

    if (!translations) return;

    const fallback = code === defaultLanguage
        ? translations
        : await loadTranslations(defaultLanguage);

    languageState = {
        code,
        translations,
        roles: getValue(translations, "home.roles-list")
            ?? getValue(fallback, "home.roles-list")
            ?? []
    };

    document.documentElement.lang = code;
    translateDocument(translations, fallback);
    updateActiveLanguage(code);
    setStoredLanguage(code);

    window.dispatchEvent(new CustomEvent("portfolio:languagechange", {
        detail: languageState
    }));
}

export function getLanguageState() {
    return languageState;
}

async function loadTranslations(language) {
    if (translationsCache.has(language)) {
        return translationsCache.get(language);
    }

    try {
        const translations = await fetch(`/sources/translates/${language}.json`)
            .then(r => r.json());

        translationsCache.set(language, translations);

        return translations;
    } catch {
        return null;
    }
}

function getInitialLanguage() {
    const storedLanguage = resolveLanguage(getStoredLanguage());

    if (storedLanguage) {
        return storedLanguage;
    }

    for (const language of navigator.languages ?? [navigator.language]) {
        const resolvedLanguage = resolveLanguage(language);

        if (resolvedLanguage) {
            return resolvedLanguage;
        }
    }

    return defaultLanguage;
}

function resolveLanguage(language) {
    if (!language) return null;

    const normalizedLanguage = normalizeLanguage(language);
    const baseLanguage = normalizedLanguage.split("-")[0];

    for (const supportedLanguage of config.languages) {
        const codes = [
            supportedLanguage.code,
            ...(supportedLanguage.aliases ?? [])
        ].map(normalizeLanguage);

        if (codes.includes(normalizedLanguage) || codes.includes(baseLanguage)) {
            return supportedLanguage.code;
        }
    }

    return null;
}

function normalizeLanguage(language) {
    return String(language).trim().toLowerCase().replace("_", "-");
}

function translateDocument(translations, fallback) {
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const value =
            getValue(translations, element.dataset.i18n)
            ?? getValue(fallback, element.dataset.i18n);

        if (typeof value !== "string" && typeof value !== "number") {
            return;
        }

        const attribute = element.dataset.i18nAttr;

        if (attribute) {
            element.setAttribute(attribute, value);
        } else {
            element.textContent = value;
        }
    });
}

function getValue(source, path) {
    return path.split(".").reduce((value, key) => value?.[key], source);
}

function updateActiveLanguage(language) {
    document.querySelectorAll("#langOptions [data-lang]").forEach(option => {
        const active = option.dataset.lang === language;

        option.classList.toggle("active", active);
        option.setAttribute("aria-selected", String(active));
    });
}

function bindLanguageSelector() {
    if (selectorReady) return;

    const dropdown = document.querySelector(".lang-dropdown");
    const selected = document.getElementById("langSelected");
    const options = document.getElementById("langOptions");

    if (!dropdown || !selected || !options) return;

    const setOpen = open => {
        dropdown.classList.toggle("active", open);
        selected.setAttribute("aria-expanded", String(open));
        options.hidden = !open;
    };

    const selectOption = async option => {
        if (!option?.dataset.lang) return;

        await applyLanguage(option.dataset.lang);
        setOpen(false);
    };

    selected.addEventListener("click", event => {
        event.stopPropagation();
        setOpen(!dropdown.classList.contains("active"));
    });

    options.addEventListener("click", event => {
        selectOption(event.target.closest("[data-lang]"));
    });

    options.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        selectOption(event.target.closest("[data-lang]"));
    });

    document.addEventListener("click", event => {
        if (!dropdown.contains(event.target)) {
            setOpen(false);
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            setOpen(false);
        }
    });

    setOpen(false);
    selectorReady = true;
}

function getStoredLanguage() {
    try {
        return localStorage.getItem(storageKey);
    } catch {
        return null;
    }
}

function setStoredLanguage(language) {
    try {
        localStorage.setItem(storageKey, language);
        const cv = document.querySelector('[data-i18n="footer.cv"]');
        const info = config.info.find(item => item.i18n === "footer.cv");
        cv.href = `${info.href}_${language.toUpperCase()}.pdf`;
    } catch {
        return null;
    }
}

const initialLanguage = getInitialLanguage();

renderLanguageOptions(config.languages, initialLanguage);
bindLanguageSelector();

await applyLanguage(initialLanguage);