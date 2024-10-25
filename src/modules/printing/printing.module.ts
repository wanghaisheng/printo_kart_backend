import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PrintingController } from './printing.controller';
import { PrintingService } from './printing.service';
import { Cart } from '../orders/orders.entity';
import { PrintDetails } from './printing.entity';
import { UserModule } from '../users/user.module';
import { Users } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart,PrintDetails,Users]),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    forwardRef(() => UserModule),

  ],
  controllers: [PrintingController],
  providers: [PrintingService],
  exports: [PrintingService],
})
export class PrintingModule {}
