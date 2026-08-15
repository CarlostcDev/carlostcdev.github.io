class Project {
    constructor() {
        this.projectsElement = document.getElementById("projects-list");
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
        const loader = document.getElementById("loader");
        if (loader) loader.hidden = false;
        try {
            const response = await fetch("https://api.github.com/users/CarlostcDev/repos?type=owner&sort=updated&per_page=100", {
                headers: {Accept: "application/vnd.github+json"}
            });
            if (!response.ok) return [];
            const data = await response.json();
            return data
                .filter(repo => repo.topics?.includes("project"))
                .map(repo => {
                    const topics = repo.topics.filter(topic => topic !== "project");
                    const language = repo["language"];
                    if (language && !topics.some(topic => topic.toLowerCase() === language.toLowerCase())) topics.unshift(language);
                    return {
                        id: repo["id"],
                        name: repo["name"],
                        description: repo["description"] || "",
                        url: repo["html_url"],
                        homepage: repo["homepage"] || null,
                        topics,
                        stars: repo["stargazers_count"],
                        pushedAt: repo["pushed_at"]
                    };
                });
        } catch (error) {
            console.error("Error fetching projects:", error);
            return [];
        } finally {
            if (loader) loader.hidden = true;
        }
    }

    #setupEvents() {
        this.projectsElement.addEventListener("click", e => {
            const btn = e.target.closest(".filter-btn");
            const clear = e.target.closest(".clear");
            const reset = e.target.closest(".reset-filters");
            if (btn) this.#handleButtonFilter(btn);
            if (clear) this.#clearSearch();
            if (reset) this.#resetAll();
        });
        document.addEventListener("click", e => {
            document.querySelectorAll(".filter-select").forEach(details => {
                if (!details.contains(e.target)) details.removeAttribute("open");
            });
        });
        this.searchInput?.addEventListener("input", e => {
            this.searchQuery = e.target.value.trim().toLowerCase();
            this.#filter();
        });
        if (!this.rangeInput) return;
        ["input", "mousedown", "touchstart"].forEach(event => {
            this.rangeInput.addEventListener(event, () => {
                if (this.rangeTooltip) this.rangeTooltip.hidden = false;
                this.#updateRangeUI();
            });
        });

        ["mouseup", "touchend"].forEach(event => {
            window.addEventListener(event, () => {
                if (this.rangeTooltip) this.rangeTooltip.hidden = true;
            });
        });

        this.rangeInput.addEventListener("change", e => {
            const prop = e.target.dataset.prop;
            const value = Number(e.target.value);
            this.activeFilters = this.activeFilters.filter(filter => filter.prop !== prop);
            if (value > 0) this.activeFilters.push({prop, value});
            this.#updateButtonStates();
            this.#filter();
        });
        this.#updateRangeUI();
    }

    #handleButtonFilter(btn) {
        const {sort, order, prop, value} = btn.dataset;
        if (sort) {
            const sortOrder = order || "desc";
            const isSameSort = this.currentSort?.prop === sort && this.currentSort?.order === sortOrder;
            this.currentSort = isSameSort ? null : {prop: sort, order: sortOrder};
        } else if (prop && value !== undefined) {
            const index = this.activeFilters.findIndex(filter => filter.prop === prop && filter.value === value);
            if (index !== -1) this.activeFilters.splice(index, 1);
            else this.activeFilters.push({prop, value});
        }

        this.#updateButtonStates();
        this.#filter();
    }

    #updateRangeUI() {
        if (!this.rangeInput) return;
        const min = Number(this.rangeInput.min) || 0;
        const max = Number(this.rangeInput.max) || 100;
        const value = Number(this.rangeInput.value);
        const percent = ((value - min) / (max - min)) * 100;
        this.rangeInput.style.setProperty("--value-percent", `${percent}%`);
        if (!this.rangeTooltip) return;
        this.rangeTooltip.textContent = value >= 50 ? `+${value}` : value;
        const thumbWidth = 10;
        const availableWidth = this.rangeInput.clientWidth - thumbWidth;
        const leftPosition = (percent / 100) * availableWidth + thumbWidth / 2;
        this.rangeTooltip.style.left = `${leftPosition}px`;
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
        }
        if (this.rangeTooltip) this.rangeTooltip.hidden = true;
        this.#updateButtonStates();
        this.#filter();
    }

    #updateButtonStates() {
        document.querySelectorAll(".filter-btn").forEach(btn => {
            const {sort, order, prop, value} = btn.dataset;
            let active;
            if (sort) {
                const sortOrder = order || "desc";
                active = this.currentSort?.prop === sort && this.currentSort?.order === sortOrder;
            } else active = this.activeFilters.some(filter => filter.prop === prop && filter.value === value);
            btn.classList.toggle("active", active);
        });
    }

    #filter() {
        let result = [...this.data];
        if (this.searchQuery) {
            result = result.filter(project =>
                project.name.toLowerCase().includes(this.searchQuery) ||
                project.topics.some(topic => topic.toLowerCase().includes(this.searchQuery))
            );
        }
        if (this.activeFilters.length) {
            result = result.filter(project =>
                this.activeFilters.every(({prop, value}) => {
                    const property = project[prop];
                    if (typeof property === "number") return property >= Number(value);
                    if (Array.isArray(property)) return property.some(item => String(item).toLowerCase() === String(value).toLowerCase());
                    return String(property).toLowerCase() === String(value).toLowerCase();
                })
            );
        }

        if (this.currentSort) {
            const {prop, order} = this.currentSort;
            result.sort((a, b) => {
                const valueA = new Date(a[prop]).getTime() || a[prop];
                const valueB = new Date(b[prop]).getTime() || b[prop];
                return order === "desc" ? valueB - valueA : valueA - valueB;
            });
        }
        this.#render(result);
    }

    #render(list) {
        const container = this.projectsElement.querySelector(".projects-list");
        if (!container) return;
        if (!list.length) {
            container.innerHTML = `
                <div class="no-projects">
                    <svg class="no-svg" aria-hidden="true" focusable="false"><use href="../sources/svgs/sprite.svg#alert"></use></svg>
                    <p class="no-p" data-i18n="projects.projects.no-projects">No hay proyectos que coincidan con los filtros.</p>
                </div>`;
            return;
        }

        container.innerHTML = list.map(project => {
            const topics = project.topics.map(topic =>
                `<li class="box-li ${topic.toLowerCase().replace(/\s+/g, "-")}">${topic}</li>`
            ).join("");
            return `
                <article class="project-box">
                    <h3 class="box-title">${project.name}</h3>
                    <p class="box-desc">${project.description}</p>
                    ${topics ? `<ul class="box-ul">${topics}</ul>` : ""}
                    <a class="box-url" href="${project.homepage || project.url}" target="_blank" rel="noopener noreferrer">
                        <span class="box-button" data-i18n="projects.projects.buttons">Ver proyecto</span>
                        <svg class="box-svg" aria-hidden="true" focusable="false"><use href="../../sources/svgs/sprite.svg#arrow-open"></use></svg>
                    </a>
                </article>`;
        }).join("");
    }
}

const project = new Project();
project.init().catch(console.error);