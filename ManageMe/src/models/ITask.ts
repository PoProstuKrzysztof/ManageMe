export default interface ITask {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    storyId: string;
    estimatedHours: number;
    status: 'todo' | 'doing' | 'done';
    createdDate: string;
    startDate?: string;
    endDate?: string;
    assignedUserId?: string;
}
