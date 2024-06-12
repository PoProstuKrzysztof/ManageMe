import { TaskService } from '../services/TaskService.ts';
import ITask from '../models/ITask.ts';
import { renderStories } from './storyHandler.ts';

const taskService = new TaskService();
let currentTaskId: string;

function getElementValue(id: string): string {
    return (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
}

function createTask() {
    const name = getElementValue('taskName');
    const description = getElementValue('taskDescription');
    const priority = getElementValue('taskPriority') as 'low' | 'medium' | 'high';
    const estimatedHours = parseInt(getElementValue('taskEstimatedHours'), 10);
    const storyId = getElementValue('taskStory');
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

function renderTasks() {
    const tasks = taskService.getAll();
    const taskContainer = document.getElementById('taskContainer')!;
    taskContainer.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.addEventListener('click', () => showTaskDetails(task));

        taskItem.innerHTML = `
            <div class="task-details">
                <span>${task.name}</span>
                <p>${task.description}</p>
                <span>Priority: ${task.priority}</span>
                <span>State: ${task.status}</span>
            </div>
        `;

        taskContainer.appendChild(taskItem);
    });
}

function showTaskDetails(task: ITask) {
    currentTaskId = task.id;
    const taskDetails = document.getElementById('taskDetails')!;
    taskDetails.classList.remove('hidden');

    const details = {
        taskNameDetail: `Name: ${task.name}`,
        taskDescriptionDetail: `Description: ${task.description}`,
        taskPriorityDetail: `Priority: ${task.priority}`,
        taskStoryDetail: `Story: ${task.storyId}`,
        taskStatusDetail: `Status: ${task.status}`,
        taskCreatedDateDetail: `Created Date: ${task.createdDate}`
    };

    Object.entries(details).forEach(([id, text]) => {
        (document.getElementById(id) as HTMLParagraphElement).textContent = text;
    });
}

function assignUser() {
    const userId = getElementValue('taskAssignUser');
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

function markTaskAsDone() {
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

function clearTaskForm() {
    ['taskName', 'taskDescription', 'taskPriority', 'taskEstimatedHours', 'taskStory'].forEach(id => {
        (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value = id === 'taskPriority' ? 'low' : '';
    });
}

export { createTask, renderTasks, showTaskDetails, assignUser, markTaskAsDone, clearTaskForm };
