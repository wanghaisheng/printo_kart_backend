import { Injectable, HttpException, HttpStatus, BadRequestException, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'
import { Address, Users, UserVerification } from './user.entity'
import { CreateAddressDto, OnboardDTO, PageDTO, VerifyOtpDto } from './user.dto'
import { MailService } from '../mailer/mailer.service'
import { defaultDomain } from 'helper'
import { uuid } from 'uuidv4'
import { getAddressCount, getAddressList } from './user.repository'
import { count } from 'console'

@Injectable()
export class UsersService {
  private JWT_SECRET: string
  logger: Logger
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(UserVerification)
    private readonly userVerificationRepository: Repository<UserVerification>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly configService: ConfigService,
    public readonly mailService: MailService
  ) {
    this.JWT_SECRET = this.configService.get<string>('JWT_SECRET') || 'your_jwt_secret'
  }

  // Add Profile
  async addProfile(email: string, firstName: string, lastName: string, phone: string) {
    if (!email || !firstName || !lastName || !phone) {
      throw new HttpException('All fields (email, password, first name, last name, phone number) are required.', HttpStatus.BAD_REQUEST)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new HttpException('Invalid email format.', HttpStatus.BAD_REQUEST)
    }

    const newUser = this.userRepository.create({
      email,
      firstName,
      lastName,
      phone,
    })

    return this.userRepository.save(newUser)
  }

  // Login
  async login(data: OnboardDTO): Promise<any> {
    const email = data.email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Validate email format
    if (!emailRegex.test(email)) {
      throw new HttpException('Invalid email format.', HttpStatus.BAD_REQUEST)
    }

    // Check if user exists by email
    let user = await this.userRepository.findOne({ where: { email } })
    if (!user) {
      // Create new user without password
      const id = uuid()
      user = this.userRepository.create({ id, email })
      await this.userRepository.save(user)
    }

    // Delete any previous OTPs for the user
    await this.userVerificationRepository.delete({ userId: user.id })

    // Generate a new OTP
    const otp = this.generateOTP()

    // Hash the OTP before saving it
    const salt = await bcrypt.genSalt() // Generate a salt
    const hashedOtp = await bcrypt.hash(otp, salt)

    // Send OTP via email (Mailer service should handle the actual sending)
    await this.mailService.sendEmailOTP(email, otp)

    // Create and save the hashed OTP in the database
    const userVerification = this.userVerificationRepository.create({
      userId: user.id,
      otp: hashedOtp, // Save the hashed OTP
    })
    await this.userVerificationRepository.save(userVerification)

    // Return a response indicating OTP sent
    return {
      message: 'OTP sent to your email. Please verify.',
      userId: user.id,
    }
  }

  // Verify OTP
  async verifyOTP(verify: VerifyOtpDto): Promise<any> {
    const userId = verify.userId

    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const userVerification = await this.userVerificationRepository.findOne({
      where: { userId: user.id },
    })

    if (!userVerification) {
      throw new HttpException('OTP not found or expired', HttpStatus.NOT_FOUND)
    }

    const isOtpValid = await bcrypt.compare(verify.otp, userVerification.otp)
    if (!isOtpValid) {
      throw new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED)
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, this.JWT_SECRET, { expiresIn: '1h' })

    await this.userVerificationRepository.delete(userVerification)

    return { message: 'Verification successful', token }
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
      })
      // const regexPattern = new RegExp(defaultDomain, 'g');
      // userDetails.email = regexPattern.test(userDetails.email)
      //   ? ''
      //   : userDetails.email;
      const completeUserInfo: any = {
        ...userDetails,
      }
      return { message: 'User detail', data: completeUserInfo }
    } catch (error) {
      this.logger.error(error.message)
      throw new BadRequestException(error.message)
    }
  }

  /** Adds or updates the user profile.
   * @param {CreateProfileDTO} createProfileDTO
   * @param {string} userId 

  */
  // async addUserProfile({ name, phone, bio, profilePic, socialProfile, email }: CreateProfileDTO, userId: string) {
  //   try {
  //     let userDetails = await getUserBy({ id: userId })
  //     const updateSocialProfile = {
  //       instagram: '',
  //       discord: '',
  //       telegram: '',
  //       twitter: '',
  //     }
  //     if (socialProfile) {
  //       updateSocialProfile.instagram = socialProfile['instagram']
  //         ? socialProfile['instagram']
  //         : userDetails.socialProfile && userDetails.socialProfile['instagram']
  //         ? userDetails.socialProfile['instagram']
  //         : ''
  //       updateSocialProfile.discord = socialProfile['discord']
  //         ? socialProfile['discord']
  //         : userDetails.socialProfile && userDetails.socialProfile['discord']
  //         ? userDetails.socialProfile['discord']
  //         : ''
  //       updateSocialProfile.telegram = socialProfile['telegram']
  //         ? socialProfile['telegram']
  //         : userDetails.socialProfile && userDetails.socialProfile['telegram']
  //         ? userDetails.socialProfile['telegram']
  //         : ''
  //       updateSocialProfile.twitter = socialProfile['twitter']
  //         ? socialProfile['twitter']
  //         : userDetails.socialProfile && userDetails.socialProfile['twitter']
  //         ? userDetails.socialProfile['twitter']
  //         : ''
  //     }
  //     let emailUpdate = false
  //     if (email) {
  //       const regexPattern = new RegExp(defaultDomain, 'g')
  //       if (regexPattern.test(userDetails.email)) {
  //         emailUpdate = true
  //       }
  //     }

  //     if (emailUpdate) {
  //       // check if email already exists
  //       const emailUserDetails = await getUserBy({ email, operatorId: userDetails.operatorId })
  //       if (emailUserDetails) throw errors.EmailAlreadyExists
  //     }
  //     const data: Partial<Users> = {
  //       name: name ? name : userDetails.name,
  //       phone: phone ? phone : userDetails.phone,
  //       bio: bio ? bio : userDetails.bio,
  //       profilePic: profilePic ? profilePic : userDetails.profilePic,
  //       socialProfile: updateSocialProfile,
  //       email: emailUpdate ? email : userDetails.email,
  //     }
  //     await this.userRepository.update({ id: userId }, data)
  //     userDetails = await getUserBy({ id: userId }, [
  //       'id',
  //       'email',
  //       'emailVerified',
  //       'vaccount',
  //       'name',
  //       'phone',
  //       'operatorId',
  //       'bio',
  //       'profilePic',
  //       'socialProfile',
  //     ])
  //     const completeUserInfo = { ...userDetails }

  //     return { message: 'User profile info saved successfully.', data: completeUserInfo }
  //   } catch (error) {
  //     this.logger.error(error.message)
  //     throw new BadRequestException(error.message)
  //   }
  // }

  async addNewAddress(
    { firstName, lastName, country, addressLine1, addressLine2, town, landmark, postcode, phone, email }: CreateAddressDto,
    userId: string
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Create a new Address entity
    const id = uuid()
    const newAddress = this.addressRepository.create({
      id,
      firstName: user.firstName ? user.firstName : firstName,
      lastName: user.lastName ? user.lastName : lastName,
      country,
      addressLine1,
      addressLine2,
      town,
      landmark,
      postcode,
      phone,
      email: user.email ? user.email : email,
      userId: user.id, // Associate the address with the user
    })

    // Save to the database

    await this.addressRepository.save(newAddress)
    return { message: 'Address added sucessfully !' }
  }

  async updateAddress(
    addressId: string, // Address ID to identify which address to update
    { firstName, lastName, country, addressLine1, addressLine2, town, landmark, postcode, phone, email }: CreateAddressDto,
    userId: string
  ) {
    // Fetch the user
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Fetch the address by ID and user ID (to ensure it's the user's address)
    const address = await this.addressRepository.findOne({
      where: { id: addressId, userId },
    })
    if (!address) {
      throw new NotFoundException('Address not found')
    }

    // Update the address with new details, using either user info or new input
    address.firstName = firstName ? firstName : address.firstName
    address.lastName = lastName ? lastName : address.lastName
    address.country = country ? country : address.country
    address.addressLine1 = addressLine1 ? addressLine1 : address.addressLine1
    address.addressLine2 = addressLine2 ? addressLine2 : address.addressLine2
    address.town = town ? town : address.town
    address.landmark = landmark ? landmark : address.landmark
    address.postcode = postcode ? postcode : address.postcode
    address.phone = phone ? phone : address.phone
    address.email = email ? email : address.email

    // Save the updated address back to the database
    await this.addressRepository.save(address)

    return { message: 'Address updated successfully!' }
  }

  async deleteAddress(addressId: string, userId: string): Promise<any> {
    // Check if the user exists
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Check if the address exists and belongs to the user
    const address = await this.addressRepository.findOne({
      where: { id: addressId, userId },
    })
    if (!address) {
      throw new NotFoundException('Address not found or does not belong to this user')
    }

    // Delete the address
    await this.addressRepository.remove(address)

    return { message: 'Address deleted successfully!' }
  }

  async addressList(userId: string, { page, limit }: PageDTO) {
    try {
      let user = userId
      const list = await getAddressList(user, page, limit)

      const count = await getAddressCount(user)
      return {
        message: 'Users list fetched succesfully',
        data: { list, count, page, limit },
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Helper method to generate OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString() // 6-digit OTP
  }
}
