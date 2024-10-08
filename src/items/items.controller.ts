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
import { ItemsService, ResponseFormat } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  async create(
    @Body() createItemDto: CreateItemDto,
  ): Promise<ResponseFormat<Item>> {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  async findAll(): Promise<ResponseFormat<Item[]>> {
    return this.itemsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseFormat<Item>> {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<ResponseFormat<Item>> {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseFormat<void>> {
    return this.itemsService.delete(id);
  }

  @Patch(':id/status')
  async toggleStatus(
    @Param('id') id: string,
    @Body('status') status: boolean,
  ): Promise<ResponseFormat<Item>> {
    return this.itemsService.toggleStatus(id, status);
  }

  @Patch(':id/softdelete')
  async softDelete(@Param('id') id: string) {
    return this.itemsService.softDelete(id);
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.itemsService.search(query);
  }
}
