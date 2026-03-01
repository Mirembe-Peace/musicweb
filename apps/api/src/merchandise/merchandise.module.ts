import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

import { MerchandiseService } from './merchandise.service';
import { MerchandiseController } from './merchandise.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [MerchandiseController],
  providers: [MerchandiseService],
})

export class MerchandiseModule {}
