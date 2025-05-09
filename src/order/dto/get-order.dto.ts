import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsNumber, IsPositive } from "class-validator";

export class GetOrderDto {
    @ApiProperty()
    @IsPositive()
    @Type(() => Number)
    @IsInt()
    skip: number

    @ApiProperty()
    @IsPositive()
    @Type(() => Number)
    @IsInt()
    take: number

    
}