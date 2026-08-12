import config from "../../../scripts/utils/config.js";

class Navigator {
    constructor() {
        this.navigator = document.getElementById("navigator");
    }

    init() {
        if (!this.navigator) return;
        this.#render();
    }

    #render() {
        const path = this.navigator.dataset.menu?.split(".") ?? [];
        const menuConfig = path.reduce((acc, key) => acc?.[key], config.menus);
        if (!menuConfig || !Array.isArray(menuConfig)) return;
        let menuList = this.navigator.querySelector(".bottom-nav-list");
        if (!menuList) {
            menuList = document.createElement("menu");
            menuList.className = "bottom-nav-list";
            this.navigator.appendChild(menuList);
        }
        let html = "";
        const len = menuConfig.length;
        for (let i = 0; i < len; i++) {
            const item = menuConfig[i];
            const href = item.href ? `href="${item.href}" ` : "";
            const cls = item.class ? ` ${item.class}` : "";
            const aria = item.ariaLabel ? `aria-label="${item.ariaLabel}" ` : "";
            const target = item.target ? `target="${item.target}" ` : "";
            const rel = item.rel ? `rel="${item.rel}" ` : "";
            const langList = item.hasLangOptions ? '<ul class="lang-options" role="listbox" hidden></ul>' : "";
            html += `<li>${langList}<a ${href}class="nav-item${cls}" ${aria}${target}${rel}><div class="hover"><svg class="icon"><use href="/sources/svgs/sprite.svg#${item.icon}"></use></svg></div><span data-i18n="${item.i18n}">${item.name}</span></a></li>`;
        }
        menuList.innerHTML = html;
    }
}

new Navigator().init();