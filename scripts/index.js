import "./utils/config.js";
import { loadComponents } from "./utils/components.js"; await loadComponents();
import { loadLanguages } from "./utils/i18n.js"; await loadLanguages();
import("./utils/theme-mode.js");
import("./features/click-copy.js");