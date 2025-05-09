import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { OrderStatus } from '@prisma/client';
import { GetOrderDto } from './dto/get-order.dto';

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
      });
      
      const orderItemsData = createOrderDto.orderItems;

      const productResults = await Promise.all(
        orderItemsData.map(async (item) => {
          const product = await this.prisma.product.findFirst({
            where: { id: item.productId },
            select: { id: true, price: true },
          });
  
          if (!product) {
            throw new BadRequestException(`Product not found: ${item.productId}`);
          }
  
          return {
            ...item,
            price: product.price,
            total: product.price * item.quantity,
          };
        })
      );

      const totalPrice = productResults.reduce((sum, item) => sum + item.total, 0);

      await this.prisma.orderItems.createMany({
        data: productResults.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          orderId: createNewOrder.id,
        })),
      });

      // await this.prisma.user.update({ where: { id: waiterId }, data: {
      //   balance: waiter.balance + (totalPrice * (findone.tip / 100))
      // }})
      return await this.prisma.order.update({ where: { id: createNewOrder.id }, data: { totalPrice }})
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findAll(query: GetOrderDto) {
    const { skip = 1, take = 10, search, restaurantId, waiterId, sortBy = 'id', sortOrder = 'desc', priceFrom, priceTo } = query
    try {
      const order = await this.prisma.order.findMany({
        where: {
          ...(restaurantId && { restaurantId }),
          ...(waiterId && { waiterId }),
          ...( search && {
            OR: [
              { table: {
                contains: search,
                mode: 'insensitive'
              }},
              {
                orderitems: {
                  some: {
                    products: {
                      name: {
                        contains: search,
                        mode: 'insensitive'
                      }
                    }
                  }
                }
              }
            ]
          }),
          ...(priceFrom !== undefined || priceTo !== undefined ?
            {
              totalPrice: {
                ...(priceFrom !== undefined && { gte: Number(priceFrom) }),
                ...(priceTo !== undefined && { lte: Number(priceTo) })
              }
            }: {}
          )
        },
        include: {
          orderitems: {
            select: {
              products: {
                select: {
                  id: true,
                  name: true,
                  price: true
                }
              },
              quantity: true
            }
          },
          restaurants: {
            select: {
              name: true,
              id: true
            }
          },
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
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip: ( Number(skip) - 1 ) * Number(take),
        take: Number(take)
      });

      return order
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.order.findFirst({ where: { id }, 
        include: {
          orderitems: {
            select: {
              products: {
                select: {
                  id: true,
                  name: true,
                  price: true
                }
              },
              quantity: true
            }
          },
          restaurants: {
            select: {
              name: true,
              id: true
            }
          },
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
      const findone = await this.prisma.order.findFirst({ where: { id } });
      if (!findone) throw new BadRequestException('Order not found');
  
      if (updateOrderDto.orderItems && Array.isArray(updateOrderDto.orderItems)) {
        const productIds = updateOrderDto.orderItems.map(item => item.productId);
        const products = await this.prisma.product.findMany({
          where: { id: { in: productIds } },
        });
  
        if (products.length !== productIds.length) {
          throw new BadRequestException('Product not found');
        }
  
        await this.prisma.orderItems.deleteMany({
          where: { orderId: id },
        });
  
        await this.prisma.orderItems.createMany({
          data: updateOrderDto.orderItems.map(item => ({
            orderId: id,
            productId: item.productId,
            quantity: item.quantity,
          })),
        });
      }
  
      const updated = await this.prisma.order.update({
        where: { id },
        data: {
          table: updateOrderDto.table || findone.table,
        },
      });
  
      return updated;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error');
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
