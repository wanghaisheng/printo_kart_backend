import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Users, UserVerification } from './user.entity';
import { OnboardDTO, VerifyOtpDto } from './user.dto';
import { MailService } from '../mailer/mailer.service';
import { defaultDomain } from 'helper';

@Injectable()
export class UsersService {
  private JWT_SECRET: string;
  logger: Logger;
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(UserVerification)
    private readonly userVerificationRepository: Repository<UserVerification>,
    private readonly configService: ConfigService,
    public readonly mailService: MailService,
  ) {
    this.JWT_SECRET =
      this.configService.get<string>('JWT_SECRET') || 'your_jwt_secret';
  }

  // Add Profile
  async addProfile(
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
  ) {
    if (!email || !firstName || !lastName || !phone) {
      throw new HttpException(
        'All fields (email, password, first name, last name, phone number) are required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new HttpException('Invalid email format.', HttpStatus.BAD_REQUEST);
    }

    const newUser = this.userRepository.create({
      email,
      firstName,
      lastName,
      phone,
    });

    return this.userRepository.save(newUser);
  }

  // Login
  async login(data: OnboardDTO): Promise<any> {
    const email = data.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new HttpException('Invalid email format.', HttpStatus.BAD_REQUEST);
    }

    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      const salt = this.configService.get('SALT_HASH');
      const passwordHash = await bcrypt.hash(data.password, parseInt(salt));
      user = this.userRepository.create({ email, password: passwordHash });
      await this.userRepository.save(user);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    await this.userVerificationRepository.delete({ userId: user.id });

    const otp = this.generateOTP();

    // Send OTP via email (implement Mailer Service for real email sending)
    // await this.mailService.sendEmailOTP(email, otp);

    console.log(`OTP sent to ${email}: ${otp}`);

    const userVerification = this.userVerificationRepository.create({
      userId: user.id,
      otp: parseInt(otp),
    });

    await this.userVerificationRepository.save(userVerification);

    return {
      message: 'OTP sent to your email. Please verify.',
      userId: user.id,
    };
  }

  // Verify OTP
  async verifyOTP(verify: VerifyOtpDto): Promise<any> {
    const userId = verify.userId;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const userVerification = await this.userVerificationRepository.findOne({
      where: { userId: user.id },
    });

    if (userVerification?.otp.toString() !== verify.otp) {
      throw new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      this.JWT_SECRET,
      { expiresIn: '1h' },
    );

    await this.userVerificationRepository.delete(userVerification);

    return { message: 'Verification successful', token };
  }

  /** Retrieves the user profile by user ID.
   * @param {string} userId
   */
  async getUserProfile(userId: string) {
    try {
      const userDetails = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });
      const regexPattern = new RegExp(defaultDomain, 'g');
      userDetails.email = regexPattern.test(userDetails.email)
        ? ''
        : userDetails.email;
      const completeUserInfo: any = {
        ...userDetails,
      };
      return { message: 'User detail', data: completeUserInfo };
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  // Helper method to generate OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  }
}
