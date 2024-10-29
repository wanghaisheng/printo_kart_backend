import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Query } from '@nestjs/common'

import { Auth, GetUserId } from './user.auth'
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UsersService } from './user.service'
import { AddUserImagesDTO, CreateAddressDto, OnboardDTO, PageDTO, VerifyOtpDto } from './user.dto'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}
  @Post('/sendOtp')
  async sendOtp(@Body() data: OnboardDTO): Promise<{ msg: string }> {
    return await this.usersService.login(data)
  }

  @Post('/verifyOtp')
  async verifyOtp(@Body() data: VerifyOtpDto): Promise<{ msg: string }> {
    return await this.usersService.verifyOTP(data)
  }

  // @Post('/profile')
  // @Auth()
  // @ApiBearerAuth()
  // async addUserProfile(
  //   @GetUserId('id') userId: string,
  //   @Body() createProfileDTO: CreateProfileDTO
  // ) {
  //   return await this.usersService.addUserProfile(createProfileDTO, userId)
  // }

  @Get('details')
  @Auth()
  @ApiForbiddenResponse({ description: 'Invalid access token' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch profile details' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @HttpCode(HttpStatus.OK)
  async getUserProfile(@GetUserId('id') userId: string) {
    return await this.usersService.getUserProfile(userId)
  }

  @Post('/createAddress')
  @Auth()
  @ApiBearerAuth()
  async createAddress(@GetUserId('id') userId: string, @Body() createAddressDto: CreateAddressDto) {
    // Call the service method to add a new address
    return await this.usersService.addNewAddress(createAddressDto, userId)
  }

  @Put('/updateAddress/:id')
  @Auth() // Ensure the user is authenticated
  @ApiBearerAuth()
  async updateAddress(
    @Param('id') addressId: string, // Get address ID from the route
    @GetUserId('id') userId: string, // Get user ID from the JWT token
    @Body() updateAddressDto: CreateAddressDto // Address update details
  ) {
    return await this.usersService.updateAddress(addressId, updateAddressDto, userId)
  }

  @Delete('/deleteAddress/:id')
  @Auth() // Ensure the user is authenticated
  @ApiBearerAuth()
  async deleteAddress(
    @Param('id') addressId: string, // Get address ID from the route
    @GetUserId('id') userId: string // Get user ID from the JWT token
  ) {
    return await this.usersService.deleteAddress(addressId, userId)
  }

  // @Post('/image')
  // @Auth()
  // @ApiBearerAuth()
  // async addUserImages(
  //   @GetUserId('id') userId: string,
  //   @Body() addUserImagesDTO: AddUserImagesDTO
  // ) {
  //   return await this.usersService.addUserImages(addUserImagesDTO, userId)
  // }

  @Get('/address')
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiOkResponse({ description: 'Address list fetched  successfully' })
  @ApiOperation({ summary: `ADMIN:  Address List ` })
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Invalid access token' })
  @Auth()
  async listUser(@GetUserId('id') userId: string, @Query() pageDto: PageDTO) {
    return await this.usersService.addressList(userId, pageDto)
  }
}
