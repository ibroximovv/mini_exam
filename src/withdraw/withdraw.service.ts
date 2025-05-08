import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WithdrawService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateWithdrawDto) {
    let wd = await this.prisma.withdraw.create({ data });
    return { wd };
  }

  async findAll(options) {
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
  }

  async findOne(id: string) {
    let one = await this.prisma.withdraw.findFirst({
      where: { id },
      include: { restaurants: true, orders: true },
    });
    if (!one) {
      throw new NotFoundException('Not Found');
    }
    return { one };
  }

  async update(id: string, data: UpdateWithdrawDto) {
    let wd = await this.prisma.withdraw.findFirst({ where: { id } });
    if (!wd) {
      throw new NotFoundException('Not found');
    }
    let updated = await this.prisma.withdraw.update({ where: { id }, data });
    return { updated };
  }

  async remove(id: string) {
    let wd = await this.prisma.withdraw.findFirst({ where: { id } });
    if (!wd) {
      throw new NotFoundException('Not found');
    }
    let deleted = await this.prisma.withdraw.delete({ where: { id } });
    return { deleted };
  }
}
