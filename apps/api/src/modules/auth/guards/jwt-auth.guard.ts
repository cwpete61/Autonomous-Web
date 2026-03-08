import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // In development mode, we bypass authentication to facilitate dashboard development
    // without requiring a full login flow setup.
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    return super.canActivate(context);
  }
}
