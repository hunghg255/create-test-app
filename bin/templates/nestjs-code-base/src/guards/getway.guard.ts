import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import { Socket } from 'socket.io'

@Injectable()
export class GatewayGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Socket
    const token = request.handshake.headers.authorization
    try {
      this.jwtService.verify(token.substr(7))
    } catch (error) {
      return false
    }
    return true
  }
}
