import config from "../../../scripts/utils/config.js";

class Navigator {
    constructor() {
        this.navigator = document.getElementById("navigator");
    }

    init() {
        if (!this.navigator) return;
        this.render();
    }

    render() {
        const menuConfig = config.menus?.[this.navigator.dataset.menu];
        const menuList = this.navigator.querySelector(".bottom-nav-list");

        if (!menuList || !menuConfig) return;

        menuList.innerHTML = menuConfig.map(item => {
            const href = item.href ? `href="${item.href}" ` : "";
            const cls = item.class ? ` ${item.class}` : "";
            const aria = item.ariaLabel ? `aria-label="${item.ariaLabel}" ` : "";
            const target = item.target ? `target="${item.target}" ` : "";
            const rel = item.rel ? `rel="${item.rel}" ` : "";
            const langList = item.hasLangOptions ? '<ul class="lang-options" role="listbox" hidden></ul>' : "";
            return `<li>${langList}<a ${href} class="nav-item${cls}" ${aria}${target}${rel}><div class="hover"><svg class="icon"><use href="/sources/svgs/sprite.svg#${item.icon}"></use></svg></div><span data-i18n="${item.i18n}">${item.name}</span></a></li>`;
        }).join("");
    }
}

new Navigator().init();