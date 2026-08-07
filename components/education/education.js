import config from "../../scripts/utils/config.js";

const container = document.getElementById("courses");

const htmlContent = config.education.map(item => `
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
            <div class="skills">
                ${item.technologies.map(tech => `<span class="${tech.class} skill">${tech.name}</span>`).join('')}
            </div>
            <div class="phrases">
                ${item.description.map(phrase => `<span data-i18n="${phrase.i18n}" class="phrase">${phrase.text}</span>`).join('')}
            </div>
        </div>
    </div>
`).join('');

container.innerHTML = htmlContent;