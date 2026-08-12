class Project {
    constructor() {
        this.projectsElement = document.getElementById("projects");
        this.loader = document.getElementById("loading");
        this.searchInput = document.querySelector(".filter-input");
        this.rangeInput = document.querySelector(".filter-range");
        this.rangeTooltip = document.getElementById("range-tooltip");
        this.data = [];
        this.activeFilters = [];
        this.currentSort = null;
        this.searchQuery = "";
    }

    async init() {
        if (!this.projectsElement) return;
        this.data = await this.#getProjects();
        this.#render(this.data);
        this.#setupEvents();
    }

    async #getProjects() {
        this.loader?.classList.remove("hidden");
        try {
            const response = await fetch("https://api.github.com/users/CarlostcDev/repos?type=owner&sort=updated&per_page=100", {
                headers: { Accept: "application/vnd.github+json" }
            });
            if (!response.ok) return [];
            const data = await response.json();
            return data
                .filter(repo => repo.topics?.includes("project"))
                .map(repo => {
                    const topics = repo.topics.filter(t => t !== "project");
                    if (repo.language && !topics.some(t => t.toLowerCase() === repo.language.toLowerCase())) topics.unshift(repo.language);
                    return {
                        id: repo.id, name: repo.name, description: repo.description || "", url: repo.html_url,
                        homepage: repo.homepage || null, topics, stars: repo.stargazers_count, pushedAt: repo.pushed_at
                    };
                });
        } catch (error) {
            console.error("Error fetching projects:", error);
            return [];
        } finally {
            this.loader?.classList.add("hidden");
        }
    }

    #setupEvents() {
        this.projectsElement.addEventListener("click", (e) => {
            const btn = e.target.closest(".filter-btn");
            const clear = e.target.closest(".clear");
            const reset = e.target.closest(".reset-filters");
            if (btn) this.#handleButtonFilter(btn);
            if (clear) this.#clearSearch();
            if (reset) this.#resetAll();
        });

        this.projectsElement.addEventListener("keydown", (e) => {
            if (e.target.closest(".reset-filters") && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                this.#resetAll();
            }
        });

        document.addEventListener("click", (e) => {
            document.querySelectorAll(".filter-select").forEach(details => {
                if (!details.contains(e.target)) details.removeAttribute("open");
            });
        });

        this.searchInput?.addEventListener("input", (e) => {
            this.searchQuery = e.target.value.trim().toLowerCase();
            this.#filter();
        });

        if (this.rangeInput) {
            ["input", "mousedown", "touchstart"].forEach(evt => {
                this.rangeInput.addEventListener(evt, () => {
                    this.rangeTooltip?.classList.remove("hidden");
                    this.#updateRangeUI();
                });
            });
            ["mouseup", "touchend"].forEach(evt => {
                window.addEventListener(evt, () => this.rangeTooltip?.classList.add("hidden"));
            });
            this.rangeInput.addEventListener("change", (e) => {
                const prop = e.target.dataset.prop;
                const val = Number(e.target.value);
                this.activeFilters = this.activeFilters.filter(f => f.prop !== prop);
                if (val > 0) this.activeFilters.push({ prop, value: val });
                this.#updateButtonStates();
                this.#filter();
            });
            this.#updateRangeUI();
        }
    }

    #handleButtonFilter(btn) {
        const { sort, order, prop, value } = btn.dataset;
        if (sort) {
            const sortOrder = order || "desc";
            this.currentSort = (this.currentSort?.prop === sort && this.currentSort?.order === sortOrder)
                ? null
                : { prop: sort, order: sortOrder };
        } else if (prop && value !== undefined) {
            const index = this.activeFilters.findIndex(f => f.prop === prop && f.value === value);
            index !== -1 ? this.activeFilters.splice(index, 1) : this.activeFilters.push({ prop, value });
        }
        this.#updateButtonStates();
        this.#filter();
    }

    #updateRangeUI() {
        if (!this.rangeInput) return;
        const min = Number(this.rangeInput.min) || 0;
        const max = Number(this.rangeInput.max) || 100;
        const val = Number(this.rangeInput.value);
        const percent = ((val - min) / (max - min)) * 100;
        this.rangeInput.style.setProperty("--value-percent", `${percent}%`);
        if (this.rangeTooltip) {
            this.rangeTooltip.textContent = val >= 50 ? `+${val}` : val;
            const thumbWidth = 10;
            const availableWidth = this.rangeInput.clientWidth - thumbWidth;
            const leftPos = (percent / 100) * availableWidth + (thumbWidth / 2);
            this.rangeTooltip.style.left = `${leftPos}px`;
        }
    }

    #clearSearch() {
        if (this.searchInput) this.searchInput.value = "";
        this.searchQuery = "";
        this.#filter();
    }

    #resetAll() {
        this.activeFilters = [];
        this.currentSort = null;
        if (this.searchInput) this.searchInput.value = "";
        this.searchQuery = "";
        if (this.rangeInput) {
            this.rangeInput.value = "0";
            this.#updateRangeUI();
            this.rangeTooltip?.classList.add("hidden");
        }
        this.#updateButtonStates();
        this.#filter();
    }

    #updateButtonStates() {
        document.querySelectorAll(".filter-btn").forEach((btn) => {
            const { sort, order, prop, value } = btn.dataset;
            let isActive = false;
            if (sort) {
                const sortOrder = order || "desc";
                isActive = Boolean(this.currentSort && this.currentSort.prop === sort && this.currentSort.order === sortOrder);
            } else isActive = this.activeFilters.some(f => f.prop === prop && f.value === value);
            btn.classList.toggle("active", isActive);
        });
    }

    #filter() {
        let result = [...this.data];
        if (this.searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(this.searchQuery) ||
                p.topics.some(t => t.toLowerCase().includes(this.searchQuery))
            );
        }
        if (this.activeFilters.length > 0) {
            result = result.filter(p =>
                this.activeFilters.every(({ prop, value }) => {
                    const pVal = p[prop];
                    if (typeof pVal === "number") return pVal >= Number(value);
                    if (Array.isArray(pVal)) return pVal.some(item => String(item).toLowerCase() === String(value).toLowerCase());
                    return String(pVal).toLowerCase() === String(value).toLowerCase();
                })
            );
        }
        if (this.currentSort) {
            const { prop, order } = this.currentSort;
            result.sort((a, b) => {
                const valA = new Date(a[prop]).getTime() || a[prop];
                const valB = new Date(b[prop]).getTime() || b[prop];
                return order === "desc" ? valB - valA : valA - valB;
            });
        }
        this.#render(result);
    }

    #render(list) {
        const div = this.projectsElement.querySelector(".projects-list");
        if (!div) return;
        if (!list.length) {
            div.innerHTML = `
                <div class="no-projects">
                    <svg class="no-svg"><use href="../sources/svgs/sprite.svg#alert"></use></svg>
                    <p class="no-p">No hay proyectos que coincidan con los filtros.</p>
                </div>`;
            return;
        }

        div.innerHTML = list.map(p => {
            const key = p.name.toLowerCase().replace(/\s+/g, "-");
            const topics = p.topics.map(t => `<li class="box-li ${t.toLowerCase().replace(/\s+/g, "-")}">${t}</li>`).join("");
            return `
                <article class="project-box">
                    <h3 class="box-title" data-i18n="projects.${key}.title">${p.name}</h3>
                    <p class="box-desc" data-i18n="projects.${key}.desc">${p.description}</p>
                    ${topics ? `<ul class="box-ul">${topics}</ul>` : ""}
                    <a class="box-url" href="${p.homepage || p.url}" target="_blank" rel="noopener noreferrer">
                        <button class="box-button" data-i18n="projects.${key}.button">Ver proyecto</button>
                        <svg class="box-svg"><use href="../../sources/svgs/sprite.svg#arrow-open"></use></svg>
                    </a>
                </article>`;
        }).join("");
    }
}

const project = new Project();
project.init().catch(console.error);