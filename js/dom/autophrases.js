import { initAutoHover } from "./autohover.js";

const response = await fetch("../../sources/config.json");
const config = await response.json();
const div = document.getElementById("phrases");

for (const phrase of config.phrases) {
    const p = document.createElement("p");
    p.classList.add("phrase");
    p.dataset.key = phrase.key;
    p.textContent = phrase.text;
    div.appendChild(p);
}

initAutoHover();