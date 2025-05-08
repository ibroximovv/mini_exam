import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegionModule } from './region/region.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { WithdrawModule } from './withdraw/withdraw.module';
import { DebtModule } from './debt/debt.module';

@Module({
  imports: [RegionModule, RestaurantModule, PrismaModule, UserModule, AuthModule, CategoryModule, WithdrawModule, DebtModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
