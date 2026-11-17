import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  author?: string;

  @IsOptional()
  @IsString()
  @Length(10, 17)
  isbn?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalCopies?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  genreId?: number;
}