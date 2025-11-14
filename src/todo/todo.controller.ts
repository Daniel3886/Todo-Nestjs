import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { EditTodoDto } from './dto/edit-todo.dto';
import { FilterTodoDto } from './dto/filter-todo.dto';
import { TodoService } from './todo.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/auth.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { SwaggerConfig } from 'src/config/swagger.config';

@ApiBearerAuth(SwaggerConfig.todo.bearerAuthName)
@ApiTags(SwaggerConfig.todo.tag)
@UseGuards(AuthGuard)
@Controller('/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async createTodo(@Body() dto: CreateTodoDto, @AuthUser() user: JwtPayload) {
    return this.todoService.createTodo({ userId: user.id, dto });
  }

  @Get()
  async getTodo(@Query() dto: FilterTodoDto, @AuthUser() user: JwtPayload) {
    return this.todoService.getTodo({ userId: user.id, dto });
  }

  @Get(':id')
  async getTodoById(@Param('id') id: string, @AuthUser() user: JwtPayload) {
    return this.todoService.getTodoById({ userId: user.id, id: id });
  }

  @Patch(':id')
  async editTodo(
    @Param('id') id: string,
    @Body() dto: EditTodoDto,
    @AuthUser() user: JwtPayload,
  ) {
    return this.todoService.editTodo({ userId: user.id, id: id }, dto);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: string, @AuthUser() user: JwtPayload) {
    return this.todoService.deleteTodo({ userId: user.id, id: id });
  }
}
