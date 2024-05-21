import './style.css';
import { ProjectService } from './services/ProjectService';
import { UserService } from './services/UserService';
import IProject from './models/IProject';

const projectService = new ProjectService();
const userService = new UserService();

document.getElementById('createProjectBtn')!.addEventListener('click', createOrUpdateProject);

function createOrUpdateProject() {
    const name = (document.getElementById('projectName') as HTMLInputElement).value;
    const description = (document.getElementById('projectDescription') as HTMLTextAreaElement).value;

    if (name && description) {
        const currentProjectId = projectService.getCurrentProject()?.id;
        if (currentProjectId) {
            projectService.update(currentProjectId, name, description);
        } else {
            projectService.create(name, description);
        }
        renderProjects();
        clearForm();
        renderCurrentProject();
    }
}

function renderProjects() {
    const projectList = document.getElementById('projectList')!;
    projectList.innerHTML = '';
    const projects = projectService.getAll();
    const currentProjectId = projectService.getCurrentProject()?.id;

    projects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        if (project.id === currentProjectId) {
            projectItem.classList.add('selected');
        }

        const projectDetails = document.createElement('div');
        projectDetails.className = 'project-details';

        const projectNameInput = document.createElement('input');
        projectNameInput.type = 'text';
        projectNameInput.value = project.name;
        projectNameInput.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            projectService.update(project.id, target.value, project.description);
        });

        const projectDescriptionTextarea = document.createElement('textarea');
        projectDescriptionTextarea.value = project.description;
        projectDescriptionTextarea.addEventListener('change', (event) => {
            const target = event.target as HTMLTextAreaElement;
            projectService.update(project.id, project.name, target.value);
        });

        projectDetails.appendChild(projectNameInput);
        projectDetails.appendChild(projectDescriptionTextarea);

        const projectActions = document.createElement('div');
        projectActions.className = 'project-actions';

        const selectButton = document.createElement('button');
        selectButton.textContent = 'Select';
        selectButton.className = 'select-btn';
        selectButton.addEventListener('click', () => {
            projectService.setCurrentProject(project.id);
            renderProjects();
            renderCurrentProject();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', () => {
            projectService.delete(project.id);
            renderProjects();
            renderCurrentProject();
        });

        projectActions.appendChild(selectButton);
        projectActions.appendChild(deleteButton);
        projectItem.appendChild(projectDetails);
        projectItem.appendChild(projectActions);
        projectList.appendChild(projectItem);
    });
}

function renderCurrentProject() {
    const currentProjectDetails = document.getElementById('currentProjectDetails')!;
    const currentProject = projectService.getCurrentProject();
    if (currentProject) {
        currentProjectDetails.innerHTML = `
            <p><strong>Name:</strong> ${currentProject.name}</p>
            <p><strong>Description:</strong> ${currentProject.description}</p>
        `;
        const nameInput = document.getElementById('projectName') as HTMLInputElement;
        const descriptionTextarea = document.getElementById('projectDescription') as HTMLTextAreaElement;

        nameInput.value = currentProject.name;
        descriptionTextarea.value = currentProject.description;

        document.getElementById('createProjectBtn')!.textContent = 'Update Project';
    } else {
        currentProjectDetails.innerHTML = '<p>No project selected</p>';
        document.getElementById('createProjectBtn')!.textContent = 'Create Project';
    }
}

function renderUser() {
    const user = userService.getUser();
    const userNameInput = document.getElementById('userName') as HTMLInputElement;
    const userEmailInput = document.getElementById('userEmail') as HTMLInputElement;

    userNameInput.value = user.name;
    userEmailInput.value = user.email;

    userNameInput.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        userService.updateUser(target.value, user.email);
    });

    userEmailInput.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        userService.updateUser(user.name, target.value);
    });
}

function clearForm() {
    (document.getElementById('projectName') as HTMLInputElement).value = '';
    (document.getElementById('projectDescription') as HTMLTextAreaElement).value = '';
    document.getElementById('createProjectBtn')!.textContent = 'Create Project';
    projectService.clearCurrentProject();
}

renderProjects();
renderUser();
renderCurrentProject();
