import config from "../../scripts/utils/config.js";

class Header {
    constructor() {
        this.header = document.querySelector("#header");
    }

    init() {
        if (!this.header) return;
        this.render();
        this.dataPage();
    }

    dataPage() {
        if (this.header.dataset.page !== "subpage") return;

        this.header.querySelectorAll("a[href^='#']").forEach(link => {
            if (!link.href.includes("#footer")) {
                link.href = `../${link.getAttribute("href")}`;
            }
        });
    }

    render() {
        const menu = this.header.querySelector("#menu-options");
        if (!menu || !config.menus?.header) return;

        menu.innerHTML = config.menus.header.map((item, index) => {
            const key = item.i18n.split(".")[1];
            return `<li><a href="${item.href}" data-i18n="${item.i18n}" class="nav-item nav-item-${index + 1}" id="nav-${key}">${item.label}</a></li>`;
        }).join("");
    }
}

new Header().init();