import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/common/role.decorator';
import { UserRole } from '@prisma/client';
import { GetOrderDto } from './dto/get-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(UserRole.WAITER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.orderService.create(createOrderDto, req);
  }

  @Get()
  findAll(@Query() query: GetOrderDto) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Roles(UserRole.WAITER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Roles(UserRole.WAITER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
