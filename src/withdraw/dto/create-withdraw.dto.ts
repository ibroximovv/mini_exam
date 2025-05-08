import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Type } from '@prisma/client';
import { IsEnum, IsNumber, Max, Min } from 'class-validator';

export class CreateWithdrawDto {
  @ApiProperty({ enum: ['KIRISH', 'CHIQISH'] })
  @IsEnum(['KIRISH', 'CHIQISH'])
  type: Type;
  @ApiProperty()
  orderId?: string;
  @ApiProperty()
  @Min(1)
  @Max(10000000)
  @IsNumber()
  price: number;
  @ApiProperty()
  restaurantId: string;
}
