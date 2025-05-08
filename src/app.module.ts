import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegionModule } from './region/region.module';
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [RegionModule, RestaurantModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
