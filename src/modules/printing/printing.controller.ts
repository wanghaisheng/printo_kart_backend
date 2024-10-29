// src/cart/cart.controller.ts
import { Body, Controller, Param, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { PrintDetailsDto } from './printing.dto'
import { PrintingService } from './printing.service'
import { Auth, GetUserId } from '../users/user.auth'

@ApiTags('Printing')
@Controller('Printing')
export class PrintingController {
  constructor(private readonly printingService: PrintingService) {}

  @Post('printPhoto')
  @Auth()
  @ApiBearerAuth()
  async addPrintDetailToCart(@GetUserId('id') userId: string, @Body() printDetailsDto: PrintDetailsDto) {
    return this.printingService.addPrintDetailToCart(userId, printDetailsDto)
  }
}
