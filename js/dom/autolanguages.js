export function renderLanguageOptions(languages, selectedLanguage) {
    const ul = document.getElementById("langOptions");

    if (!ul || !Array.isArray(languages)) return;

    const fragment = document.createDocumentFragment();

    for (const language of languages) {
        const li = document.createElement("li");
        const isSelected = language.code === selectedLanguage;

        li.dataset.lang = language.code;
        li.dataset.i18n = `header.${language.code}`;
        li.textContent = language.name;
        li.role = "option";
        li.tabIndex = 0;
        li.classList.toggle("active", isSelected);
        li.setAttribute("aria-selected", String(isSelected));
        fragment.appendChild(li);
    }

    ul.replaceChildren(fragment);
}
