import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsInt, IsUUID, Min } from "class-validator";
import { UUID } from "crypto";

export class CreateOrderItemDto {
    @IsUUID()
    productId: UUID

    @IsInt()
    @Min(1)
    quantity: number
}