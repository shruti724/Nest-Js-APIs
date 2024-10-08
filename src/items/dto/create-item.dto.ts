import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsOptional()
  status?: boolean;
}
