// role.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as JWT from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // if (!roles) {
    //   return true; 
    // }
   
    // const token = request.headers.authorization;
    // if (!token) {
    //   console.log("token not found")
    //   return false;
    // }
    // try {
    //   const decode = JWT.verify(token, "ASDFGHJUYTRDS") as JWT.JwtPayload
    //   request.user = decode
     
    // } catch (error) {
    //   console.log(error)
    //   return false;
    // }
 const request = context.switchToHttp().getRequest();
    const user = request.user
    return roles.includes(user.role);
    
  }
}
