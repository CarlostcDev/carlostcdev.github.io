import config from "../../scripts/utils/config.js";

class Education {
    constructor() {
        this.courses = document.getElementById("courses");
    }

    init() {
        if (!this.courses) return;
        this.render();
    }

    render() {
        this.courses.innerHTML = config.education.map(item => {
            const info = [
                ["education", `<a href="${item.school.href}" target="_blank" rel="noopener noreferrer">${item.school.name}</a>`],
                ["location", `<span data-i18n="${item.location.i18n}">${item.location.text}</span>`],
                ["calendar", `<span>${item["range-years"]}</span>`]
            ];
            const technologies = item.technologies.map(tech => `<span class="${tech.class} skill">${tech.name}</span>`).join("");
            const phrases = item.description.map(phrase => `<p data-i18n="${phrase.i18n}">${phrase.text}</p>`).join("");
            return `
                <div class="education">
                    <div class="info">
                        <div class="title">
                            <h3 data-i18n="${item.title.i18n}" class="h3">${item.title.text}</h3>
                            <h4 data-i18n="${item.subtitle.i18n}" class="h4">${item.subtitle.text}</h4>
                        </div>
                        <div class="data">
                            <ul class="list">
                                ${info.map(([icon, content]) => `
                                    <li class="content">
                                        <svg class="icon"><use href="sources/svgs/sprite.svg#${icon}"></use></svg>
                                        ${content}
                                    </li>`).join("")}
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

new Education().init();