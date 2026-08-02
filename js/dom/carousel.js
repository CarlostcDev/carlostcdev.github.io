function carousel() {
    const el = document.getElementById("roles");
    let i = 0;

    if (!el) return;

    el.style.display = "inline-block";
    el.style.transition = "all 0.5s ease";

    setInterval(() => {
        if (!window.ROLES || window.ROLES.length === 0) return;

        el.style.opacity = "0";
        el.style.transform = "translateY(-20px)";

        setTimeout(() => {
            el.style.transition = "none";
            el.style.transform = "translateY(20px)";

            i = (i + 1) % window.ROLES.length;
            el.textContent = window.ROLES[i];

            setTimeout(() => {
                el.style.transition = "all 0.5s ease";
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            }, 50);
        }, 500);
    }, 5000);
}

carousel();