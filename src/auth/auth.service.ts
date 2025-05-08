import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService){}
  async login(loginUserDto: LoginUserDto) {
    try {
      const findUser = await this.prisma.user.findFirst({ where: { phone: loginUserDto.phone }})
      if (!findUser) throw new BadRequestException('User not found')
      const matchPassword = bcrypt.compareSync(loginUserDto.password, findUser.password)
      if (!matchPassword) throw new BadRequestException('Password error')
      const token = this.jwt.sign({ id: findUser.id, role: findUser.role })
      return { token };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
