import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { isValidObjectId } from 'mongoose';

export interface ResponseFormat<T> {
  success: boolean;
  data?: T;
  message: string;
  status: number;
  // _id: any;
}

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<ItemDocument>) {}

  async create(createItemDto: CreateItemDto): Promise<ResponseFormat<Item>> {
    try {
      const newItem = new this.itemModel(createItemDto);
      const savedItem = await newItem.save();
      return {
        success: true,
        data: savedItem,
        message: 'Item created successfully',
        status: 201,
      };
    } catch (error) {
      console.error('Error while creating item:', error);
      throw new InternalServerErrorException('Could not create item');
    }
  }

  async findAll(): Promise<ResponseFormat<Item[]>> {
    try {
      const items = await this.itemModel.find({ isDeleted: false }).exec();
      return {
        success: true,
        data: items,
        message: 'Items retrieved successfully',
        status: 200,
      };
    } catch (error) {
      console.error('Error while retrieving items:', error);
      throw new InternalServerErrorException('Could not retrieve items');
    }
  }

  async findOne(id: string): Promise<ResponseFormat<Item>> {
    try {
      const item = await this.itemModel
        .findOne({ _id: id, isDeleted: false })
        .exec();
      if (!item) {
        throw new NotFoundException(`Item with id ${id} not found`);
      }
      return {
        success: true,
        data: item,
        message: 'Item retrieved successfully',
        status: 200,
      };
    } catch (error) {
      console.error('Error while retrieving item:', error);
      throw new InternalServerErrorException('Could not retrieve item');
    }
  }

  async update(
    id: string,
    updateItemDto: UpdateItemDto,
  ): Promise<ResponseFormat<Item>> {
    try {
      const updatedItem = await this.itemModel
        .findByIdAndUpdate(id, updateItemDto, { new: true })
        .exec();
      if (!updatedItem) {
        throw new NotFoundException(`Item with id ${id} not found`);
      }
      return {
        success: true,
        data: updatedItem,
        message: 'Item updated successfully',
        status: 200,
      };
    } catch (error) {
      console.error('Error while updating item:', error);
      throw new InternalServerErrorException('Could not update item');
    }
  }

  async delete(id: string): Promise<ResponseFormat<void>> {
    try {
      const deletedItem = await this.itemModel.findByIdAndDelete(id).exec();
      if (!deletedItem) {
        throw new NotFoundException(`Item with id ${id} not found`);
      }
      return {
        success: true,
        message: 'Item deleted successfully',
        status: 200,
      };
    } catch (error) {
      console.error('Error while deleting item:', error);
      throw new InternalServerErrorException('Could not delete item');
    }
  }

  async toggleStatus(
    id: string,
    status: boolean,
  ): Promise<ResponseFormat<Item>> {
    try {
      const updatedItem = await this.itemModel
        .findByIdAndUpdate(id, { status }, { new: true })
        .exec();

      if (!updatedItem) {
        throw new NotFoundException(`Item with id ${id} not found`);
      }

      return {
        success: true,
        data: updatedItem,
        message: 'Item status updated successfully',
        status: 200,
      };
    } catch (error) {
      console.error('Error while toggling status:', error);
      throw new InternalServerErrorException('Could not update item status');
    }
  }

  async softDelete(id: string): Promise<ResponseFormat<void>> {
    try {
      const updatedItem = await this.itemModel
        .findOneAndUpdate(
          { _id: id, isDeleted: false },
          { isDeleted: true },
          { new: true },
        )
        .exec();

      if (!updatedItem) {
        throw new NotFoundException(`Item with id ${id} not found`);
      }

      return {
        success: true,
        message: 'Item soft deleted successfully',
        status: 200,
      };
    } catch (error) {
      console.error('Error while soft deleting item:', error);
      throw new InternalServerErrorException('Could not soft delete item');
    }
  }

  async search(query: string): Promise<ResponseFormat<Item[]>> {
    try {
      const cleanQuery = query.replace(/'/g, '').trim();

      if (!cleanQuery) {
        return {
          success: false,
          message: 'Query cannot be empty',
          status: 400,
        };
      }

      console.log('Type of query:', typeof cleanQuery);

      const isObjectId = isValidObjectId(cleanQuery);
      if (isObjectId) {
        console.log('Query is a valid ObjectId:', cleanQuery);
      } else {
        console.log('Query is a string search:', cleanQuery);
      }

      const searchConditions: any = { isDeleted: false };

      if (isObjectId) {
        searchConditions._id = cleanQuery;
      } else {
        searchConditions.name = { $regex: cleanQuery, $options: 'i' };
      }

      const items = await this.itemModel.find(searchConditions).exec();

      return {
        success: true,
        data: items,
        message: 'Items retrieved successfully',
        status: 200,
      };
    } catch (error) {
      console.error('Error while searching items:', error.message);
      throw new InternalServerErrorException('Could not retrieve items');
    }
  }
}
