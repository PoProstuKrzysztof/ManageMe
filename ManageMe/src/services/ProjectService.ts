import IProject from '../models/IProject';

export class ProjectService {
    private projects: IProject[];
    private currentProjectId: string | null;

    constructor() {
        const storedProjects = localStorage.getItem('projects');
        this.projects = storedProjects ? JSON.parse(storedProjects) : [];
        this.currentProjectId = localStorage.getItem('currentProjectId');
    }

    create(name: string, description: string): void {
        const id = self.crypto.randomUUID();
        const newProject: IProject = { id, name, description };
        this.projects.push(newProject);
        this.saveProjectsToLocalStorage();
    }

    getAll(): IProject[] {
        return this.projects;
    }

    getById(id: string): IProject | undefined {
        return this.projects.find(project => project.id === id);
    }

    update(id: string, name: string, description: string): void {
        const index = this.projects.findIndex(project => project.id === id);
        if (index !== -1) {
            this.projects[index] = { id, name, description };
            this.saveProjectsToLocalStorage();
        }
    }

    delete(id: string): void {
        this.projects = this.projects.filter(project => project.id !== id);
        this.saveProjectsToLocalStorage();
    }

    setCurrentProject(id: string): void {
        this.currentProjectId = id;
        localStorage.setItem('currentProjectId', id);
    }

    getCurrentProject(): IProject | null {
        const project = this.currentProjectId ? this.getById(this.currentProjectId) : null;
        return project ?? null;
    }

    clearCurrentProject(): void {
        this.currentProjectId = null;
        localStorage.removeItem('currentProjectId');
    }

    private saveProjectsToLocalStorage(): void {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }
}
