// src/cart/cart.service.ts
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PageDTO } from '../users/user.dto'
import { Order } from './orders.entity'
import { OrderStatusEnum, paymentStatusEnum } from './orders.interface'
import { Address } from '../users/user.entity'
import { PrintDetails } from '../printing/printing.entity'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(PrintDetails)
    private readonly printDetailsRepository: Repository<PrintDetails>
  ) {}

  // Method to get cart details by user ID
  async getCartByUserId(userId: string, { page, limit }: PageDTO) {
    const [carts, total] = await this.orderRepository.findAndCount({
      where: { userId, status: OrderStatusEnum.InCart },
      skip: (page - 1) * limit, // Calculate the number of items to skip
      take: limit, // Limit the number of items returned
    })

    if (carts.length === 0) {
      throw new NotFoundException(`Cart not found for user ID: ${userId}`)
    }

    return {
      data: carts,
      total, // Total number of carts found
    }
  }

  async getOrdersByUserId(userId: string, { page, limit }: PageDTO) {
    try {
      const [orders, totalOrders] = await this.orderRepository.findAndCount({
        where: { userId },
        skip: (page - 1) * limit, // Calculate the number of items to skip
        take: limit, // Limit the number of items returned
      })

      // Initialize an array to store the enriched orders
      const completeOrderInfo = []

      for (const order of orders) {
        // Array to store enriched order details for the current order
        const enrichedOrderDetails = []
        // Fetch product details from printDetailsRepository for each order detail
        const productDetails = await this.printDetailsRepository.findOne({
          where: { id: order.productId }, // Assuming productId links to printDetailsRepository
        })

        // Append the enriched detail with product details
        enrichedOrderDetails.push({ productDetails })

        // Push the enriched order into the complete order info array
        completeOrderInfo.push({
          ...order,
          orderDetails: enrichedOrderDetails,
        })
      }

      return {
        orders: completeOrderInfo,
        total: totalOrders,
        page,
        limit,
      }
    } catch (error) {
      throw error
    }
  }

  async getOrdersByOrderId(orderId: string) {
    try {
      const orderDetails = await this.orderRepository.findOne({
        where: { id: orderId },
      })
      if (!orderDetails) throw new HttpException('Order not found', HttpStatus.NOT_FOUND)

      // Initialize an array to store the enriched orders
      const completeOrderInfo = []

      // Array to store enriched order details for the current order
      const enrichedOrderDetails = []
      // Fetch product details from printDetailsRepository for each order detail
      const productDetails = await this.printDetailsRepository.findOne({
        where: { id: orderDetails.productId }, // Assuming productId links to printDetailsRepository
      })

      // Append the enriched detail with product details
      enrichedOrderDetails.push({ productDetails })

      // Push the enriched order into the complete order info array
      completeOrderInfo.push({
        orderDetails,
        enrichedOrderDetails,
      })

      return {
        orders: completeOrderInfo,
      }
    } catch (error) {
      throw error
    }
  }

  async placeOrder(userId: string, orderId: string, addressId: string) {
    // Retrieve the order by orderId\
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId },
    })
    if (!order) throw new HttpException('Order not found', HttpStatus.NOT_FOUND)

    const addressDetail = await this.addressRepository.findOne({
      where: {
        id: addressId,
      },
    })

    if (!addressDetail) throw new HttpException('Address not found', HttpStatus.NOT_FOUND)

    const productId = order.productId

    // Step 3: Process payment
    const paymentResponse = 'success'
    // await this.paymentService.processPayment(order);

    // Step 4: Update order status based on payment result
    order.status = OrderStatusEnum.Pending
    order.addressId = addressDetail.id
    order.paymentStatus = paymentStatusEnum.Pending
    order.productId = productId
    await this.orderRepository.save(order)

    return {
      message: 'Your order placed successfully!',
      orderId: order.id,
    }
  }
}
