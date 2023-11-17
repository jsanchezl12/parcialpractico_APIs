import { IsNotEmpty, IsEmail, IsDateString } from 'class-validator';

export class MemberDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsDateString()
  birthdate: string;
}
