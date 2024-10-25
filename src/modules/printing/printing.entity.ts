// src/cart/entities/print-details.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { PrintSize, PrintType } from './printing.interface';

@Entity()
export class PrintDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PrintType })
  type: PrintType;

  @Column({ type: 'enum', enum: PrintSize })
  size: PrintSize;

  @Column('text', { array: true })
  image: string[];

  @Column({ type: 'text' })
  instruction: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ nullable: true })
  userId: string;
}
