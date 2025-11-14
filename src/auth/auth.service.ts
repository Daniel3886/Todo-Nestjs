import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.type';
import { AuthInput } from './types/auth-input.type';
import { AuthTokens } from './types/auth-tokens.type';
import { AccessTokenResponse } from './types/access-token-response.type';
import { AuthConfig } from 'src/config/auth.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private generateTokens(payload: JwtPayload): AuthTokens {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: AuthConfig.accessTokenExpiresIn,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: AuthConfig.refreshTokenExpiresIn,
    });

    return { accessTokens: accessToken, refreshTokens: refreshToken };
  }

  async register(input: AuthInput): Promise<AuthTokens> {
    const exist = await this.userService.findOne(input.email);
    if (exist) throw new BadRequestException('Email already registered');

    const user = await this.userService.create(input);
    const payload: JwtPayload = { id: user.id, email: user.email };
    const tokens = this.generateTokens(payload);

    await this.userService.createSession(user.id, tokens.refreshTokens);
    return tokens;
  }

  async login(input: AuthInput): Promise<AuthTokens> {
    const user = await this.userService.findOne(input.email);

    if (!user) throw new UnauthorizedException('Invalid email');

    const passwordMatches = await this.userService.comparePassword(
      input.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { id: user.id, email: user.email };
    const tokens = this.generateTokens(payload);

    await this.userService.createSession(user.id, tokens.refreshTokens);
    return tokens;
  }

  async refresh(refreshToken: string): Promise<AccessTokenResponse> {
    try {
      const payload: JwtPayload = this.jwtService.verify(refreshToken);
      const session = await this.userService.findSessionByToken(refreshToken);

      if (!session)
        throw new UnauthorizedException('Invalid or expired refresh token');

      const user = await this.userService.findById(payload.id);

      if (!user)
        throw new UnauthorizedException('Invalid or expired refresh token');

      const accessToken = this.jwtService.sign<JwtPayload>(
        { id: user.id, email: user.email },
        { expiresIn: AuthConfig.accessTokenExpiresIn },
      );
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.userService.removeAllSessionsForUser(userId);
  }
}
