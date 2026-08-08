export function autoHover(element, time) {
    const node = document.querySelectorAll(element);
    if (node.length > 0) {
        let index = 0;

        const nextNode = () => {
            node.forEach(phrase => phrase.classList.remove("hovered"));
            node[index].classList.add("hovered");
            index = (index + 1) % node.length;
        };

        nextNode();
        setInterval(nextNode, time);
    }
}