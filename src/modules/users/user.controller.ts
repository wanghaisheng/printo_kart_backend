import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Query
  } from '@nestjs/common'

  import { Auth, GetUserId } from './user.auth'
  import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags
  } from '@nestjs/swagger'
import { UsersService } from './user.service'
import { AddUserImagesDTO, OnboardDTO, VerifyOtpDto } from './user.dto'
  
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
  
    // @Post('/image')
    // @Auth()
    // @ApiBearerAuth()
    // async addUserImages(
    //   @GetUserId('id') userId: string,
    //   @Body() addUserImagesDTO: AddUserImagesDTO
    // ) {
    //   return await this.usersService.addUserImages(addUserImagesDTO, userId)
    // }
  

  

  

  
    // @Get('admin/users')
    // @HttpCode(HttpStatus.OK)
    // @ApiBadRequestResponse({ description: 'Bad Request' })
    // @ApiOkResponse({ description: 'User list fetched  successfully' })
    // @ApiOperation({ summary: `ADMIN:  Users List ` })
    // @ApiBearerAuth()
    // @ApiForbiddenResponse({ description: 'Invalid access token' })
    // @Auth()
    // async listUser(@Query() pageDto: PageDTO) {
    //   return await this.usersService.userList(pageDto)
    // }
  



  

  

  }
  