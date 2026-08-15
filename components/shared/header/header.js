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
        const menu = this.header.querySelector("#menu-options");
        if (!menu) return;
        const path = this.header.dataset.menu?.split(".") ?? [];
        const menuConfig = path.reduce((acc, key) => acc?.[key], config.menus);
        if (!Array.isArray(menuConfig)) return;
        menu.innerHTML = menuConfig.map((item, index) => {
            const key = item.i18n?.split(".").pop() ?? "";
            const i18n = item.i18n ? `data-i18n="${item.i18n}"` : "";
            const target = item.target ? `target="${item.target}"` : "";
            const rel = item.rel ? `rel="${item.rel}"` : "";
            return `<li><a href="${item.href ?? "#"}" ${i18n} ${target} ${rel} class="nav-item nav-item-${index + 1}" id="nav-${key || index + 1}">${item.name}</a></li>`;
        }).join("");
    }
}

new Header().init();