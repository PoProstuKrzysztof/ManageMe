import { StoryService } from '../services/StoryService';
import { ProjectService } from '../services/ProjectService';
import { UserService } from '../services/UserService';
import { TaskService } from '../services/TaskService';


const storyService = new StoryService();
const projectService = new ProjectService();
const userService = new UserService();
const taskService = new TaskService();

export function createStory() {
    const name = (document.getElementById('storyName') as HTMLInputElement).value;
    const description = (document.getElementById('storyDescription') as HTMLTextAreaElement).value;
    const priority = (document.getElementById('storyPriority') as HTMLSelectElement).value as 'low' | 'medium' | 'high';
    const projectId = projectService.getCurrentProject()?.id;

    if (name && description && projectId) {
        const owner = userService.getUser()?.id || '';
        storyService.create(name, description, priority, projectId, owner);
        renderStories(projectId);
        clearStoryForm();
        closeStoryModal(); 
    }
}

export function renderStories(projectId: string) {
    const todoColumn = document.getElementById('todoColumn')!;
    const doingColumn = document.getElementById('doingColumn')!;
    const doneColumn = document.getElementById('doneColumn')!;

    todoColumn.innerHTML = '<h3>To Do <span id="addStoryBtn" class="add-btn">+</span></h3>';
    doingColumn.innerHTML = '<h3>Doing</h3>';
    doneColumn.innerHTML = '<h3>Done</h3>';

    const stories = storyService.getAll().filter(story => story.project === projectId);

    stories.forEach(story => {
        const storyItem = document.createElement('div');
        storyItem.className = 'story-item';

        const storyDetails = document.createElement('div');
        storyDetails.className = 'story-details';

        const storyName = document.createElement('input');
        storyName.type = 'text';
        storyName.value = story.name;
        storyName.className = 'story-input';
        storyName.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            story.name = target.value;
        });

        const storyDescription = document.createElement('textarea');
        storyDescription.value = story.description;
        storyDescription.className = 'story-input';
        storyDescription.addEventListener('input', (event) => {
            const target = event.target as HTMLTextAreaElement;
            story.description = target.value;
        });

        const storyPriority = document.createElement('select');
        ['low', 'medium', 'high'].forEach(priority => {
            const option = document.createElement('option');
            option.value = priority;
            option.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
            if (priority === story.priority) {
                option.selected = true;
            }
            storyPriority.appendChild(option);
        });
        storyPriority.className = 'story-input';
        storyPriority.addEventListener('change', (event) => {
            const target = event.target as HTMLSelectElement;
            story.priority = target.value as 'low' | 'medium' | 'high';
        });

        const storyState = document.createElement('span');
        storyState.textContent = `State: ${story.status}`;

        const taskList = document.createElement('div');
        taskList.className = 'task-list';
        taskList.id = `taskList-${story.id}`;

        const tasks = taskService.getAll().filter(task => task.storyId === story.id);
        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.textContent = task.name;
            taskList.appendChild(taskItem);
        });

        const createTaskButton = document.createElement('button');
        createTaskButton.textContent = 'Create Task';
        createTaskButton.className = 'create-btn';
        createTaskButton.addEventListener('click', () => {
            showTaskForm(story.id);
        });

        storyDetails.appendChild(storyName);
        storyDetails.appendChild(storyDescription);
        storyDetails.appendChild(storyPriority);
        storyDetails.appendChild(storyState);
        storyDetails.appendChild(taskList);
        storyDetails.appendChild(createTaskButton);

        const storyActions = document.createElement('div');
        storyActions.className = 'story-actions';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', () => {
            storyService.delete(story.id);
            renderStories(projectId);
        });

        if (story.status !== 'done') {
            const moveButton = document.createElement('button');
            moveButton.textContent = 'Move';
            moveButton.className = 'move-btn';
            moveButton.addEventListener('click', () => {
                if (story.status === 'todo') {
                    story.status = 'doing';
                } else if (story.status === 'doing') {
                    story.status = 'done';
                }
                storyService.update(story.id, story.name, story.description, story.priority, story.status);
                renderStories(projectId);
            });
            storyActions.appendChild(moveButton);
        }

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = 'save-btn';
        saveButton.addEventListener('click', () => {
            storyService.update(story.id, story.name, story.description, story.priority, story.status);
            renderStories(projectId);
        });

        storyActions.appendChild(saveButton);
        storyActions.appendChild(deleteButton);
        storyItem.appendChild(storyDetails);
        storyItem.appendChild(storyActions);

        if (story.status === 'todo') {
            todoColumn.appendChild(storyItem);
        } else if (story.status === 'doing') {
            doingColumn.appendChild(storyItem);
        } else if (story.status === 'done') {
            doneColumn.appendChild(storyItem);
        }
    });


    document.getElementById('addStoryBtn')!.addEventListener('click', openStoryModal);
    document.getElementById('closeStoryModal')!.addEventListener('click', closeStoryModal);
}

export function clearStoryForm() {
    (document.getElementById('storyName') as HTMLInputElement).value = '';
    (document.getElementById('storyDescription') as HTMLTextAreaElement).value = '';
    (document.getElementById('storyPriority') as HTMLSelectElement).value = 'low';
}

export function showTaskForm(storyId: string) {
    const taskForm = document.getElementById('taskForm')!;
    taskForm.classList.remove('hidden');
    (document.getElementById('taskStory') as HTMLSelectElement).value = storyId;
}

export function openStoryModal() {
    const storyModal = document.getElementById('storyModal')!;
    storyModal.classList.remove('hidden');
}

export function closeStoryModal() {
    const storyModal = document.getElementById('storyModal')!;
    storyModal.classList.add('hidden');
}
