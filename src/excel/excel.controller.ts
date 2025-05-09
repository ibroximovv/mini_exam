// src/restaurant/restaurant-excel.controller.ts

import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { UserService } from 'src/user/user.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { ProductService } from 'src/product/product.service';
import { DebtService } from 'src/debt/debt.service';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('excel')
export class UserExcelController {
  constructor(
    private prisma: PrismaService,
    private readonly restaurantService: RestaurantService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly debtService: DebtService,
  ) {}

  @Get('restaurant')
  async exportToExcel(@Res() res: Response) {
    const data = await this.prisma.restaurant.findMany();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Restaurants');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Income', key: 'income', width: 15 },
      { header: 'Outcome', key: 'outcome', width: 15 },
    ];

    data.forEach((restaurant) => {
      worksheet.addRow(restaurant);
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=restaurants.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  @Get('user')
  async userExcel(@Res() res: Response) {
    const waiters = await this.prisma.user.findMany({
      where: { role: UserRole.WAITER },
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Waiters');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Balance', key: 'balance', width: 20 },
    ];

    waiters.forEach((user) => {
      worksheet.addRow({
        name: user.name,
        balance: user.balance,
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=waiters.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }

  @Get('products')
  async productExcel(@Res() res: Response) {
    const activeProducts = await this.prisma.product.findMany({
      where: { isActive: true },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Active Products');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Price', key: 'price', width: 20 },
    ];

    activeProducts.forEach((product) => {
      worksheet.addRow({
        name: product.name,
        price: product.price,
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }

  @Get('debt')
  async debtExcel(@Res() res: Response) {
    const debts = await this.prisma.debt.findMany()
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Debts');

    worksheet.columns = [
      { header: 'Order ID', key: 'orderId', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Client', key: 'client', width: 30 },
      { header: 'Restaurant', key: 'restaurant', width: 30 },
    ];

    for (const debt of debts) {
      const restaurant = await this.prisma.restaurant.findFirst({
        where: { id: debt.restaurantId },
      });

      worksheet.addRow({
        orderId: debt.orderId,
        amount: debt.amount,
        client: debt.client,
        restaurant: restaurant ? restaurant.name : 'Unknown',
      });
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=debts.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }
}
