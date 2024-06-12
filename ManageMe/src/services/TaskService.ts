import ITask from '../models/ITask.ts';

export class TaskService {
    private tasks: ITask[];

    constructor() {
        const storedTasks = localStorage.getItem('tasks');
        this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
    }

    create(task: ITask): void {
        this.tasks.push(task);
        this.saveTasksToLocalStorage();
    }

    getAll(): ITask[] {
        return this.tasks;
    }

    getById(id: string): ITask | undefined {
        return this.tasks.find(task => task.id === id);
    }

    getTasksByStory(storyId: string): ITask[] {
        return this.tasks.filter(task => task.storyId === storyId);
    }

    update(id: string, updatedTask: Partial<ITask>): void {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...updatedTask };
            this.saveTasksToLocalStorage();
        }
    }

    delete(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasksToLocalStorage();
    }

    private saveTasksToLocalStorage(): void {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}
