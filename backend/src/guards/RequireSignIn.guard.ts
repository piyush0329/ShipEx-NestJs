/*
https://docs.nestjs.com/guards#guards
*/

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as JWT from 'jsonwebtoken'


@Injectable()
export class RequireSignIn implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    let token = request.headers.authorization;
    if (!token) {
      console.log("token not found")
      return false;
    }
    token = token.split(" ")[1]
    try {
      const decode = JWT.verify(token, "ASDFGHJUYTRDS") as JWT.JwtPayload
      request.user = decode
      if (decode) {
        return true
      }
    } catch (error) {
      console.log(error)
      return false;
    }
  }
}
