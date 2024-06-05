import { UserService } from '../services/UserService';

const userService = new UserService();

export function renderUser() {
    const user = userService.getUser();
    const userNameElement = document.getElementById('userName')!;
    const userEmailElement = document.getElementById('userEmail')!;

    userNameElement.textContent = `Name: ${user.name}`;
    userEmailElement.textContent = `Email: ${user.email}`;
}
