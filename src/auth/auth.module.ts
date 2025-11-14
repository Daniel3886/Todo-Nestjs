import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthConfig } from 'src/config/auth.config';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: AuthConfig.jwtSecret,
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
