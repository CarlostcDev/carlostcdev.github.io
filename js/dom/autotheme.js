const config = await fetch("../../sources/config.json").then(r => r.json());
const rdm = Math.floor(Math.random() * config.themes.length);
document.documentElement.classList.add(config.themes[rdm]);