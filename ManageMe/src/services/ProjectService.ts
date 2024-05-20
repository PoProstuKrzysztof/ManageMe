
import IProject from '../models/IProject';

export class ProjectService {
    private projects: IProject[];

    constructor() {
        const storedProjects = localStorage.getItem('projects');
        this.projects = storedProjects ? JSON.parse(storedProjects) : [];
    }

    create(name: string, description: string): void {
        const id = crypto.randomUUID();
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

    private saveProjectsToLocalStorage(): void {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }
}
