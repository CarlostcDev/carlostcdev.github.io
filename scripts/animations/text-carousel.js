export function textCarousel(options = {}) {
    const {elementId, interval = 5000, configKey, eventName = "portfolio:languagechange"} = options;
    const element = document.getElementById(elementId);
    if (!element) return null;
    const getNestedValue = (object, path) => object && path ? path.split(".").reduce((value, key) => value?.[key], object) : undefined;
    const normalizeArray = array => Array.isArray(array) ? array.filter(item => typeof item === "string" && item.trim()) : [];
    let items = normalizeArray(getNestedValue(window.languageState, configKey));
    let index = 0;
    let intervalId;
    let animationTimeoutId;
    let resetTimeoutId;

    element.style.display = "inline-block";
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    const updateText = () => {
        if (!items.length) return;
        index %= items.length;
        element.textContent = items[index];
    };

    const handleLanguageChange = event => {
        items = normalizeArray(event.detail ? getNestedValue(event.detail, configKey) : undefined);
        index = 0;
        updateText();
    };

    const changeText = () => {
        if (!items.length) return;
        element.style.opacity = "0";
        element.style.transform = "translateY(-20px)";
        animationTimeoutId = setTimeout(() => {
            element.style.transition = "none";
            element.style.transform = "translateY(20px)";
            index = (index + 1) % items.length;
            updateText();
            resetTimeoutId = setTimeout(() => {
                element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }, 50);
        }, 500);
    };

    window.addEventListener(eventName, handleLanguageChange);
    updateText();
    intervalId = setInterval(changeText, interval);

    return () => {
        clearInterval(intervalId);
        clearTimeout(animationTimeoutId);
        clearTimeout(resetTimeoutId);
        window.removeEventListener(eventName, handleLanguageChange);
    };
}