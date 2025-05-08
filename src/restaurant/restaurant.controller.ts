import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { Roles } from 'src/common/role.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Get()
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantService.remove(id);
  }
}
