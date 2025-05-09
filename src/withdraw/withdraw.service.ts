import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus, UserRole } from '@prisma/client';

@Injectable()
export class WithdrawService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateWithdrawDto) {
    try {
      let withdraw = await this.prisma.withdraw.create({ data });
      if (data.type == 'KIRISH' && data.orderId) {
        let restaurant = await this.prisma.restaurant.findFirst({
          where: { id: data.restaurantId },
        });
        let order = await this.prisma.order.findFirst({
          where: { id: data.orderId },
        });
        let waiter = await this.prisma.user.findFirst({
          where: { id: order?.waiterId },
        });
        if (!restaurant) {
          throw new NotFoundException('Restaurant not found');
        }
        if (!order) {
          throw new NotFoundException('Order Not found');
        }

        let waiterBalance = (order?.totalPrice / 100) * restaurant.tip;
        let restaurantBalance =
          restaurant.income + (data.price - waiterBalance);

        if (waiter?.role == UserRole.WAITER) {
          await this.prisma.user.update({
            where: { id: waiter.id },
            data: { balance: waiterBalance },
          });
        }

        await this.prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { income: restaurantBalance },
        });
        await this.prisma.order.update({
          where: { id: data.orderId },
          data: { status: OrderStatus.PAID },
        });

        await this.prisma.user.update({
          where: { id: waiter?.id },
          data: { balance: waiterBalance },
        });

        let debt = await this.prisma.debt.findFirst({
          where: { orderId: data.orderId },
        });
        if (debt) {
          if (debt.amount <= data.price) {
            await this.prisma.debt.delete({ where: { id: debt.id } });
          } else {
            throw new BadRequestException(`You can not pay less than your order's total price.`);
          }
        }
      } else if (data.type == 'CHIQISH') {
        let restaurant = await this.prisma.restaurant.findFirst({
          where: { id: data.restaurantId },
        });
        if (!restaurant) {
          throw new NotFoundException('Restaurant not found');
        }
        let newBalance = restaurant.outcome + data.price;
        await this.prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { outcome: newBalance },
        });
      }
      return { withdraw };
    } catch (error) {
      return error.message;
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
      return error.message;
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
      return error.message;
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
      return error.message;
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
      return error.message;
    }
  }
}
