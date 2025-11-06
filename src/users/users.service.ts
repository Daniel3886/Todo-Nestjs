import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password: hashed },
    });
  }

  async findOne(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateRefreshToken(user_id: number, refreshToken: string) {
    return this.prisma.user.update({
      where: { id: user_id },
      data: { refreshToken }
    });
  }

  async removeRefreshToken(user_id: number) {
    return this.prisma.user.update({
      where: {id: user_id},
      data: { refreshToken: null },
    })
  }

  async findById(id: number){
    return this.prisma.user.findUnique({ where: { id }})
  }
}
