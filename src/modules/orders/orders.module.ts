// src/cart/cart.module.ts
import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from './orders.entity'
import { PhotoPrintSetting, PrintDetails } from '../printing/printing.entity'
import { Address, Users } from '../users/user.entity'
import { OrderService } from './orders.service'
import { PrintingService } from '../printing/printing.service'
import { OrderController } from './orders.controller'
import { UserModule } from '../users/user.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Address,PrintDetails,PhotoPrintSetting, Users]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    forwardRef(() => UserModule),
  ],
  providers: [OrderService, PrintingService],
  controllers: [OrderController],
})
export class OrderModule {}
