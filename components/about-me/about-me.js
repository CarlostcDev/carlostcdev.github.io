import config from "../../scripts/utils/config.js";
import { autoHover } from "../../scripts/animations/auto-hover.js";

class AboutMe {
    constructor() {
        this.phrases = document.getElementById("phrases");
    }

    init() {
        if (!this.phrases) return;
        this.render();
    }

    render() {
        const fragment = document.createDocumentFragment();
        for (const phrase of config.phrases ?? []) {
            const p = document.createElement("p");
            p.classList.add("phrase");
            p.dataset.i18n = phrase.key;
            p.textContent = phrase.text;
            fragment.appendChild(p);
        }
        this.phrases.replaceChildren(fragment);
        autoHover(".phrase", 4600);
    }
}

new AboutMe().init();