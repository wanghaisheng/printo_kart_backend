export enum OnboardingTypeEnum {
    EmailOTP = 1,
  }
  
  export enum UserImageType {
    Profile = 1
  }
  

  


  
 

  
  export enum RolesEnum {
    User = 1,
    Admin = 2,
    Owner = 3,
    SuperAdmin = 4
  }
  
  export interface VerificationCodeInterface {
    userId: string
    code: string
    verificationCodeType: VerificationCodeTypeEnum
    phone: string
  }
  
  export enum VerificationCodeTypeEnum {
    Email = 1,
  }
  
  export interface JwtPayload {
    id: string
    phone: string
  }
  