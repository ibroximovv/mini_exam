import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Region } from 'src/region/entities/region.entity';

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
          ]
        }
      })
      if (findone) throw new BadRequestException('Restaurant already exists.')
      return await this.prisma.restaurant.create({ data: createRestaurantDto });
    } catch (error) {
      if(error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findAll() {
    try {
      return await this.prisma.restaurant.findMany({
        include: {
          regions: true
        },
        omit: {
          regionId: true
        }
      });
    } catch (error) {
      if(error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.restaurant.findFirst({ where: { id }})
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
      return await this.prisma.restaurant.update({ where: { id }, data: updateRestaurantDto });
    } catch (error) {
      if(error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.restaurant.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Restaurant not found')
      return await this.prisma.restaurant.delete({ where: { id }});
    } catch (error) {
      if(error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
