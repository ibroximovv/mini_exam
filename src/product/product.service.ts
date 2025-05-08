import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async findAll() {
    try {
      return await this.prisma.product.findMany()
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.product.findFirst({ where: { id }})
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
      return `This action updates a #${id} product`;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.product.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Product not found')
      return await this.prisma.product.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
