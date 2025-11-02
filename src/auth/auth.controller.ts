import { Body, Controller, HttpCode, HttpStatus, Post, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('/auth')
export class AuthController {
        
    constructor(
        private authService: AuthService,
        private jwtService: JwtService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    signIn(@Body() signInDto: SignInDto){
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('/profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Post('refresh')
    async refresh(@Body('refreshToken') token: string) {
      try {
        const payload = this.jwtService.verify(token);
        const newAccessToken = this.jwtService.sign({ sub: payload.sub });
        return { accessToken: newAccessToken };
      } catch (e) {
        throw new UnauthorizedException('Invalid refresh token');
    }
}
}
