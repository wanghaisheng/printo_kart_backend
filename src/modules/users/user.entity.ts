import { CreatedModified } from '../../../helper';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('users') // Define table name explicitly (optional)
export class Users extends CreatedModified {
  @PrimaryColumn()
  id: string; // Use definite assignment assertion

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phone?: string;
}

@Entity('user_verification')
export class UserVerification {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  userId!: string; // Mark this as required to ensure it's always initialized

  @Column({ type: 'text' })
  otp!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created?: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modified?: Date;

  // Optionally, define a relation to the `User` entity
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  user?: Users;
}

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  country: string;

  @Column()
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column()
  town: string;

  @Column({ nullable: true })
  landmark: string;

  @Column()
  postcode: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  userId: string;

  // Define the ManyToOne relationship with User
  // @ManyToOne(() => Users, (user) => Users.addresses)
  // user: Users;
}
