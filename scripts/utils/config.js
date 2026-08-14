const response = await fetch("../data/config.json");

if (!response.ok) {
    throw new Error(`Failed to load configuration: ${response.status} ${response.statusText}`);
}

const config = await response.json();

export default config;