import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';


export enum UserCreateRole {
  OWNER = 'OWNER',
  CASHER = 'CASHER',
  WAITER = 'WAITER',
}
export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;
  @ApiProperty()
  @IsPhoneNumber('UZ')
  phone: string;
  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak' })
  @MaxLength(32, { message: 'Parol 32 ta belgidan oshmasligi kerak' })
  password: string;
  @ApiProperty({ enum: UserCreateRole })
  @IsEnum(UserCreateRole)
  role: UserRole;
  @ApiProperty()
  @IsString({ message: 'Siz faqat String tipida malumot yubora olasiz' })
  restaurantId: string;
}
