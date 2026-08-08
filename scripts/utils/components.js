export async function loadComponents() {
    const elements = document.querySelectorAll("[data-component]");

    await Promise.all(
        Array.from(elements).map(async (element) => {
            const name = element.dataset.component;
            const htmlPath = `./components/${name}/${name}.html`;
            const jsPath = `../../components/${name}/${name}.js`;

            const res = await fetch(htmlPath);
            if (res.ok) {
                element.innerHTML = await res.text();
                await import(jsPath).catch(() => null);
            }
        })
    );
}