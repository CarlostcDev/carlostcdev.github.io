export function initAutoHover() {
    const frases = document.querySelectorAll(".phrase");

    if (frases.length === 0) return;

    let index = 0;

    function nextHover() {
        frases.forEach(f => f.classList.remove("hovered"));
        frases[index].classList.add("hovered");
        index = (index + 1) % frases.length;
    }

    nextHover();
    setInterval(nextHover, 4600);
}