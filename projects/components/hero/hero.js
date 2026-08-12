import { RobotAnimation } from "../robot-animation/robot-animation.js";

class Hero {
    constructor() {
        this.hero = document.getElementById("hero");
        this.robot = new RobotAnimation();
    }

    init() {
        if (!this.hero) return;
        this.#render();
    }

    #render() {
        this.alertTimer = null;
        this.mouseX = 0;
        this.directionChanges = 0;
        this.lastDirectionChange = 0;
        this.robot.init().then(() => {
            const a = this.hero.querySelector(".hero-a");

            a.addEventListener("mouseenter", () => {
                this.robot.changeState("yes");
            });

            document.addEventListener("mouseleave", event => {
                if (event.clientY > 0) return;
                clearTimeout(this.alertTimer);
                this.robot.changeState("alert");
            });

            document.addEventListener("mouseenter", () => {
                clearTimeout(this.alertTimer);
                this.robot.changeState("idle");
            });

            document.addEventListener("mousemove", event => {
                if (this.mouseX === null) {
                    this.mouseX = event.clientX;
                    return;
                }

                const movement = event.clientX - this.mouseX;
                this.mouseX = event.clientX;
                if (Math.abs(movement) < 20) return;
                const direction = Math.sign(movement);
                const now = Date.now();
                if (direction !== this.mouseDirection) {
                    if (now - this.lastDirectionChange > 1000) this.directionChanges = 0;
                    this.directionChanges++;
                    this.lastDirectionChange = now;
                    this.mouseDirection = direction;
                    if (this.directionChanges >= 7) {
                        this.robot.changeState("no");
                        this.directionChanges = 0;
                    }
                }
            });
        });
    }
}

new Hero().init();