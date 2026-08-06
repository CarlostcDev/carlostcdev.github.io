import config from "../config.js";

const container = document.getElementById("jobs");

const htmlContent = config.experience.map(item => `
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