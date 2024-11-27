import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class TodoDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsBoolean()
  isCompleted: boolean;

  @IsDate()
  createdAt: Date;
}
