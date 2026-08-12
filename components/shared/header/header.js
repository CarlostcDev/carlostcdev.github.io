import config from "../../../scripts/utils/config.js";

class Header {
    constructor() {
        this.header = document.getElementById("header");
    }

    init() {
        if (!this.header) return;
        this.#render();
    }

    #render() {
        this.menu = this.header.querySelector("#menu-options");
        if (!this.menu) return;
        const path = this.header.dataset.menu?.split(".") ?? [];
        const menuConfig = path.reduce((acc, key) => acc?.[key], config.menus);
        if (!Array.isArray(menuConfig)) return;

        this.menu.innerHTML = menuConfig.map((item, index) => {
            const key = item.i18n ? item.i18n.split(".")[1] : "";
            const i18n = item.i18n ? `data-i18n="${item.i18n}"` : "";
            const target = item.target ? `target="${item.target}"` : "";
            const rel = item.rel ? `rel="${item.rel}"` : "";
            return `<li><a href="${item.href ?? "#"}" ${i18n} ${target} ${rel} class="nav-item nav-item-${index + 1}" id="nav-${key || index + 1}">${item.name}</a></li>`;
        }).join("");
    }
}

new Header().init();