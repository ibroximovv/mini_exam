import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DebtService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDebtDto) {
    try {
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
