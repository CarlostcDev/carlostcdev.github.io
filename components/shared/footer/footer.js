import config from "../../../scripts/utils/config.js";
import { clickCopy } from "../../../scripts/features/click-copy.js";

class Footer {
    constructor() {
        this.footer = document.getElementById("footer");
    }

    init() {
        if (!this.footer) return;
        this.#render();
        this.#setYear();
        this.#setLocalTime();
        this.#setCopy();
    }

    #render() {
        const info = this.footer.querySelector("#info");
        const social = this.footer.querySelector("#social");
        const stats = this.footer.querySelector("#stats");
        if (!info || !social || !stats) return;

        const language = (localStorage.getItem("portfolio.language") || "EN").toUpperCase();
        const basePath = this.footer.dataset.subpage === "true" ? "../../" : "";
        const infoItems = config.info?.items;
        const infoLen = infoItems?.length ?? 0;

        let infoHtml = `<h2 data-i18n="${config.info?.title?.i18n ?? ""}">${config.info?.title?.h2 ?? ""}</h2><div class="info-container">`;

        for (let i = 0; i < infoLen; i++) {
            const item = infoItems[i];
            const rawHref = item.i18n === "shared.cv" ? `${item.href}_${language}.pdf` : item.href;
            const hrefVal = rawHref && !rawHref.startsWith("http") && !rawHref.startsWith("mailto:") && !rawHref.startsWith("tel:") ? `${basePath}${rawHref}` : rawHref;
            const hrefAttr = hrefVal != null ? `href="${hrefVal}"` : "";
            const idAttr = item.icon === "copy" ? 'id="copy-mail"' : "";
            const i18nAttr = item.i18n ? `data-i18n="${item.i18n}"` : "";
            const targetAttr = item.href?.startsWith("http") ? 'target="_blank"' : "";
            const relAttr = targetAttr ? 'rel="noopener noreferrer"' : "";

            infoHtml += `
                <div class="list">
                    <svg class="icon" aria-hidden="true" focusable="false"><use href="${basePath}sources/svgs/sprite.svg#${item.icon}"></use></svg>
                    <a ${idAttr} ${hrefAttr} ${targetAttr} ${relAttr} class="source" ${i18nAttr}>${item.text}</a>
                    ${item.i18n === "shared.localtime" ? '<span id="localtime"></span>' : ""}
                </div>`;
        }

        infoHtml += "</div>";
        info.innerHTML = infoHtml;

        const socialItems = config.social?.items;
        const socialLen = socialItems?.length ?? 0;
        let socialHtml = `<h2 data-i18n="${config.social?.title?.i18n ?? ""}">${config.social?.title?.h2 ?? ""}</h2><div class="buttons-container">`;

        for (let i = 0; i < socialLen; i++) {
            const item = socialItems[i];
            const rawHref = item.href;
            const hrefVal = rawHref && !rawHref.startsWith("http") && !rawHref.startsWith("mailto:") && !rawHref.startsWith("tel:") ? `${basePath}${rawHref}` : rawHref;
            const hrefAttr = hrefVal != null ? `href="${hrefVal}"` : "";
            const targetAttr = item.target && !rawHref?.startsWith("mailto:") && !rawHref?.startsWith("tel:") ? `target="${item.target}"` : "";
            const relAttr = targetAttr && item.rel ? `rel="${item.rel}"` : "";

            socialHtml += `
                <div class="button-item">
                    <a ${hrefAttr} ${targetAttr} ${relAttr} class="${item.class}">
                        <svg aria-hidden="true" focusable="false"><use href="${basePath}sources/svgs/sprite.svg#${item.icon}"></use></svg>
                        ${item.i18n ? `<span data-i18n="${item.i18n}">${item.text}</span>` : item.text}
                    </a>
                </div>`;
        }

        socialHtml += "</div>";
        social.innerHTML = socialHtml;

        stats.innerHTML = `
            <h2 data-i18n="shared.stats">Estadísticas</h2>
            <div class="image-stats">
                <img src="https://streak-stats.demolab.com/?user=CarlostcDev&theme=dark"
                data-i18n="shared.github-stats" data-i18n-attr="alt" width="75%" class="img"
                loading="lazy" alt="GitHub contribution streak statistics for Carlos Tormo">
            </div>`;
    }

    #setYear() {
        const year = this.footer.querySelector("#year");
        if (!year) return;
        year.textContent = String(new Date().getFullYear());
    }

    #setLocalTime() {
        const clock = this.footer.querySelector("#localtime");
        if (!clock) return;

        const timeFormatter = new Intl.DateTimeFormat("es-ES", {
            timeZone: "Europe/Madrid",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        const updateTime = () => {clock.textContent = timeFormatter.format(new Date());};

        updateTime();
        setInterval(updateTime, 1000);
    }

    #setCopy() {
        clickCopy("copy-mail");
    }
}

new Footer().init();