import lottie from "https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/+esm";

export class RobotAnimation {
    constructor() {
        this.robotAnimation = document.getElementById("robot-animation");
        this.container = this.robotAnimation?.querySelector(".robot-animation") || this.robotAnimation;
        this.animation = null;
        this.currentState = null;
        this.completeHandler = null;
        this.faceElements = [];
        this.eyeElements = [];
        this.faceAnimationFrame = null;
    }

    async init() {
        if (!this.robotAnimation) return;
        this.#setupEvents();
        await this.#loadAnimation();
        this.#setupFaceTracking();
        this.#setState(this.robotAnimation.dataset.state || "idle");
        this.#setEventClick();
        this.#setAutoWidth();
    }

    #setupEvents() {
        this.mouseX = 0; this.mouseY = 0;
        this.faceX = 0; this.faceY = 0;
        this.eyeX = 0; this.eyeY = 0;
        this.faceTracking = false;
        document.addEventListener("mousemove", event => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });
        this.observer = new MutationObserver(() => {
            const state = this.robotAnimation.dataset.state || "idle";
            if (state !== this.currentState) this.#setState(state);
        });
        this.observer.observe(this.robotAnimation, { attributes: true, attributeFilter: ["data-state"] });
    }

    async #loadAnimation() {
        const animationPath = this.robotAnimation.dataset.animation;
        if (!animationPath) return;
        const response = await fetch(animationPath);
        if (!response.ok) throw new Error(`No se pudo cargar la animación: ${response.status}`);
        const data = await response.json();
        this.animation = lottie.loadAnimation({
            container: this.container,
            renderer: "svg",
            loop: false,
            autoplay: false,
            animationData: data
        });
        await new Promise(resolve => this.animation.addEventListener("DOMLoaded", resolve, { once: true }));
    }

    #setupFaceTracking() {
        const elements = this.animation.renderer.elements;
        if (!elements) return;
        this.#setupFaceElements(elements);
        this.#setupEyeElements(elements);
    }

    #setupFaceElements(elements) {
        ["inner", "inner 2"].forEach(name => {
            const layer = elements.find(item => item.data?.nm === name);
            if (!layer?.baseElement) return;
            const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
            const parent = layer.baseElement.parentNode;
            if (!parent) return;
            wrapper.setAttribute("data-face-wrapper", name);
            parent.insertBefore(wrapper, layer.baseElement);
            wrapper.appendChild(layer.baseElement);
            this.faceElements.push({ name, wrapper });
        });
    }

    #setupEyeElements(elements) {
        const layer = elements.find(item => item.data?.nm === "Shape Layer 1");
        if (!layer?.baseElement) return;
        const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const parent = layer.baseElement.parentNode;
        if (!parent) return;
        wrapper.setAttribute("data-eye-wrapper", "Shape Layer 1");
        parent.insertBefore(wrapper, layer.baseElement);
        wrapper.appendChild(layer.baseElement);
        this.eyeElements.push({ name: "Shape Layer 1", wrapper });
    }

    #updateFaceTracking() {
        if (!this.faceTracking || !this.faceElements.length) {
            this.faceAnimationFrame = null;
            return;
        }
        const rect = this.container.getBoundingClientRect();
        if (!rect.width || !rect.height) {
            this.faceAnimationFrame = requestAnimationFrame(() => this.#updateFaceTracking());
            return;
        }
        const normalizedX = (this.mouseX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const normalizedY = (this.mouseY - (rect.top + rect.height / 2)) / (rect.height / 2);
        const targetFaceX = Math.max(-10, Math.min(10, normalizedX * 10));
        const targetFaceY = Math.max(-7, Math.min(7, normalizedY * 7));
        this.faceX += (targetFaceX - this.faceX) * 0.12;
        this.faceY += (targetFaceY - this.faceY) * 0.12;
        this.faceElements.forEach(({ wrapper }) => {wrapper.setAttribute("transform", `translate(${this.faceX},${this.faceY})`);});
        const targetEyeX = Math.max(-5, Math.min(5, normalizedX * 5));
        const targetEyeY = Math.max(-4, Math.min(4, normalizedY * 4));
        this.eyeX += (targetEyeX - this.eyeX) * 0.16;
        this.eyeY += (targetEyeY - this.eyeY) * 0.16;
        this.eyeElements.forEach(({ wrapper }) => {wrapper.setAttribute("transform", `translate(${this.faceX + this.eyeX},${this.faceY + this.eyeY})`);});
        this.faceAnimationFrame = requestAnimationFrame(() => this.#updateFaceTracking());
    }

    #startFaceTracking() {
        this.faceTracking = true;
        if (!this.faceAnimationFrame) this.#updateFaceTracking();
    }

    #stopFaceTracking() {
        this.faceTracking = false;
        if (this.faceAnimationFrame) {
            cancelAnimationFrame(this.faceAnimationFrame);
            this.faceAnimationFrame = null;
        }
        this.faceX = this.faceY = this.eyeX = this.eyeY = 0;
        this.faceElements.forEach(({ wrapper }) => wrapper.setAttribute("transform", "translate(0,0)"));
        this.eyeElements.forEach(({ wrapper }) => wrapper.setAttribute("transform", "translate(0,0)"));
    }

    #setState(state) {
        if (!this.animation) return;
        const states = { idle: [0, 29], yes: [31, 105], no: [106, 180], alert: [181, 270], thinking: [271, 390], jump: [391, 479] };
        const segment = states[state];
        if (!segment) return;
        this.#removeCompleteHandler();
        this.currentState = state;
        state === "idle" ? this.#startFaceTracking() : this.#stopFaceTracking();
        const [start, end] = segment;
        const looping = state === "idle" || this.loopState;
        this.completeHandler = () => {
            if (this.currentState !== state) return;
            looping ? this.animation.playSegments([start, end], true) : this.#setState("idle");
        };
        this.animation.addEventListener("complete", this.completeHandler);
        this.animation.playSegments([start, end], true);
    }

    #removeCompleteHandler() {
        if (!this.completeHandler || !this.animation) return;
        this.animation.removeEventListener("complete", this.completeHandler);
        this.completeHandler = null;
    }

    #setAutoWidth() {
        const svg = this.robotAnimation.querySelector("svg");
        const content = svg?.querySelector("g");
        if (svg && content) {
            const box = content.getBBox();
            const padding = 25;
            svg.setAttribute(
                "viewBox",
                `${box.x - padding} ${box.y - padding} ${box.width + padding * 2} ${box.height + padding * 2}`
            );
        }
    }

    #setEventClick() {
        const svg = this.robotAnimation.querySelector("svg");
        const content = svg?.querySelector("g");
        if (svg && content) {
            content.addEventListener("click", () => {
                this.changeState("jump");
            });
        }
    }

    changeState(state, loop = false) {
        this.robotAnimation.dataset.state = state;
        this.loopState = loop;
    }
}