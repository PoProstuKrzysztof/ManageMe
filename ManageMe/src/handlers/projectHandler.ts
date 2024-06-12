import { ProjectService } from '../services/ProjectService.ts';
import IProject from '../models/IProject.ts';
import { populateStoryDropdown, renderStories } from './storyHandler.ts';

const projectService = new ProjectService();

const getElementValue = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement).value;

function toggleVisibility(formId: string, listId: string, detailsId: string, hide: boolean) {
    document.getElementById(formId)!.classList.toggle('hidden', hide);
    document.getElementById(listId)!.classList.toggle('hidden', hide);
    document.getElementById(detailsId)!.classList.toggle('hidden', !hide);
}

function createButton(text: string, className: string, onClick: () => void) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.addEventListener('click', onClick);
    return button;
}

export function createProject() {
    const name = getElementValue('projectName');
    const description = getElementValue('projectDescription');

    if (name && description) {
        projectService.create(name, description);
        renderProjects();
        clearForm();
    }
}

export function renderProjects() {
    const projectList = document.getElementById('projectList')!;
    projectList.innerHTML = '';
    const projects = projectService.getAll();

    projects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.innerHTML = `
            <div class="project-details">
                <span>${project.name}</span>
                <p>${project.description}</p>
            </div>
        `;

        const projectActions = document.createElement('div');
        projectActions.className = 'project-actions';

        projectActions.appendChild(createButton('Select', 'select-btn', () => {
            projectService.setCurrentProject(project.id);
            populateStoryDropdown();
            showProjectDetails(project);
        }));

        projectActions.appendChild(createButton('Delete', 'delete-btn', () => {
            projectService.delete(project.id);
            renderProjects();
        }));

        projectItem.appendChild(projectActions);
        projectList.appendChild(projectItem);
    });
}

export function showProjectDetails(project: IProject) {
    toggleVisibility('projectForm', 'projectList', 'projectDetails', true);

    const nameInput = document.getElementById('selectedProjectName') as HTMLInputElement;
    const descriptionTextarea = document.getElementById('selectedProjectDescription') as HTMLTextAreaElement;

    nameInput.value = project.name;
    descriptionTextarea.value = project.description;

    nameInput.oninput = ({ target }) => projectService.update(project.id, (target as HTMLInputElement).value, project.description);
    descriptionTextarea.oninput = ({ target }) => projectService.update(project.id, project.name, (target as HTMLTextAreaElement).value);

    renderStories(project.id);
}

export function showProjectList() {
    toggleVisibility('projectForm', 'projectList', 'projectDetails', false);
    projectService.clearCurrentProject();
    renderProjects();
}

export function deleteSelectedProject() {
    const currentProjectId = projectService.getCurrentProject()?.id;
    if (currentProjectId) {
        projectService.delete(currentProjectId);
        showProjectList();
    }
}

export function clearForm() {
    ['projectName', 'projectDescription'].forEach(id => (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement).value = '');
    projectService.clearCurrentProject();
}
