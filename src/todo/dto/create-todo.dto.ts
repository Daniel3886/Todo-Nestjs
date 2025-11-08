import { IsNotEmpty, IsOptional, IsDateString } from "class-validator";

export class CreateTodoDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
