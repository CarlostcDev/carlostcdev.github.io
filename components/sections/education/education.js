import config from "../../../scripts/utils/config.js";

class Education {
    constructor() {
        this.courses = document.getElementById("courses");
    }

    init() {
        if (!this.courses) return;
        this.#render();
    }

    #render() {
        const list = config.education;
        if (!this.courses || !list?.length) return;
        let html = "";
        const len = list.length;
        for (let i = 0; i < len; i++) {
            const item = list[i];
            let technologies = "";
            const techList = item.technologies;
            const techLen = techList?.length ?? 0;
            for (let j = 0; j < techLen; j++) {
                const tech = techList[j];
                technologies += `<span class="${tech.class} skill">${tech.name}</span>`;
            }
            let phrases = "";
            const phraseList = item.description;
            const phraseLen = phraseList?.length ?? 0;
            for (let k = 0; k < phraseLen; k++) {
                const phrase = phraseList[k];
                phrases += `<p data-i18n="${phrase.i18n}">${phrase.text}</p>`;
            }
            html += `
            <div class="education">
                <div class="info">
                    <div class="title">
                        <h3 data-i18n="${item.title.i18n}" class="h3">${item.title.text}</h3>
                        <h4 data-i18n="${item.subtitle.i18n}" class="h4">${item.subtitle.text}</h4>
                    </div>
                    <div class="data">
                        <ul class="list">
                            <li class="content">
                                <svg class="icon"><use href="sources/svgs/sprite.svg#education"></use></svg>
                                <a href="${item.school.href}" target="_blank" rel="noopener noreferrer">${item.school.name}</a>
                            </li>
                            <li class="content">
                                <svg class="icon"><use href="sources/svgs/sprite.svg#location"></use></svg>
                                <span data-i18n="${item.location.i18n}">${item.location.text}</span>
                            </li>
                            <li class="content">
                                <svg class="icon"><use href="sources/svgs/sprite.svg#calendar"></use></svg>
                                <span>${item["range-years"]}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="description">
                    <div class="skills">${technologies}</div>
                    <div class="phrases">${phrases}</div>
                </div>
            </div>`;
        }

        this.courses.innerHTML = html;
    }
}

new Education().init();