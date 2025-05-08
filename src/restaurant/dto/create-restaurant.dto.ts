import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsPhoneNumber, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateRestaurantDto {
    @ApiProperty({ example: 'Nt' })
    @IsString()
    name: string

    @ApiProperty({ example: 'Chilonzor' })
    @IsString()
    adress: string

    @ApiProperty({ example: '+998910128133' })
    @IsPhoneNumber()
    phone: string

    @ApiProperty({ example: 15 })
    @Type(() => Number)
    @IsNumber()
    tip: number

    @ApiProperty()
    @IsUUID()
    regionId: UUID

    @ApiProperty({ example: true })
    @IsBoolean()
    isActive: boolean
}
