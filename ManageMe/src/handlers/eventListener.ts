import { createProject, deleteSelectedProject, showProjectList } from './projectHandler';
import { createStory, showTaskForm } from './storyHandler';
import { createTask, assignUser, markTaskAsDone } from './taskHandler';

export function initializeEventListeners() {
    document.getElementById('createProjectBtn')!.addEventListener('click', createProject);
    document.getElementById('backBtn')!.addEventListener('click', showProjectList);
    document.getElementById('deleteSelectedProjectBtn')!.addEventListener('click', deleteSelectedProject);
    document.getElementById('createStoryBtn')!.addEventListener('click', createStory);
    document.getElementById('createTaskBtn')!.addEventListener('click', createTask);
    document.getElementById('assignUserBtn')!.addEventListener('click', assignUser);
    document.getElementById('markDoneBtn')!.addEventListener('click', markTaskAsDone);
}
