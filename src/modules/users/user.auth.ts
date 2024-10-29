import { CanActivate, ExecutionContext, HttpException, HttpStatus, UseGuards, applyDecorators, createParamDecorator } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as jwt from 'jsonwebtoken'
import { Users } from './user.entity'
import { UsersService } from './user.service'

export class AuthGuard implements CanActivate {
  constructor(
    public readonly userService: UsersService,
    @InjectRepository(Users)
    private userRepository: Repository<Users>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    if (!req.headers.authorization && !(req.query.apiKey && req.query.email && req.query.operatorId)) return false
    req.user = await this.validateToken(req.headers.authorization)
    return true
  }

  async validateToken(auth: string) {
    try {
      if (auth.split(' ')[0] !== 'Bearer') throw new HttpException('Invalid access token', HttpStatus.FORBIDDEN)
      const token = auth.split(' ')[1]
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET)
      const userDetails = await this.userRepository.findOne({
        where: { id: decoded.id },
      })
      if (!userDetails) throw new Error('User not found')
      return decoded
    } catch (error) {
      throw new Error('User not found')
    }
  }
}

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard))
}

export const GetUserId = createParamDecorator((data, req): string => {
  return req.args[0].user.userId
})
