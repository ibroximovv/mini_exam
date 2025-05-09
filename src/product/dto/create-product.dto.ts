import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString, IsUUID, Min } from "class-validator";
import { UUID } from "crypto";

export class CreateProductDto {
    @ApiProperty({ example: 'osh' })
    @IsString()
    name: string

    @ApiProperty({ example: 25000 })
    @Min(1000)
    @Type(() => Number)
    @IsNumber()
    price: number

    @ApiProperty()
    @IsUUID()
    categoryId: UUID

    @ApiProperty()
    @IsUUID()
    restaurantId: UUID

    @ApiProperty({ example: true })
    @IsBoolean()
    isActive: boolean
}
