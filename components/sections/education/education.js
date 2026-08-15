import config from "../../../scripts/utils/config.js";

class Education {
    constructor() {
        this.education = document.getElementById("education");
    }

    init() {
        if (!this.education) return;
        this.#render();
    }

    #render() {
        const list = config.education;
        const courses = this.education.querySelector("#courses");
        if (!courses || !list?.length) return;
        courses.innerHTML = list.map(item => {
            const technologies = (item.technologies ?? []).map(tech => `<span class="${tech.class} skill">${tech.name}</span>`).join("");
            const phrases = (item.description ?? []).map(phrase => `<p data-i18n="${phrase.i18n}">${phrase.text}</p>`).join("");
            return `
                <div class="education">
                    <div class="info">
                        <div class="title">
                            <h3 data-i18n="${item.title.i18n}" class="h3">${item.title.text}</h3>
                            <h4 data-i18n="${item.subtitle.i18n}" class="h4">${item.subtitle.text}</h4>
                        </div>
                        <div class="data">
                            <ul class="list">
                                <li class="content">
                                    <svg class="icon" aria-hidden="true" focusable="false"><use href="sources/svgs/sprite.svg#education"></use></svg>
                                    <a href="${item.school.href}" target="_blank" rel="noopener noreferrer">${item.school.name}</a>
                                </li>
                                <li class="content">
                                    <svg class="icon" aria-hidden="true" focusable="false"><use href="sources/svgs/sprite.svg#location"></use></svg>
                                    <span data-i18n="${item.location.i18n}">${item.location.text}</span>
                                </li>
                                <li class="content">
                                    <svg class="icon" aria-hidden="true" focusable="false"><use href="sources/svgs/sprite.svg#calendar"></use></svg>
                                    <span>${item["range-years"]}</span>
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

new Education().init();