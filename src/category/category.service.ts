import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    let ctg = await this.prisma.category.findFirst({
      where: { name: data.name, restaurantId: data.restaurantId },
    });
    if (ctg) {
      throw new BadRequestException(
        `Category ${data.name} in your restaurant already exists`,
      );
    }
    let newCategory = await this.prisma.category.create({ data });
    return {
      status: 200,
      message: 'Category created succesfully',
      newCategory,
    };
  }

  async findAll(options) {
    let where: any = {};
    if (options.name) where.name = options.name;
    if (options.restaurantId) where.restaurantId = options.restaurantId;
    if (options.isActive) where.isActive = options.isActive === 'true'; // boolean qilib olamiz

    const take = options.take ? parseInt(options.take) : undefined;
    const skip = options.from ? parseInt(options.from) : undefined;

    const orderBy = options.sort
      ? {
          [options.sort]: options.order === 'desc' ? 'desc' : 'asc',
        }
      : undefined;

    const datas = await this.prisma.category.findMany({
      where,
      take,
      skip,
      orderBy,
      include: {
        restaurants: {
          select: { name: true },
        },
      },
    });

    return {
      datas,
    };
  }

  async findOne(id: string) {
    let one = await this.prisma.category.findFirst({
      where: { id },
      include: {
        restaurants: {
          select: { name: true },
        },
      },
    });
    if (!one) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }
    return {
      one,
    };
  }

  async update(id: string, data: UpdateCategoryDto) {
    let ctg = await this.prisma.category.findFirst({ where: { id } });
    if (!ctg) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }
    let updated = await this.prisma.category.update({ where: { id }, data });
    return {
      message: 'Category updated succesfully',
      updated,
    };
  }

  async remove(id: string) {
    let ctg = await this.prisma.category.findFirst({ where: { id } });
    if (!ctg) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }
    let deleted = await this.prisma.category.delete({ where: { id } });
    return {
      message: 'Category deleted succesfully',
      deleted,
    };
  }
}
