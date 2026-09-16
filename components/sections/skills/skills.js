import config from "../../../scripts/utils/config.js";

class Skills {
    constructor() {
        this.skills = document.getElementById("skills");
    }

    init() {
        if (!this.skills) return;
        this.#render();
    }

    #render() {
        const list = config.skills;
        if (!list) return;

        Object.entries(list).forEach(([category, technologies]) => {
            const details = this.skills.querySelector(`.${category}-details`);
            if (!details) return;

            const content = details.querySelector(".content");
            if (!content) return;

            content.innerHTML = technologies.map(tech => `<li class="${tech.class} details-skill">${tech.name}</li>`).join("");
        });
    }
}

new Skills().init();