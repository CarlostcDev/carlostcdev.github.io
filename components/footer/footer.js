import config from "../../scripts/utils/config.js";

class Footer {
    constructor() {
        this.footer = document.getElementById("footer");
    }

    init() {
        if (!this.footer) return;
        this.render();
        this.setYear();
        this.setLocalTime();
    }

    render() {
        const info = this.footer.querySelector("#info");
        const social = this.footer.querySelector("#social");
        const stats = this.footer.querySelector("#stats");
        const language = localStorage.getItem("portfolio.language") || "EN";

        info.innerHTML = `
            <h2 data-i18n="${config.info.title.i18n}">${config.info.title.h2}</h2>
            <div class="info-container">
                ${config.info.items.map(item => {
                    const href = item.i18n === "footer.cv" ? `${item.href}_${language.toUpperCase()}.pdf` : item.href;
                    return `
                        <div class="list">
                            <svg class="icon"><use href="sources/svgs/sprite.svg#${item.icon}"></use></svg>
                            <a href="${href}" target="_blank" rel="noopener noreferrer" class="source" ${item.i18n ? `data-i18n="${item.i18n}"` : ""}>${item.text}</a>
                            ${item.i18n === "footer.localtime" ? `<span id="localtime"></span>` : ""}
                        </div>
                    `;
                }).join("")}
            </div>
        `;

        social.innerHTML = `
            <h2 data-i18n="${config.social.title.i18n}">${config.social.title.h2}</h2>
            <div class="buttons-container">
                ${config.social.items.map(item => `
                    <div class="button-item">
                        <a href="${item.href}" ${item.target ? `target="${item.target}"` : ""} ${item.rel ? `rel="${item.rel}"` : ""}>
                            <button class="${item.class}">
                                <svg><use href="sources/svgs/sprite.svg#${item.icon}"></use></svg>
                                ${item.i18n ? `<span data-i18n="${item.i18n}">${item.text}</span>` : item.text}
                            </button>
                        </a>
                    </div>
                `).join("")}
            </div>
        `;

        stats.innerHTML = `
            <h2 data-i18n="stats.h2">Estadísticas</h2>
            <div class="image-stats">
                <img src="https://github-readme-stats-sigma-five.vercel.app/api/top-langs/?username=CarlostcDev&layout=compact&bg_color=00000000&title_color=58A6FF&text_color=C9D1D9&hide_border=true&width=100%"
                     width="100%" class="image-stats" loading="lazy" alt="Carlos Tormo - Developer Stats">
            </div>
        `;
    }

    setYear() {
        const year = this.footer.querySelector("#year");
        if (year) {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            try {
                year.textContent = new Date().toLocaleDateString('es-ES', {timeZone: timezone, year: 'numeric'});
            } catch {
                year.textContent = new Date().getFullYear().toString();
            }
        }
    }

    setLocalTime() {
        const clock = this.footer.querySelector("#localtime");
        if (clock) {
            const timeFormatter = new Intl.DateTimeFormat("es-ES", {
                timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", second: "2-digit"
            });
            const updateTime = () => {clock.textContent = timeFormatter.format(new Date());};
            updateTime();
            setInterval(updateTime, 1000);
        }
    }
}

new Footer().init();