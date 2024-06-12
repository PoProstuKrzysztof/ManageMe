import { StoryService } from '../services/StoryService.ts';
import { ProjectService } from '../services/ProjectService.ts';
import { deleteSelectedProject,showProjectList } from './projectHandler.ts';

const storyService = new StoryService();
const projectService = new ProjectService();

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

    // Ustaw nagłówki kolumn
    columns.todo.innerHTML = '<h3>To Do <span id="addStoryBtn" class="add-btn">+</span></h3>';
    columns.doing.innerHTML = '<h3>Doing</h3>';
    columns.done.innerHTML = '<h3>Done</h3>';

    const stories = storyService.getAll().filter(story => story.project === projectId);

    stories.forEach(story => {
        const storyItem = document.createElement('div');
        storyItem.className = 'story-item';

        storyItem.innerHTML = `
            <span>${story.name}</span>
            <button class="info-btn">Info</button>
            <div class="story-details">
                <p>${story.description}</p>
                <p>Priority: ${story.priority}</p>
                <span>State: ${story.status}</span>
                <span>Creation date: ${story.creationDate}</span>
            </div>
            <button class="move-btn">Move</button>
            <button class="delete-btn">Delete</button>
        `;

        const infoButton = storyItem.querySelector('.info-btn')!;
        const storyDetails = storyItem.querySelector('.story-details')!;
        const moveButton = storyItem.querySelector('.move-btn')!;
        const deleteButton = storyItem.querySelector('.delete-btn')!;

        infoButton.addEventListener('click', () => storyDetails.classList.toggle('active'));

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

    document.getElementById('addStoryBtn')!.addEventListener('click', openStoryModal);
    document.getElementById('createStoryBtn')!.addEventListener('click', createStory);
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
    document.getElementById('createProjectBtn')!.addEventListener('click', () => {
        const name = getElementValue('projectName');
        const description = getElementValue('projectDescription');
        if (name && description) {
            projectService.create(name, description);
            projectService.setCurrentProject(projectService.getAll().slice(-1)[0].id);
            renderStories(projectService.getCurrentProject()?.id!);
        }
    });
    document.getElementById('backBtn')!.addEventListener('click', showProjectList);
    document.getElementById('deleteSelectedProjectBtn')!.addEventListener('click', deleteSelectedProject);
});
