export default interface IStory {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    project: string;
    creationDate: Date;
    status: 'todo' | 'doing' | 'done';
    owner: string; 
}
