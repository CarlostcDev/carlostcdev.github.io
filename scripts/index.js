import "./utils/config.js";
import { loadComponents } from "./utils/components.js"; await loadComponents();
import("./utils/theme-mode.js");
await import("./animations/text-carousel.js");
import { loadLanguages } from "./utils/i18n.js"; await loadLanguages();