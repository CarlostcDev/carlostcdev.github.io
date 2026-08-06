const config = await fetch("../data/config.json").then(r => r.json());
export default config;