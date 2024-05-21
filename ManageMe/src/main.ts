import './style.css';
import { ProjectService } from './services/ProjectService';
import { UserService } from './services/UserService';
import { StoryService } from './services/StoryService';
import IProject from './models/IProject';
import IStory from './models/IStory';

const projectService = new ProjectService();
const userService = new UserService();
const storyService = new StoryService();

document.getElementById('createProjectBtn')!.addEventListener('click', createProject);
document.getElementById('backBtn')!.addEventListener('click', showProjectList);
document.getElementById('deleteSelectedProjectBtn')!.addEventListener('click', deleteSelectedProject);
document.getElementById('createStoryBtn')!.addEventListener('click', createStory);

function createProject() {
    const name = (document.getElementById('projectName') as HTMLInputElement).value;
    const description = (document.getElementById('projectDescription') as HTMLTextAreaElement).value;

    if (name && description) {
        projectService.create(name, description);
        renderProjects();
        clearForm();
    }
}

function createStory() {
    const name = (document.getElementById('storyName') as HTMLInputElement).value;
    const description = (document.getElementById('storyDescription') as HTMLTextAreaElement).value;
    const priority = (document.getElementById('storyPriority') as HTMLSelectElement).value as 'low' | 'medium' | 'high';
    const status = 'todo';
    const projectId = projectService.getCurrentProject()?.id;

    if (name && description && projectId) {
        const owner = userService.getUser()?.id || '';
        storyService.create(name, description, priority, projectId, owner);
        renderStories(projectId);
        clearStoryForm();
    }
}

function renderProjects() {
    const projectList = document.getElementById('projectList')!;
    projectList.innerHTML = '';
    const projects = projectService.getAll();

    projects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';

        const projectDetails = document.createElement('div');
        projectDetails.className = 'project-details';

        const projectName = document.createElement('span');
        projectName.textContent = project.name;

        const projectDescription = document.createElement('p');
        projectDescription.textContent = project.description;

        projectDetails.appendChild(projectName);
        projectDetails.appendChild(projectDescription);

        const projectActions = document.createElement('div');
        projectActions.className = 'project-actions';

        const selectButton = document.createElement('button');
        selectButton.textContent = 'Select';
        selectButton.className = 'select-btn';
        selectButton.addEventListener('click', () => {
            projectService.setCurrentProject(project.id);
            showProjectDetails(project);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', () => {
            projectService.delete(project.id);
            renderProjects();
        });

        projectActions.appendChild(selectButton);
        projectActions.appendChild(deleteButton);
        projectItem.appendChild(projectDetails);
        projectItem.appendChild(projectActions);
        projectList.appendChild(projectItem);
    });
}

function showProjectDetails(project: IProject) {
    const projectForm = document.getElementById('projectForm')!;
    const projectList = document.getElementById('projectList')!;
    const projectDetails = document.getElementById('projectDetails')!;

    projectForm.classList.add('hidden');
    projectList.classList.add('hidden');
    projectDetails.classList.remove('hidden');

    const nameInput = document.getElementById('selectedProjectName') as HTMLInputElement;
    const descriptionTextarea = document.getElementById('selectedProjectDescription') as HTMLTextAreaElement;

    nameInput.value = project.name;
    descriptionTextarea.value = project.description;

    nameInput.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        projectService.update(project.id, target.value, project.description);
    });

    descriptionTextarea.addEventListener('input', (event) => {
        const target = event.target as HTMLTextAreaElement;
        projectService.update(project.id, project.name, target.value);
    });

    renderStories(project.id);
}

function renderStories(projectId: string) {
    const todoColumn = document.getElementById('todoColumn')!;
    const doingColumn = document.getElementById('doingColumn')!;
    const doneColumn = document.getElementById('doneColumn')!;

    todoColumn.innerHTML = '<h3>To Do</h3>';
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

        storyDetails.appendChild(storyName);
        storyDetails.appendChild(storyDescription);
        storyDetails.appendChild(storyPriority);
        storyDetails.appendChild(storyState);

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
}

function showProjectList() {
    const projectForm = document.getElementById('projectForm')!;
    const projectList = document.getElementById('projectList')!;
    const projectDetails = document.getElementById('projectDetails')!;

    projectForm.classList.remove('hidden');
    projectList.classList.remove('hidden');
    projectDetails.classList.add('hidden');

    projectService.clearCurrentProject();
    renderProjects();
}

function deleteSelectedProject() {
    const currentProjectId = projectService.getCurrentProject()?.id;
    if (currentProjectId) {
        projectService.delete(currentProjectId);
        showProjectList();
    }
}

function renderUser() {
    const user = userService.getUser();
    const userNameElement = document.getElementById('userName')!;
    const userEmailElement = document.getElementById('userEmail')!;

    userNameElement.textContent = `Name: ${user.name}`;
    userEmailElement.textContent = `Email: ${user.email}`;
}

function clearForm() {
    (document.getElementById('projectName') as HTMLInputElement).value = '';
    (document.getElementById('projectDescription') as HTMLTextAreaElement).value = '';
    projectService.clearCurrentProject();
}

function clearStoryForm() {
    (document.getElementById('storyName') as HTMLInputElement).value = '';
    (document.getElementById('storyDescription') as HTMLTextAreaElement).value = '';
    (document.getElementById('storyPriority') as HTMLSelectElement).value = 'low';
}

renderProjects();
renderUser();
