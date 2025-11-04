import { Body, Controller, HttpCode, HttpStatus, Post, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('/auth')
export class AuthController {
        
    constructor(
        private authService: AuthService,
        private jwtService: JwtService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('/register')
    register(@Body() registerDto: RegisterDto){
        return this.authService.register(registerDto.email, registerDto.password);
            
    }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @Post('/refresh')
    async refresh(@Body('refreshToken') token: string) {
        try {
            const payload = this.jwtService.verify(token);
            const newAccessToken = this.jwtService.sign({ sub: payload.sub });
            return { accessToken: newAccessToken };
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
    
    @UseGuards(AuthGuard)
    @Get('/profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
