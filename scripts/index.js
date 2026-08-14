import { loadComponents } from "./utils/components.js";
import { loadLanguages } from "./utils/i18n.js";

await loadComponents();

await Promise.all([
    loadLanguages(),
    import("./utils/theme-mode.js"),
    import("./features/click-copy.js")
]);