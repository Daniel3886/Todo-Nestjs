import { IsOptional, IsIn, IsString, IsDateString } from "class-validator";

export class EditTodoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  status?: 'DONE' | 'PENDING';

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
