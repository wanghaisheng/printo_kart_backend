// src/cart/cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './orders.entity';
import { PageDTO } from '../users/user.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  // Method to get cart details by user ID
  async getCartByUserId(userId: string, { page, limit }: PageDTO) {
    const [carts, total] = await this.cartRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit, // Calculate the number of items to skip
      take: limit, // Limit the number of items returned
    });

    if (carts.length === 0) {
      throw new NotFoundException(`Cart not found for user ID: ${userId}`);
    }

    return {
      data: carts,
      total, // Total number of carts found
    };
  }
}
