const hamburger = document.getElementById("menu");
const menu = document.querySelector(".menu");

hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
});

document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
        menu.classList.remove("active");
    }
});