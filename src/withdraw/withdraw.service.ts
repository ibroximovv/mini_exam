import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class WithdrawService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateWithdrawDto) {
    try {
      let withdraw = await this.prisma.withdraw.create({ data });
      if (data.type == "KIRISH" && data.orderId) {
        let restaurant = await this.prisma.restaurant.findFirst({ where: { id: data.restaurantId } })
        if (!restaurant) {
          throw new NotFoundException("Restaurant not found")
        }
        let newBalance = restaurant.income + data.price
        await this.prisma.restaurant.update({ where: { id: restaurant.id }, data: { income: newBalance}})
        await this.prisma.order.update({
          where:
            { id: data.orderId },
          data:
            { status: OrderStatus.PAID}
        })

        let a = await this.prisma.order.findFirst({
          where:
            { id: data.orderId }
        })

        let balance = a.totalPrice / 100 * restaurant?.tip
        
        await this.prisma.user.update({
          where:
            { id: a?.waiterId },
          data:
            { balance: a.}
        })
      }
      else if (data.type == "CHIQISH") {
        let restaurant = await this.prisma.restaurant.findFirst({ where: { id: data.restaurantId } })
        if (!restaurant) {
          throw new NotFoundException("Restaurant not found")
        }    
        let newBalance = restaurant.outcome + data.price
        await this.prisma.restaurant.update({ where: { id: restaurant.id }, data: { outcome: newBalance}})
      }
      return { withdraw };
    } catch (error) {
      return error.message
    }
  }

  async findAll(options) {
    try {
      let where: any = {};

      if (options.price) where.price = options.price;
      if (options.type) where.type = options.type;
      if (options.orderId) where.orderId = options.orderId;
      if (options.restaurantId) where.restaurantId = options.restaurantId;

      const take = options.take ? parseInt(options.take) : undefined;
      const skip = options.from ? parseInt(options.from) : undefined;

      const orderBy = options.sort
        ? {
            [options.sort]: options.order === 'desc' ? 'desc' : 'asc',
          }
        : undefined;

      const withdraws = await this.prisma.withdraw.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          restaurants: true,
          orders: true,
        },
      });

      return withdraws;
    } catch (error) {
      return error.message
    }
  }

  async findOne(id: string) {
    try {
      let one = await this.prisma.withdraw.findFirst({
        where: { id },
        include: { restaurants: true, orders: true },
      });
      if (!one) {
        throw new NotFoundException('Not Found');
      }
      return { one };
    } catch (error) {
      return error.message
    }
  }

  async update(id: string, data: UpdateWithdrawDto) {
    try {
      let wd = await this.prisma.withdraw.findFirst({ where: { id } });
      if (!wd) {
        throw new NotFoundException('Not found');
      }
      let updated = await this.prisma.withdraw.update({ where: { id }, data });
      return { updated };
    } catch (error) {
      return error.message
    }
  }

  async remove(id: string) {
    try {
      let wd = await this.prisma.withdraw.findFirst({ where: { id } });
      if (!wd) {
        throw new NotFoundException('Not found');
      }
      let deleted = await this.prisma.withdraw.delete({ where: { id } });
      return { deleted };
    } catch (error) {
      return error.message
    }
  }
}
