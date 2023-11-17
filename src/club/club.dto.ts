import { IsNotEmpty, MaxLength, IsDateString } from 'class-validator';

export class ClubDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  foundationDate: string;

  @IsNotEmpty()
  @MaxLength(100)
  description: string;
}
