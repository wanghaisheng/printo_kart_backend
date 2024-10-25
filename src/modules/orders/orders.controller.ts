// src/cart/cart.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { OrderService } from './orders.service';
import { Auth, GetUserId } from '../users/user.auth';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PageDTO } from '../users/user.dto';


@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('cart')
  @Auth()
  @ApiBearerAuth()
  async getCartByUserId(@GetUserId('id') userId: string, @Query() pageDto: PageDTO) {
    return this.orderService.getCartByUserId(userId, pageDto);
  }
}
