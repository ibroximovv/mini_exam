import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsIn, IsInt, IsOptional, IsPositive, IsString, IsUUID } from "class-validator"
import { UUID } from "crypto"

export class GetOrderDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    @IsInt()
    skip?: number

    @ApiProperty({ required: false })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    @IsInt()
    take?: number

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    search?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    restaurantId?: UUID

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    waiterId?: UUID

    @ApiProperty({ required: false, enum: ['id', 'table', 'totalPrice'] })
    @IsOptional()
    @IsIn(['id', 'table', 'totalPrice'])
    sortBy?: 'id' | 'table' | 'totalPrice'

    @ApiProperty({ required: false, enum: ['asc', 'desc'] })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc'

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    priceFrom?: number

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    priceTo?: number
}
