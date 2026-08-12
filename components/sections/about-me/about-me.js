import config from "../../../scripts/utils/config.js";
import { autoHover } from "../../../scripts/animations/auto-hover.js";

class AboutMe {
    constructor() {
        this.phrases = document.getElementById("phrases");
    }

    init() {
        if (!this.phrases) return;
        this.#render();
    }

    #render() {
        const list = config.phrases;
        if (!this.phrases || !list?.length) return;
        const fragment = document.createDocumentFragment();
        const len = list.length;
        for (let i = 0; i < len; i++) {
            const item = list[i];
            const p = document.createElement("p");
            p.className = "phrase";
            p.dataset.i18n = item.key;
            p.textContent = item.text;
            fragment.appendChild(p);
        }
        this.phrases.replaceChildren(fragment);
        autoHover(".phrase", 4600);
    }
}

new AboutMe().init();