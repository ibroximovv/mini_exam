import { Module } from '@nestjs/common';
import { UserExcelController } from './excel.controller';
import { UserExcelService } from './excel.service';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { DebtService } from 'src/debt/debt.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';

@Module({
  controllers: [UserExcelController],
  providers: [UserExcelService, UserService, ProductService, DebtService, RestaurantService]
})
export class UserExcelModule {}
