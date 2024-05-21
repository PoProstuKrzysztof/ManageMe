// src/services/StoryService.ts
import IStory from '../models/IStory';

export class StoryService {
    private stories: IStory[];

    constructor() {
        const storedStories = localStorage.getItem('stories');
        this.stories = storedStories ? JSON.parse(storedStories) : [];
    }

    create(name: string, description: string, priority: 'low' | 'medium' | 'high', project: string, owner: string): void {
        const id = self.crypto.randomUUID();
        const newStory: IStory = { id, name, description, priority, project, creationDate: new Date(), status: 'todo', owner };
        this.stories.push(newStory);
        this.saveStoriesToLocalStorage();
    }

    getAll(): IStory[] {
        return this.stories;
    }

    getById(id: string): IStory | undefined {
        return this.stories.find(story => story.id === id);
    }

    update(id: string, name: string, description: string, priority: 'low' | 'medium' | 'high', status: 'todo' | 'doing' | 'done'): void {
        const index = this.stories.findIndex(story => story.id === id);
        if (index !== -1) {
            this.stories[index] = { ...this.stories[index], name, description, priority, status };
            this.saveStoriesToLocalStorage();
        }
    }

    delete(id: string): void {
        this.stories = this.stories.filter(story => story.id !== id);
        this.saveStoriesToLocalStorage();
    }

    private saveStoriesToLocalStorage(): void {
        localStorage.setItem('stories', JSON.stringify(this.stories));
    }
}
