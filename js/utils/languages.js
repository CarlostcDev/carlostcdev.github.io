import { renderLanguageOptions } from "../dom/autolanguages.js";

const storageKey = "portfolio.language";
const defaultLanguage = "es";
const configUrl = new URL("../../sources/config.json", import.meta.url);
const translationsCache = new Map();
let configPromise = null;
let selectorReady = false;
let languageState = {
    code: defaultLanguage,
    translations: {},
    roles: []
};

export async function initLanguages() {
    const config = await loadConfig();
    const initialLanguage = getInitialLanguage(config);

    renderLanguageOptions(config.languages, initialLanguage);
    bindLanguageSelector();

    return applyLanguage(initialLanguage);
}

export async function applyLanguage(language) {
    const config = await loadConfig();
    let code = resolveLanguage(language, config) ?? defaultLanguage;
    let translations = await loadTranslationsSafely(code);

    if (!translations && code !== defaultLanguage) {
        code = defaultLanguage;
        translations = await loadTranslationsSafely(defaultLanguage);
    }

    if (!translations) {
        return languageState;
    }

    const fallback = code === defaultLanguage ? translations : await loadTranslationsSafely(defaultLanguage);
    const roles = getValue(translations, "home.roles-list") ?? getValue(fallback, "home.roles-list") ?? [];

    document.documentElement.lang = code;
    translateDocument(translations, fallback);
    updateActiveLanguage(code);
    setStoredLanguage(code);

    languageState = { code, translations, roles };

    window.dispatchEvent(new CustomEvent("portfolio:languagechange", {
        detail: languageState
    }));

    return languageState;
}

export function getLanguageState() {
    return languageState;
}

function loadConfig() {
    configPromise ??= fetchJson(configUrl);
    return configPromise;
}

async function loadTranslationsSafely(language) {
    try {
        return await loadTranslations(language);
    } catch {
        return null;
    }
}

async function loadTranslations(language) {
    if (translationsCache.has(language)) {
        return translationsCache.get(language);
    }

    const translations = await fetchJson(new URL(`../../sources/translates/${language}.json`, import.meta.url));
    translationsCache.set(language, translations);

    return translations;
}

async function fetchJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
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
        const option = event.target.closest("[data-lang]");
        selectOption(option);
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

function getInitialLanguage(config) {
    const storedLanguage = getStoredLanguage();
    const resolvedStoredLanguage = resolveLanguage(storedLanguage, config);

    if (resolvedStoredLanguage) {
        return resolvedStoredLanguage;
    }

    for (const language of navigator.languages ?? [navigator.language]) {
        const resolvedLanguage = resolveLanguage(language, config);

        if (resolvedLanguage) {
            return resolvedLanguage;
        }
    }

    return defaultLanguage;
}

function resolveLanguage(language, config) {
    if (!language || !Array.isArray(config.languages)) return null;

    const normalizedLanguage = normalizeLanguage(language);
    const baseLanguage = normalizedLanguage.split("-")[0];

    for (const supportedLanguage of config.languages) {
        const codes = [supportedLanguage.code, ...(supportedLanguage.aliases ?? [])].map(normalizeLanguage);

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
        const value = getValue(translations, element.dataset.i18n) ?? getValue(fallback, element.dataset.i18n);

        if (typeof value !== "string" && typeof value !== "number") return;

        const attribute = element.dataset.i18nAttr;

        if (attribute) {
            element.setAttribute(attribute, value);
            return;
        }

        element.textContent = value;
    });
}

function getValue(source, path) {
    return path.split(".").reduce((value, key) => value?.[key], source);
}

function updateActiveLanguage(language) {
    document.querySelectorAll("#langOptions [data-lang]").forEach(option => {
        const isActive = option.dataset.lang === language;

        option.classList.toggle("active", isActive);
        option.setAttribute("aria-selected", String(isActive));
    });
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
    } catch {
        return null;
    }
}
