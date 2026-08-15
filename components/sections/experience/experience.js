import config from "../../../scripts/utils/config.js";

class Experience {
    constructor() {
        this.experience = document.getElementById("experience");
    }

    init() {
        if (!this.experience) return;
        this.#render();
    }

    #render() {
        const list = config.experience;
        const jobs = this.experience.querySelector("#jobs");
        if (!jobs || !list?.length) return;
        jobs.innerHTML = list.map(item => {
            const technologies = (item.technologies ?? []).map(tech => `<span class="${tech.class} skill">${tech.name}</span>`).join("");
            const phrases = (item.description ?? []).map(phrase => `<p data-i18n="${phrase.i18n}">${phrase.text}</p>`).join("");
            return `
                <div class="experience">
                    <div class="info">
                        <div class="logo">
                            <img src="${item.icon.src}" class="${item.icon.class}" loading="lazy" alt="${item.company.name}">
                        </div>
                        <div class="title">
                            <h3 data-i18n="${item.job.i18n}" class="h3">${item.job.name}</h3>
                            <h4 data-i18n="${item.company.i18n}" class="h4">${item.company.name}</h4>
                        </div>
                        <div class="data">
                            <ul class="list">
                                <li class="content">
                                    <svg class="icon" aria-hidden="true" focusable="false"><use href="sources/svgs/sprite.svg#business"></use></svg>
                                    <a href="${item.business.href}" target="_blank" rel="noopener noreferrer" data-i18n="${item.business.i18n}">${item.business.name}</a>
                                </li>
                                <li class="content">
                                    <svg class="icon" aria-hidden="true" focusable="false"><use href="sources/svgs/sprite.svg#location"></use> </svg>
                                    <span data-i18n="${item.location.i18n}">${item.location.text}</span>
                                </li>
                                <li class="content">
                                    <svg class="icon" aria-hidden="true" focusable="false"><use href="sources/svgs/sprite.svg#calendar"></use></svg>
                                    <span data-i18n="${item["range-years"].i18n}">${item["range-years"].years}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="description">
                        <div class="skills">${technologies}</div>
                        <div class="phrases">${phrases}</div>
                    </div>
                </div>
            `;
        }).join("");
    }
}

new Experience().init();