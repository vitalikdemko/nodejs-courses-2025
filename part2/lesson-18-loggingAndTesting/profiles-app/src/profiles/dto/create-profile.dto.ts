import { IsEmail, IsInt, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProfileDto {
  @IsEmail()
  email: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MinLength(2)
  displayName: string;

  @IsInt()
  @Min(0)
  age: number;
}