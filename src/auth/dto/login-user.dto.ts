import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString } from "class-validator";

export class LoginUserDto {
    @ApiProperty({ example: '+998911111111' })
    @IsPhoneNumber()
    phone: string

    @ApiProperty({ example: '12345678' })
    @IsString()
    password: string
}