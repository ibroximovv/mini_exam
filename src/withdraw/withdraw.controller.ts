import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { ApiQuery } from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/common/role.decorator';

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Roles(UserRole.CASHER, UserRole.ADMIN, UserRole.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createWithdrawDto: CreateWithdrawDto) {
    return this.withdrawService.create(createWithdrawDto);
  }

  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['type', 'price', 'orderId', 'restaurantId'],
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
  })
  @ApiQuery({
    name: 'take',
    required: false,
  })
  @ApiQuery({
    name: 'from',
    required: false,
  })
  @ApiQuery({
    name: 'restaurantId',
    required: false,
  })
  @ApiQuery({
    name: 'price',
    required: false,
  })
  @ApiQuery({
    name: 'orderId',
    required: false,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['KIRISH', 'CHIQISH'],
  })
  @Get()
  findAll(
    @Query('price') price: number,
    @Query('type') type: string,
    @Query('orderId') orderId: number,
    @Query('restaurantId') restaurantId: number,
    @Query('take') take: number,
    @Query('from') from: number,
    @Query('order') order: number,
    @Query('sort') sort: number,
  ) {
    let options = {
      price,
      type,
      orderId,
      restaurantId,
      take,
      from,
      order,
      sort,
    };
    return this.withdrawService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.withdrawService.findOne(id);
  }

  @Roles(UserRole.CASHER, UserRole.ADMIN, UserRole.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWithdrawDto: UpdateWithdrawDto,
  ) {
    return this.withdrawService.update(id, updateWithdrawDto);
  }

  @Roles(UserRole.CASHER, UserRole.ADMIN, UserRole.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.withdrawService.remove(id);
  }
}
