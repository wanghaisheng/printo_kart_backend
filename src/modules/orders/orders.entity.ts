// src/cart/entities/cart.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CartTypeEnum } from './orders.interface';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: false })
  userId: string;

  @Column({unique: true})
  productId: string;
  
  @Column({ type: 'enum', enum: CartTypeEnum })
  type: CartTypeEnum
}
