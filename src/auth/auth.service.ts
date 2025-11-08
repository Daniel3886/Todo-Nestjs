import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async register(
        email: string, 
        password: string
    ): Promise<{ accessToken: string, refreshToken: string }> {
        const exist = await this.userService.findOne(email);

        if(exist){
            throw new BadRequestException("Email already registered");
        }   

        const user = await this.userService.create(email, password);
        const payload = { sub: user.id, email: user.email }
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d'});

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

        return { accessToken, refreshToken};
    }

    async login(
        email: string, 
        password: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.userService.findOne(email);

        if(!user){
            throw new UnauthorizedException("Invalid email");
        }   

        const passwordMatches = await bcrypt.compare(password, user.password);
        if(!passwordMatches) {
            throw new UnauthorizedException("Invalid password");
        }
        
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d'});

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

        return { accessToken, refreshToken };
    };

    async refresh(token: string): Promise<{ accessToken: string }> {
        try {
        const payload = this.jwtService.verify(token);
        const user = await this.userService.findById(payload.sub);

        if (!user || !user.refreshToken) throw new UnauthorizedException('Invalid refresh token');

        const isMatch = await bcrypt.compare(token, user.refreshToken);
        if (!isMatch) throw new UnauthorizedException('Invalid refresh token');

        const newAccessToken = this.jwtService.sign({ sub: user.id, email: user.email });
        return { accessToken: newAccessToken };
    } catch (e) {
        throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async logout(userId: number){
        await this.userService.removeRefreshToken(userId);
    }
}
