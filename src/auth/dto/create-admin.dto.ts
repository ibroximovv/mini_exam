import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { IsEnum, IsPhoneNumber, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateAdminDto {
    @ApiProperty({ example: 'name' })
    @IsString()
    name: string

    @ApiProperty({ example: '+998911111111' })
    @IsPhoneNumber()
    phone: string

    @ApiProperty({ example: '12345678' })
    @IsString()
    password: string

    @ApiProperty({ enum: UserRole, example: 'ADMIN'})
    @IsEnum(UserRole)
    role: UserRole

    @ApiProperty({ example: 'a7273ab3-140b-41cc-920b-4962c53173fc' })
    @IsUUID()
    restaurantId: UUID
}