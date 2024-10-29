import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { dataSourceOptions } from './database/database.module'
import { UserModule } from './modules/users/user.module'
import { MailModule } from './modules/mailer/mailer.module'

// import { HttpModule } from '@nestjs/axios'
import { CommonModule } from './modules/common/common.module'
import { PrintingModule } from './modules/printing/printing.module'
import { OrderModule } from './modules/orders/orders.module'

@Module({
  imports: [
    UserModule,
    MailModule,
    CommonModule,
    PrintingModule,
    OrderModule,
    // {
    //   ...HttpModule.register({}),
    //   global: true,
    // }
    TypeOrmModule.forRoot(dataSourceOptions),
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   validationSchema: Joi.object({
    //     TWILIO_ACCOUNT_SID: Joi.string().required(),
    //     TWILIO_AUTH_TOKEN: Joi.string().required(),
    //     TWILIO_VERIFICATION_SERVICE_SID: Joi.string().required()
    //     // ...
    //   })
    // }),
    JwtModule.register({
      secret: 'mykeysecret', // Change this to your own secret key
      signOptions: { expiresIn: '1h' }, // Example expiration (1 hour)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes({ path: '*admin*', method: RequestMethod.ALL })
  }
}
