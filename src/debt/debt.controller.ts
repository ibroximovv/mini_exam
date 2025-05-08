import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Post()
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtService.create(createDebtDto);
  }

  @ApiQuery({
    name: "sort",
    required: false,
    enum: ["amount", "client"]
  })
  @ApiQuery({
    name: "order",
    required: false,
    enum: ["asc", "desc"]
  })
  @ApiQuery({
    name: "from",
    required: false
  })
  @ApiQuery({
    name: "take",
    required: false
  })
  @ApiQuery({
    name: "client",
    required: false
  })
  @ApiQuery({
    name: "restuarantId",
    required: false
  })
  @ApiQuery({
    name: "orderId",
    required: false
  })
  @Get()
  findAll(
    @Query("orderId") orderId: number,
    @Query("restaurantId") restaurantId:  string,
    @Query("client") client: string,
    @Query("sort") sort: string,
    @Query("order") order: string,
    @Query("take") take: string,
    @Query("from") from: string
  ) {
    let options = {orderId, restaurantId,client, sort, order, take, from}
    return this.debtService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDebtDto: UpdateDebtDto) {
    return this.debtService.update(id, updateDebtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtService.remove(id);
  }
}
