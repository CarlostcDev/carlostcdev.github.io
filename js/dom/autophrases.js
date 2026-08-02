import { initAutoHover } from "./autohover.js";

const configUrl = new URL("../../sources/config.json", import.meta.url);

export async function initAutoPhrases() {
    const div = document.getElementById("phrases");

    if (!div) return;

    const response = await fetch(configUrl);

    if (!response.ok) return;

    const config = await response.json();
    const fragment = document.createDocumentFragment();

    for (const phrase of config.phrases ?? []) {
        const p = document.createElement("p");
        p.classList.add("phrase");
        p.dataset.i18n = phrase.key;
        p.textContent = phrase.text;
        fragment.appendChild(p);
    }

    div.replaceChildren(fragment);
    initAutoHover();
}
