import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('merchandise')
export class MerchandiseController {
  constructor(private readonly merchandiseService: MerchandiseService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: any) {
    return this.merchandiseService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.merchandiseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.merchandiseService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.merchandiseService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.merchandiseService.remove(id);
  }
}
