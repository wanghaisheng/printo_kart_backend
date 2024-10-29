// src/cart/dto/print-details.dto.ts
import { IsEnum, IsInt, IsArray, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PrintSize, PrintType } from './printing.interface'

export class PrintDetailsDto {
  @ApiProperty({ enum: PrintType, example: PrintType['Classic Photo Prints'] })
  @IsEnum(PrintType)
  type: PrintType

  @ApiProperty({ enum: PrintSize, example: PrintSize['4x6'] })
  @IsEnum(PrintSize)
  size: PrintSize

  @ApiProperty({ type: [String], example: ['image1.jpg', 'image2.jpg'] })
  @IsArray()
  @IsString({ each: true })
  image: string[]

  @ApiProperty({ example: 'Please handle with care' })
  @IsString()
  instruction: string

  @ApiProperty({ example: 1 })
  @IsInt()
  quantity: number
}
