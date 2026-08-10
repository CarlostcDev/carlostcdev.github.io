import {RobotAnimation} from "../robot-animation/robot-animation.js";

class Hero {
    constructor() {
        this.hero = document.getElementById("hero");
        this.robot = new RobotAnimation();
        this.alertTimer = null;
        this.mouseX = 0;
        this.lastDirection = 0;
        this.directionChanges = 0;
        this.lastDirectionChange = 0;
    }

    init() {
        if (!this.hero) return;
        this.render();
    }

    render() {
        this.robot.init().then(() => {
            const button = this.hero.querySelector(".hero-button");

            button.addEventListener("mouseenter", () => {
                this.robot.changeState("yes");
            });

            document.addEventListener("mouseleave", event => {
                if (event.clientY > 0) return;

                clearTimeout(this.alertTimer);
                this.robot.changeState("alert", true);

                this.alertTimer = setTimeout(() => {
                    this.robot.changeState("thinking", true);
                }, 4000);
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
                    if (now - this.lastDirectionChange > 1000) {
                        this.directionChanges = 0;
                    }

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