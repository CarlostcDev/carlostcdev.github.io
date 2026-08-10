class Project {
    constructor() {
        this.projects = document.getElementById("projects");
    }

    init() {
        if (!this.projects) return;
        //this.getProjects().then(p => this.projects.innerHTML = JSON.stringify(p));
    }

    async getProjects() {
        const loader = document.getElementById("loading");
        if (loader) loader.classList.remove("hidden");

        try {
            const response = await fetch("https://api.github.com/users/CarlostcDev/repos?type=owner&sort=updated&per_page=100", {
                headers: { Accept: "application/vnd.github+json" }
            });
            if (!response.ok) throw new Error(`GitHub API HTTP ${response.status}`);
            const data = await response.json();
            return data.reduce((acc, repo) => {
                if (repo.topics?.includes("project")) {
                    acc.push({
                        id: repo.id,
                        name: repo.name,
                        description: repo.description,
                        url: repo.html_url,
                        homepage: repo.homepage || null,
                        language: repo.language,
                        topics: repo.topics.filter(t => t !== "project"),
                        stars: repo.stargazers_count,
                        forks: repo.forks_count,
                        updatedAt: repo.updated_at,
                        createdAt: repo.created_at,
                        pushedAt: repo.pushed_at,
                        defaultBranch: repo.default_branch,
                        archived: repo.archived,
                        license: repo.license?.spdx_id ?? null
                    });
                }
                return acc;
            }, []);
        } catch (error) {
            console.error("Error fetching projects:", error);
            return [];
        } finally {
            if (loader) loader.classList.add("hidden");
        }
    }
}

new Project().init();