import {
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsString,
  IsEnum,
  MaxLength,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { $Enums } from '@prisma/client';

export class FilterTodoDto {
  @IsOptional()
  @IsEnum($Enums.Status)
  status?: $Enums.Status;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  query?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeNoDueDate?: boolean;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;
}
