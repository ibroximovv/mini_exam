import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegionModule } from './region/region.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { WithdrawModule } from './withdraw/withdraw.module';
import { DebtModule } from './debt/debt.module';
import { UserExcelModule } from './excel/excel.module';

@Module({
  imports: [RegionModule, RestaurantModule, PrismaModule, UserModule, AuthModule, ProductModule, OrderModule, CategoryModule, WithdrawModule, DebtModule, UserExcelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
