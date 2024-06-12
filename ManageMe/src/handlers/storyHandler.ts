import { StoryService } from '../services/StoryService.ts';
import { ProjectService } from '../services/ProjectService.ts';
import { TaskService } from '../services/TaskService.ts';
import ITask from '../models/ITask.ts';

const storyService = new StoryService();
const projectService = new ProjectService();
const taskService = new TaskService();

const getElementValue = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;

export function createStory() {
    const name = getElementValue('storyName');
    const description = getElementValue('storyDescription');
    const priority = getElementValue('storyPriority') as 'low' | 'medium' | 'high';
    const projectId = projectService.getCurrentProject()?.id;

    if (name && description && projectId) {
        storyService.create(name, description, priority, projectId);
        renderStories(projectId);
        clearStoryForm();
        closeStoryModal();
    }
}

export function renderStories(projectId: string) {
    const columns = {
        todo: document.getElementById('todoColumn')!,
        doing: document.getElementById('doingColumn')!,
        done: document.getElementById('doneColumn')!
    };

    columns.todo.innerHTML = '<h3>To Do <span id="addStoryBtn" class="add-btn">+</span></h3>';
    columns.doing.innerHTML = '<h3>Doing</h3>';
    columns.done.innerHTML = '<h3>Done</h3>';

    const stories = storyService.getAll().filter(story => story.project === projectId);

    stories.forEach(story => {
        const storyItem = document.createElement('div');
        storyItem.className = 'story-item';

        storyItem.innerHTML = `
        <span id="storyName-column">${story.name}</span>
        <button class="info-btn">Info</button>
        <div class="story-details">
            <span>${story.description}</span>
            <span>Priority: ${story.priority}</span>
            <span>State: ${story.status}</span>
            <span>Creation date: ${story.creationDate}</span>
        </div>
        <button class="move-btn">Move</button>
        <button class="delete-btn">Delete</button>
    `;
    const infoButton = storyItem.querySelector('.info-btn') as HTMLElement;
    const storyDetails = storyItem.querySelector('.story-details') as HTMLElement;
    const taskButtonsContainer = storyItem.querySelector('.task-buttons') as HTMLElement;
    const moveButton = storyItem.querySelector('.move-btn') as HTMLElement;
    const deleteButton = storyItem.querySelector('.delete-btn') as HTMLElement;

        infoButton.addEventListener('click', () => {
            storyDetails.classList.toggle('active');
            renderTaskButtons(taskButtonsContainer, story.id);
        });

        moveButton.addEventListener('click', () => {
            story.status = story.status === 'todo' ? 'doing' : 'done';
            if (story.status === 'done') {
                story.finishDate = new Date().toLocaleDateString();
                storyDetails.innerHTML += `<span>Task finished: ${story.finishDate}</span>`;
                moveButton.remove();
            }
            storyService.update(story.id, story.name, story.description, story.priority, story.status);
            renderStories(projectId);
        });

        deleteButton.addEventListener('click', () => {
            storyService.delete(story.id);
            renderStories(projectId);
        });

        columns[story.status].appendChild(storyItem);
    });

    document.getElementById('addStoryBtn')?.addEventListener('click', openStoryModal);
}

function renderTaskButtons(container: HTMLElement, storyId: string) {
    const tasks = taskService.getTasksByStory(storyId);
    container.innerHTML = '';
    tasks.forEach(task => {
        const taskButton = document.createElement('button');
        taskButton.className = 'task-btn';
        taskButton.textContent = task.name;
        taskButton.addEventListener('click', () => openTaskModal(task));
        container.appendChild(taskButton);
    });
}

function openTaskModal(task: ITask) {
    const modal = document.getElementById('taskModal')!;
    modal.classList.remove('hidden');

    (document.getElementById('taskModalName') as HTMLParagraphElement).textContent = `Name: ${task.name}`;
    (document.getElementById('taskModalDescription') as HTMLParagraphElement).textContent = `Description: ${task.description}`;
    (document.getElementById('taskModalPriority') as HTMLParagraphElement).textContent = `Priority: ${task.priority}`;
    (document.getElementById('taskModalStatus') as HTMLParagraphElement).textContent = `Status: ${task.status}`;
    (document.getElementById('taskModalCreationDate') as HTMLParagraphElement).textContent = `Creation Date: ${task.createdDate}`;
    (document.getElementById('taskModalStory') as HTMLParagraphElement).textContent = `Story ID: ${task.storyId}`;

    document.getElementById('closeTaskModal')!.addEventListener('click', closeTaskModal);
}

function closeTaskModal() {
    const modal = document.getElementById('taskModal')!;
    modal.classList.add('hidden');

    document.getElementById('closeTaskModal')!.removeEventListener('click', closeTaskModal);
}

export function populateStoryDropdown() {
    const taskStorySelect = document.getElementById('taskStory') as HTMLSelectElement;
    taskStorySelect.innerHTML = '';

    storyService.getAll().forEach(story => {
        const option = document.createElement('option');
        option.value = story.id;
        option.text = story.name;
        taskStorySelect.appendChild(option);
    });
}

export function clearStoryForm() {
    ['storyName', 'storyDescription', 'storyPriority'].forEach(id => (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value = '');
}

export function openStoryModal() {
    document.getElementById('storyModal')!.classList.remove('hidden');
}

export function closeStoryModal() {
    document.getElementById('storyModal')!.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    const currentProjectId = projectService.getCurrentProject()?.id;
    if (currentProjectId) {
        renderStories(currentProjectId);
    }
});
