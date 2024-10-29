// src/cart/entities/cart.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { CartTypeEnum, OrderStatusEnum, paymentStatusEnum } from './orders.interface'

@Entity()
// export class Cart {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'varchar', unique: false })
//   userId: string;

//   @Column({ unique: true })
//   productId: string;

//   @Column({ type: 'enum', enum: CartTypeEnum })
//   type: CartTypeEnum;
// }
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', unique: false })
  userId: string

  @Column({ unique: true })
  productId: string

  @Column({ unique: false, nullable: true })
  price: number

  @Column({ type: 'enum', enum: OrderStatusEnum, nullable: true  })
  status: OrderStatusEnum

  @Column({ type: 'enum', enum: OrderStatusEnum, nullable: true })
  paymentStatus: paymentStatusEnum

  @Column({ unique: false, nullable: true })
  addressId: string
}
