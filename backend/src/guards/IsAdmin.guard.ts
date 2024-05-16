/*
https://docs.nestjs.com/guards#guards
*/

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as JWT from 'jsonwebtoken'

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    
    if (!token) {
      console.log("token not found")
      return false;
    }

    try {
      const decode = JWT.verify(token, "ASDFGHJUYTRDS") as JWT.JwtPayload
   
      request.user = decode
      if(decode.role==='admin'){
        return true
      } 
    } catch (error) {
      console.log(error)
      return false; 
    }
  }
}
