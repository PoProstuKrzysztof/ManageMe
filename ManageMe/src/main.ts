import './style.css';
import { initializeEventListeners } from './handlers/eventListener';
import { renderProjects } from './handlers/projectHandler';
import { renderUser } from './handlers/userHandler';

// Inicjalizacja aplikacji
renderProjects();
renderUser();
initializeEventListeners();
