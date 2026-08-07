import "./utils/config.js";
import { loadComponents } from "./utils/components.js";

await loadComponents();

await import("./animations/carousel.js");
await import("./utils/autotheme.js");
await import("./utils/i18n.js");