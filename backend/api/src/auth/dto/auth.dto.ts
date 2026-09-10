import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Aryan Patel' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'aryan@vyro.app' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'securepassword123' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'aryan@vyro.app' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'securepassword123' })
  @IsString()
  password!: string;
}
