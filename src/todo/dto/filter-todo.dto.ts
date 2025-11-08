import { IsOptional, IsIn, IsDateString, IsBoolean, IsInt, Min, IsString,  } from "class-validator";
import { Type } from "class-transformer";

export class FilterTodoDto {
  @IsOptional()
  status?: 'DONE' | 'PENDING';

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsDateString()
  before?: string;

  @IsOptional()
  @IsDateString()
  after?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeNoDueDate?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}