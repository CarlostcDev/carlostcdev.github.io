const el = document.getElementById("roles");

if (el) {
    let roles = normalizeRoles(window.languageState?.roles ?? []);
    let i = 0;

    el.style.display = "inline-block";
    el.style.transition = "all 0.5s ease";

    const updateRole = () => {
        if (roles.length === 0) return;
        i %= roles.length;
        el.textContent = roles[i];
    };

    window.addEventListener("portfolio:languagechange", event => {
        roles = normalizeRoles(event.detail?.roles);
        i = 0;
        updateRole();
    });

    updateRole();

    setInterval(() => {
        if (roles.length === 0) return;

        el.style.opacity = "0";
        el.style.transform = "translateY(-20px)";

        setTimeout(() => {
            el.style.transition = "none";
            el.style.transform = "translateY(20px)";

            i = (i + 1) % roles.length;
            updateRole();

            setTimeout(() => {
                el.style.transition = "all 0.5s ease";
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            }, 50);
        }, 500);
    }, 5000);
}

function normalizeRoles(roles) {
    return Array.isArray(roles) ? roles.filter(role => typeof role === "string" && role.trim()) : [];
}