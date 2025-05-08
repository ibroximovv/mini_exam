import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserCreateRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQuery } from '@nestjs/swagger';

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
    enum: ["name", "phone", "role"]
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ["asc", "desc"]
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
  @Get()
  findAll(
    @Query("name") name: string,
    @Query("phone") phone: string,
    @Query("role") role: string,
    @Query("restaurantId") restaurantId: string,
    @Query("from") from: string,
    @Query("take") take: string,
    @Query("order") order: string,
    @Query("sort") sort: string,
  ) {
    let options = {name, phone, role, restaurantId, order, sort, from, take}
    return this.userService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
