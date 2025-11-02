import { Injectable } from '@nestjs/common';
export type User = any; 

@Injectable()
export class UserService {
    private readonly users = [
        {
            userId: 1,
            email: "john@gmail.com",
            password: "password"
        },
        {
            userId: "2",
            email: "maria@proton.me",
            password: "guess"
        }
    ];

    async findOne(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email)
    }
}
