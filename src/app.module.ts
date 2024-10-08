// src/app.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nestAPI'),
    ItemsModule,
  ],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    console.log('MongoDB connection established successfully.');
  }
}
