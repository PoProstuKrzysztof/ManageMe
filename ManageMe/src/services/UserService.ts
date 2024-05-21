import IUser from '../models/IUser.ts';

export class UserService {
    private user: IUser;

    constructor() {
        // Mock zalogowanego użytkownika
        this.user = {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com'
        };
    }

    getUser(): IUser {
        return this.user;
    }

    updateUser(name: string, email: string): void {
        this.user.name = name;
        this.user.email = email;
    }
}
