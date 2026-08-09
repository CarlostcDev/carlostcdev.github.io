export async function loadComponents() {
    const elements = document.querySelectorAll("[data-component]");
    const isHome = location.pathname === "/" || location.pathname.endsWith("/index.html");

    await Promise.all(
        Array.from(elements).map(async element => {
            const [type, name] = element.dataset.component.split("/");

            if (type === "sections" && !isHome) return;

            const basePath = type === "shared" || type === "sections"
                ? `../../components/${type}/${name}/${name}`
                : `../../${type}/components/${name}/${name}`;

            const htmlPath = new URL(`${basePath}.html`, import.meta.url);
            const jsPath = new URL(`${basePath}.js`, import.meta.url);

            const res = await fetch(htmlPath);

            if (res.ok) {
                element.innerHTML = await res.text();
                await import(jsPath);
            }
        })
    );
}