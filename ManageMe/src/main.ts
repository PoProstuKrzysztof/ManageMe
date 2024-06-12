import './style.css';
import { initializeEventListeners } from './handlers/eventListener.ts';
import { renderProjects } from './handlers/projectHandler.ts';

renderProjects();
initializeEventListeners();
