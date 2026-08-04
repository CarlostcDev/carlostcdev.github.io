import config from "../config.js";

const buttons = document.getElementById("buttons");
buttons.innerHTML = config.social.map(social => `
    <li>
        <a href="${social.href}" target="_blank" rel="noopener noreferrer">
            <button class="${social.class}">
                <svg><use href="/sources/svgs/sprite.svg#${social.icon}"></use></svg>
                ${social.i18n
    ? `<span data-i18n="${social.i18n}">${social.text}</span>`
    : social.text
}
            </button>
        </a>
    </li>
`).join("");

const info = document.getElementById("info");
const language = localStorage.getItem("portfolio.language") || "EN";

info.innerHTML = config.info.map(inf => {
    const href = inf.i18n === "footer.cv"
        ? `${inf.href}_${language.toUpperCase()}.pdf`
        : inf.href;

    const i18nAttr = inf.i18n ? `data-i18n="${inf.i18n}"` : "";
    const localTimeSpan = inf.i18n === "footer.localtime" ? '<span id="localtime"></span>' : '';

    return `
        <li class="list">
            <svg class="icon"><use href="/sources/svgs/sprite.svg#${inf.icon}"></use></svg>
            <a href="${href}" target="_blank" rel="noopener noreferrer" class="source" ${i18nAttr}>
                ${inf.text}
            </a>
            ${localTimeSpan}
        </li>
    `;
}).join("");

const year = document.getElementById("year");
if (year) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
        year.textContent = new Date().toLocaleDateString('es-ES', {timeZone: timezone, year: 'numeric'});
    } catch {
        year.textContent = new Date().getFullYear().toString();
    }
}

const localTimeElement = document.getElementById("localtime");
if (localTimeElement) {
    const timeFormatter = new Intl.DateTimeFormat("es-ES", {
        timeZone: "Europe/Madrid",
        hour: "2-digit",
        minute: "2-digit"
    });

    const updateTime = () => {
        localTimeElement.textContent = timeFormatter.format(new Date());
    };

    updateTime();
    setInterval(updateTime, 1000);
}