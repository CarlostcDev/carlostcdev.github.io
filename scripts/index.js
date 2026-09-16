import { loadComponents } from "./utils/components.js";
import { loadLanguages } from "./utils/i18n.js";
import "./utils/theme-change.js";

await loadComponents();
await import("./utils/theme-mode.js");

await Promise.all([
    loadLanguages(),
    import("./features/click-copy.js")
]);