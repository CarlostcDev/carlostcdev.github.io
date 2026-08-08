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

    render() {
        const menuConfig = config.menus?.[this.header.dataset.menu];
        const menu = this.header.querySelector("#menu-options");

        if (!menu || !menuConfig) return;

        menu.innerHTML = menuConfig.map((item, index) => {
            const key = item.i18n.split(".")[1];
            return `<li><a href="${item.href}" data-i18n="${item.i18n}" class="nav-item nav-item-${index + 1}" id="nav-${key}">${item.label}</a></li>`;
        }).join("");
    }

    dataPage() {
        if (this.header.dataset.page !== "subpage") return;

        this.header.querySelectorAll("a[href^='#']").forEach(link => {
            if (!link.href.includes("#footer")) {
                link.href = `../${link.getAttribute("href")}`;
            }
        });
    }
}

new Header().init();