import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { OnboardingTypeEnum } from './user.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class OnboardDTO {
  // @ApiProperty({ description: ''})
  // @IsNumber()
  // @IsNotEmpty()
  // loginType: OnboardingTypeEnum;

  @ApiProperty({description: ''})
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // @ApiProperty({description: ''})
  // @IsString()
  // @IsNotEmpty()
  // password: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    description: 'The verification code received on the provided data',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The verification code received on the provided data',
  })
  @IsString()
  @IsNotEmpty({ message: 'OTP is required' })
  @Length(6, 6, { message: 'OTP must be exactly 6 characters long' })
  otp: string;
}

export class CreateProfileDTO {
  @ApiPropertyOptional({ description: 'Name of the user' })
  @IsOptional()
  @IsString()
  fullName: string;

  @ApiPropertyOptional({ description: 'Phone number of the user' })
  @IsOptional()
  @IsString()
  phone: string;

  // @ApiPropertyOptional({ description: 'Social profiles of the user' })
  // @IsOptional()
  // socialProfile: SocialProfileDTO

  @ApiPropertyOptional({
    description: 'The email address of the user profile',
    format: 'email',
  })
  @IsOptional()
  @IsEmail()
  email: string;
}

export class AddUserImagesDTO {
  @ApiPropertyOptional({ description: 'Profile picture link' })
  @IsOptional()
  @IsString()
  imageUrl: string;

  // @ApiProperty({ description: 'User image type ' })
  // @IsOptional()
  // @IsString()
  // imageType: UserImageType
}

export class PageDTO {
  @ApiPropertyOptional({ description: 'Profile picture link' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;

  @ApiPropertyOptional({ description: 'Profile picture link' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000)
  limit: number;
}

export class UserFilterDTO extends PageDTO {
  @ApiPropertyOptional({ description: 'Name of the user' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Phone number of the user' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Birthday of the user' })
  @IsOptional()
  @IsString()
  birthday?: string;

  @ApiPropertyOptional({ description: 'Religion of the user' })
  @IsOptional()
  @IsString()
  religion?: string;

  @ApiPropertyOptional({ description: 'Height of the user' })
  @IsOptional()
  @IsString()
  height?: string;

  @ApiPropertyOptional({ description: 'Bio of the user' })
  @IsOptional()
  @IsArray()
  hobbies?: string[];

  // @ApiPropertyOptional({ description: 'The ID of template.' })
  // @IsOptional()
  // @IsEnum(PurposeEnum)
  // purpose?: PurposeEnum;

  // @ApiPropertyOptional({ description: 'The ID of template.' })
  // @IsOptional()
  // @IsNumber()
  // ageFrom?: number;

  // @ApiPropertyOptional({ description: 'The ID of template.' })
  // @IsOptional()
  // @IsNumber()
  // ageTo?: number;

  @ApiPropertyOptional({ description: 'The ID of template.' })
  @IsOptional()
  language?: string[];

  @ApiPropertyOptional({ description: 'Education level of the user' })
  @IsOptional()
  education?: string;

  @ApiPropertyOptional({ description: 'Gender of the user' })
  @IsOptional()
  @IsString()
  gender?: string;

  // @ApiPropertyOptional({ description: 'What the user is looking for' })
  // @IsOptional()
  // lookingFor?: LookingForDTO;

  @ApiPropertyOptional({ description: 'Bio of the user' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'Email address of the user' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Email address of the user' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Email address of the user' })
  @IsOptional()
  @IsString()
  homeTown?: string;

  @ApiPropertyOptional({ description: 'The zodiac sign of the user.' })
  @IsOptional()
  zodiac?: string;

  @ApiPropertyOptional({ description: 'The smoking habit of the user.' })
  @IsOptional()
  smoke?: string;

  @ApiPropertyOptional({ description: 'The drinking habit of the user.' })
  @IsOptional()
  drink?: string;

  @ApiPropertyOptional({ description: 'The drinking habit of the user.' })
  @IsOptional()
  exercise?: string;

  @ApiPropertyOptional({ description: 'The drinking habit of the user.' })
  @IsOptional()
  kids?: string;

  @ApiPropertyOptional({ description: 'The drinking habit of the user.' })
  @IsOptional()
  politics?: string;
}


export class CreateAddressDto {
  @ApiProperty({description: ''})
  @IsOptional()
  firstName: string;

  @ApiProperty({description: ''})
  @IsOptional()
  lastName: string;

  @ApiProperty({description: ''})
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({description: ''})
  @IsOptional()
  @IsString()
  addressLine1: string;

  @ApiProperty({description: ''})
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({description: ''})
  @IsOptional()
  @IsString()
  town: string;

  @ApiProperty({description: ''})
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiProperty({description: ''})
  @IsOptional()
  @IsString()
  postcode: string;

  @ApiProperty({description: ''})
  @IsOptional()
  // @IsPhoneNumber('IN') // Change 'IN' if you want validation for another country
  phone: string;

  @ApiProperty({description: ''})
  @IsOptional()
  @IsEmail()
  email?: string;

}
