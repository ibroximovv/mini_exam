import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString } from "class-validator";

export class LoginUserDto {
    @ApiProperty({ example: '' })
    @IsPhoneNumber()
    phone: string

    @ApiProperty({ example: '' })
    @IsString()
    password: string
}