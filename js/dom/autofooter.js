import config from "../config.js";

const buttons = document.getElementById("social");
const socialH2 = config.social.find(item => item.h2);
const socialLinks = config.social.filter(item => item.href);

buttons.innerHTML = `
    ${socialH2 ? `<h2 data-i18n="${socialH2.i18n}">${socialH2.h2}</h2>` : ""}
    <div class="buttons-container">
        ${socialLinks.map(social => `
            <div class="button-item">
                <a href="${social.href}" ${social.target ? `target="${social.target}"` : ""} ${social.rel ? `rel="${social.rel}"` : ""}>
                    <button class="${social.class}">
                        <svg><use href="/sources/svgs/sprite.svg#${social.icon}"></use></svg>
                        ${social.i18n ? `<span data-i18n="${social.i18n}">${social.text}</span>` : social.text}
                    </button>
                </a>
            </div>
        `).join("")}
    </div>
`;

const info = document.getElementById("info");
const language = localStorage.getItem("portfolio.language") || "EN";
const infoH2 = config.info.find(item => item.h2);
const infoItems = config.info.filter(item => item.icon);

info.innerHTML = `
    ${infoH2 ? `<h2 data-i18n="${infoH2.i18n}">${infoH2.h2}</h2>` : ""}
    <div class="info-container">
        ${infoItems.map(inf => {
    const href = inf.i18n === "footer.cv" ? `${inf.href}_${language.toUpperCase()}.pdf` : inf.href;
    const i18nAttr = inf.i18n ? `data-i18n="${inf.i18n}"` : "";
    const localTimeSpan = inf.i18n === "footer.localtime" ? '<span id="localtime"></span>' : '';

    return `
                <div class="list">
                    <svg class="icon"><use href="/sources/svgs/sprite.svg#${inf.icon}"></use></svg>
                    <a href="${href}" target="_blank" rel="noopener noreferrer" class="source" ${i18nAttr}>
                        ${inf.text}
                    </a>
                    ${localTimeSpan}
                </div>
            `;
}).join("")}
    </div>
`;

const year = document.getElementById("year");
if (year) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
        year.textContent = new Date().toLocaleDateString('es-ES', {timeZone: timezone, year: 'numeric'});
    } catch {
        year.textContent = new Date().getFullYear().toString();
    }
}

const clock = document.getElementById("localtime");
if (clock) {
    const timeFormatter = new Intl.DateTimeFormat("es-ES", {
        timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
    const updateTime = () => {clock.textContent = timeFormatter.format(new Date());};
    updateTime();
    setInterval(updateTime, 1000);
}