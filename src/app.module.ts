import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegionModule } from './region/region.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [RegionModule, RestaurantModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
