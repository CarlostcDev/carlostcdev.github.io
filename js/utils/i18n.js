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

async function loadTranslations(language) {
    if (translationsCache.has(language)) {
        return translationsCache.get(language);
    }

    try {
        const translations = await fetch(`/data/translates/${language}.json`)
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
    document.querySelectorAll(".lang-options [data-lang]").forEach(option => {
        const active = option.dataset.lang === language;

        option.classList.toggle("active", active);
        option.setAttribute("aria-selected", String(active));
    });
}

function bindLanguageSelector() {
    if (selectorReady) return;

    const headerDropdown = document.querySelector(".lang-dropdown");
    const mobileOptions = document.querySelector("#menu .lang-options");
    const mobileToggle = document.querySelector(".lang-toggle");
    const selected = document.getElementById("langSelected");
    const headerOptions = document.querySelector(".lang-dropdown .lang-options");

    const setOpen = (open) => {
        if (headerDropdown) headerDropdown.classList.toggle("active", open);
        if (selected) selected.setAttribute("aria-expanded", String(open));
        if (headerOptions) headerOptions.hidden = !open;
        if (mobileOptions) mobileOptions.hidden = !open;
    };

    const toggleDropdown = (event) => {
        event.stopPropagation();
        const isHidden = mobileOptions ? mobileOptions.hidden : true;
        setOpen(isHidden);
    };

    if (selected) selected.addEventListener("click", toggleDropdown);
    if (mobileToggle) mobileToggle.addEventListener("click", toggleDropdown);

    document.querySelectorAll(".lang-options").forEach(optionsList => {
        optionsList.addEventListener("click", event => {
            const option = event.target.closest("[data-lang]");
            if (!option?.dataset.lang) return;
            applyLanguage(option.dataset.lang).then(() => {});
            setOpen(false);
        });
    });

    document.addEventListener("click", event => {
        if (!event.target.closest(".lang-dropdown") && !event.target.closest(".lang-toggle")) {
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
        if (cv && info) cv.href = `${info.href}_${language.toUpperCase()}.pdf`;
    } catch {
        return null;
    }
}

const initialLanguage = getInitialLanguage();

renderLanguageOptions(config.languages, initialLanguage);
bindLanguageSelector();

await applyLanguage(initialLanguage);