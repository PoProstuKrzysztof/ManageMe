import { StoryService } from '../services/StoryService.ts';
import { ProjectService } from '../services/ProjectService.ts';




const storyService = new StoryService();
const projectService = new ProjectService();


export function createStory() {
    const name = (document.getElementById('storyName') as HTMLInputElement).value;
    const description = (document.getElementById('storyDescription') as HTMLTextAreaElement).value;
    const priority = (document.getElementById('storyPriority') as HTMLSelectElement).value as 'low' | 'medium' | 'high';
    const projectId = projectService.getCurrentProject()?.id;

    if (name && description && projectId) {
        storyService.create(name, description, priority, projectId);
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

        const storyName = document.createElement('span');
        storyName.textContent = story.name;

        const infoButton = document.createElement('button');
        infoButton.textContent = 'Info';
        infoButton.className = 'info-btn';
        infoButton.addEventListener('click', () => {
            const details = storyItem.querySelector('.story-details')!;
            const actions = storyItem.querySelector('.story-actions')!;
            details.classList.toggle('active');
            actions.classList.toggle('active');
        });

        const storyDetails = document.createElement('div');
        storyDetails.className = 'story-details';

        const storyDescription = document.createElement('p');
        storyDescription.textContent = story.description;

        const storyPriority = document.createElement('p');
        storyPriority.textContent = `Priority: ${story.priority}`;

        const storyState = document.createElement('span');
        storyState.textContent = `State: ${story.status}`;

        const storyCreationDate = document.createElement('span');
        storyCreationDate.textContent = `Creation date: ${story.creationDate}`

       

        storyDetails.appendChild(storyDescription);
        storyDetails.appendChild(storyPriority);
        storyDetails.appendChild(storyState);
        storyDetails.appendChild(storyCreationDate);

        const moveButton = document.createElement('button');
        moveButton.textContent = 'Move';
        moveButton.className = 'move-btn';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.className = 'delete-btn'

        moveButton.addEventListener('click', () => {
            if (story.status === 'todo') {
                story.status = 'doing';
            } else if (story.status === 'doing') {
                story.status = 'done';
                story.finishDate = new Date().toLocaleDateString();

                const storyEndDate = document.createElement('span');
                storyEndDate.textContent = `Task finished: ${story.finishDate}`

                storyDetails.appendChild(storyEndDate)
            }
            storyService.update(story.id, story.name, story.description, story.priority, story.status);
            renderStories(projectId);
        });

        const storyActions = document.createElement('div');
        storyActions.className = 'story-actions';

        storyItem.appendChild(storyName);
        storyItem.appendChild(infoButton);
        storyItem.appendChild(moveButton);
        storyItem.appendChild(storyDetails);
        storyItem.appendChild(storyActions);

        if (story.status === 'todo') {
            todoColumn.appendChild(storyItem);
        } else if (story.status === 'doing') {
            doingColumn.appendChild(storyItem);
        } else if (story.status === 'done') {
            doneColumn.appendChild(storyItem);
            storyItem.removeChild(moveButton)
        }
    });

    document.getElementById('addStoryBtn')!.addEventListener('click', openStoryModal);
    document.getElementById('createStoryBtn')!.addEventListener('click', createStory);
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
