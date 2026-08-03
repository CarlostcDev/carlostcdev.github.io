import { initAutoPhrases } from './dom/autophrases.js';
import { initCarousel } from './dom/carousel.js';
import { initLanguages } from './utils/languages.js';
import { initMenu } from './utils/menu.js';
import { initTheme } from './utils/theme.js';

import "./dom/autohover.js";
import "./dom/autolanguages.js";
import "./dom/autophrases.js";
import "./dom/autoyears.js";
import "./dom/carousel.js";

import "./utils/languages.js";
import "./utils/menu.js";
import "./utils/theme.js";

initMenu();
initTheme();
await initAutoPhrases();
const languageState = await initLanguages();
initCarousel(languageState.roles);
