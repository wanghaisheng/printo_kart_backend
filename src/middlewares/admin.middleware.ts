// import {
//     HttpException,
//     HttpStatus,
//     Injectable,
//     NestMiddleware
//   } from '@nestjs/common'
//   import { NextFunction, Request, Response } from 'express'
//   import { CommonService } from 'src/modules/common/common.service'
//   // import { AuthGuard } from 'src/modules/user/user.auth'
//   import * as jwt from 'jsonwebtoken'

//   @Injectable()
//   export class CheckAdminMiddleware implements NestMiddleware {
//     constructor(
//       public readonly commonService: CommonService,
//       // public readonly authGuard: AuthGuard
//     ) {}

//     async use(req: Request, res: Response, next: NextFunction) {
//       if (!req.headers.authorization) throw errors.AuthorizationTokenRequired
//       const user: any = await this.validateToken(
//         req.headers.authorization
//       )
//       await this.commonService.checkAccess(user.id, RolesEnum.Admin)

//       next()
//     }

//     async validateToken(auth: string) {
//       try {
//         if (auth.split(' ')[0] !== 'Bearer')
//           throw new HttpException('Invalid token', HttpStatus.FORBIDDEN)
//         const token = auth.split(' ')[1]
//         return jwt.verify(token, process.env.JWT_SECRET)
//       } catch (error) {
//         const message = 'Token error- ' + error.message
//         throw new HttpException(message, HttpStatus.FORBIDDEN)
//       }
//     }
//   }
