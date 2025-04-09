import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateOcrTextDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(10000)
  @ApiProperty()
  Text: string;
}
