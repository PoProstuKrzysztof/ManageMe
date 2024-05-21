import './style.css';
import { ProjectService } from './services/ProjectService';
import { UserService } from './services/UserService';
import IProject from './models/IProject';

const projectService = new ProjectService();
const userService = new UserService();

document.getElementById('createProjectBtn')!.addEventListener('click', createProject);
document.getElementById('backBtn')!.addEventListener('click', showProjectList);
document.getElementById('deleteSelectedProjectBtn')!.addEventListener('click', deleteSelectedProject);

function createProject() {
    const name = (document.getElementById('projectName') as HTMLInputElement).value;
    const description = (document.getElementById('projectDescription') as HTMLTextAreaElement).value;

    if (name && description) {
        projectService.create(name, description);
        renderProjects();
        clearForm();
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

renderProjects();
renderUser();
