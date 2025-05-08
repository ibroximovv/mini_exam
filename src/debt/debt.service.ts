import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DebtService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDebtDto) {
    let db = await this.prisma.debt.findFirst({
      where: { client: data.client },
    });
    if (db) {
      throw new BadRequestException(
        `Client "${data.client}" already have a debt`,
      );
    }
    let created = await this.prisma.debt.create({ data });
    return { created };
  }

  async findAll(options) {
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
  }

  async findOne(id: string) {
    let one = await this.prisma.debt.findFirst({ where: { id } });
    if (!one) {
      throw new NotFoundException('Not Found');
    }

    return { one };
  }

  async update(id: string, data: UpdateDebtDto) {
    let one = await this.prisma.debt.findFirst({ where: { id } });
    if (!one) {
      throw new NotFoundException('Not Found');
    }
    let updated = await this.prisma.debt.update({ where: { id }, data });
    return updated;
  }

  async remove(id: string) {
    let one = await this.prisma.debt.findFirst({ where: { id } });
    if (!one) {
      throw new NotFoundException('Not Found');
    }
    let deleted = await this.prisma.debt.delete({ where: { id } });
    return deleted;
  }
}
