import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'
import { UserModule } from 'src/modules/users/user.module'
import { CommonModule } from 'src/modules/common/common.module'
import { PrintingModule } from 'src/modules/printing/printing.module'
import { OrderModule } from 'src/modules/orders/orders.module'

// import { SwaggerTheme } from 'swagger-themes'

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Printo Kart API Documentation')
    .setDescription(
      `Printo Kart is an online platform for photo printing, custom frames, and document printing. 
      The API enables user account management, image uploads, and order processing, supporting roles like admin and customers.
       Key features include authentication, order management, and payment integration.`
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    // .setExternalDoc('For more details click here', 'https://api-guide.owens.market')
    // .setTermsOfService('https://www.owens.market/terms-of-use')
    // .setContact('', '', 'techsupport@owens.market')
    // .addTag('User', 'User related operations')
    .build()

  const document = SwaggerModule.createDocument(app, options, {
    include: [UserModule, CommonModule, PrintingModule, OrderModule],
  })

  if (document.components?.securitySchemes) {
    delete document.components.securitySchemes['bearerAuth'] // Remove the default Bearer Authorization
  }

  const themeOptions = {
    explorer: false,
    // customCss:
    //   theme.getBuffer('classic').toString() +
    //   `
    //   .swagger-ui .model .property{
    //     display: none
    //   }
    //   `,
  }
  SwaggerModule.setup('documentation', app, document, themeOptions)
}
