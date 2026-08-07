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