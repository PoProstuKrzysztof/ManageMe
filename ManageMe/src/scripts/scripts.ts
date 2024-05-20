// src/script/scripts.ts
import { ProjectService } from '../services/ProjectService';


const projectService = new ProjectService();

document.getElementById('createProjectBtn')!.addEventListener('click', () => {
    const name = (document.getElementById('projectName') as HTMLInputElement).value;
    const description = (document.getElementById('projectDescription') as HTMLTextAreaElement).value;

    if (name && description) {
        projectService.create(name, description);
        renderProjects();
        (document.getElementById('projectName') as HTMLInputElement).value = '';
        (document.getElementById('projectDescription') as HTMLTextAreaElement).value = '';
    }
});

function renderProjects() {
    const projectList = document.getElementById('projectList')!;
    projectList.innerHTML = '';
    const projects = projectService.getAll();
    projects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';

        const projectDetails = document.createElement('div');
        projectDetails.className = 'project-details';
        projectDetails.innerHTML = `<h2>${project.name}</h2><p>${project.description}</p>`;

        const projectActions = document.createElement('div');
        projectActions.className = 'project-actions';
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            projectService.delete(project.id);
            renderProjects();
        });

        projectActions.appendChild(deleteButton);
        projectItem.appendChild(projectDetails);
        projectItem.appendChild(projectActions);
        projectList.appendChild(projectItem);
    });
}

renderProjects();
