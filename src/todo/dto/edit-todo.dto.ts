import { IsEnum, IsOptional } from 'class-validator';
import { BaseTodoDto, IsTodoTitle } from './base-todo.dto';
import { $Enums } from '@prisma/client';

export class EditTodoDto extends BaseTodoDto {
  @IsOptional()
  @IsTodoTitle()
  title?: string;

  @IsOptional()
  @IsEnum($Enums.Status)
  status?: $Enums.Status;
}
