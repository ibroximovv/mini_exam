import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt"
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService){}

  async create(data: CreateUserDto) {
    try {
      let user = await this.prisma.user.findFirst({ where: { phone: data.phone } })
      if (user) {
        if (user.role === data.role) {
          throw new BadRequestException(`${data.role} with this phone already exists`)
        }
      }
      let hash = bcrypt.hashSync(data.password, 10)
      let newUser = await this.prisma.user.create({data: {...data, password: hash}})
      return newUser
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2024') {
          throw new InternalServerErrorException(
            'Ma\'lumotlar bazasiga ulanishda muammo yuz berdi. Iltimos, qayta urinib koring.',
          );
        }
        throw new BadRequestException(`Prisma xatosi: ${error.message}`);
      }
      let hash = bcrypt.hashSync(data.password, 10);
      let newUser = await this.prisma.user.create({
        data: { ...data, password: hash },
      });
      return newUser;
    }
  }

  async findAll(options) {
    try {
      let where: any = {};
      if (options.name) where.name = options.name;
      if (options.role) where.role = options.role;
      if (options.restaurantId) where.restaurantId = options.restaurantId;
      if (options.phone) where.phone = options.phone;

      let orderBy: { [key: string]: 'asc' | 'desc' }[] | undefined = undefined;

      if (options.sort) {
        const order: 'asc' | 'desc' = options.order === 'desc' ? 'desc' : 'asc';
        orderBy = [{ [options.sort]: order }];
      }

      const skip = options.from ? Number(options.from) : 0;
      const take = options.take ? Number(options.take) : 10;

      let users = await this.prisma.user.findMany({ where });
      return users;
    } catch (error) {
      return error.message
    }
  }

  async findOne(id: string) {
    try {
      let one = await this.prisma.user.findFirst({ where: { id } });
      if (!one) {
        throw new NotFoundException(`User with id(${id}) not found`);
      }
      return one;
    } catch (error) {
      return error.message
    }
  }

  async update(id: string, data: UpdateUserDto) {
    try {
      let user = this.findOne(id);
      if (!user) {
        throw new NotFoundException(`User with id(${id}) not found`);
      }
      let updatedUser = await this.prisma.user.update({ where: { id }, data });
      return updatedUser;
    } catch (error) {
      return error.message
    }
  }

  async remove(id: string) {
    try {
      let user = this.findOne(id);
      if (!user) {
        throw new NotFoundException(`User with id(${id}) not found`);
      }
      let deleted = await this.prisma.user.delete({ where: { id } });
      return deleted;
    } catch (error) {
      return error.message
    }
  }
}
