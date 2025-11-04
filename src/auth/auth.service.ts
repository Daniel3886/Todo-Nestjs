import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async register(
        email: string, 
        password: string
    ): Promise<{ access_token: string, refresh_token: string }> {
        const exist = await this.userService.findOne(email);

        if(exist){
            throw new BadRequestException("Email already registered");
        }   

        const user = await this.userService.create(email, password);
        const payload = { sub: user.id, email: user.email }

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d'})
        };
    }

    async login(
        email: string, 
        password: string
    ): Promise<{ access_token: string; refresh_token: string }> {
        const user = await this.userService.findOne(email);

        if(!user){
            throw new UnauthorizedException("Invalid email");
        }   

        const passwordMatches = await bcrypt.compare(password, user.password);
        if(!passwordMatches) {
            throw new UnauthorizedException("Invalid password");
        }
        
        const payload = { sub: user.id, email: user.email };

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d'})
        };
    }
}
