class Project {
    constructor() {
        this.projectsElement = document.getElementById("projects");
        this.loader = document.getElementById("loading");
        this.searchInput = document.querySelector(".filter-input");
        this.data = [];
        this.activeFilters = [];
        this.currentSort = null;
        this.searchQuery = "";
    }

    async init() {
        if (!this.projectsElement) return;
        this.data = await this.#getProjects();
        this.#render(this.data);
        this.#setupButtons();
        this.#setupSearch();
        this.#setupOutsideClickHandler();
    }

    async #getProjects() {
        if (this.loader) this.loader.classList.remove("hidden");

        try {
            const response = await fetch("https://api.github.com/users/CarlostcDev/repos?type=owner&sort=updated&per_page=100", {
                headers: { Accept: "application/vnd.github+json" }
            });

            if (!response.ok) {
                console.error(`GitHub API error: ${response.status}`);
                return [];
            }

            const data = await response.json();
            const projects = [];

            for (let i = 0; i < data.length; i++) {
                const repo = data[i];
                const topics = Array.isArray(repo.topics) ? repo.topics : [];
                if (topics.indexOf("project") !== -1) {
                    const filteredTopics = topics.filter((t) => t !== "project");
                    if (repo.language && !filteredTopics.map(t => t.toLowerCase()).includes(repo.language.toLowerCase())) {
                        filteredTopics.unshift(repo.language);
                    }

                    projects.push({
                        id: repo.id,
                        name: repo.name,
                        description: repo.description,
                        url: repo.html_url,
                        homepage: repo.homepage || null,
                        language: repo.language,
                        topics: filteredTopics,
                        stars: repo.stargazers_count,
                        forks: repo.forks_count,
                        updatedAt: repo.updated_at,
                        createdAt: repo.created_at,
                        pushedAt: repo.pushed_at,
                        defaultBranch: repo.default_branch,
                        archived: repo.archived,
                        license: repo.license ? repo.license.spdx_id : null
                    });
                }
            }

            return projects;
        } catch (error) {
            console.error("Error fetching projects:", error);
            return [];
        } finally {
            if (this.loader) this.loader.classList.add("hidden");
        }
    }

    #setupButtons() {
        const buttons = document.querySelectorAll(".filter-btn");
        buttons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const sortProp = btn.dataset.sort;

                if (sortProp) {
                    const sortOrder = btn.dataset.order || "desc";

                    if (this.currentSort && this.currentSort.prop === sortProp && this.currentSort.order === sortOrder) {
                        this.currentSort = null;
                    } else {
                        this.currentSort = { prop: sortProp, order: sortOrder };
                    }
                } else {
                    const prop = btn.dataset.prop;
                    const value = btn.dataset.value;

                    if (!prop || value === undefined) return;

                    const index = this.activeFilters.findIndex(f => f.prop === prop && f.value === value);

                    if (index !== -1) {
                        this.activeFilters.splice(index, 1);
                    } else {
                        this.activeFilters.push({ prop, value });
                    }
                }

                this.#updateButtonStates();
                this.#filter();
            });
        });
    }

    #setupSearch() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener("input", (e) => {
            this.searchQuery = e.target.value.trim().toLowerCase();
            this.#filter();
        });

        const rangeInput = document.querySelector(".filter-range");
        const tooltip = document.getElementById("range-tooltip");

        const updateTooltipPosition = (input) => {
            if (!tooltip) return;
            const min = Number(input.min) || 0;
            const max = Number(input.max) || 100;
            const val = Number(input.value);
            const percent = (val - min) / (max - min);

            tooltip.textContent = val >= 50 ? `+${val}` : val;

            const thumbWidth = 10;
            const availableWidth = input.clientWidth - thumbWidth;
            const leftPos = percent * availableWidth + (thumbWidth / 2);
            tooltip.style.left = `${leftPos}px`;
        };

        const updateRangeBackground = (input) => {
            const min = Number(input.min) || 0;
            const max = Number(input.max) || 100;
            const val = Number(input.value);
            const percent = ((val - min) / (max - min)) * 100;
            input.style.setProperty("--value-percent", `${percent}%`);
        };

        if (rangeInput && tooltip) {
            updateTooltipPosition(rangeInput);
            updateRangeBackground(rangeInput);

            rangeInput.addEventListener("mousedown", () => {
                tooltip.classList.remove("hidden");
                updateTooltipPosition(rangeInput);
            });

            rangeInput.addEventListener("touchstart", () => {
                tooltip.classList.remove("hidden");
                updateTooltipPosition(rangeInput);
            });

            window.addEventListener("mouseup", () => {
                tooltip.classList.add("hidden");
            });

            window.addEventListener("touchend", () => {
                tooltip.classList.add("hidden");
            });

            rangeInput.addEventListener("input", (e) => {
                updateTooltipPosition(e.target);
                updateRangeBackground(e.target);
            });

            rangeInput.addEventListener("change", (e) => {
                const prop = e.target.dataset.prop;
                const value = e.target.value;

                const index = this.activeFilters.findIndex(f => f.prop === prop);

                if (Number(value) === 0) {
                    if (index !== -1) this.activeFilters.splice(index, 1);
                } else {
                    if (index !== -1) {
                        this.activeFilters[index].value = value;
                    } else {
                        this.activeFilters.push({ prop, value });
                    }
                }

                this.#updateButtonStates();
                this.#filter();
            });
        }
    }

    #updateButtonStates() {
        const buttons = document.querySelectorAll(".filter-btn");
        buttons.forEach((btn) => {
            const sortProp = btn.dataset.sort;

            if (sortProp) {
                const sortOrder = btn.dataset.order || "desc";
                const isSortActive = this.currentSort && this.currentSort.prop === sortProp && this.currentSort.order === sortOrder;
                btn.classList.toggle("active", Boolean(isSortActive));
            } else {
                const prop = btn.dataset.prop;
                const value = btn.dataset.value;
                const isFilterActive = this.activeFilters.some(f => f.prop === prop && f.value === value);
                btn.classList.toggle("active", isFilterActive);
            }
        });
    }

    #filter() {
        let result = [...this.data];

        if (this.searchQuery !== "") {
            result = result.filter((project) => {
                const nameMatch = project.name.toLowerCase().includes(this.searchQuery);
                const topicMatch = Array.isArray(project.topics) && project.topics.some(t => t.toLowerCase().includes(this.searchQuery));
                return nameMatch || topicMatch;
            });
        }

        if (this.activeFilters.length > 0) {
            result = result.filter((project) => {
                return this.activeFilters.every(({ prop, value }) => {
                    const projectVal = project[prop];
                    const targetVal = String(value).toLowerCase();

                    if (Array.isArray(projectVal)) {
                        return projectVal.some(item => String(item).toLowerCase() === targetVal);
                    }

                    if (typeof projectVal === "number") {
                        const targetNum = Number(value);
                        if (targetNum >= 50) {
                            return projectVal >= targetNum;
                        }
                        return projectVal >= targetNum;
                    }

                    if (typeof projectVal === "boolean") {
                        return String(projectVal) === targetVal;
                    }

                    const directMatch = projectVal && String(projectVal).toLowerCase() === targetVal;
                    const topicMatch = Array.isArray(project.topics) && project.topics.some(t => String(t).toLowerCase() === targetVal);

                    return directMatch || topicMatch;
                });
            });
        }

        if (this.currentSort) {
            const { prop, order } = this.currentSort;
            result.sort((a, b) => {
                const dateA = new Date(a[prop]).getTime();
                const dateB = new Date(b[prop]).getTime();
                return order === "desc" ? dateB - dateA : dateA - dateB;
            });
        }

        this.#render(result);
    }

    #render(list) {
        const div = this.projectsElement.querySelector(".projects-list");
        if (!div) return;

        if (!list.length) {
            div.innerHTML = "<p class=\"no-projects\">No hay proyectos que coincidan con los filtros.</p>";
            return;
        }

        let html = "";
        for (let i = 0; i < list.length; i++) {
            const project = list[i];
            const formattedKey = project.name.toLowerCase().replace(/\s+/g, "-");
            const description = project.description || "";

            let topicsHtml = "";
            if (project.topics && project.topics.length > 0) {
                for (let j = 0; j < project.topics.length; j++) {
                    const topic = project.topics[j];
                    const topicClass = topic.toLowerCase().replace(/\s+/g, "-");
                    topicsHtml += `<li class="box-li ${topicClass}">${topic}</li>`;
                }
            }

            html += `
                <article class="project-box">
                    <h3 class="box-title" data-i18n="projects.${formattedKey}.title">${project.name}</h3>
                    <p class="box-desc" data-i18n="projects.${formattedKey}.desc">${description}</p>
                    ${topicsHtml ? `<ul class="box-ul">${topicsHtml}</ul>` : ""}
                    <a class="box-url" href="${project.homepage ? project.homepage : project.url}" target="_blank" rel="noopener noreferrer">
                        <button class="box-button" data-i18n="projects.${formattedKey}.button">Ver proyecto</button>
                        <svg class="box-svg"><use href="../../sources/svgs/sprite.svg#arrow-open"></use></svg>
                    </a>
                </article>
            `;
        }

        div.innerHTML = html;
    }

    #setupOutsideClickHandler() {
        document.addEventListener("click", (e) => {
            const detailsElements = document.querySelectorAll(".filter-select");
            detailsElements.forEach((details) => {
                if (!details.contains(e.target)) {
                    details.removeAttribute("open");
                }
            });
        });
    }
}

const project = new Project();
project.init().catch(console.error);