import { IsOptional, IsString, MaxLength, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseTodoDto, IsTodoTitle } from './base-todo.dto';

export class CreateTodoDto extends BaseTodoDto {
  @IsTodoTitle()
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  declare description?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  declare dueDate?: Date;
}
