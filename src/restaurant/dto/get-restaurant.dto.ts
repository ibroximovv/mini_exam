import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class GetRestaurantDto {
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

    @ApiProperty({ required: false, description: 'name, phone, adress' })
    @IsOptional()
    @IsString()
    search?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    regionId?: UUID

    @ApiProperty({ required: false, enum: ['id', 'name', 'adress', 'tip', 'income', 'outcome'] })
    @IsOptional()
    @IsIn(['id', 'name', 'adress', 'tip', 'income', 'outcome'])
    sortBy?: 'id' | 'name' | 'adress' | 'tip' | 'income' | 'outcome'

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

    @ApiProperty({ required: false, type: Boolean })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isActive?: boolean;
}