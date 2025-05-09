import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString } from "class-validator";

export class LoginUserDto {
    @ApiProperty({ example: '+998123456789' })
    @IsPhoneNumber()
    phone: string

    @ApiProperty({ example: 'your password' })
    @IsString()
    password: string
}