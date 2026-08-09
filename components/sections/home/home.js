import { textCarousel } from '../../../scripts/animations/text-carousel.js';

class Home {
    constructor() {
        this.home = document.getElementById("home");
    }

    init() {
        if (!this.home) return;
        this.carousel();
    }

    carousel() {
        textCarousel({
            elementId: "roles",
            interval: 5000,
            configKey: "roles"
        });
    }
}

new Home().init();