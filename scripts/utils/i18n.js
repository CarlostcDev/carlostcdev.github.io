import config from "./config.js";

const STORAGE_KEY = "portfolio.language";
const DEFAULT_LANGUAGE = "en";

const translationsCache = new Map();

let selectorReady = false;
let languageRequestId = 0;

let languageState = {
    code: DEFAULT_LANGUAGE,
    translations: {},
    roles: []
};

export function renderLanguageOptions(
    languages = config.languages,
    selectedLanguage = getCurrentLanguage()
) {
    const lists = document.querySelectorAll(".lang-options");

    if (!lists.length || !Array.isArray(languages)) return;

    const html = languages.map(language => {
        const selected = language.code === selectedLanguage;

        return `
            <li
                data-lang="${language.code}"
                data-i18n="global.languages.${language.code}"
                role="option"
                tabindex="0"
                class="${selected ? "active" : ""}"
                aria-selected="${selected}"
            >
                ${language.name}
            </li>
        `;
    }).join("");

    lists.forEach(list => {
        list.innerHTML = html;
        list.setAttribute("role", "listbox");
    });
}

export async function applyLanguage(language) {
    const requestId = ++languageRequestId;
    const targetCode = resolveLanguage(language) ?? DEFAULT_LANGUAGE;

    let translations = await loadTranslations(targetCode);

    if (requestId !== languageRequestId) return;

    if (!translations && targetCode !== DEFAULT_LANGUAGE) {
        translations = await loadTranslations(DEFAULT_LANGUAGE);
    }

    if (requestId !== languageRequestId || !translations) return;

    const fallback = targetCode === DEFAULT_LANGUAGE
        ? translations
        : await loadTranslations(DEFAULT_LANGUAGE) ?? translations;

    if (requestId !== languageRequestId) return;

    const roles =
        getValue(translations, "portfolio.home.roles-list") ??
        getValue(fallback, "portfolio.home.roles-list") ??
        [];

    languageState = {
        code: targetCode,
        translations,
        roles
    };

    document.documentElement.lang = targetCode;

    translateDocument(translations, fallback);
    updateActiveLanguage(targetCode);
    updateCvLink(targetCode);
    setStoredLanguage(targetCode);

    window.dispatchEvent(
        new CustomEvent("portfolio:languagechange", {
            detail: languageState
        })
    );
}

async function loadTranslations(language) {
    if (translationsCache.has(language)) {
        return translationsCache.get(language);
    }

    const translationPromise = fetch(`/data/translates/${language}.json`)
        .then(response => {
            if (!response.ok) {
                return null;
            }

            return response.json();
        })
        .catch(() => null);

    translationsCache.set(language, translationPromise);

    return translationPromise;
}

function getInitialLanguage() {
    const storedLanguage = resolveLanguage(getStoredLanguage());

    if (storedLanguage) {
        return storedLanguage;
    }

    const browserLanguages = navigator.languages?.length
        ? navigator.languages
        : [navigator.language];

    for (const language of browserLanguages) {
        const resolvedLanguage = resolveLanguage(language);

        if (resolvedLanguage) {
            return resolvedLanguage;
        }
    }

    return DEFAULT_LANGUAGE;
}

function resolveLanguage(language) {
    if (!language) return null;

    const normalizedLanguage = normalizeLanguage(language);
    const baseLanguage = normalizedLanguage.split("-")[0];

    for (const item of config.languages) {
        const itemCode = normalizeLanguage(item.code);
        const aliases = (item.aliases ?? []).map(normalizeLanguage);

        if (
            itemCode === normalizedLanguage ||
            itemCode === baseLanguage ||
            aliases.includes(normalizedLanguage) ||
            aliases.includes(baseLanguage)
        ) {
            return item.code;
        }
    }

    return null;
}

function normalizeLanguage(language) {
    return String(language)
        .trim()
        .toLowerCase()
        .replaceAll("_", "-");
}

function translateDocument(translations, fallback) {
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const keyPath = element.dataset.i18n;

        if (!keyPath) return;

        const value =
            getValue(translations, keyPath) ??
            getValue(fallback, keyPath);

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

    return path
        .split(".")
        .reduce((value, key) => value?.[key], source);
}

function updateActiveLanguage(language) {
    document
        .querySelectorAll(".lang-options [data-lang]")
        .forEach(option => {
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

        headerDropdown?.classList.toggle("active", open);
        selected?.setAttribute("aria-expanded", String(open));

        allOptions.forEach(options => {
            options.hidden = !open;
        });
    };

    document.addEventListener("click", event => {
        const toggleButton = event.target.closest(
            "#langSelected, .lang-toggle"
        );

        const optionItem = event.target.closest("[data-lang]");

        if (toggleButton) {
            event.stopPropagation();

            const navOptions = document.querySelector(".lang-options");
            const isHidden = navOptions?.hidden ?? true;

            setOpen(isHidden);
            return;
        }

        if (optionItem) {
            const selectedLanguage = optionItem.dataset.lang;

            if (selectedLanguage) {
                applyLanguage(selectedLanguage).catch(console.error);
                setOpen(false);
            }

            return;
        }

        if (!event.target.closest(".lang-dropdown")) {
            setOpen(false);
        }
    });

    document.addEventListener("keydown", event => {
        const optionItem = event.target.closest(
            '.lang-options [role="option"]'
        );

        if (!optionItem) return;

        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();

        const selectedLanguage = optionItem.dataset.lang;

        if (selectedLanguage) {
            applyLanguage(selectedLanguage).catch(console.error);
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
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

function setStoredLanguage(language) {
    try {
        localStorage.setItem(STORAGE_KEY, language);
    } catch {}
}

function updateCvLink(language) {
    const cv = document.querySelector('[data-i18n="shared.cv"]');
    const info = config.info?.items?.find(
        item => item.i18n === "shared.cv"
    );

    if (!cv || !info) return;

    cv.href = `${info.href}_${language.toUpperCase()}.pdf`;
}

export async function loadLanguages() {
    const initialLanguage = getInitialLanguage();

    renderLanguageOptions(config.languages, initialLanguage);
    bindLanguageSelector();

    await applyLanguage(initialLanguage);
}