import config from "../../scripts/utils/config.js";

class Experience {
    constructor() {
        this.jobs = document.getElementById("jobs");
    }

    init() {
        if (!this.jobs) return;

        this.render();
    }

    render() {
        this.jobs.innerHTML = config.experience.map(item => {
            const info = [
                ["business", `<a href="${item.business.href}" target="_blank" rel="noopener noreferrer" data-i18n="${item.business.i18n}">${item.business.name}</a>`],
                ["location", `<span data-i18n="${item.location.i18n}">${item.location.text}</span>`],
                ["calendar", `<span data-i18n="${item["range-years"].i18n}">${item["range-years"].years}</span>`]
            ];
            const technologies = item.technologies.map(tech => `<span class="${tech.class} skill">${tech.name}</span>`).join("");
            const phrases = item.description.map(phrase => `<p data-i18n="${phrase.i18n}">${phrase.text}</p>`).join("");
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
                                ${info.map(([icon, content]) => `
                                    <li class="content">
                                        <svg class="icon"><use href="sources/svgs/sprite.svg#${icon}"></use></svg>
                                        ${content}
                                    </li>
                                `).join("")}
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