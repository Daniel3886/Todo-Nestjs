import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { RequestWithUser } from './types/request-with-user.type';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SwaggerConfig } from 'src/config/swagger.config';

@ApiBearerAuth(SwaggerConfig.auth.bearerAuthName)
@ApiTags(SwaggerConfig.auth.tag)
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(@Req() req: RequestWithUser) {
    await this.authService.logout(req.user.id);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
}
