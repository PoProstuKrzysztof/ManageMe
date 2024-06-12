import './style.css';
import { initializeEventListeners } from './handlers/eventListener.ts';
import { renderProjects } from './handlers/projectHandler.ts';
import { renderUser } from './handlers/userHandler.ts';

renderProjects();
renderUser();
initializeEventListeners();
