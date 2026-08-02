const response = await fetch("../../sources/config.json");
const config = await response.json();
const ul = document.getElementById("langOptions");

for (const lang of config.languages) {
    const li = document.createElement("li");
    li.dataset.lang = lang.code;
    li.dataset.key = lang.code;
    li.textContent = lang.name;
    ul.appendChild(li);
}