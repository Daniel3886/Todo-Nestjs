import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { EditTodoDto } from './dto/edit-todo.dto';
import { FilterTodoDto } from './dto/filter-todo.dto';
import { TodoService } from './todo.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('todo')
@UseGuards(AuthGuard)
@Controller('/todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async createTodo(@Body() dto: CreateTodoDto, @Request() req) {
    console.log(req.user);
    return this.todoService.createTodo(req.user.id, dto);
  }

  @Get()
  async getTodo(@Query() dto: FilterTodoDto, @Request() req) {
    return this.todoService.getTodo(req.user.id, dto);
  }

  @Get('/:id')
  async getTodokById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.todoService.getTodoById(req.user.id, id);
  }

  @Patch('/:id')
  async editTodo(@Param('id', ParseIntPipe) id: number, @Body() dto: EditTodoDto, @Request() req) {
    return this.todoService.editTodo(req.user.id, id, dto);
  }

  @Delete('/:id')
  async deleteTodo(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.todoService.deleteTodo(req.user.id, id);
  }
}
