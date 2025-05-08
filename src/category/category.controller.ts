import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
