import config from "../config.js";

const div = document.getElementById("phrases");
if (div) {
    const fragment = document.createDocumentFragment();

    for (const phrase of config.phrases ?? []) {
        const p = document.createElement("p");
        p.classList.add("phrase");
        p.dataset.i18n = phrase.key;
        p.textContent = phrase.text;
        fragment.appendChild(p);
    }

    div.replaceChildren(fragment);
}

const phrases = document.querySelectorAll(".phrase");
if (phrases.length > 0) {
    let index = 0;

    const nextHover = () => {
        phrases.forEach(phrase => phrase.classList.remove("hovered"));
        phrases[index].classList.add("hovered");
        index = (index + 1) % phrases.length;
    };

    nextHover();
    setInterval(nextHover, 4600);
}