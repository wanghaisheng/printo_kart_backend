// src/cart/cart.controller.ts
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common'
import { OrderService } from './orders.service'
import { Auth, GetUserId } from '../users/user.auth'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { PageDTO } from '../users/user.dto'
import { query } from 'express'

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('cart')
  @Auth()
  @ApiBearerAuth()
  async getCartByUserId(@GetUserId('id') userId: string, @Query() pageDto: PageDTO) {
    return this.orderService.getCartByUserId(userId, pageDto)
  }

  @Post('placeOrder/:orderId/:addressId')
  @Auth()
  @ApiBearerAuth()
  async placeOrder(@GetUserId('id') userId: string, @Param('orderId') orderId: string, @Param('addressId') addressId: string) {
    return this.orderService.placeOrder(userId, orderId, addressId)
  }

  @Get('orders')
  @Auth()
  @ApiBearerAuth()
  async getOrdersUserId(@GetUserId('id') userId: string, @Query() pageDto: PageDTO) {
    return this.orderService.getOrdersByUserId(userId, pageDto)
  }

  @Get(':orderId')
  @Auth()
  @ApiBearerAuth()
  async getOrdersByOrderId(@Param('orderId') orderId: string) {
    return this.orderService.getOrdersByOrderId(orderId)
  }
}
