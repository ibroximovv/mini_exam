import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetProductDto } from './dto/get-product.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService){}
  async create(createProductDto: CreateProductDto) {
    try {
      const findByRestaurantId = await this.prisma.restaurant.findFirst({ where: {
        AND: [
          { id: createProductDto.restaurantId },
          { isActive: true }
        ]
      }})
      if (!findByRestaurantId) throw new BadRequestException('Restaurant not found or not active')
      const findCategory = await this.prisma.category.findFirst({ where: { id: createProductDto.categoryId }})
      if (!findCategory) throw new BadRequestException('Category not found')
      const findone = await this.prisma.product.findFirst({ where: { name: createProductDto.name }})
      if (findone) throw new BadRequestException('Product already exists')
      return await this.prisma.product.create({ data: createProductDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findAll(query: GetProductDto) {
    const { skip = 1, take = 10, search, isActive, priceFrom, priceTo, sortBy = 'id', sortOrder = 'desc', restaurantId } = query;
    try {
      return await this.prisma.product.findMany({
        where: {
          ...(restaurantId && { restaurantId }),
          ...(search && {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
            ]
          }),
          ...(priceFrom !== undefined || priceTo !== undefined ?
            {
              price: {
                ...(priceFrom !== undefined &&  { gte: Number(priceFrom) }),
                ...(priceTo !== undefined &&  { lte: Number(priceTo) }),
              }
            }: {}
          ),
          ...(isActive !== undefined ? { isActive }: {}),
        },
        include: {
          categories: {
            select: {
              id: true,
              name: true
            }
          },
          restaurants: {
            select:{
              id: true,
              name: true,
              phone: true
            }
          }
        },
        omit: {
          restaurantId: true,
          categoryId: true
        },
        skip: ( Number(skip) - 1 ) * Number(take),
        take: Number(take),
        orderBy: {
          [sortBy]: sortOrder
        }
      })
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.message.includes('Timed out fetching a new connection')
      ) {
        throw new InternalServerErrorException('Serverda vaqtinchalik muammo yuz berdi. Iltimos, keyinroq urinib ko‘ring.');
      }
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.product.findFirst({ where: { id },
        include: {
          categories: {
            select: {
              id: true,
              name: true
            }
          },
          restaurants: {
            select:{
              id: true,
              name: true,
              phone: true
            }
          }
        },
        omit: {
          restaurantId: true,
          categoryId: true
        },
      })
      if (!findone) throw new BadRequestException('Product not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const findone = await this.prisma.product.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Product not found')
      const findByRestaurantId = await this.prisma.restaurant.findFirst({ where: {
        AND: [
          { id: updateProductDto.restaurantId },
          { isActive: true }
        ]
      }})
      if (!findByRestaurantId) throw new BadRequestException('Restaurant not found or not active')
      const findCategory = await this.prisma.category.findFirst({ where: { id: updateProductDto.categoryId }})
      if (!findCategory) throw new BadRequestException('Category not found')
      const findOne = await this.prisma.product.findFirst({ where: { name: updateProductDto.name }})
      if (findOne) throw new BadRequestException('Product already exists')
      return await this.prisma.product.update({ where: { id }, data: updateProductDto, 
        include: {
          categories: {
            select: {
              id: true,
              name: true
            }
          },
          restaurants: {
            select:{
              id: true,
              name: true,
              phone: true
            }
          }
        },
        omit: {
          restaurantId: true,
          categoryId: true
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.product.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Product not found')
      return await this.prisma.product.delete({ where: { id }, 
        include: {
          categories: {
            select: {
              id: true,
              name: true
            }
          },
          restaurants: {
            select:{
              id: true,
              name: true,
              phone: true
            }
          }
        },
        omit: {
          restaurantId: true,
          categoryId: true
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
