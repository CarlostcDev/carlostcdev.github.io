import config from "../../../scripts/utils/config.js";

class Experience {
    constructor() {
        this.jobs = document.getElementById("jobs");
    }

    init() {
        if (!this.jobs) return;
        this.#render();
    }

    #render() {
        const list = config.experience;
        if (!this.jobs || !list?.length) return;
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
                                <svg class="icon"><use href="sources/svgs/sprite.svg#business"></use></svg>
                                <a href="${item.business.href}" target="_blank" rel="noopener noreferrer" data-i18n="${item.business.i18n}">${item.business.name}</a>
                            </li>
                            <li class="content">
                                <svg class="icon"><use href="sources/svgs/sprite.svg#location"></use></svg>
                                <span data-i18n="${item.location.i18n}">${item.location.text}</span>
                            </li>
                            <li class="content">
                                <svg class="icon"><use href="sources/svgs/sprite.svg#calendar"></use></svg>
                                <span data-i18n="${item["range-years"].i18n}">${item["range-years"].years}</span>
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
        this.jobs.innerHTML = html;
    }
}

new Experience().init();