export default interface IStory {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    project: string;
    creationDate?: string;
    finishDate: string;
    status: 'todo' | 'doing' | 'done';
}
