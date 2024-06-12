import IUser from '../models/IUser.ts';

export class UserService {
    private users: IUser[];
    private loggedInUser: IUser;

    constructor() {
        this.users = [
            { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
            { id: '2', name: 'Developer User', email: 'developer@example.com', role: 'developer' },
            { id: '3', name: 'DevOps User', email: 'devops@example.com', role: 'devops' }
        ];
        this.loggedInUser = this.users[0]; 
    }

    getUser(): IUser {
        return this.loggedInUser;
    }

    getAllUsers(): IUser[] {
        return this.users;
    }
}
