import { translateElement } from "../utils/i18n.js";

export function clickCopy(element) {
    const target = document.getElementById(element);
    if (!target) return;

    target.addEventListener("click", async e => {
        e.preventDefault();
        const text = target.textContent.trim();
        await navigator.clipboard.writeText(text);
        const div = document.createElement("div");
        div.classList.add("copy-content");
        div.innerHTML = `
            <svg aria-hidden="true" class="copy-svg"><use href="../sources/svgs/sprite.svg#check"></use></svg>
            <span data-i18n="shared.msg-copied" class="copy-span"></span>
        `;
        document.body.appendChild(div);
        const msg = div.querySelector("[data-i18n]");
        translateElement(msg);
        setTimeout(() => div.remove(), 2000);
    });
}