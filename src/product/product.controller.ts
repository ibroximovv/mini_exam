import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/common/role.decorator';
import { UserRole } from '@prisma/client';
import { GetProductDto } from './dto/get-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: GetProductDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
