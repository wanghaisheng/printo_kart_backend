// src/cart/print-details.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../orders/orders.entity';
import { PrintDetailsDto } from './printing.dto';
import { PrintDetails } from './printing.entity';
import { AnyARecord } from 'dns';
import { uuid } from 'uuidv4';
import { CartTypeEnum } from '../orders/orders.interface';

@Injectable()
export class PrintingService {
  constructor(
    @InjectRepository(PrintDetails)
    private readonly printDetailsRepository: Repository<PrintDetails>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async addPrintDetailToCart(userId: string, printDetailsDto: PrintDetailsDto) {
    const { type, size, image, instruction, quantity } = printDetailsDto;

    if (!type || !size || !image || !instruction || quantity <= 0) {
      throw new BadRequestException(
        'All fields are required and quantity must be greater than 0.',
      );
    }

    try {
      //   const cart = await this.cartRepository.findOne({
      //     where: {  },
      //   });
      //   if (!cart)
      //     throw new NotFoundException(`Cart not found for user ID: ${userId}`);
      const id = uuid();
      const printDetails = this.printDetailsRepository.create({
        id,
        type,
        size,
        image,
        instruction,
        quantity,
        userId,
      });

      const savedPrintDetail =
        await this.printDetailsRepository.save(printDetails);

      const cartDetails: any = {
        id: uuid(),
        userId: userId,
        productId: printDetails.id,
        type: CartTypeEnum.Photo_Print,
      };

      // Update the cart to ensure the orders array is populated
      await this.cartRepository.save(cartDetails); // Save the updated cart

      return {
        message: 'Your print detail has been added to the cart successfully.',
        data: savedPrintDetail,
      };
    } catch (error) {
      if (error) {
        throw error; // Rethrow if it's a NotFoundException
      } else {
        throw new BadRequestException(
          'Failed to add print detail to cart. Please check the input data.',
        );
      }
    }
  }

  async getPrintDetailsByCartId(cartId: number): Promise<PrintDetails[]> {
    try {
      const printDetails = await this.printDetailsRepository.find({
        //   where: { cart: { id: cartId } },
      });
      if (!printDetails.length) {
        throw new NotFoundException(
          `No print details found for cart ID: ${cartId}`,
        );
      }
      return printDetails;
    } catch (error) {
      throw new BadRequestException('Failed to fetch print details from cart.');
    }
  }

  async deletePrintDetail(printDetailId: number): Promise<void> {
    try {
      const result = await this.printDetailsRepository.delete(printDetailId);
      if (result.affected === 0) {
        throw new NotFoundException(
          `Print detail with ID ${printDetailId} not found.`,
        );
      }
    } catch (error) {
      throw new BadRequestException('Failed to delete print detail.');
    }
  }
}
