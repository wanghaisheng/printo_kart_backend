// src/cloudinary/cloudinary.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Express } from 'express'
import { CommonService } from './common.service'

@ApiTags('common')
@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload an image to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image successfully uploaded.' })
  @ApiResponse({ status: 400, description: 'Invalid file format or request.' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.commonService.uploadImage(file)
    return result
  }
}
