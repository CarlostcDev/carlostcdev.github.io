export function autoHover(selector, interval) {
    const nodes = document.querySelectorAll(selector);

    if (!nodes.length) return null;

    let index = 0;
    let current = nodes[0];

    current.classList.add("hovered");

    const intervalId = setInterval(() => {
        current.classList.remove("hovered");

        index = (index + 1) % nodes.length;
        current = nodes[index];

        current.classList.add("hovered");
    }, interval);

    return () => {
        clearInterval(intervalId);
        current.classList.remove("hovered");
    };
}