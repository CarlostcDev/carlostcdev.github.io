export async function loadComponents() {
    const elements = document.querySelectorAll("[data-component]");

    for (const element of elements) {
        const name = element.dataset.component;
        const base = `components/${name}/${name}`;

        const response = await fetch(`${base}.html`);

        if (!response.ok) {
            console.error(`No se pudo cargar ${base}.html`);
            continue;
        }

        element.innerHTML = await response.text();

        await import(`../../${base}.js`);
    }
}