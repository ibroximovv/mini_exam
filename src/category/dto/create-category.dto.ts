import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;
  @ApiProperty()
  restaurantId: string;
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isActive: boolean;
}
