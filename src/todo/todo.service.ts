import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { FilterTodoDto } from './dto/filter-todo.dto';
import { EditTodoDto } from './dto/edit-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { connect } from 'http2';
import { constants } from 'buffer';
import { contains } from 'class-validator';
import { UsersModule } from 'src/users/users.module';

@Injectable()
export class TodoService {
    constructor(private readonly prisma: PrismaService) {}

  async createTodo(userId: number, dto: CreateTodoDto) {
    return this.prisma.todo.create({
        data: {
            title: dto.title,
            description: dto.description,
            dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
            user: {
                connect: { id: userId },
            }
        }
    })
  }

  async getTodo(userId: number, dto: FilterTodoDto) {
  const where: any = { userId };

  if (dto.status) where.status = dto.status;
  if (dto.query) {
    where.OR = [
      { title: { contains: dto.query, mode: 'insensitive' } },
      { description: { contains: dto.query, mode: 'insensitive' } },
    ];
  }
  if (dto.before || dto.after) {
    where.dueDate = {};
    if (dto.after) where.dueDate.gte = new Date(dto.after);
    if (dto.before) where.dueDate.lte = new Date(dto.before);
  }
  if (dto.includeNoDueDate) {
    where.OR = [...(where.OR || []), { dueDate: null }];
  }

  return this.prisma.todo.findMany({
    where,
    take: dto.limit ?? 10,
    skip: dto.page ? (dto.page - 1) * (dto.limit ?? 10) : 0,
  });
}

  async getTodoById(userId: number, id: number) {
    const todo = await this.prisma.todo.findUnique({
        where: {
            id: id,
            userId: userId,
        },
    })

    if(!todo || todo.userId !== userId) {
        throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return todo;
  }

  async editTodo(userId: number, id: number, dto: EditTodoDto) {
    try{
    const updatedTodo = await this.prisma.todo.update({
        where: {
            userId: userId,
            id: id
        },
        data: {
            title: dto.title,
            description: dto.description,
            status: dto.status as 'DONE' | 'PENDING',
            dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }
    })

    return updatedTodo;
    } catch (e){
        throw new NotFoundException(`Todo with id ${id} not found`);
    }
  }

  async deleteTodo(userId: number, id: number) {
    try{
    const deleteTodo = await this.prisma.todo.delete({
        where: {
            id,
            userId
        }
    })

    return deleteTodo;
    } catch (e){
        throw new NotFoundException(`Todo with id ${id} not found`);
    }
  }
}

