import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateDebtDto {
  @ApiProperty()
  @IsString()
  orderId: string;
  @ApiProperty({required: false})
  @IsNumber()
  @Min(1)
  @Max(1000000)
    @IsOptional()
  amount?: number;
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  client: string;
  @ApiProperty()
  restaurantId: string;
}
