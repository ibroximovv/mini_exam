import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateRestaurantDto {
    @ApiProperty({ example: 'Nt' })
    @IsString()
    name: string
}
