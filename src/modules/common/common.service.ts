// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary } from 'cloudinary'
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    })
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    // Return type changed to string
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'uploads' }, (error, result: UploadApiResponse | UploadApiErrorResponse) => {
          if (error) return reject(error)
          resolve((result as UploadApiResponse).secure_url) // Return only the URL
        })
        .end(file.buffer)
    })
  }
}
