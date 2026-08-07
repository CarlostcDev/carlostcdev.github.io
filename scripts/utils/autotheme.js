import config from "./config.js";

const rdm = Math.floor(Math.random() * config.themes.length);
document.documentElement.classList.add(config.themes[rdm]);