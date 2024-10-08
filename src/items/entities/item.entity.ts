import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema()
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: true })
  status?: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
