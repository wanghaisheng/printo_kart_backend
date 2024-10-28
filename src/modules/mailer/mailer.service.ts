import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmailOTP(email: string, otp: string) {
    const params = {
      to: email,
      from: this.configService.get<string>('SENDER_MAIL'),
      subject: 'Printo_Kart',
      html: `<h1>Welcom to Printo_Kart</h1><p>Your verification code is: ${otp}</p>`,
    };
    try {
      const result = await this.mailerService.sendMail(params);
      console.log(`Email sent to ${email}`);
      return {
        success: true,
        message: `Email sent to ${email}`,
      };
    } catch (error) {
      console.error('Error sending email', error);
      throw new InternalServerErrorException('Error in sending email');
    }
  }
}
