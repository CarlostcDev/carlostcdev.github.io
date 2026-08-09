import config from "../../../scripts/utils/config.js";

class Header {
    constructor() {
        this.header = document.querySelector("#header");
    }

    init() {
        if (!this.header) return;
        this.render();
    }

    render() {
        const menuConfig = config.menus?.[this.header.dataset.menu];
        const menu = this.header.querySelector("#menu-options");

        if (!menu || !menuConfig) return;

        menu.innerHTML = menuConfig.map((item, index) => {
            const key = item.i18n ? item.i18n.split(".")[1] : "";
            const i18n = item.i18n ? `data-i18n="${item.i18n}"` : "";
            return `<li><a href="${item.href}" ${i18n} class="nav-item nav-item-${index + 1}" id="nav-${key || index + 1}">${item.name}</a></li>`;
        }).join("");
    }
}

new Header().init();