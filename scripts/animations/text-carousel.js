export function textCarousel(options = {}) {
    const {
        elementId,
        interval = 5000,
        configKey,
        eventName = "portfolio:languagechange"
    } = options;

    const e = document.getElementById(elementId);
    if (!e) return null;

    const getNestedValue = (obj, path) => {
        if (!obj || !path) return undefined;
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const normalizeArray = (arr) => {
        return Array.isArray(arr) ? arr.filter(item => typeof item === "string" && item.trim()) : [];
    };

    let items = normalizeArray(getNestedValue(window.languageState, configKey));
    let i = 0;
    let timerId = null;
    e.style.display = "inline-block";
    e.style.transition = "all 0.5s ease";

    const updateText = () => {
        if (items.length === 0) return;
        i %= items.length;
        e.textContent = items[i];
    };

    const handleLanguageChange = (event) => {
        const eventData = event.detail ? getNestedValue(event.detail, configKey) : undefined;
        items = normalizeArray(eventData);
        i = 0;
        updateText();
    };

    window.addEventListener(eventName, handleLanguageChange);
    updateText();

    timerId = setInterval(() => {
        if (items.length === 0) return;
        e.style.opacity = "0";
        e.style.transform = "translateY(-20px)";

        setTimeout(() => {
            e.style.transition = "none";
            e.style.transform = "translateY(20px)";
            i = (i + 1) % items.length;
            updateText();

            setTimeout(() => {
                e.style.transition = "all 0.5s ease";
                e.style.opacity = "1";
                e.style.transform = "translateY(0)";
            }, 50);
        }, 500);
    }, interval);

    return () => {
        if (timerId) clearInterval(timerId);
        window.removeEventListener(eventName, handleLanguageChange);
    };
}