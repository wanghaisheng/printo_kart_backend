import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async sendEmailOTP(email: string, otp: string) {
    const params = {
      to: email,
      from: this.configService.get<string>('SENDER_MAIL'),
      subject: 'Printo Kart',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h1 style="color: #333; text-align: center;">Welcome to <span style="color: #5151E0;">Printo Kart</span></h1>
          <p style="font-size: 16px; color: #555; text-align: center;">
            Your verification code is:
          </p>
          <p style="font-size: 24px;width:30%; color: white; background: #5151E0; padding: 10px; border-radius: 8px; text-align: center; margin: 10px 176px;">
            ${otp}
          </p>
          <p style="font-size: 14px; color: #999; text-align: center; margin-top: 20px;">
            If you did not request this code, please ignore this email.
          </p>
        </div>`,
    }

    try {
      const result = await this.mailerService.sendMail(params)
      console.log(`Email sent to ${email}`)
      return {
        success: true,
        message: `Email sent to ${email}`,
      }
    } catch (error) {
      console.error('Error sending email', error)
      throw new InternalServerErrorException('Error in sending email')
    }
  }
}
