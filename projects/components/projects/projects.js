class Project {
    constructor() {
        this.projectsElement = document.getElementById("projects");
        this.loader = document.getElementById("loading");
        this.data = [];
    }

    async init() {
        if (!this.projectsElement) return;
        this.data = await this.getProjects();
        this.render();
    }

    async getProjects() {
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

    render() {
        const div = this.projectsElement.querySelector(".projects-list");
        if (!div || !this.data.length) return;
        let html = "";
        for (let i = 0; i < this.data.length; i++) {
            const project = this.data[i];
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
}

const project = new Project();
project.init().catch(console.error);