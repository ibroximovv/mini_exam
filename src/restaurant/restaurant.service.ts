import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Region } from 'src/region/entities/region.entity';
import { GetRestaurantDto } from './dto/get-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService){}
  async create(createRestaurantDto: CreateRestaurantDto) {
    try {
      const findregion = await this.prisma.region.findFirst({ where: { id: createRestaurantDto.regionId }})
      if (!findregion) throw new BadRequestException('Region not found.')
      const findone = await this.prisma.restaurant.findFirst({
        where: {
          AND: [
            { name: createRestaurantDto.name },
            { adress: createRestaurantDto.adress },
            { phone: createRestaurantDto.phone }, 
            { isActive: true }
          ]
        }
      })
      if (findone) throw new BadRequestException('Restaurant already exists.')
      return await this.prisma.restaurant.create({ data: createRestaurantDto,
        include: {
          regions: true
        },
        omit: {
          regionId: true
        },
     });
    } catch (error) {
      if(error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findAll(query: GetRestaurantDto) {
    const { search, skip = 1, take = 10, isActive, regionId, priceFrom, priceTo, sortBy = 'id', sortOrder = 'desc' } = query
    let priceFilterField: 'income' | 'outcome' | 'tip' | undefined;
    if (sortBy === 'income' || sortBy === 'outcome' || sortBy === 'tip') {
      priceFilterField = sortBy
    }
    try {
      return await this.prisma.restaurant.findMany({
        where: {
          ...(search && {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
              {
                adress: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
              {
                phone: {
                  contains: search,
                  mode: 'insensitive'
                }
              }
            ]
          }),
          ...(priceFilterField && (priceFrom !== undefined || priceTo !== undefined) && {
            [priceFilterField]: {
              ...(priceFrom !== undefined && { gte: Number(priceFrom) }),
              ...(priceTo !== undefined && { lte: Number(priceTo) }),
            }
          }),
          ...(isActive !== undefined ? { isActive }: {}),
          ...(regionId && { regionId })
        },
        include: {
          regions: true
        },
        omit: {
          regionId: true
        },
        skip: ( Number(skip) - 1 ) * Number(take),
        take: Number(take),
        orderBy: {
          [sortBy]: sortOrder
        }
      });
    } catch (error) {
      if(error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.restaurant.findFirst({ where: { id },
        include: {
          regions: true
        },
        omit: {
          regionId: true
        },
      })
      if (!findone) throw new BadRequestException('Restaurant not found')
      return findone;
    } catch (error) {
      if(error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    try {
      const findone = await this.prisma.restaurant.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Restaurant not found')
      const findregion = await this.prisma.region.findFirst({ where: { id: updateRestaurantDto.regionId }})
      if (!findregion) throw new BadRequestException('Region not found.')
        const findOne = await this.prisma.restaurant.findFirst({
          where: {
            AND: [
              { name: updateRestaurantDto.name },
              { adress: updateRestaurantDto.adress },
              { phone: updateRestaurantDto.phone }, // isActive ham qoshiladi sal keyinroq
            ]
          }
        })
      if (findOne) throw new BadRequestException('Restaurant already exists.')
      return await this.prisma.restaurant.update({ where: { id }, data: updateRestaurantDto, 
        include: {
          regions: true
        },
        omit: {
          regionId: true
        },
      });
    } catch (error) {
      if(error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.restaurant.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Restaurant not found')
      return await this.prisma.restaurant.delete({ where: { id }, 
        include: {
          regions: true
        },
        omit: {
          regionId: true
        },
      });
    } catch (error) {
      if(error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
