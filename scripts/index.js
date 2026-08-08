import("./utils/theme-mode.js");
import "./utils/config.js";
import { loadComponents } from "./utils/components.js"; await loadComponents();
await import("./animations/text-carousel.js");
import { loadLanguages } from "./utils/i18n.js"; await loadLanguages();