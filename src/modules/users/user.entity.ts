import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // Define table name explicitly (optional)
export class Users {
  @PrimaryGeneratedColumn()
  id!: string; // Use definite assignment assertion

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phone?: string;

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity('user_verification')
export class UserVerification {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  userId!: string; // Mark this as required to ensure it's always initialized

  @Column()
  otp!: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created?: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modified?: Date;

  // Optionally, define a relation to the `User` entity
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  user?: Users;
}
