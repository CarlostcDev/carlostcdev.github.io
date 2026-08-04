import config from "../config.js";

const buttons = document.getElementById("buttons");
for (const social of config.social) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = social.href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    const button = document.createElement("button");
    button.classList.add(social.class);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `/sources/svgs/sprite.svg#${social.icon}`);
    svg.append(use);
    button.append(svg);

    if (social.i18n) {
        const span = document.createElement("span");
        span.dataset.i18n = social.i18n;
        span.textContent = social.text;
        button.appendChild(span);
    } else {
        button.append(document.createTextNode(social.text));
    }

    a.appendChild(button);
    li.appendChild(a);
    buttons.appendChild(li);
}

const info = document.getElementById("info");
for (const inf of config.info) {
    const li = document.createElement("li");
    li.classList.add("list");
    const a = document.createElement("a");
    let language = localStorage.getItem("portfolio.language");
    if (inf.i18n === "footer.cv") a.href = inf.href + "_" + (language ? language.toUpperCase() : "EN") + ".pdf";
    else a.href = inf.href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.classList.add("source");
    if (inf.i18n) a.dataset.i18n = inf.i18n;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `/sources/svgs/sprite.svg#${inf.icon}`);
    svg.classList.add("icon")
    svg.append(use);
    a.textContent = inf.text;
    li.appendChild(svg);
    li.appendChild(a);
    info.appendChild(li);
}

function dateToYear(timeZone) {
    try {
        return new Date().toLocaleDateString('es-ES', {timeZone: timeZone, year: 'numeric'});
    } catch {
        return new Date().getFullYear().toString();
    }
}

const year = document.getElementById("year");
if (year) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    year.textContent = dateToYear(timezone);
}
