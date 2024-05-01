import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {User} from '../types/user.type';

export const UserData = createParamDecorator( (data: unknown, ctx: ExecutionContext) :User  => {
    const request = ctx.switchToHttp().getRequest();
    return request.userData;
})