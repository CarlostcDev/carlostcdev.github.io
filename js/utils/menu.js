export function initMenu() {
    const hamburger = document.getElementById("menu");
    const menu = document.querySelector(".menu-container");

    if (!hamburger || !menu) return;

    hamburger.addEventListener("click", event => {
        event.stopPropagation();
        menu.classList.toggle("active");
        hamburger.setAttribute("aria-expanded", String(menu.classList.contains("active")));
    });

    document.addEventListener("click", event => {
        if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
            menu.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        }
    });
}
