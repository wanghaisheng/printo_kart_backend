// src/cart/print-details.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order } from '../orders/orders.entity'
import { PrintDetailsDto } from './printing.dto'
import { PhotoPrintSetting, PrintDetails } from './printing.entity'
import { uuid } from 'uuidv4'
import { CartTypeEnum, OrderStatusEnum } from '../orders/orders.interface'
import { PrintType } from './printing.interface'

@Injectable()
export class PrintingService {
  constructor(
    @InjectRepository(PrintDetails)
    private readonly printDetailsRepository: Repository<PrintDetails>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(PhotoPrintSetting)
    private readonly photoPrintSettingRepository: Repository<PhotoPrintSetting>
  ) {}

  async addPrintDetailToCart(userId: string, printDetailsDto: PrintDetailsDto) {
    const { type, size, image, instruction, quantity } = printDetailsDto

    if (!type || !size || !image || !instruction || quantity <= 0) {
      throw new BadRequestException('All fields are required and quantity must be greater than 0.')
    }

    try {
      //   const cart = await this.cartRepository.findOne({
      //     where: {  },
      //   });
      //   if (!cart)
      //     throw new NotFoundException(`Cart not found for user ID: ${userId}`);

      const id = uuid()
      const printDetails = this.printDetailsRepository.create({
        id,
        type,
        size,
        image,
        instruction,
        quantity,
        userId,
      })

      const savedPrintDetail = await this.printDetailsRepository.save(printDetails)

      const orderDetails: any = {
        id: uuid(),
        userId: userId,
        productId: printDetails.id,
        type: CartTypeEnum.Photo_Print,
        status: OrderStatusEnum.InCart,
        price: 100,
      }

      // Update the cart to ensure the orders array is populated
      await this.orderRepository.save(orderDetails) // Save the updated cart

      return {
        message: 'Your print detail has been added to the cart successfully.',
        data: savedPrintDetail,
        orderId: orderDetails.id,
      }
    } catch (error) {
      if (error) {
        throw error // Rethrow if it's a NotFoundException
      } else {
        throw new BadRequestException('Failed to add print detail to cart. Please check the input data.')
      }
    }
  }
}
