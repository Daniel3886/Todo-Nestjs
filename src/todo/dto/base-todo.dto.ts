import {
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

export function IsTodoTitle(): PropertyDecorator {
  return applyDecorators(IsNotEmpty(), IsString(), MaxLength(100));
}

export class BaseTodoDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;
}
