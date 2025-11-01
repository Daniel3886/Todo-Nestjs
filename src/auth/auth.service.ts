import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

// TODO: make password encrypted and later compare the hashed password not the plain text password

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async signIn(
        username: string,
         pass: string
    ): Promise<{ access_token: string }> {
        const user = await this.userService.findOne(username);
        if(user?.password !== pass){
            throw new UnauthorizedException();
        }   
        const payload = { sub: user.userId, username: user.username };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
