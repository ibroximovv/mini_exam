import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { ArrayMinSize, IsEnum, IsString, IsUUID, ValidateNested } from "class-validator";
import { UUID } from "crypto";
import { CreateOrderItemDto } from "./create-orderItem.dto";

export class CreateOrderDto {
    @ApiProperty()
    @IsUUID()
    restaurantId: UUID

    @ApiProperty({ example: 'A1' })
    @IsString()
    table: string

    @ApiProperty({
        example: [
          {
            productId: "b54e5123-bbc3-49d6-bb3e-456789abcdef",
            quantity: 2,
          },
          {
            productId: "a12e5123-bbc3-49d6-bb3e-123456abcdef",
            quantity: 1,
          }
        ]
    })
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    @ArrayMinSize(1)
    orderItems: CreateOrderItemDto[]
}
