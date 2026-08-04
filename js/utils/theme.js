const themeToggle = document.getElementById("themeToggle");
const body = document.body;

if (themeToggle) {
    if (localStorage.getItem("theme") === "light") {
        body.classList.add("light-mode");
    }

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("light-mode");

        localStorage.setItem(
            "theme",
            body.classList.contains("light-mode") ? "light" : "dark"
        );
    });
}