import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { CommonController } from './common.controller'
import { CommonService } from './common.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
