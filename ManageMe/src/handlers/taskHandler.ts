import { TaskService } from '../services/TaskService.ts';
import ITask from '../models/ITask.ts';
import { renderStories } from './storyHandler.ts';

const taskService = new TaskService();
let currentTaskId: string;

export function createTask() {
    const name = (document.getElementById('taskName') as HTMLInputElement).value;
    const description = (document.getElementById('taskDescription') as HTMLTextAreaElement).value;
    const priority = (document.getElementById('taskPriority') as HTMLSelectElement).value as 'low' | 'medium' | 'high';
    const estimatedHours = parseInt((document.getElementById('taskEstimatedHours') as HTMLInputElement).value, 10);
    const storyId = (document.getElementById('taskStory') as HTMLSelectElement).value;
    const status = 'todo';
    const createdDate = new Date().toISOString();

    if (name && description && !isNaN(estimatedHours) && storyId) {
        const task: ITask = {
            id: crypto.randomUUID(),
            name,
            description,
            priority,
            storyId,
            estimatedHours,
            status,
            createdDate,
        };
        taskService.create(task);
        renderTasks();
        renderStories(storyId);
        clearTaskForm();
    }
}

export function renderTasks() {

    const tasks = taskService.getAll();

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.addEventListener('click', () => showTaskDetails(task));

        const taskDetails = document.createElement('div');
        taskDetails.className = 'task-details';

        const taskName = document.createElement('span');
        taskName.textContent = task.name;

        const taskDescription = document.createElement('p');
        taskDescription.textContent = task.description;

        const taskPriority = document.createElement('span');
        taskPriority.textContent = `Priority: ${task.priority}`;

        const taskState = document.createElement('span');
        taskState.textContent = `State: ${task.status}`;

        taskDetails.appendChild(taskName);
        taskDetails.appendChild(taskDescription);
        taskDetails.appendChild(taskPriority);
        taskDetails.appendChild(taskState);

        taskItem.appendChild(taskDetails);

    });
}

export function showTaskDetails(task: ITask) {
    currentTaskId = task.id;
    const taskDetails = document.getElementById('taskDetails')!;
    taskDetails.classList.remove('hidden');

    (document.getElementById('taskNameDetail') as HTMLParagraphElement).textContent = `Name: ${task.name}`;

    (document.getElementById('taskDescriptionDetail') as HTMLParagraphElement).textContent = `Description: ${task.description}`;

    (document.getElementById('taskPriorityDetail') as HTMLParagraphElement).textContent = `Priority: ${task.priority}`;

    (document.getElementById('taskStoryDetail') as HTMLParagraphElement).textContent = `Story: ${task.storyId}`;

    (document.getElementById('taskEstimatedHoursDetail') as HTMLParagraphElement).textContent = `Estimated Hours: ${task.estimatedHours}`;

    (document.getElementById('taskStatusDetail') as HTMLParagraphElement).textContent = `Status: ${task.status}`;

    (document.getElementById('taskCreatedDateDetail') as HTMLParagraphElement).textContent = `Created Date: ${task.createdDate}`;

    (document.getElementById('taskAssignedUserDetail') as HTMLParagraphElement).textContent = `Assigned User: ${task.assignedUserId || 'N/A'}`;

}

export function assignUser() {
    const userSelect = document.getElementById('taskAssignUser') as HTMLSelectElement;
    const userId = userSelect.value;
    const task = taskService.getById(currentTaskId);

    if (task && userId) {
        taskService.update(currentTaskId, {
            assignedUserId: userId,
            status: 'doing',
            startDate: new Date().toISOString(),
        });
        renderTasks();
        showTaskDetails(taskService.getById(currentTaskId)!);
    }
}

export function markTaskAsDone() {
    const task = taskService.getById(currentTaskId);

    if (task) {
        taskService.update(currentTaskId, {
            status: 'done',
            endDate: new Date().toISOString(),
        });
        renderTasks();
        showTaskDetails(taskService.getById(currentTaskId)!);
    }
}

export function clearTaskForm() {
    (document.getElementById('taskName') as HTMLInputElement).value = '';
    (document.getElementById('taskDescription') as HTMLTextAreaElement).value = '';
    (document.getElementById('taskPriority') as HTMLSelectElement).value = 'low';
    (document.getElementById('taskEstimatedHours') as HTMLInputElement).value = '';
    (document.getElementById('taskStory') as HTMLSelectElement).value = '';
}
