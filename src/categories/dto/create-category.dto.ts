import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'title can be not empty' })
  @IsString({ message: 'title should be string' })
  title: string;

  @IsNotEmpty({ message: 'description can be not empty' })
  @IsString({ message: 'description should be string' })
  description: string;
}
