import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService ){}
  async create(createRegionDto: CreateRegionDto) {
    try {
      const findRegion = await this.prisma.region.findFirst({ where: { name: createRegionDto.name }})
      if (findRegion) throw new BadRequestException('Region already exists.')
      return await this.prisma.region.create({ data: createRegionDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findAll() {
    try {
      return await this.prisma.region.findMany();
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.region.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Region not found.')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async update(id: string, updateRegionDto: UpdateRegionDto) {
    try {
      const findone = await this.prisma.region.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Region not found.')
      const findRegion = await this.prisma.region.findFirst({ where: { name: updateRegionDto.name }})
      if (findRegion) throw new BadRequestException('Region already exists.')
      return await this.prisma.region.update({ where: { id }, data: updateRegionDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.region.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Region not found.')
      return await this.prisma.region.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
