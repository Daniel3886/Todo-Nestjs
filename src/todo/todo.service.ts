import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { FilterTodoDto } from './dto/filter-todo.dto';
import { EditTodoDto } from './dto/edit-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async createTodo({
    userId,
    dto,
  }: {
    userId: User['id'];
    dto: CreateTodoDto;
  }) {
    return this.prisma.todo.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async getTodo({ userId, dto }: { userId: string; dto: FilterTodoDto }) {
    const { query, status, startDate, endDate, includeNoDueDate } = dto;
    const where: Prisma.TodoWhereInput = {
      AND: [
        {
          userId,
          status,
        },
        {
          OR: query
            ? [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ]
            : undefined,
        },
        {
          dueDate:
            startDate || endDate ? { gte: startDate, lte: endDate } : undefined,
        },
        {
          OR: includeNoDueDate ? [{ dueDate: null }] : undefined,
        },
      ],
    } satisfies Prisma.TodoWhereInput;

    return this.prisma.todo.findMany({
      where,
      take: dto.limit,
      skip: dto.page ? (dto.page - 1) * (dto.limit ?? 10) : 0,
    });
  }

  async getTodoById({ userId, id }: { userId: string; id: string }) {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id: id,
      },
    });

    if (!todo || todo.userId !== userId) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return todo;
  }

  async editTodo(
    { userId, id }: { userId: User['id']; id: string },
    dto: EditTodoDto,
  ) {
    await this.getTodoById({ userId, id });

    const updatedTodo = await this.prisma.todo.update({
      where: {
        id: id,
      },
      data: dto,
    });

    return updatedTodo;
  }

  async deleteTodo({ userId, id }: { userId: User['id']; id: string }) {
    await this.getTodoById({ userId, id });

    const deletedTodo = await this.prisma.todo.delete({
      where: {
        id,
      },
    });

    return deletedTodo;
  }
}
