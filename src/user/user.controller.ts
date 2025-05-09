import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserCreateRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQuery } from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/common/role.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['name', 'phone', 'role'],
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: UserCreateRole,
  })
  @ApiQuery({
    name: 'restaurantId',
    required: false,
  })
  @ApiQuery({
    name: 'phone',
    required: false,
  })
  @ApiQuery({
    name: 'name',
    required: false,
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard)
  @Get()
  findAll(
    @Query('name') name: string,
    @Query('phone') phone: string,
    @Query('role') role: string,
    @Query('restaurantId') restaurantId: string,
    @Query('from') from: string,
    @Query('take') take: string,
    @Query('order') order: string,
    @Query('sort') sort: string,
  ) {
    let options = { name, phone, role, restaurantId, order, sort, from, take };
    return this.userService.findAll(options);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
