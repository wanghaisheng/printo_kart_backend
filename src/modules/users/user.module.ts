import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Users, UserVerification } from './user.entity';
import { UsersService } from './user.service';
import { MailModule } from '../mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserVerification]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
