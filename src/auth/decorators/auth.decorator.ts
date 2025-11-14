import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.type';
import { RequestWithUser } from '../types/request-with-user.type';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      throw new InternalServerErrorException(
        'AuthUser decorator used without an active AuthGuard. ' +
          'Did you forget to apply the AuthGuard (e.g., @UseGuards(AuthGuard))?',
      );
    }

    return request.user;
  },
);
