import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Session, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, password }: { email: string; password: string }) {
    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password: hashed },
    });
  }

  async findOne(email: User['email']) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createSession(
    userId: User['id'],
    refreshToken: Session['refreshTokens'],
  ) {
    return this.prisma.session.create({
      data: {
        userId,
        refreshTokens: refreshToken,
      },
    });
  }

  async findSessionByToken(refreshToken: Session['refreshTokens']) {
    return this.prisma.session.findFirst({
      where: { refreshTokens: refreshToken },
    });
  }

  async removeAllSessionsForUser(userId: User['id']) {
    return this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  async findById(id: User['id']) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async comparePassword(
    inputPassword: string,
    hashedPassword: User['password'],
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, hashedPassword);
  }
}
