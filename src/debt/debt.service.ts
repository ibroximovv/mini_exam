import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProgramUpdateLevel } from 'typescript';

@Injectable()
export class DebtService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDebtDto) {
    try {
      const {amount = 0} = data
      let db = await this.prisma.debt.findFirst({
        where: { client: data.client },
      });
      if (db) {
        throw new BadRequestException({message: `Client "${data.client}" already have a debt`})
      }
      let a = await this.prisma.restaurant.findFirst({ where: { id: data.restaurantId } })
      if (!a) {
        throw new NotFoundException("Restaurant not found")
      }

      let newBalance = a.outcome + amount
      await this.prisma.restaurant.update({where: {id: data.restaurantId}, data: {outcome: newBalance}})
      let created = await this.prisma.debt.create({ data: {...data, amount} });

      let order = await this.prisma.order.findFirst({where: {id: data.orderId}})

      if (!order) {
        throw new NotFoundException("Order not found")
      }
      let newTotal = order.totalPrice - amount

      await this.prisma.order.update({where: {id: data.orderId}, data: {totalPrice: newTotal}}) 
      return { created };
    } catch (error) {
      return error.message
    }
  }

  async findAll(options) {
    try {
      let where: any = {};

      if (options.orderId) where.orderId = options.orderId;
      if (options.client) where.client = options.client;
      if (options.restaurantId) where.restaurantId = options.restaurantId;

      const take = options.take ? parseInt(options.take) : undefined;
      const skip = options.from ? parseInt(options.from) : undefined;

      const orderBy = options.sort
        ? {
            [options.sort]: options.order === 'desc' ? 'desc' : 'asc',
          }
        : undefined;

      const datas = await this.prisma.debt.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          orders: true,
          restaurants: {
            select: { name: true },
          },
        },
      });

      return datas;
    } catch (error) {
      console.log(error);
      return error.message
    }
  }

  async findOne(id: string) {
    try {
      let one = await this.prisma.debt.findFirst({ where: { id } });
      if (!one) {
        throw new NotFoundException('Not Found');
      }

      return { one };
    } catch (error) {
      console.log(error);
      return error.message
      
    }
  }

  async update(id: string, data: UpdateDebtDto) {
    try {
      let one = await this.prisma.debt.findFirst({ where: { id } });
      if (!one) {
        throw new NotFoundException('Not Found');
      }
      let updated = await this.prisma.debt.update({ where: { id }, data });
      return updated;
    } catch (error) {
      return error.message
    }
  }

  async remove(id: string) {
    try {
      let one = await this.prisma.debt.findFirst({ where: { id } });
      if (!one) {
        throw new NotFoundException('Not Found');
      }
      let deleted = await this.prisma.debt.delete({ where: { id } });
      return deleted;
    } catch (error) {
      return error.message
    }
  }
}
