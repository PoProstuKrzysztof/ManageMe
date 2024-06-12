import IProject from '../models/IProject.ts';

export class ProjectService {
    private projects: IProject[] = JSON.parse(localStorage.getItem('projects') || '[]');
    private currentProjectId: string | null = localStorage.getItem('currentProjectId');

    create(name: string, description: string): void {
        this.projects.push({ id: crypto.randomUUID(), name, description });
        this.saveProjectsToLocalStorage();
    }

    getAll(): IProject[] {
        return this.projects;
    }

    getById(id: string): IProject | undefined {
        return this.projects.find(project => project.id === id);
    }

    update(id: string, name: string, description: string): void {
        const project = this.getById(id);
        if (project) {
            Object.assign(project, { name, description });
            this.saveProjectsToLocalStorage();
        }
    }

    delete(id: string): void {
        this.projects = this.projects.filter(project => project.id !== id);
        this.saveProjectsToLocalStorage();
    }

    setCurrentProject(id: string): void {
        localStorage.setItem('currentProjectId', this.currentProjectId = id);
    }

    getCurrentProject(): IProject | null {
        return this.getById(this.currentProjectId || '') || null;
    }

    clearCurrentProject(): void {
        localStorage.removeItem('currentProjectId');
        this.currentProjectId = null;
    }

    private saveProjectsToLocalStorage(): void {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }
}
