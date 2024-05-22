export default interface IUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'devops' | 'developer';
}
