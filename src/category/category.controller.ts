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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/common/role.decorator';
import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['name', 'restaurantId'],
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    enum: ['true', 'false'],
  })
  @ApiQuery({
    name: 'restaurantId',
    required: false,
  })
  @ApiQuery({
    name: 'name',
    required: false,
  })
  @Get()
  findAll(
    @Query('name') name: string,
    @Query('restaurantId') restaurantId: string,
    @Query('isActive') isActive: string,
    @Query('sort') sort: string,
    @Query('order') order: string,
    @Query('take') take: string,
    @Query('from') from: string,
  ) {
    let options = { name, restaurantId, isActive, take, from, sort, order };
    return this.categoryService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
