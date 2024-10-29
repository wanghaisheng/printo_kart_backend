// src/cart/entities/print-details.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { PrintSize, PrintType } from './printing.interface'
import { CreatedModified } from '../../../helper'

@Entity()
export class PrintDetails extends CreatedModified {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: PrintType })
  type: PrintType

  @Column({ type: 'enum', enum: PrintSize })
  size: PrintSize

  @Column('text', { array: true })
  image: string[]

  @Column({ type: 'text' })
  instruction: string

  @Column({ type: 'int' })
  quantity: number

  @Column({ nullable: true })
  userId: string
}

@Entity()
export class PhotoPrintSetting extends CreatedModified {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  type: string // e.g., 'Classic Photo Prints', 'Square Photo Prints'

  @Column()
  size: string // e.g., '4x6', '5x7'

  @Column('decimal')
  price: number
}
