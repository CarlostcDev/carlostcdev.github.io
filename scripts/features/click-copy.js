export function clickCopy(element) {
    document.getElementById(element).addEventListener("click", async (e) => {
        e.preventDefault();

        await navigator.clipboard.writeText(e.target.textContent.trim());

        const div = document.createElement("div");
        div.textContent = "¡Copiado!";
        Object.assign(div.style, {
            position: "fixed",
            bottom: "10%",
            right: "50%",
            padding: "20px 30px",
            background: "var(--dark)",
            color: "var(--primary)",
            borderRadius: "4px",
            zIndex: "9999"
        });

        document.body.appendChild(div);
        setTimeout(() => div.remove(), 2000);
    });
}