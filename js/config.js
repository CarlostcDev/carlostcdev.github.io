const config = await fetch("../sources/config.json").then(r => r.json());
export default config;