import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService){}
  async create(createOrderDto: CreateOrderDto, req: Request) {
    try {
      const findone = await this.prisma.restaurant.findFirst({ where: { id: createOrderDto.restaurantId }})
      if (!findone) throw new BadRequestException('Restaurant not found')
      const waiterId = req['user'].id;
      const waiter = await this.prisma.user.findFirst({ where: { id: waiterId }})
      if (!waiter) throw new BadRequestException('Waiter not found')
      const createNewOrder = await this.prisma.order.create({
        data: {
          restaurantId: createOrderDto.restaurantId,
          waiterId,
          table: createOrderDto.table,
          status: OrderStatus.PENDING
        }
      })
      
      await this.prisma.orderItems.createMany({
        data: createOrderDto.orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          orderId: createNewOrder.id
        }))
      })
      return createNewOrder;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findAll() {
    try {
      return await this.prisma.order.findMany({
        include: {
          orderitems: true,
          restaurants: true,
          waiters: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          }
        },
        omit: {
          restaurantId: true,
          waiterId: true
        }
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.order.findFirst({ where: { id }, 
        include: {
          orderitems: true,
          restaurants: true,
          waiters: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          }
        },
        omit: {
          restaurantId: true,
          waiterId: true
        }
      })
      if (!findone) throw new BadRequestException('Order not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const findone = await this.prisma.order.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Order not found')
      const updated = await this.prisma.order.update({ where: { id }, data: updateOrderDto })
      if (!updateOrderDto.orderItems || !Array.isArray(updateOrderDto.orderItems)) {
        throw new BadRequestException('orderItems list is invalid');
      }
      
      await this.prisma.orderItems.updateMany({
        data: updateOrderDto.orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          orderId: updated.id
        }))
      })
      return updated;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async remove(id: string) {
    try {
      return `This action removes a #${id} order`;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
